require('dotenv').config();
const express = require('express');
const app = express();
app.set('view cache', false);
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const http = require('http');
const server = http.createServer(app);
const { setupLiveRacing, liveSessions } = require('./live');
const { router: forumLinksRouter, getForumLinkForTrack } = require('./forum-links');
app.use('/api', forumLinksRouter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const NODEBB_URL = process.env.NODEBB_URL || 'https://forum.freerider.app';
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cookieParser());

const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('https://db.freerider.app');

const PORT = 3000;

// persistent disk mount for Render
const PERSISTENT_ROOT_DISK = '/var/data';

const USE_LOCAL_FILES = false;

const LOCAL_ROOT = USE_LOCAL_FILES
    ? path.join(__dirname, '..', '..', 'data')
    : PERSISTENT_ROOT_DISK;

// maps /var/data/cr/trackcodes to the public URL /data/cr/trackcodes
['cr', 'bhr', 'frhd', 'tm', 'app'].forEach(type => {
    app.use(`/data/${type}/trackcodes`, express.static(path.join(LOCAL_ROOT, type, 'trackcodes')));
    app.use(`/data/${type}/thumbnails`, express.static(path.join(LOCAL_ROOT, type, 'thumbnails')));
});

app.use('/avatars', express.static(path.join(LOCAL_ROOT, 'avatars')));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ extended: true }));

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://forum.freerider.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/login', (req, res) => {
    const redirect = req.query.redirect || 'https://freerider.app';
    res.redirect(`${NODEBB_URL}/login`);
});

app.get('/api/auth/me', (req, res) => {
    const nbbToken = req.cookies['nbb_token'];

    if (!nbbToken) {
        return res.json({ loggedIn: false });
    }

    try {
        const decoded = jwt.verify(nbbToken, JWT_SECRET);
        res.json({
            loggedIn: true,
            user: {
                uid: decoded.uid,
                username: decoded.username
            }
        });
    } catch (error) {
        console.log('[Auth] Invalid nbb_token:', error.message);
        res.json({ loggedIn: false });
    }
});

app.post('/api/tracks/log', async (req, res) => {
    try {
        const { trackType, trackId, trackName } = req.body;

        if (!trackType || !trackId) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        let userId = 0;
        let username = 'Guest';
        const nbbToken = req.cookies?.['nbb_token'];
        if (nbbToken) {
            try {
                const decoded = jwt.verify(nbbToken, JWT_SECRET);
                userId = decoded.uid;
                username = decoded.username;
            } catch (e) {}
        }

        await pb.collection('track_loads').create({
            track_type: trackType,
            track_id: trackId,
            track_name: trackName || '',
            user_id: userId,
            username: username
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Track log error:', error);
        console.error('Request body:', req.body);
        res.json({ success: false });
    }
});

// templates
//const trackTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/track.ejs'), 'utf8'));
const dbTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/db.ejs'), 'utf8'));
const editorTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/editor.ejs'), 'utf8'));

// playlists
let playlistsCache = [];

async function loadPlaylistsFromDb() {
    console.log('Loading playlists from PocketBase...');

    try {
        const records = await pb.collection('playlists').getFullList({
            sort: '-created',
            expand: 'frhd_track,bhr_track,cr_track,tm_track,app_track,db_track,playlists',
            requestKey: `playlists-${Date.now()}`
        });

        console.log(`  Found ${records.length} playlist records`);

        playlistsCache = records.map(record => {
            const tracks = [];
            const childPlaylists = [];

            const addPlatformTracks = (expandKey, type) => {
                if (!record.expand?.[expandKey]) return;
                const items = Array.isArray(record.expand[expandKey])
                    ? record.expand[expandKey]
                    : [record.expand[expandKey]];
                for (const track of items) {
                    tracks.push({
                        type: type,
                        id: track._id,
                        name: track.name,
                        recordId: track.id
                    });
                }
            };

            addPlatformTracks('frhd_track', 'frhd');
            addPlatformTracks('bhr_track', 'bhr');
            addPlatformTracks('cr_track', 'cr');
            addPlatformTracks('tm_track', 'tm');
            addPlatformTracks('app_track', 'app');

            if (record.expand?.db_track) {
                const dbTracks = Array.isArray(record.expand.db_track)
                    ? record.expand.db_track
                    : [record.expand.db_track];

                for (const dbRecord of dbTracks) {
                    const linked = trackLinks.find(l => l.canonical === dbRecord.canonical);

                    if (linked && linked.tracks.length > 0) {
                        // has platform links - use priority to pick primary
                        const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
                        let primaryTrack = linked.tracks[0];
                        for (const priorityType of typePriority) {
                            const found = linked.tracks.find(t => t.type === priorityType);
                            if (found) {
                                primaryTrack = found;
                                break;
                            }
                        }
                        tracks.push({
                            type: primaryTrack.type,
                            id: primaryTrack.id,
                            canonical: dbRecord.canonical,
                            name: linked.name || dbRecord.name,
                            recordId: dbRecord.id,
                            fromDb: true
                        });
                    } else {
                        // no platform links - treat as app/canonical-only track
                        tracks.push({
                            type: 't',
                            id: dbRecord.canonical,
                            canonical: dbRecord.canonical,
                            name: linked?.name || dbRecord.name || dbRecord.canonical,
                            recordId: dbRecord.id,
                            fromDb: true,
                            canonicalOnly: true
                        });
                    }
                }
            }

            // nested playlists
            if (record.expand?.playlists) {
                const nestedPlaylists = Array.isArray(record.expand.playlists)
                    ? record.expand.playlists
                    : [record.expand.playlists];
                for (const nested of nestedPlaylists) {
                    childPlaylists.push({
                        id: nested.id,
                        canonical: nested.canonical,
                        name: nested.name
                    });
                }
            }

            console.log(`  Playlist "${record.name}": ${tracks.length} tracks, ${childPlaylists.length} child playlists`);

            return {
                id: record.id,
                canonical: record.canonical,
                name: record.name || 'Untitled Playlist',
                username: record.username || 'Unknown',
                description: record.description || '',
                tracks: tracks,
                childPlaylists: childPlaylists,
                trackCount: tracks.length,
                show: record.show === true,
                created: record.created,
                updated: record.updated
            };
        });

        console.log(`  Loaded ${playlistsCache.length} playlists from PocketBase`);
    } catch (e) {
        console.error('Failed to load playlists from PocketBase:', e.message);
        console.error('Full error:', e);
        playlistsCache = [];
    }
}

function findPlaylist(playlistId) {
    return playlistsCache.find(p => p.id === playlistId || p.canonical === playlistId);
}

// player links for aliased usernames
let playerLinks = [];

async function loadPlayerLinksFromDb() {
    console.log('Loading player links from PocketBase...');

    try {
        const records = await pb.collection('players').getFullList({
            requestKey: `player-links-${Date.now()}`
        });

        playerLinks = records.map(record => ({
            canonical: record.canonical,
            displayName: record.name,
            aliases: record.aliases || [],
            showProfile: record.show || false,
            frhd: record.frhd_ids?.length > 0,
            bhr: record.bhr_ids?.length > 0,
            cr: record.cr_ids?.length > 0,
            frhd_usernames: record.frhd_ids || [],
            bhr_usernames: record.bhr_ids || [],
            cr_usernames: record.cr_ids || []
        }));

        console.log(`  Loaded ${playerLinks.length} player links from PocketBase`);
    } catch (e) {
        console.error('Failed to load player links from PocketBase:', e.message);
        playerLinks = [];
    }
}

function normalizeAuthorName(name) {
    return name?.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function findPlayerAliases(username, platformFilter = null) {
    const normalizedInput = normalizeAuthorName(username);

    for (const player of playerLinks) {
        const matchesAlias = player.aliases?.some(alias =>
            normalizeAuthorName(alias) === normalizedInput
        );

        const matchesFrhd = player.frhd_usernames?.some(u =>
            normalizeAuthorName(u) === normalizedInput
        );
        const matchesBhr = player.bhr_usernames?.some(u =>
            normalizeAuthorName(u) === normalizedInput
        );
        const matchesCr = player.cr_usernames?.some(u =>
            normalizeAuthorName(u) === normalizedInput
        );

        if (matchesAlias || matchesFrhd || matchesBhr || matchesCr) {
            // determine which aliases to use based on platform filter
            let effectiveAliases = player.aliases || [];
            
            if (platformFilter === 'frhd' && player.frhd_usernames?.length > 0) {
                effectiveAliases = player.frhd_usernames;
            } else if (platformFilter === 'bhr' && player.bhr_usernames?.length > 0) {
                effectiveAliases = player.bhr_usernames;
            } else if (platformFilter === 'cr' && player.cr_usernames?.length > 0) {
                effectiveAliases = player.cr_usernames;
            }
            // For 'db', 'tm', 'app', or no filter - use all aliases
            
            return {
                canonical: player.canonical,
                displayName: player.displayName,
                aliases: effectiveAliases,
                allAliases: player.aliases || [],
                normalizedAliases: effectiveAliases.map(a => normalizeAuthorName(a)),
                platforms: {
                    frhd: player.frhd === true,
                    bhr: player.bhr === true,
                    cr: player.cr === true
                },
                frhd_usernames: player.frhd_usernames || [],
                bhr_usernames: player.bhr_usernames || [],
                cr_usernames: player.cr_usernames || []
            };
        }
    }

    return {
        canonical: normalizedInput,
        displayName: username,
        aliases: [username],
        allAliases: [username],
        normalizedAliases: [normalizedInput],
        platforms: { frhd: false, bhr: false, cr: false },
        frhd_usernames: [],
        bhr_usernames: [],
        cr_usernames: []
    };
}

// track links for cross-platform tracks
let trackLinks = [];
let trackLinksLookup = new Map();
let trackRemixesLookup = new Map()

async function loadTrackLinksFromDb() {
    console.log('Loading track links from PocketBase...');

    try {
        const records = await pb.collection('db').getFullList({
            expand: 'frhd_id,bhr_id,cr_id,tm_id,app_id,remix_of,entry_to',
            requestKey: `track-links-${Date.now()}`
        });

        trackRemixesLookup.clear();

        trackLinks = records.map(record => {
            const tracks = [];

            if (record.expand?.frhd_id) {
                for (const t of record.expand.frhd_id) {
                    tracks.push({ type: 'frhd', id: t._id });
                }
            }

            if (record.expand?.bhr_id) {
                for (const t of record.expand.bhr_id) {
                    tracks.push({ type: 'bhr', id: t._id });
                }
            }

            if (record.expand?.cr_id) {
                for (const t of record.expand.cr_id) {
                    tracks.push({ type: 'cr', id: t._id });
                }
            }

            if (record.expand?.tm_id) {
                for (const t of record.expand.tm_id) {
                    tracks.push({ type: 'tm', id: t._id });
                }
            }

            if (record.expand?.app_id) {
                for (const t of record.expand.app_id) {
                    tracks.push({ type: 'app', id: t._id });
                }
            }

            let remixOf = [];
            if (record.expand?.remix_of && record.expand.remix_of.length > 0) {
                for (const original of record.expand.remix_of) {
                    remixOf.push({
                        canonical: original.canonical,
                        name: original.name
                    });

                    if (!trackRemixesLookup.has(original.canonical)) {
                        trackRemixesLookup.set(original.canonical, []);
                    }
                    trackRemixesLookup.get(original.canonical).push({
                        canonical: record.canonical,
                        name: record.name
                    });
                }
            }

            // parse entry_to playlist relation
            let entryTo = null;
            if (record.expand?.entry_to && record.expand.entry_to.length > 0) {
                const playlist = record.expand.entry_to[0];
                entryTo = {
                    id: playlist.id,
                    canonical: playlist.canonical,
                    name: playlist.name
                };
            }

            return {
                canonical: record.canonical,
                name: record.name,
                authors: record.authors || [],
                published: record.published || null,
                description: record.description || null,
                tracks: tracks,
                remixOf: remixOf.length > 0 ? remixOf : null,
                entryTo: entryTo,
                alt: record.alt === true,
                hide: record.hide === true
            };
        });

        trackLinksLookup.clear();
        for (const link of trackLinks) {
            for (const track of link.tracks) {
                const key = `${track.type}-${track.id}`;
                trackLinksLookup.set(key, link);
            }
        }

        console.log(`  Loaded ${trackLinks.length} track links (${trackLinksLookup.size} tracks)`);
    } catch (e) {
        console.error('Failed to load track links from PocketBase:', e.message);
        trackLinks = [];
        trackLinksLookup.clear();
        trackRemixesLookup.clear();
    }
}

app.get('/api/player/:name', async (req, res) => {
    const username = req.params.name;
    const playerInfo = findPlayerAliases(username);

    // count tracks in db cache
    const trackCount = dbTracksCache.all.filter(t => {
        if (t.username && findPlayerAliases(t.username).canonical === playerInfo.canonical) return true;
        if (t.authorsArray) {
            for (const a of t.authorsArray) {
                if (a && findPlayerAliases(a).canonical === playerInfo.canonical) return true;
            }
        }
        return false;
    }).length;

    // get some sample tracks by this player
    const sampleTracks = dbTracksCache.all
        .filter(t => {
            if (t.username && findPlayerAliases(t.username).canonical === playerInfo.canonical) return true;
            if (t.authorsArray) {
                for (const a of t.authorsArray) {
                    if (a && findPlayerAliases(a).canonical === playerInfo.canonical) return true;
                }
            }
            return false;
        })
        .slice(0, 5)
        .map(t => ({
            name: t.name,
            type: t.urlType || t.type,
            id: t.urlId || t.id,
            canonical: t.canonical
        }));

    res.json({
        canonical: playerInfo.canonical,
        displayName: playerInfo.displayName,
        aliases: playerInfo.aliases,
        avatar: `/avatars/${playerInfo.canonical}.png`,
        platforms: playerInfo.platforms,
        trackCount: trackCount,
        sampleTracks: sampleTracks
    });
});

app.get('/api/remixes/:canonical', (req, res) => {
    const canonical = req.params.canonical;
    const remixes = trackRemixesLookup.get(canonical) || [];

    const remixTracks = remixes.map(remix => {
        const linked = trackLinks.find(l => l.canonical === remix.canonical);
        if (!linked || linked.tracks.length === 0) return null;

        for (const trackRef of linked.tracks) {
            const cached = dbTracksCache[trackRef.type]?.find(t => t.id == trackRef.id);
            if (cached) {
                return processTrackWithLinks(cached);
            }
        }
        return null;
    }).filter(Boolean);

    res.json({
        original: canonical,
        remixes: remixTracks,
        count: remixTracks.length
    });
});

function findLinkedTracks(type, id) {
    const key = `${type}-${id}`;
    return trackLinksLookup.get(key) || null;
}

function formatSize(bytes) {
    if (bytes === null || bytes === undefined || bytes === 0 || isNaN(bytes)) { return ''; }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function parseNumericValue(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;

    const str = String(val).toLowerCase().trim();
    const match = str.match(/^([\d.]+)\s*([km]?)$/);
    if (match) {
        const num = parseFloat(match[1]);
        const suffix = match[2];
        if (suffix === 'k') return num * 1000;
        if (suffix === 'm') return num * 1000000;
        return num;
    }

    return parseFloat(str) || 0;
}

function unparseNumericValue(val) {
    if (val === null || val === undefined) return 0;
    const num = parseInt(val) || 0;

    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function transformRecord(record, type) {
    let authorsArray = [];
    if (record.authors) {
        try {
            if (typeof record.authors === 'string') {
                authorsArray = JSON.parse(record.authors);
            } else if (Array.isArray(record.authors)) {
                authorsArray = record.authors;
            }
        } catch (e) {
            authorsArray = [record.authors];
        }
    }

    let upvotes, downvotes, votes;
    if (type === 'cr') {
        const rawVotes = parseInt(record.votes) || 0;
        upvotes = unparseNumericValue(rawVotes);
        downvotes = null;
        votes = unparseNumericValue(rawVotes);
    } else {
        upvotes = record.upvotes !== undefined ? unparseNumericValue(record.upvotes) : null;
        downvotes = record.downvotes !== undefined ? unparseNumericValue(record.downvotes) : null;
        votes = null;
    }

    let published = null;
    if (record.published) {
        const date = new Date(record.published);
        if (!isNaN(date.getTime())) {
            published = date.toISOString().split('T')[0];
        }
    }

    return {
        id: record._id,
        name: record.name || `${type.toUpperCase()} Track #${record._id}`,
        username: record.username || '',
        authors: Array.isArray(authorsArray) ? authorsArray.join(', ') : (record.authors || ''),
        authorsArray: authorsArray,
        upvotes: upvotes,
        downvotes: downvotes,
        votes: votes,
        favorites: record.favorites !== undefined ? unparseNumericValue(record.favorites) : null,
        plays: record.plays !== undefined ? unparseNumericValue(record.plays) : null,
        size: record.size || null,
        published: published,
        description: record.description || '',
        type: type,
        urlType: type === 'app' ? 't' : type,
        urlType: type,
        urlId: record._id,
        badges: [type],
        canonicalId: `${type}-${record._id}`
    };
}


function processTrackWithLinks(track) {
    const linked = findLinkedTracks(track.type, track.id);

    if (track.type === 't') {
        return {
            ...track,
            urlType: 't',
            urlId: track.canonical || track.id,
            badges: track.badges || []
        };
    }

    let badges = [track.type];
    let urlType = track.type;
    let urlId = track.id;
    let authors = track.authors;
    let authorsArray = track.authorsArray || [];
    let name = track.name;
    let description = track.description || '';
    let published = track.published;
    let canonical = null;
    let remixOf = null;
    let remixCount = 0;
    let entryTo = null;

    let combinedUpvotes = track.type === 'cr'
        ? parseNumericValue(track.votes)
        : parseNumericValue(track.upvotes);
    let combinedDownvotes = parseNumericValue(track.downvotes);
    let combinedPlays = parseNumericValue(track.plays);
    let combinedFavorites = parseNumericValue(track.favorites);

    if (linked) {
        canonical = linked.canonical;

        if (linked.name) {
            name = linked.name;
        }

        if (linked.published) {
            const date = new Date(linked.published);
            if (!isNaN(date.getTime())) {
                published = date.toISOString().split('T')[0];
            }
        }

        badges = [...new Set(linked.tracks.map(t => t.type))];

        if (linked.authors && linked.authors.length > 0) {
            authorsArray = [...linked.authors];
            authors = authorsArray.join(', ');
        }

        urlType = 't';
        urlId = linked.canonical;

        if (linked.remixOf && linked.remixOf.length > 0) {
            remixOf = linked.remixOf;
        }

        const remixes = trackRemixesLookup.get(linked.canonical);
        if (remixes) {
            remixCount = remixes.length;
        }

        if (!entryTo && linked.entryTo) {
            entryTo = linked.entryTo;
        }

        if (!description) {
            const frhdLink = linked.tracks.find(t => t.type === 'frhd');
            if (frhdLink) {
                const cacheKey = `frhd-${frhdLink.id}`;
                const frhdMeta = linkedTrackStatsCache.get(cacheKey);
                if (frhdMeta && frhdMeta.description) {
                    description = frhdMeta.description;
                }
            }
        }

        for (const linkedTrack of linked.tracks) {
            if (linkedTrack.type === track.type && linkedTrack.id === track.id) {
                continue;
            }

            const cacheKey = `${linkedTrack.type}-${linkedTrack.id}`;
            const linkedMeta = linkedTrackStatsCache.get(cacheKey);

            if (linkedMeta) {
                if (linkedTrack.type === 'cr') {
                    combinedUpvotes += parseNumericValue(linkedMeta.votes);
                } else {
                    combinedUpvotes += parseNumericValue(linkedMeta.upvotes);
                }
                combinedDownvotes += parseNumericValue(linkedMeta.downvotes);
                combinedPlays += parseNumericValue(linkedMeta.plays);
                combinedFavorites += parseNumericValue(linkedMeta.favorites);
            }
        }
    }

    const formattedUpvotes = unparseNumericValue(combinedUpvotes);
    const formattedDownvotes = unparseNumericValue(combinedDownvotes);
    const formattedPlays = unparseNumericValue(combinedPlays);
    const formattedFavorites = unparseNumericValue(combinedFavorites);

    return {
        ...track,
        name,
        description,
        published,
        authors,
        authorsArray,
        badges,
        urlType,
        urlId,
        canonical,
        remixOf,
        remixCount,
        entryTo,
        upvotes: formattedUpvotes,
        downvotes: formattedDownvotes,
        votes: track.type === 'cr' ? formattedUpvotes : null,
        plays: formattedPlays,
        favorites: formattedFavorites,
        canonicalId: linked ? linked.canonical : `${track.type}-${track.id}`
    };
}

function sortTracks(tracks, sortBy, sortOrder) {
    if (sortBy === 'shuffle') {
        return shuffleArray(tracks);
    }

    return tracks.sort((a, b) => {
        let valA, valB;

        switch (sortBy) {
            case 'id':
                valA = parseInt(a.id) || 0;
                valB = parseInt(b.id) || 0;
                break;
            case 'name':
                valA = (a.name || '').toLowerCase();
                valB = (b.name || '').toLowerCase();
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            case 'upvotes':
                valA = parseNumericValue(a.upvotes);
                valB = parseNumericValue(b.upvotes);
                break;
            case 'downvotes':
                valA = parseNumericValue(a.downvotes);
                valB = parseNumericValue(b.downvotes);
                break;
            case 'favorites':
                valA = parseNumericValue(a.favorites);
                valB = parseNumericValue(b.favorites);
                break;
            case 'plays':
                valA = parseNumericValue(a.plays);
                valB = parseNumericValue(b.plays);
                break;
            case 'size':
                valA = parseInt(a.size) || 0;
                valB = parseInt(b.size) || 0;
                break;
            case 'published':
                valA = new Date(a.published).getTime() || 0;
                valB = new Date(b.published).getTime() || 0;
                break;
            default:
                valA = parseInt(a.id) || 0;
                valB = parseInt(b.id) || 0;
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
}

app.get('/api/playlists', (req, res) => {
    const visiblePlaylists = playlistsCache.filter(p => p.show === true);

    res.json({
        playlists: visiblePlaylists.map(p => {
            const lastTrack = p.tracks[p.tracks.length - 1];
            const thumbnail = lastTrack
                ? `/${lastTrack.type}/${lastTrack.id}.png`
                : null;

            return {
                id: p.id,
                canonical: p.canonical,
                name: p.name,
                username: p.username,
                description: p.description,
                trackCount: p.tracks.length,
                childPlaylists: p.childPlaylists || [],
                show: p.show,
                thumbnail: thumbnail,
                lastTrack: lastTrack
            };
        })
    });
});

app.get('/api/playlists/all', (req, res) => {
    res.json({
        playlists: playlistsCache.map(p => {
            const lastTrack = p.tracks[p.tracks.length - 1];
            const thumbnail = lastTrack
                ? `/${lastTrack.type}/${lastTrack.id}.png`
                : null;

            return {
                id: p.id,
                canonical: p.canonical,
                name: p.name,
                username: p.username,
                description: p.description,
                trackCount: p.tracks.length,
                childPlaylists: p.childPlaylists || [],
                show: p.show,
                thumbnail: thumbnail,
                lastTrack: lastTrack
            };
        })
    });
});

app.get('/api/playlist/:id', (req, res) => {
    const playlist = findPlaylist(req.params.id);
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
});

app.get('/api/daily/:type', async (req, res) => {
    const type = req.params.type;

    if (!['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        if (dbTracksCache[type] && dbTracksCache[type].length > 0) {
            const track = dailyTrackFromCache(type);
            if (track) {
                return res.json({
                    ...track,
                    specialType: 'daily',
                    trackId: track.id,
                    thumbnail: `/${track.urlType || type}/${track.urlId || track.id}.png`,
                    url: `/${track.urlType || type}/${track.urlId || track.id}`
                });
            }
        }

        const seed = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
        const countResult = await pb.collection(type).getList(1, 1, {
            filter: 'show = true',
            requestKey: `daily-count-${type}-${Date.now()}`
        });

        const total = countResult.totalItems;
        if (total === 0) {
            return res.status(404).json({ error: 'No tracks available' });
        }

        const index = seed % total;
        const result = await pb.collection(type).getList(index + 1, 1, {
            filter: 'show = true',
            requestKey: `daily-${type}-${Date.now()}`
        });

        if (result.items.length === 0) {
            return res.status(404).json({ error: 'Track not found' });
        }

        const record = result.items[0];
        const track = transformRecord(record, type);

        res.json({
            ...track,
            specialType: 'daily',
            trackId: track.id,
            thumbnail: `/${type}/${track.id}.png`,
            url: `/${type}/${track.id}`
        });
    } catch (error) {
        console.error('Daily track error:', error);
        res.status(500).json({ error: 'Failed to get daily track' });
    }
});

app.get('/api/random/:type', async (req, res) => {
    const type = req.params.type;

    if (!['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        if (dbTracksCache[type] && dbTracksCache[type].length > 0) {
            const track = randomTrackFromCache(type);
            if (track) {
                return res.json({
                    ...track,
                    specialType: 'random',
                    trackId: track.id,
                    thumbnail: `/${track.urlType || type}/${track.urlId || track.id}.png`,
                    url: `/${track.urlType || type}/${track.urlId || track.id}`
                });
            }
        }

        const result = await pb.collection(type).getList(1, 1, {
            filter: 'show = true',
            sort: '@random',
            requestKey: `random-${type}-${Date.now()}`
        });

        if (result.items.length === 0) {
            return res.status(404).json({ error: 'No tracks available' });
        }

        const record = result.items[0];
        const track = transformRecord(record, type);

        res.json({
            ...track,
            specialType: 'random',
            trackId: track.id,
            thumbnail: `/${type}/${track.id}.png`,
            url: `/${type}/${track.id}`
        });
    } catch (error) {
        console.error('Random track error:', error);
        res.status(500).json({ error: 'Failed to get random track' });
    }
});

app.get('/api/user-aliases/:name', async (req, res) => {
    const username = req.params.name;
    const type = req.query.type || 'db';
    const playerInfo = findPlayerAliases(username);

    let trackCount = 0;

    if (type === 'db') {
        const playerCanonical = playerInfo.canonical;
        trackCount = dbTracksCache.all.filter(t => {
            if (t.username && findPlayerAliases(t.username).canonical === playerCanonical) return true;
            if (t.authorsArray) {
                for (const a of t.authorsArray) {
                    if (a && findPlayerAliases(a).canonical === playerCanonical) return true;
                }
            }
            return false;
        }).length;
    }
    else if (['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
        try {
            const filterString = buildFilterString({
                type,
                query: '',
                author: username,
                showOnly: false
            });

            const result = await pb.collection(type).getList(1, 1, {
                filter: filterString || undefined,
                requestKey: `player-count-${type}-${username}-${Date.now()}`
            });

            trackCount = result.totalItems;
        } catch (e) {
            console.error(`Failed to get track count for ${username} in ${type}:`, e.message);
            trackCount = 0;
        }
    }
    else if (type === 'all') {
        for (const collectionType of ['frhd', 'bhr', 'cr', 'tm', 'app']) {
            try {
                const filterString = buildFilterString({
                    type: collectionType,
                    query: '',
                    author: username,
                    showOnly: false
                });

                const result = await pb.collection(collectionType).getList(1, 1, {
                    filter: filterString || undefined,
                    requestKey: `player-count-all-${collectionType}-${username}-${Date.now()}`
                });

                trackCount += result.totalItems;
            } catch (e) {
                console.error(`Failed to get track count for ${username} in ${collectionType}:`, e.message);
            }
        }
    }

    res.json({
        canonical: playerInfo.canonical,
        displayName: playerInfo.displayName,
        aliases: playerInfo.aliases,
        platforms: playerInfo.platforms,
        trackCount: trackCount
    });
});

app.get('/api/players', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 24;
    const query = req.query.q || '';

    let players = playerLinks.map(player => ({
        canonical: player.canonical,
        displayName: player.displayName,
        aliases: player.aliases || [],
        avatar: `/avatars/${player.canonical}.png`,
        platforms: {
            frhd: player.frhd === true,
            bhr: player.bhr === true,
            cr: player.cr === true
        }
    }));

    if (query) {
        const lowerQuery = query.toLowerCase();
        players = players.filter(player =>
            player.displayName?.toLowerCase().includes(lowerQuery) ||
            player.canonical?.toLowerCase().includes(lowerQuery) ||
            player.aliases?.some(a => a.toLowerCase().includes(lowerQuery))
        );
    }

    const totalCount = players.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedPlayers = players.slice(startIndex, startIndex + perPage);

    res.json({
        players: paginatedPlayers,
        pagination: { page, perPage, totalCount, totalPages }
    });
});

let linkedTrackStatsCache = new Map();
let dbTracksCache = {
    frhd: [],
    bhr: [],
    cr: [],
    tm: [],
    app: [],
    all: [],
    lastUpdated: null
};

let authorIndex = new Map();
let nameIndex = new Map();
let canonicalIndex = new Map();
let trigramIndex = new Map();

async function loadDbTracksAndStatsCache() {
    console.log('Loading db tracks and stats cache...');

    const needed = { frhd: new Set(), bhr: new Set(), cr: new Set(), tm: new Set(), app: new Set() };

    for (const link of trackLinks) {
        if (link.hide) continue;
        for (const track of link.tracks) {
            if (needed[track.type]) {
                needed[track.type].add(track.id);
            }
        }
    }

    console.log(`Need: frhd=${needed.frhd.size}, bhr=${needed.bhr.size}, cr=${needed.cr.size}, tm=${needed.tm.size}, app=${needed.app.size}`);

    linkedTrackStatsCache.clear();

    for (const type of ['frhd', 'bhr', 'cr', 'tm', 'app']) {
        if (needed[type].size === 0) {
            dbTracksCache[type] = [];
            console.log(`  ${type}: 0 tracks`);
            continue;
        }

        try {
            const ids = Array.from(needed[type]);
            const allRecords = [];

            for (let i = 0; i < ids.length; i += 100) {
                const batch = ids.slice(i, i + 100);
                const filter = batch.map(id => `_id = ${id}`).join(' || ');

                const records = await pb.collection(type).getFullList({
                    filter: filter,
                    requestKey: `db-cache-${type}-${i}-${Date.now()}`
                });

                allRecords.push(...records);
            }

            dbTracksCache[type] = allRecords.map(r => transformRecord(r, type));

            for (const record of allRecords) {
                const cacheKey = `${type}-${record._id}`;
                linkedTrackStatsCache.set(cacheKey, {
                    upvotes: record.upvotes,
                    downvotes: record.downvotes,
                    votes: record.votes,
                    plays: record.plays,
                    favorites: record.favorites,
                    size: record.size,
                    description: record.description || ''
                });
            }

            console.log(`  ${type}: ${dbTracksCache[type].length} tracks`);
        } catch (e) {
            console.error(`Failed to load ${type} cache:`, e.message);
            dbTracksCache[type] = [];
        }
    }

    let allTracks = [
        ...dbTracksCache.frhd,
        ...dbTracksCache.bhr,
        ...dbTracksCache.cr,
        ...dbTracksCache.tm,
        ...dbTracksCache.app
    ].map(processTrackWithLinks);

    // add app-only tracks (in db with no relational links)
    const tracksWithoutPlatformLinks = trackLinks
        .filter(link => link.tracks.length === 0 && !link.hide)
        .map(link => {
            // create a virtual track record for db-only entries
            let published = null;
            if (link.published) {
                const date = new Date(link.published);
                if (!isNaN(date.getTime())) {
                    published = date.toISOString().split('T')[0];
                }
            }

            return {
                id: link.canonical,
                name: link.name || link.canonical,
                type: 't',
                authors: link.authors ? link.authors.join(', ') : 'Unknown',
                authorsArray: link.authors || [],
                username: '',
                description: link.description || '',
                published: published,
                upvotes: null,
                downvotes: null,
                votes: null,
                plays: null,
                favorites: null,
                size: null,
                badges: ['app'],
                urlType: 't',
                urlId: link.canonical,
                canonical: link.canonical,
                canonicalId: link.canonical,
                remixOf: link.remixOf,
                remixCount: trackRemixesLookup.get(link.canonical)?.length || 0,
                entryTo: link.entryTo,
                alt: link.alt
            };
        });

    console.log(`  Found ${tracksWithoutPlatformLinks.length} tracks without platform links`);

    allTracks = [...allTracks, ...tracksWithoutPlatformLinks];

    const seenCanonical = new Set();
    dbTracksCache.all = allTracks.filter(track => {
        if (seenCanonical.has(track.canonicalId)) return false;
        seenCanonical.add(track.canonicalId);
        return true;
    }).map(track => ({
        ...track,
        _searchName: track.name?.toLowerCase() || '',
        _searchAuthors: track.authors?.toLowerCase() || '',
        _searchDescription: track.description?.toLowerCase() || '',
        _searchAuthorsArray: track.authorsArray?.map(a => a?.toLowerCase()).filter(Boolean) || [],
        _searchCanonicalId: track.canonicalId?.toLowerCase() || '',
        _searchUsername: track.username?.toLowerCase() || ''
    }));

    buildSearchIndexes();

    dbTracksCache.lastUpdated = Date.now();
    console.log(`DB tracks cache loaded: ${dbTracksCache.all.length} total tracks, ${linkedTrackStatsCache.size} stats cached`);
}

app.get('/api/db', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 24, 1), 100);
    const type = req.query.type || 'db';
    const query = req.query.q || '';
    const sortBy = req.query.sort || 'shuffle';
    const sortOrder = req.query.order || 'desc';
    const author = req.query.author || '';
    const playlist = req.query.playlist || '';

    try {
        if (query.toLowerCase() === 'playlist' || query.toLowerCase() === 'playlists' || query.toLowerCase() === 'is:playlist') {
            const cacheKey = `playlists:${sortBy}:${sortOrder}:${page}:${perPage}`;
            const cached = sortBy !== 'shuffle' ? getCachedSearch(cacheKey) : null;
            if (cached) return res.json(cached);

            let playlists = playlistsCache.filter(p => p.show === true);

            if (sortBy === 'shuffle') {
                playlists = shuffleArray(playlists);
            } else if (sortBy === 'name') {
                playlists.sort((a, b) => {
                    const cmp = (a.name || '').localeCompare(b.name || '');
                    return sortOrder === 'asc' ? cmp : -cmp;
                });
            } else if (sortBy === 'published' || sortBy === 'created') {
                playlists.sort((a, b) => {
                    const dateA = new Date(a.created).getTime() || 0;
                    const dateB = new Date(b.created).getTime() || 0;
                    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                });
            }

            const totalCount = playlists.length;
            const totalPages = Math.ceil(totalCount / perPage);
            const startIndex = (page - 1) * perPage;
            const paginatedPlaylists = playlists.slice(startIndex, startIndex + perPage);

            const result = {
                tracks: [],
                playlists: paginatedPlaylists.map(p => {
                    const lastTrack = p.tracks[p.tracks.length - 1];
                    return {
                        id: p.id,
                        canonical: p.canonical,
                        name: p.name,
                        username: p.username,
                        description: p.description,
                        trackCount: p.tracks.length,
                        show: p.show,
                        thumbnail: lastTrack
                            ? `/${lastTrack.type}/${lastTrack.id}.png`
                            : '/data/default-thumbnail.png'
                    };
                }),
                pagination: { page, perPage, totalCount, totalPages },
                playlist: null,
                mode: 'playlists'
            };

            if (sortBy !== 'shuffle') {
                setCachedSearch(cacheKey, result);
            }
            return res.json(result);
        }

        if (playlist) {
            const cacheKey = `playlist:${playlist}:${type}:${sortBy}:${sortOrder}`;
            const cached = sortBy !== 'shuffle' ? getCachedSearch(cacheKey) : null;
            if (cached) return res.json(cached);

            const playlistData = findPlaylist(playlist);
            if (!playlistData) {
                return res.json({
                    tracks: [],
                    pagination: { page: 1, perPage: 0, totalCount: 0, totalPages: 0 },
                    playlist: null
                });
            }

            let playlistTracks = playlistData.tracks;
            if (type && type !== 'db' && ['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
                playlistTracks = playlistTracks.filter(t => t.type === type);
            }

            const tracksByType = { frhd: [], bhr: [], cr: [], tm: [], app: [] };
            const canonicalTracks = [];

            playlistTracks.forEach(t => {
                if (t.type === 't') {
                    canonicalTracks.push(t);
                } else if (tracksByType[t.type]) {
                    tracksByType[t.type].push(t.id);
                }
            });

            const fetchedTracks = new Map();

            for (const [trackType, ids] of Object.entries(tracksByType)) {
                if (ids.length === 0) continue;

                try {
                    const uncachedIds = [];
                    ids.forEach(id => {
                        const cached = dbTracksCache[trackType]?.find(t => t.id == id);
                        if (cached) {
                            fetchedTracks.set(`${trackType}-${id}`, cached);
                        } else {
                            uncachedIds.push(id);
                        }
                    });

                    if (uncachedIds.length > 0) {
                        const filter = uncachedIds.map(id => `_id = ${id}`).join(' || ');
                        const records = await pb.collection(trackType).getFullList({
                            filter: filter,
                            requestKey: `playlist-batch-${trackType}-${Date.now()}`
                        });

                        records.forEach(record => {
                            const transformed = transformRecord(record, trackType);
                            fetchedTracks.set(`${trackType}-${record._id}`, transformed);
                        });
                    }
                } catch (e) {
                    console.error(`Failed to fetch ${trackType} playlist tracks:`, e.message);
                }
            }

            for (const ct of canonicalTracks) {
                const canonical = ct.id; // for type 't', id is the canonical

                const cached = dbTracksCache.all.find(t =>
                    t.canonical === canonical ||
                    t.canonicalId === canonical ||
                    (t.type === 't' && t.id === canonical)
                );

                if (cached) {
                    fetchedTracks.set(`t-${canonical}`, {
                        ...cached,
                        type: 't',
                        urlType: 't',
                        urlId: canonical
                    });
                } else {
                    const linked = trackLinks.find(l => l.canonical === canonical);
                    if (linked) {
                        let published = null;
                        if (linked.published) {
                            const date = new Date(linked.published);
                            if (!isNaN(date.getTime())) {
                                published = date.toISOString().split('T')[0];
                            }
                        }

                        fetchedTracks.set(`t-${canonical}`, {
                            id: canonical,
                            canonical: canonical,
                            canonicalId: canonical,
                            name: linked.name || ct.name || canonical,
                            type: 't',
                            urlType: 't',
                            urlId: canonical,
                            authors: linked.authors ? linked.authors.join(', ') : 'Unknown',
                            authorsArray: linked.authors || [],
                            username: '',
                            description: linked.description || '',
                            published: published,
                            badges: [],
                            upvotes: null,
                            downvotes: null,
                            votes: null,
                            plays: null,
                            favorites: null,
                            size: null,
                            remixOf: linked.remixOf || null,
                            remixCount: trackRemixesLookup.get(canonical)?.length || 0
                        });
                    }
                }
            }

            let allTracks = [];
            playlistTracks.forEach(trackRef => {
                const key = trackRef.type === 't'
                    ? `t-${trackRef.id}`
                    : `${trackRef.type}-${trackRef.id}`;

                const track = fetchedTracks.get(key);
                if (track) {
                    allTracks.push(track);
                }
            });

            allTracks = allTracks.map(track => {
                if (track.type === 't') {
                    return track;
                }
                return processTrackWithLinks(track);
            });

            allTracks = sortTracks(allTracks, sortBy, sortOrder);

            const playlistInfo = {
                id: playlistData.id,
                canonical: playlistData.canonical,
                name: playlistData.name,
                username: playlistData.username,
                description: playlistData.description,
                totalTracks: playlistData.tracks.length
            };

            const result = {
                tracks: allTracks,
                pagination: {
                    page: 1,
                    perPage: allTracks.length,
                    totalCount: allTracks.length,
                    totalPages: 1
                },
                playlist: playlistInfo,
                allLoaded: true
            };

            if (sortBy !== 'shuffle') {
                setCachedSearch(cacheKey, result);
            }
            return res.json(result);
        }

        if (author) {
            const cacheKey = `author:${author}:${type}:${query}:${sortBy}:${sortOrder}`;
            const cached = sortBy !== 'shuffle' ? getCachedSearch(cacheKey) : null;
            if (cached) return res.json(cached);

            let allTracks = [];

            if (type === 'db') {
                allTracks = filterCachedTracks(dbTracksCache.all, query, author, type);
                allTracks = sortTracks(allTracks, sortBy, sortOrder);

                const result = {
                    tracks: allTracks,
                    pagination: {
                        page: 1,
                        perPage: allTracks.length,
                        totalCount: allTracks.length,
                        totalPages: 1
                    },
                    playlist: null,
                    allLoaded: true
                };

                if (sortBy !== 'shuffle') {
                    setCachedSearch(cacheKey, result);
                }
                return res.json(result);
            }

            const collections = ['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type) ? [type] : ['frhd', 'bhr', 'cr', 'tm', 'app'];

            for (const collectionType of collections) {
                const filterString = buildFilterString({
                    type: collectionType,
                    query,
                    author,
                    showOnly: false
                });

                try {
                    const records = await pb.collection(collectionType).getFullList({
                        filter: filterString || undefined,
                        requestKey: `author-${collectionType}-${author}-${Date.now()}`
                    });
                    allTracks = allTracks.concat(records.map(r => transformRecord(r, collectionType)));
                } catch (e) {
                    console.error(`Failed to fetch ${collectionType}:`, e.message);
                }
            }

            allTracks = allTracks.map(processTrackWithLinks);

            if (!['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
                const seenCanonical = new Set();
                allTracks = allTracks.filter(track => {
                    if (seenCanonical.has(track.canonicalId)) return false;
                    seenCanonical.add(track.canonicalId);
                    return true;
                });
            }

            allTracks = sortTracks(allTracks, sortBy, sortOrder);

            const result = {
                tracks: allTracks,
                pagination: {
                    page: 1,
                    perPage: allTracks.length,
                    totalCount: allTracks.length,
                    totalPages: 1
                },
                playlist: null,
                allLoaded: true
            };

            if (sortBy !== 'shuffle') {
                setCachedSearch(cacheKey, result);
            }
            return res.json(result);
        }

        if (type === 'db') {
            let allTracks = filterCachedTracks(dbTracksCache.all, query, '');

            allTracks = sortTracks(allTracks, sortBy, sortOrder);

            if (req.query.afterCanonical || req.query.beforeCanonical) {
                const cursorId = req.query.afterCanonical || req.query.beforeCanonical;
                const cursorIndex = allTracks.findIndex(t =>
                    t.canonical === cursorId ||
                    t.canonicalId === cursorId ||
                    String(t.id) === cursorId
                );

                if (cursorIndex !== -1) {
                    if (req.query.afterCanonical) {
                        allTracks = allTracks.slice(cursorIndex + 1);
                    } else {
                        allTracks = allTracks.slice(0, cursorIndex);
                        allTracks = allTracks.reverse();
                    }
                }
            }

            if (req.query.exclude) {
                const excludeId = req.query.exclude;
                allTracks = allTracks.filter(t =>
                    t.canonical !== excludeId &&
                    t.canonicalId !== excludeId &&
                    String(t.id) !== excludeId
                );
            }

            const totalCount = allTracks.length;
            const totalPages = Math.ceil(totalCount / perPage);
            const startIndex = (page - 1) * perPage;
            const paginatedTracks = allTracks.slice(startIndex, startIndex + perPage);

            const result = {
                tracks: paginatedTracks,
                pagination: { page, perPage, totalCount, totalPages },
                playlist: null
            };

            if (sortBy !== 'shuffle' && !req.query.afterCanonical && !req.query.beforeCanonical && !req.query.exclude) {
                const cacheKey = `db:${query}:${sortBy}:${sortOrder}:${page}:${perPage}`;
                setCachedSearch(cacheKey, result);
            }
            return res.json(result);
        }

        if (['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
            const filterString = buildFilterString({ type, query, author, type, showOnly: false });

            let sortString;
            if (sortBy === 'shuffle') {
                sortString = '@random';
            } else {
                let sortField = sortBy;
                if (type === 'cr' && sortBy === 'upvotes') sortField = 'votes';
                if (type === 'cr' && sortBy === 'downvotes') sortField = 'votes';

                const fieldMap = {
                    'id': '_id',
                    'name': 'name',
                    'upvotes': 'upvotes',
                    'downvotes': 'downvotes',
                    'votes': 'votes',
                    'plays': 'plays',
                    'size': 'size',
                    'favorites': 'favorites',
                    'published': 'published'
                };

                const field = fieldMap[sortField] || '_id';
                sortString = sortOrder === 'asc' ? field : `-${field}`;
            }

            const result = await pb.collection(type).getList(page, perPage, {
                filter: filterString || undefined,
                sort: sortString,
                requestKey: `db-${type}-${page}-${Date.now()}`
            });

            let tracks = result.items.map(r => transformRecord(r, type));
            tracks = tracks.map(processTrackWithLinks);

            return res.json({
                tracks,
                pagination: {
                    page,
                    perPage,
                    totalCount: result.totalItems,
                    totalPages: result.totalPages
                },
                playlist: null
            });
        }

        const cacheKey = `all:${query}:${sortBy}:${sortOrder}:${page}:${perPage}`;
        const cached = sortBy !== 'shuffle' ? getCachedSearch(cacheKey) : null;
        if (cached) return res.json(cached);

        const collections = ['frhd', 'bhr', 'cr', 'tm', 'app'];
        let allTracks = [];

        for (const collectionType of collections) {
            const filterString = buildFilterString({
                type: collectionType,
                query,
                author,
                showOnly: false
            });

            try {
                const records = await pb.collection(collectionType).getFullList({
                    filter: filterString || undefined,
                    requestKey: `all-${collectionType}-${Date.now()}`
                });
                allTracks = allTracks.concat(records.map(r => transformRecord(r, collectionType)));
            } catch (e) {
                console.error(`Failed to fetch ${collectionType}:`, e.message);
            }
        }

        allTracks = allTracks.map(processTrackWithLinks);

        const seenCanonical = new Set();
        allTracks = allTracks.filter(track => {
            if (seenCanonical.has(track.canonicalId)) return false;
            seenCanonical.add(track.canonicalId);
            return true;
        });

        allTracks = sortTracks(allTracks, sortBy, sortOrder);

        const totalCount = allTracks.length;
        const totalPages = Math.ceil(totalCount / perPage);
        const startIndex = (page - 1) * perPage;
        const paginatedTracks = allTracks.slice(startIndex, startIndex + perPage);

        const result = {
            tracks: paginatedTracks,
            pagination: { page, perPage, totalCount, totalPages },
            playlist: null
        };

        if (sortBy !== 'shuffle') {
            setCachedSearch(cacheKey, result);
        }
        res.json(result);

    } catch (error) {
        console.error('DB API error:', error);
        res.status(500).json({ error: 'Failed to fetch tracks', details: error.message });
    }
});

app.get('/db', async (req, res) => {
    const type = req.query.type || 'db';
    const query = req.query.q || '';
    const sortBy = req.query.sort || 'shuffle';
    const sortOrder = req.query.order || 'desc';

    const renderedHtml = dbTemplate({
        title: type === 'db' ? 'Track Database' : `${type.toUpperCase()} Tracks`,
        type,
        query,
        sortBy,
        sortOrder
    });

    res.status(200).send(renderedHtml);
});

app.get('/api/authors-by-platform', (req, res) => {
    const platform = req.query.platform || 'db';
    const query = req.query.q || '';
    const sortBy = req.query.sort || 'name';
    const sortOrder = req.query.order || 'asc';

    let players = playerLinks
        .filter(player => {
            if (player.showProfile !== true) return false;
            if (platform === 'all' || platform === 'db') return true;
            return player[platform] === true;
        })
        .map(player => ({
            type: 'player',
            canonical: player.canonical,
            displayName: player.displayName,
            aliases: player.aliases,
            avatar: `/avatars/${player.canonical}.png`,
            platforms: {
                frhd: player.frhd === true,
                bhr: player.bhr === true,
                cr: player.cr === true
            }
        }));

    if (query) {
        const lowerQuery = query.toLowerCase();
        players = players.filter(player =>
            player.displayName?.toLowerCase().includes(lowerQuery) ||
            player.canonical?.toLowerCase().includes(lowerQuery) ||
            player.aliases?.some(a => a.toLowerCase().includes(lowerQuery))
        );
    }

    if (sortBy === 'shuffle') {
        players = shuffleArray(players);
    } else if (sortBy === 'name') {
        players.sort((a, b) => {
            const cmp = (a.displayName || '').localeCompare(b.displayName || '');
            return sortOrder === 'asc' ? cmp : -cmp;
        });
    }

    res.json({
        players: players,
        allLoaded: true
    });
});

function buildFilterString(options) {
    const { type, query, author, showOnly } = options;
    let filterParts = [];

    if (showOnly) {
        filterParts.push('show = true');
    }

    if (query) {
        const numericMatch = query.match(/^(upvotes|downvotes|votes|plays|size|favorites|id)(>|<|>=|<=|=)(\d+)$/i);

        if (numericMatch) {
            const field = numericMatch[1].toLowerCase();
            const operator = numericMatch[2];
            const value = parseInt(numericMatch[3]);

            let dbField = field;
            if (type === 'cr' && (field === 'upvotes' || field === 'downvotes')) {
                dbField = 'votes';
            }
            if (field === 'id') {
                dbField = '_id';
            }

            filterParts.push(`${dbField} ${operator} ${value}`);
        }
        else if (query.match(/^published(>|<|>=|<=|=)(\d{4}-\d{2}-\d{2})$/i)) {
            const dateMatch = query.match(/^published(>|<|>=|<=|=)(\d{4}-\d{2}-\d{2})$/i);
            const operator = dateMatch[1];
            const date = dateMatch[2];
            filterParts.push(`published ${operator} "${date}"`);
        }
        else if (query.match(/^year:(\d{4})$/i)) {
            const year = query.match(/^year:(\d{4})$/i)[1];
            filterParts.push(`published >= "${year}-01-01" && published <= "${year}-12-31"`);
        }
        else if (query.match(/^id:(\d+)$/i)) {
            const id = query.match(/^id:(\d+)$/i)[1];
            filterParts.push(`_id = ${id}`);
        }
        else if (query.match(/^size:(tiny|small|medium|large|huge)$/i)) {
            const sizeCategory = query.match(/^size:(tiny|small|medium|large|huge)$/i)[1].toLowerCase();
            const sizeRanges = {
                tiny: 'size < 1000',
                small: 'size >= 1000 && size < 10000',
                medium: 'size >= 10000 && size < 100000',
                large: 'size >= 100000 && size < 1000000',
                huge: 'size >= 1000000'
            };
            filterParts.push(`(${sizeRanges[sizeCategory]})`);
        }
        else if (query.match(/^remix(of)?:(.+)$/i)) {
            const remixMatch = query.match(/^remix(of)?:(.+)$/i);
            const searchTerm = remixMatch[2].toLowerCase();

            filtered = filtered.filter(t => {
                if (!t.remixOf) return false;
                return t.remixOf.canonical.toLowerCase().includes(searchTerm) ||
                    t.remixOf.name.toLowerCase().includes(searchTerm);
            });
        }
        else {
            const escapedQuery = query.replace(/"/g, '\\"');

            let searchFields = [
                `name ~ "${escapedQuery}"`,
                `authors ~ "${escapedQuery}"`
            ];

            if (type === 'frhd') {
                searchFields.push(`description ~ "${escapedQuery}"`);
            }

            if (/^\d+$/.test(query)) {
                searchFields.push(`_id = ${query}`);
            }

            const playerInfo = findPlayerAliases(query, type);
            for (const alias of playerInfo.aliases) {
                const escapedAlias = alias.replace(/"/g, '\\"');
                if (escapedAlias.toLowerCase() !== escapedQuery.toLowerCase()) {
                    searchFields.push(`authors ~ "${escapedAlias}"`);
                    if (['frhd', 'bhr', 'cr'].includes(type)) {
                        searchFields.push(`username ~ "${escapedAlias}"`);
                    }
                }
            }

            filterParts.push(`(${searchFields.join(' || ')})`);
        }
    }

    if (author) {
    const playerInfo = findPlayerAliases(author, type);
    const aliases = playerInfo.aliases && playerInfo.aliases.length > 0
        ? playerInfo.aliases
        : [author];

    const aliasConditions = aliases.flatMap(alias => {
        const escaped = alias.replace(/"/g, '\\"');
        const conditions = [];
        
        if (['frhd', 'bhr', 'cr'].includes(type)) {
            conditions.push(`username = "${escaped}"`);
        }
        conditions.push(`authors ~ '"${escaped}"'`);

        return conditions;
    });

    filterParts.push(`(${aliasConditions.join(' || ')})`);
}

    return filterParts.length > 0 ? filterParts.join(' && ') : '';
}

function generateTrigrams(str) {
    if (!str || str.length < 3) return [str?.toLowerCase() || ''];
    const s = str.toLowerCase();
    const trigrams = [];
    for (let i = 0; i <= s.length - 3; i++) {
        trigrams.push(s.substring(i, i + 3));
    }
    return trigrams;
}

function searchByText(query, tracks) {
    const lowerQuery = query.toLowerCase();
    const isFullCache = tracks === dbTracksCache.all;

    if (lowerQuery.length < 3) {
        return tracks.filter(t => {
            if (t._searchName.includes(lowerQuery)) return true;
            if (t._searchAuthorsArray?.some(a => a.includes(lowerQuery))) return true;
            return false;
        });
    }

    if (!isFullCache) {
        return tracks.filter(t => {
            if (t._searchName.includes(lowerQuery)) return true;
            if (t._searchDescription.includes(lowerQuery)) return true;
            if (t.id?.toString().includes(query)) return true;
            if (t._searchCanonicalId.includes(lowerQuery)) return true;
            if (t._searchAuthorsArray?.some(a => a.includes(lowerQuery))) return true;
            return false;
        });
    }

    const results = new Set();

    const playerInfo = findPlayerAliases(query);
    for (const alias of playerInfo.aliases) {
        const authorMatch = authorIndex.get(alias.toLowerCase());
        if (authorMatch) {
            for (const idx of authorMatch) results.add(idx);
        }
    }

    const exactWordMatch = nameIndex.get(lowerQuery);
    if (exactWordMatch) {
        for (const idx of exactWordMatch) results.add(idx);
    }

    const queryTrigrams = generateTrigrams(lowerQuery);
    if (queryTrigrams.length > 0 && queryTrigrams[0].length >= 3) {
        const trigramMatches = getTrigramMatches(queryTrigrams, lowerQuery);
        for (const idx of trigramMatches) results.add(idx);
    }

    if (results.size > 0) {
        return Array.from(results).map(idx => dbTracksCache.all[idx]);
    }

    return tracks.filter(t => {
        if (t._searchName.includes(lowerQuery)) return true;
        if (t._searchDescription.includes(lowerQuery)) return true;
        if (t._searchAuthorsArray?.some(a => a.includes(lowerQuery))) return true;
        return false;
    });
}

function getTrigramMatches(queryTrigrams, originalQuery) {
    if (queryTrigrams.length === 0) return new Set();

    let candidates = trigramIndex.get(queryTrigrams[0]);
    if (!candidates || candidates.size === 0) return new Set();

    candidates = new Set(candidates);

    for (let i = 1; i < queryTrigrams.length && candidates.size > 0; i++) {
        const triMatches = trigramIndex.get(queryTrigrams[i]);
        if (!triMatches || triMatches.size === 0) {
            return new Set();
        }
        
        const newCandidates = new Set();
        const [smaller, larger] = candidates.size < triMatches.size 
            ? [candidates, triMatches] 
            : [triMatches, candidates];
        
        for (const x of smaller) {
            if (larger.has(x)) newCandidates.add(x);
        }
        candidates = newCandidates;
    }

    const lowerQuery = originalQuery.toLowerCase();
    const verified = new Set();
    
    for (const idx of candidates) {
        const track = dbTracksCache.all[idx];
        if (track._searchName.includes(lowerQuery) ||
            track._searchAuthorsArray?.some(a => a.includes(lowerQuery))) {
            verified.add(idx);
        }
    }
    
    return verified;
}

function filterCachedTracks(tracks, query, author, platformType = null) {
    let filtered = [...tracks];

    if (query.includes(' + ')) {
        const parts = query.split(' + ').map(p => p.trim()).filter(Boolean);
        for (const part of parts) {
            filtered = filterCachedTracks(filtered, part, '', platformType);
        }
        return filtered;
    }

    if (query.includes(' | ')) {
        const parts = query.split(' | ').map(p => p.trim()).filter(Boolean);
        const results = new Set();
        for (const part of parts) {
            const partResults = filterCachedTracks([...tracks], part, '', platformType);
            partResults.forEach(t => results.add(t.canonicalId));
        }
        return tracks.filter(t => results.has(t.canonicalId));
    }

    if (author && !query) {
        const playerInfo = findPlayerAliases(author, platformType);
        const aliasesLower = playerInfo.aliases.map(a => a.toLowerCase());

        const matchingIndices = new Set();
        for (const alias of aliasesLower) {
            const indices = authorIndex.get(alias);
            if (indices) {
                indices.forEach(idx => matchingIndices.add(idx));
            }
        }

        if (matchingIndices.size > 0) {
            return Array.from(matchingIndices).map(idx => dbTracksCache.all[idx]);
        }
        return [];
    }

    if (query) {
        if (/^\d+$/.test(query)) {
            const found = filtered.filter(t => t.id?.toString() === query);
            if (found.length > 0) {
                filtered = found;
            } else {
                filtered = searchByText(query, filtered);
            }
        }
        else if (query.match(/^id=(\d+)$/i)) {
            const id = parseInt(query.match(/^id=(\d+)$/i)[1]);
            return filtered.filter(t => t.id === id);
        }
        else if (query.match(/^(upvotes|downvotes|votes|plays|size|favorites|id)(>|<|>=|<=|=)(\d+)$/i)) {
            const numericMatch = query.match(/^(upvotes|downvotes|votes|plays|size|favorites|id)(>|<|>=|<=|=)(\d+)$/i);
            const field = numericMatch[1].toLowerCase();
            const operator = numericMatch[2];
            const value = parseInt(numericMatch[3]);

            filtered = filtered.filter(t => {
                let trackValue;
                if (field === 'upvotes' || field === 'votes') {
                    trackValue = parseNumericValue(t.upvotes) || parseNumericValue(t.votes) || 0;
                } else if (field === 'downvotes') {
                    trackValue = parseNumericValue(t.downvotes) || 0;
                } else if (field === 'plays') {
                    trackValue = parseNumericValue(t.plays) || 0;
                } else if (field === 'size') {
                    trackValue = parseInt(t.size) || 0;
                } else if (field === 'favorites') {
                    trackValue = parseNumericValue(t.favorites) || 0;
                } else if (field === 'id') {
                    trackValue = parseInt(t.id) || 0;
                }

                switch (operator) {
                    case '>': return trackValue > value;
                    case '<': return trackValue < value;
                    case '>=': return trackValue >= value;
                    case '<=': return trackValue <= value;
                    case '=': return trackValue === value;
                    default: return true;
                }
            });
        }
        else if (query.match(/^(upvotes|plays|size|favorites):(\d+)\.\.(\d+)$/i)) {
            const rangeMatch = query.match(/^(upvotes|plays|size|favorites):(\d+)\.\.(\d+)$/i);
            const field = rangeMatch[1].toLowerCase();
            const min = parseInt(rangeMatch[2]);
            const max = parseInt(rangeMatch[3]);

            filtered = filtered.filter(t => {
                let value;
                if (field === 'upvotes') value = parseNumericValue(t.upvotes) || parseNumericValue(t.votes) || 0;
                else if (field === 'plays') value = parseNumericValue(t.plays) || 0;
                else if (field === 'size') value = parseInt(t.size) || 0;
                else if (field === 'favorites') value = parseNumericValue(t.favorites) || 0;

                return value >= min && value <= max;
            });
        }
        else if (query.match(/^published(>|<|>=|<=|=)(\d{4}-\d{2}-\d{2})$/i)) {
            const dateMatch = query.match(/^published(>|<|>=|<=|=)(\d{4}-\d{2}-\d{2})$/i);
            const operator = dateMatch[1];
            const dateStr = dateMatch[2];
            const filterDate = new Date(dateStr).getTime();

            filtered = filtered.filter(t => {
                if (!t.published) return false;
                const trackDate = new Date(t.published).getTime();

                switch (operator) {
                    case '>': return trackDate > filterDate;
                    case '<': return trackDate < filterDate;
                    case '>=': return trackDate >= filterDate;
                    case '<=': return trackDate <= filterDate;
                    case '=': return t.published.startsWith(dateStr);
                    default: return true;
                }
            });
        }
        else if (query.match(/^year=(\d{4})$/i)) {
            const year = query.match(/^year=(\d{4})$/i)[1];
            filtered = filtered.filter(t => t.published && t.published.startsWith(year));
        }
        else if (query.match(/^size:(tiny|small|medium|large|huge)$/i)) {
            const sizeCategory = query.match(/^size:(tiny|small|medium|large|huge)$/i)[1].toLowerCase();
            const sizeRanges = {
                tiny: [0, 1000],
                small: [1000, 10000],
                medium: [10000, 100000],
                large: [100000, 1000000],
                huge: [1000000, Infinity]
            };
            const [min, max] = sizeRanges[sizeCategory];
            filtered = filtered.filter(t => {
                const size = parseInt(t.size) || 0;
                return size >= min && size < max;
            });
        }
        else if (query.match(/^(type|platform):(frhd|bhr|cr|tm|app)$/i)) {
            const filterType = query.match(/^(type|platform):(frhd|bhr|cr|tm|app)$/i)[2].toLowerCase();
            filtered = filtered.filter(t => t.badges && t.badges.includes(filterType));
        }
        else if (query.match(/^(player|user|author):(.+)$/i)) {
            const playerQuery = query.match(/^(player|user|author):(.+)$/i)[2];
            const playerInfo = findPlayerAliases(playerQuery, platformType);
            const aliasesLower = playerInfo.aliases.map(a => a.toLowerCase());

            if (filtered === dbTracksCache.all || filtered.length === dbTracksCache.all.length) {
                const matchingIndices = new Set();
                for (const alias of aliasesLower) {
                    const indices = authorIndex.get(alias);
                    if (indices) {
                        indices.forEach(idx => matchingIndices.add(idx));
                    }
                }
                if (matchingIndices.size > 0) {
                    filtered = Array.from(matchingIndices).map(idx => dbTracksCache.all[idx]);
                } else {
                    filtered = [];
                }
            } else {
                filtered = filtered.filter(t => {
                    for (const alias of aliasesLower) {
                        if (t._searchUsername === alias) return true;
                        if (t._searchAuthorsArray && t._searchAuthorsArray.includes(alias)) return true;
                    }
                    return false;
                });
            }
        }
        else if (query.match(/^has:(description|votes|plays|favorites|remix|remixes)$/i)) {
            const hasField = query.match(/^has:(description|votes|plays|favorites|remix|remixes)$/i)[1].toLowerCase();
            filtered = filtered.filter(t => {
                switch (hasField) {
                    case 'description': return t.description && t.description.trim() !== '';
                    case 'votes': return parseNumericValue(t.upvotes) > 0 || parseNumericValue(t.votes) > 0;
                    case 'plays': return parseNumericValue(t.plays) > 0;
                    case 'favorites': return parseNumericValue(t.favorites) > 0;
                    case 'remix':
                    case 'remixes': return t.remixCount > 0;
                    default: return true;
                }
            });
        }
        else if (query.match(/^badges:(\d+)$/i)) {
            const badgeCount = parseInt(query.match(/^badges:(\d+)$/i)[1]);
            filtered = filtered.filter(t => t.badges && t.badges.length >= badgeCount);
        }
        else if (query.toLowerCase() === 'linked' || query.toLowerCase() === 'multiplatform') {
            filtered = filtered.filter(t => t.badges && t.badges.length > 1);
        }
        else if (query.toLowerCase() === 'remix' || query.toLowerCase() === 'remixes') {
            filtered = filtered.filter(t => t.remixOf && t.remixOf.length > 0);
        }
        else if (query.toLowerCase() === 'playlists' || query.toLowerCase() === 'is:playlist') {
            filtered = [];
            filtered._showPlaylists = true;
        }
        else if (query.match(/^playlist:(.+)$/i)) {
            const playlistQuery = query.match(/^playlist:(.+)$/i)[1].toLowerCase();

            const matchingPlaylists = playlistsCache.filter(p =>
                p.name.toLowerCase().includes(playlistQuery) ||
                p.canonical?.toLowerCase().includes(playlistQuery) ||
                p.username?.toLowerCase().includes(playlistQuery)
            );

            const trackKeys = new Set();
            matchingPlaylists.forEach(p => {
                p.tracks.forEach(t => trackKeys.add(`${t.type}-${t.id}`));
            });

            filtered = filtered.filter(t => trackKeys.has(`${t.type}-${t.id}`));
        }
        else if (query.match(/^remix(of)?:(.+)$/i)) {
            const remixMatch = query.match(/^remix(of)?:(.+)$/i);
            const searchTerm = remixMatch[2].toLowerCase();

            filtered = filtered.filter(t => {
                if (!t.remixOf || t.remixOf.length === 0) return false;
                return t.remixOf.some(r =>
                    r.canonical.toLowerCase().includes(searchTerm) ||
                    r.name.toLowerCase().includes(searchTerm)
                );
            });
        }
        else {
            filtered = searchByText(query, filtered);
        }
    }

    if (author && query) {
        const playerInfo = findPlayerAliases(author, platformType);
        const aliasesLower = playerInfo.aliases.map(a => a.toLowerCase());

        filtered = filtered.filter(t => {
            for (const alias of aliasesLower) {
                if (t._searchAuthorsArray.includes(alias)) return true;
                if (t._searchUsername === alias) return true;
            }
            return false;
        });
    }

    return filtered;
}

function buildSearchIndexes() {
    console.log('Building search indexes...');

    authorIndex.clear();
    nameIndex.clear();
    canonicalIndex.clear();
    trigramIndex.clear();

    dbTracksCache.all.forEach((track, idx) => {
        if (track.canonicalId) {
            canonicalIndex.set(track.canonicalId.toLowerCase(), idx);
        }
        if (track.canonical) {
            canonicalIndex.set(track.canonical.toLowerCase(), idx);
        }

        track.authorsArray?.forEach(author => {
            if (!author) return;
            const lower = author.toLowerCase();
            if (!authorIndex.has(lower)) authorIndex.set(lower, new Set());
            authorIndex.get(lower).add(idx);
        });

        if (track.username) {
            const lower = track.username.toLowerCase();
            if (!authorIndex.has(lower)) authorIndex.set(lower, new Set());
            authorIndex.get(lower).add(idx);
        }

        generateTrigrams(track.name).forEach(tri => {
            if (!trigramIndex.has(tri)) trigramIndex.set(tri, new Set());
            trigramIndex.get(tri).add(idx);
        });

        track.authorsArray?.forEach(author => {
            generateTrigrams(author).forEach(tri => {
                if (!trigramIndex.has(tri)) trigramIndex.set(tri, new Set());
                trigramIndex.get(tri).add(idx);
            });
        });

        track.name?.toLowerCase().split(/\s+/).forEach(word => {
            if (word.length < 2) return;
            if (!nameIndex.has(word)) nameIndex.set(word, new Set());
            nameIndex.get(word).add(idx);
        });
    });

    console.log(`  Search indexes built: ${authorIndex.size} authors, ${nameIndex.size} words, ${trigramIndex.size} trigrams`);
}

function randomTrackFromCache(type) {
    const tracks = dbTracksCache[type];
    if (!tracks || tracks.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomIndex];
}

function dailyTrackFromCache(type) {
    const tracks = dbTracksCache[type];
    if (!tracks || tracks.length === 0) {
        return null;
    }
    const seed = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
    return tracks[seed % tracks.length];
}

function randomTrackRedirect(type) {
    return (req, res) => {
        const track = randomTrackFromCache(type);
        if (!track) {
            return res.status(404).send('No tracks available');
        }
        res.redirect(302, `/${type}/${track.id}${req.query.json === 'true' ? '?json=true' : ''}`);
    };
}

function dailyTrackRedirect(type) {
    return (req, res) => {
        const track = dailyTrackFromCache(type);
        if (!track) {
            return res.status(404).send('No tracks available');
        }
        res.redirect(302, `/${type}/${track.id}${req.query.json === 'true' ? '?json=true' : ''}`);
    };
}

app.get('/cr/random', randomTrackRedirect('cr'));
app.get('/cr/daily', dailyTrackRedirect('cr'));
app.get('/bhr/random', randomTrackRedirect('bhr'));
app.get('/bhr/daily', dailyTrackRedirect('bhr'));
app.get('/frhd/random', randomTrackRedirect('frhd'));
app.get('/frhd/daily', dailyTrackRedirect('frhd'));
app.get('/tm/random', randomTrackRedirect('tm'));
app.get('/tm/daily', dailyTrackRedirect('tm'));
app.get('/app/random', randomTrackRedirect('app'));
app.get('/app/daily', dailyTrackRedirect('app'));

async function frhdTxtFallback(trackId, filePath) {
    try {
        const frhdModule = await import('frhdv2');
        const codeResponse = await frhdModule.getTrackCode(trackId, ['code']);
        const code = codeResponse?.track?.code || codeResponse?.code || '';
        if (code) {
            await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
            await fsPromises.writeFile(filePath, code, 'utf8');
            return code;
        }
    } catch (e) {
        console.error(`FRHD API fallback failed for ${trackId}:`, e.message);
    }
    return null;
}

async function frhdPngFallback(trackId) {
    try {
        const frhdModule = await import('frhdv2');
        const metadata = await frhdModule.getTrackData(trackId, ['img']);
        let thumbnail = metadata?.track?.img || metadata?.img;
        if (thumbnail) {
            return thumbnail.replace(/(\d+x\d+)/, '768x250');
        }
    } catch (e) {
        console.error(`FRHD thumbnail fallback failed for ${trackId}:`, e.message);
    }
    return null;
}

function txtRouting(rootPath, apiFallback = null) {
    return async (req, res) => {
        const trackId = req.params.id;
        if (!trackId) return res.status(404).send('Track code not found');

        const filePath = path.join(rootPath, `${trackId}.txt`);

        try {
            const code = await fsPromises.readFile(filePath, 'utf8');
            return res.type('text/plain').send(code);
        } catch {
            if (apiFallback) {
                const code = await apiFallback(trackId, filePath);
                if (code) return res.type('text/plain').send(code);
            }
            return res.status(404).send('Track code not found');
        }
    };
}

function pngRouting(rootPath, apiFallback = null) {
    return async (req, res) => {
        const trackId = req.params.id;
        if (!trackId) return res.status(404).send('Thumbnail not found');

        const filePath = path.join(rootPath, `${trackId}.png`);

        try {
            await fsPromises.access(filePath);
            return res.sendFile(filePath);
        } catch {
            if (apiFallback) {
                const redirectUrl = await apiFallback(trackId);
                if (redirectUrl) return res.redirect(302, redirectUrl);
            }
            return res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
        }
    };
}

app.get(['/', '/editor'], (req, res) => {
    const renderedHtml = editorTemplate({
        title: 'Free Rider',
        description: 'Create and play Free Rider tracks'
    });
    res.status(200).send(renderedHtml);
});

app.get('/tracks/:id', (req, res) => {
    res.redirect(301, '/t/' + req.params.id);
});


function dbFilterRoute(defaults) {
    return function (req, res) {
        const filter = { type: defaults.type || 'db' };
        if (req.query.q) filter.query = req.query.q;
        if (req.query.player) filter.player = req.query.player;
        if (req.query.sort) filter.sortBy = req.query.sort;
        if (req.query.order) filter.sortOrder = req.query.order;

        const title = req.query.q
            ? '' + req.query.q + ' - ' + (defaults.title || 'Track Database')
            : (defaults.title || 'Track Database');

        const renderedHtml = editorTemplate({
            title: title,
            description: defaults.description || 'Browse and play tracks',
            initialDialog: 'dbImport',
            dialogFilter: filter
        });
        res.status(200).send(renderedHtml);
    };
}

app.get('/tracks', dbFilterRoute({
    title: 'Track Database',
    description: 'Browse and play tracks from the Free Rider archive'
}));

app.get('/frhd', dbFilterRoute({
    type: 'frhd',
    title: 'Free Rider HD Archive',
    description: 'Play Free Rider HD tracks'
}));

app.get('/bhr', dbFilterRoute({
    type: 'bhr',
    title: 'Black Hat Rider Archive',
    description: 'Play Black Hat Rider tracks'
}));

app.get('/cr', dbFilterRoute({
    type: 'cr',
    title: 'Canvas Rider Archive',
    description: 'Play Canvas Rider tracks'
}));

app.get('/tm', dbFilterRoute({
    type: 'tm',
    title: 'TrackMill Archive',
    description: 'Play TrackMill tracks'
}));

app.get('/players', (req, res) => {
    const renderedHtml = editorTemplate({
        title: 'Players - Free Rider',
        description: 'Browse players in the Free Rider archive',
        initialDialog: 'dbImport',
        dialogFilter: { type: 'db', mode: 'players' }
    });
    res.status(200).send(renderedHtml);
});

app.get('/ghosts', (req, res) => {
    const renderedHtml = editorTemplate({
        title: 'Ghosts - Free Rider',
        description: 'Browse ghosts in the Free Rider archive',
        initialDialog: 'dbImport',
        dialogFilter: { type: 'db', mode: 'ghosts' }
    });
    res.status(200).send(renderedHtml);
});

app.get('/t/:canonical/remixes', (req, res) => {
    const canonical = req.params.canonical;

    const linked = trackLinks.find(l => l.canonical === canonical);
    const trackName = linked ? linked.name : canonical;

    const renderedHtml = editorTemplate({
        title: `Remixes of ${trackName} - Free Rider`,
        description: `View remixes of ${trackName}`,
        initialDialog: 'dbImport',
        dialogFilter: { remixesOf: { canonical: canonical, name: trackName } }
    });
    res.status(200).send(renderedHtml);
});

app.get('/u/:username', (req, res) => {
    const username = decodeURIComponent(req.params.username);
    const renderedHtml = editorTemplate({
        title: `${username} - Free Rider`,
        description: `Tracks by ${username}`,
        initialDialog: 'dbImport',
        dialogFilter: { player: username, type: 'db' }
    });
    res.status(200).send(renderedHtml);
});

app.get('/p/:playlist', (req, res) => {
    const playlist = decodeURIComponent(req.params.playlist);
    const renderedHtml = editorTemplate({
        title: `Playlist - Free Rider`,
        description: `View playlist`,
        initialDialog: 'dbImport',
        dialogFilter: { playlist: playlist, type: 'db' }
    });
    res.status(200).send(renderedHtml);
});

app.get('/cr/:id.txt', txtRouting(path.join(LOCAL_ROOT, 'cr', 'trackcodes')));
app.get('/cr/:id.png', pngRouting(path.join(LOCAL_ROOT, 'cr', 'thumbnails')));
app.get('/bhr/:id.txt', txtRouting(path.join(LOCAL_ROOT, 'bhr', 'trackcodes')));
app.get('/bhr/:id.png', pngRouting(path.join(LOCAL_ROOT, 'bhr', 'thumbnails')));
app.get('/frhd/:id.txt', txtRouting(path.join(LOCAL_ROOT, 'frhd', 'trackcodes'), frhdTxtFallback));
app.get('/frhd/:id.png', pngRouting(path.join(LOCAL_ROOT, 'frhd', 'thumbnails'), frhdPngFallback));
app.get('/tm/:id.txt', txtRouting(path.join(LOCAL_ROOT, 'tm', 'trackcodes')));
app.get('/tm/:id.png', pngRouting(path.join(LOCAL_ROOT, 'tm', 'thumbnails')));
app.get('/app/:id.txt', txtRouting(path.join(LOCAL_ROOT, 'app', 'trackcodes')));
app.get('/app/:id.png', pngRouting(path.join(LOCAL_ROOT, 'app', 'thumbnails')));

app.get('/t/:id.txt', async (req, res) => {
    const id = req.params.id;

    try {
        const linked = trackLinks.find(l => l.canonical === id);

        if (linked && !linked.alt) {
            const priority = ['cr', 'bhr', 'frhd', 'tm', 'app'];
            for (const platform of priority) {
                const platformTrack = linked.tracks.find(t => t.type === platform);
                if (platformTrack) {
                    const filePath = path.join(LOCAL_ROOT, platform, 'trackcodes', `${platformTrack.id}.txt`);
                    if (fs.existsSync(filePath)) {
                        return res.sendFile(filePath);
                    }
                }
            }
        }

        // alt is true OR no platform links - load from data/tracks/
        const trackPath = path.join(LOCAL_ROOT, 'tracks', 'trackcodes', `${id}.txt`);
        if (fs.existsSync(trackPath)) {
            return res.sendFile(trackPath);
        }

        res.status(404).send('Track not found');
    } catch (e) {
        const trackPath = path.join(LOCAL_ROOT, 'tracks', 'trackcodes', `${id}.txt`);
        if (fs.existsSync(trackPath)) {
            return res.sendFile(trackPath);
        }

        res.status(404).send('Track not found');
    }
});

app.get('/t/:id.png', async (req, res) => {
    const id = req.params.id;

    try {
        const linked = trackLinks.find(l => l.canonical === id);

        if (linked && !linked.alt) {
            const priority = ['cr', 'bhr', 'frhd', 'tm', 'app'];
            for (const platform of priority) {
                const platformTrack = linked.tracks.find(t => t.type === platform);
                if (platformTrack) {
                    const filePath = path.join(LOCAL_ROOT, platform, 'thumbnails', `${platformTrack.id}.png`);
                    if (fs.existsSync(filePath)) {
                        return res.sendFile(filePath);
                    }
                }
            }
        }

        // alt is true OR no platform links - load from data/tracks/
        const thumbPath = path.join(LOCAL_ROOT, 'tracks', 'thumbnails', `${id}.png`);
        if (fs.existsSync(thumbPath)) {
            return res.sendFile(thumbPath);
        }

        res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
    } catch (e) {
        const thumbPath = path.join(LOCAL_ROOT, 'tracks', 'thumbnails', `${id}.png`);
        if (fs.existsSync(thumbPath)) {
            return res.sendFile(thumbPath);
        }

        res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
    }
});

app.get('/t/:id', async (req, res) => {
    const id = req.params.id;
    const linked = trackLinks.find(l => l.canonical === id);

    if (!linked) {
        if (req.query.json === 'true') {
            return res.status(404).json({ error: 'Track not found' });
        }
        return res.status(404).send('Track not found');
    }

    let code = '';
    let primaryType = 'app';
    let primaryId = id;

    const priority = ['cr', 'bhr', 'frhd', 'tm', 'app'];

    if (!linked.alt && linked.tracks.length > 0) {
        for (const platform of priority) {
            const platformTrack = linked.tracks.find(t => t.type === platform);
            if (platformTrack) {
                primaryType = platform;
                primaryId = platformTrack.id;
                const filePath = path.join(LOCAL_ROOT, platform, 'trackcodes', `${platformTrack.id}.txt`);
                try {
                    code = fs.readFileSync(filePath, 'utf8');
                    break;
                } catch (e) {
                    // Continue to next platform
                }
            }
        }
    }

    if (!code) {
        const trackPath = path.join(LOCAL_ROOT, 'tracks', 'trackcodes', `${id}.txt`);
        try {
            code = fs.readFileSync(trackPath, 'utf8');
        } catch (e) {
            if (req.query.json === 'true') {
                return res.status(404).json({ error: 'Track code not found' });
            }
            return res.status(404).send('Track not found');
        }
    }

    const remixes = trackRemixesLookup.get(id) || [];
    const remixCount = remixes.length;

    if (req.query.json === 'true') {
        const linkedTracks = {};
        for (const track of linked.tracks || []) {
            const cacheKey = `${track.type}-${track.id}`;
            const stats = linkedTrackStatsCache.get(cacheKey);

            linkedTracks[track.type] = {
                id: track.id,
                name: track.name || linked.name,
                upvotes: stats?.upvotes || track.upvotes || null,
                downvotes: stats?.downvotes || track.downvotes || null,
                votes: stats?.votes || track.votes || null,
                plays: stats?.plays || track.plays || null,
                favorites: stats?.favorites || track.favorites || null,
                size: stats?.size || track.size || null,
                description: stats?.description || track.description || ''
            };
        }

        return res.json({
            id: id,
            canonical: id,
            canonicalId: id,
            name: linked.name,
            authors: linked.authors ? linked.authors.join(', ') : 'Unknown',
            authorsArray: linked.authors || [],
            thumbnail: `/t/${id}.png`,

            // Primary platform info for GameSettings.type
            type: primaryType,
            primaryType: primaryType,
            primaryId: primaryId,

            urlType: 't',
            urlId: id,

            trackUrl: `/t/${id}.txt`,
            description: linked.description || '',
            published: linked.published || '',
            size: code.length,
            forumUrl: linked.forumUrl || '',
            badges: linked.tracks.map(t => t.type),
            permalink: `https://freerider.app/t/${id}`,

            entryTo: linked.entryTo || null,

            // Remix data
            remixOf: linked.remixOf || null,
            remixCount: remixCount,
            remixes: remixCount > 0 ? remixes : null,

            // Linked track IDs (flat)
            frhdId: linked.tracks.find(t => t.type === 'frhd')?.id || null,
            bhrId: linked.tracks.find(t => t.type === 'bhr')?.id || null,
            crId: linked.tracks.find(t => t.type === 'cr')?.id || null,
            tmId: linked.tracks.find(t => t.type === 'tm')?.id || null,
            appId: linked.tracks.find(t => t.type === 'app')?.id || null,

            // Full linked tracks data with stats
            linkedTracks: linkedTracks
        });
    }

    const trackData = {
        id: id,
        canonical: id,
        name: linked.name,
        type: primaryType,
        primaryType: primaryType,
        primaryId: primaryId,
        authors: linked.authors ? linked.authors.join(', ') : 'Unknown',
        authorsArray: linked.authors || [],
        code: code,
        description: linked.description || '',
        thumbnail: `/t/${id}.png`,
        permalink: `https://freerider.app/t/${id}`,
        published: linked.published || '',
        size: code.length,
        forumUrl: linked.forumUrl || '',
        badges: linked.tracks.map(t => t.type),
        alt: linked.alt || false,

        // Remix data
        remixOf: linked.remixOf || null,
        remixCount: remixCount,

        // Linked track IDs
        frhdId: linked.tracks.find(t => t.type === 'frhd')?.id || null,
        bhrId: linked.tracks.find(t => t.type === 'bhr')?.id || null,
        crId: linked.tracks.find(t => t.type === 'cr')?.id || null,
        tmId: linked.tracks.find(t => t.type === 'tm')?.id || null,
        appId: linked.tracks.find(t => t.type === 'app')?.id || null
    };

    const renderedHtml = editorTemplate({
        track: {
            ...trackData,
            id: id,
            type: primaryType
        }
    });

    res.status(200).send(renderedHtml);
});

function createTrackHandler(type) {
    return async (req, res) => {
        const trackId = req.params.id;
        const numericId = parseInt(trackId, 10);

        const linked = findLinkedTracks(type, numericId);
        /*if (linked) {
            const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
            const typeIndex = typePriority.indexOf(type);
            
            for (let i = 0; i < typeIndex; i++) {
                const earlier = linked.tracks.find(t => t.type === typePriority[i]);
                if (earlier) {
                    const redirectUrl = `/${earlier.type}/${earlier.id}${req.query.json === 'true' ? '?json=true' : ''}`;
                    return res.redirect(301, redirectUrl);
                }
            }
        }*/

        let trackData = {
            id: trackId,
            name: `${type.toUpperCase()} Track #${trackId}`,
            authors: 'Unknown',
            code: '',
            type: type,
            description: '',
            published: '',
            size: '',
            forumUrl: '',
            thumbnail: '/data/default-thumbnail.png',
            permalink: `https://freerider.app/${type}/${trackId}`,
            badges: [type]
        };

        try {
            const record = await pb.collection(type).getFirstListItem(`_id = ${numericId}`, {
                requestKey: `track-${type}-${numericId}-${Date.now()}`
            });

            if (record) {
                const transformed = transformRecord(record, type);
                const processed = processTrackWithLinks(transformed);

                let publishedDate = '';
                if (record.published) {
                    const date = new Date(record.published);
                    if (!isNaN(date.getTime())) {
                        publishedDate = date.toISOString().split('T')[0];
                    }
                }

                let description = record.description || '';
                if (!description && linked) {
                    const frhdLink = linked.tracks.find(t => t.type === 'frhd');
                    if (frhdLink) {
                        const cacheKey = `frhd-${frhdLink.id}`;
                        const frhdMeta = linkedTrackStatsCache.get(cacheKey);
                        if (frhdMeta && frhdMeta.description) {
                            description = frhdMeta.description;
                        }
                    }
                }

                trackData = {
                    ...trackData,
                    ...processed,
                    pageId: `${type}-${trackId}`,
                    sourceUrl: `/${type}/${trackId}`,
                    description: description,
                    size: formatSize(parseInt(record.size) || 0),
                    published: publishedDate
                };

                if (linked && linked.name) {
                    trackData.name = linked.name;
                }
            }

            const codePath = path.join(LOCAL_ROOT, type, 'trackcodes', `${trackId}.txt`);
            try {
                trackData.code = await fsPromises.readFile(codePath, 'utf8');
                trackData.code = trackData.code.trim();
            } catch {
                if (type === 'frhd') {
                    const code = await frhdTxtFallback(trackId, codePath);
                    if (code) trackData.code = code;
                }
            }

            const thumbnailPath = path.join(LOCAL_ROOT, type, 'thumbnails', `${trackId}.png`);
            try {
                await fsPromises.access(thumbnailPath);
                trackData.thumbnail = `/data/${type}/thumbnails/${trackId}.png`;
            } catch {
                if (type === 'frhd') {
                    const redirectUrl = await frhdPngFallback(trackId);
                    if (redirectUrl) trackData.thumbnail = redirectUrl;
                }
            }

            const forumLink = await getForumLinkForTrack(type, trackId);
            if (forumLink) {
                trackData.forumUrl = forumLink.forumUrl;
            }

        } catch (error) {
            console.error(`${type.toUpperCase()} track ${trackId} error:`, error.message);
        }

        if (req.query.json === 'true') {
            return res.json({
                id: trackData.id,
                name: trackData.name,
                authors: trackData.authors,
                thumbnail: trackData.thumbnail,
                type: trackData.type,
                trackUrl: `/${type}/${trackId}.txt`,
                description: trackData.description,
                published: trackData.published,
                size: trackData.size,
                upvotes: trackData.upvotes,
                downvotes: trackData.downvotes,
                plays: trackData.plays,
                badges: trackData.badges,
                permalink: trackData.permalink
            });
        }

        const renderedHtml = editorTemplate({
            trackId: trackId,
            trackType: type,
            track: trackData
        });

        res.status(200).send(renderedHtml);
    };
}

app.get('/cr/:id', createTrackHandler('cr'));
app.get('/bhr/:id', createTrackHandler('bhr'));
app.get('/frhd/:id', createTrackHandler('frhd'));
app.get('/tm/:id', createTrackHandler('tm'));
app.get('/app/:id', createTrackHandler('app'));

let objectsCache = {
    items: [],
    groups: [],
    lastUpdated: null
};

async function loadObjectsCache() {
    console.log('Loading objects from PocketBase...');

    try {
        const records = await pb.collection('objects').getFullList({
            sort: 'name',
            requestKey: `objects-${Date.now()}`
        });

        objectsCache.items = records.map(record => ({
            id: record.id,
            name: record.name,
            folder: record.folder || '',
            group: record.group || '',
            objectFrom: record.object_from,
            created: record.created,
            updated: record.updated,
            filePath: record.folder
                ? `${record.folder}/${record.name}`
                : record.name,
            thumbnailUrl: record.folder
                ? `/objects/thumbnails/${record.folder}/${record.name}.png`
                : `/objects/thumbnails/${record.name}.png`,
            codeUrl: record.folder
                ? `/objects/trackcodes/${record.folder}/${record.name}.txt`
                : `/objects/trackcodes/${record.name}.txt`
        }));

        objectsCache.groups = [...new Set(
            objectsCache.items
                .map(o => o.group)
                .filter(g => g && g.trim() !== '')
        )].sort();

        objectsCache.lastUpdated = Date.now();
        console.log(`  Loaded ${objectsCache.items.length} objects in ${objectsCache.groups.length} groups`);
    } catch (e) {
        console.error('Failed to load objects from PocketBase:', e.message);
        objectsCache.items = [];
        objectsCache.groups = [];
    }
}

const objectDbTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/objects.ejs'), 'utf8'));

app.use('/objects', express.static(path.join(LOCAL_ROOT, 'objects')));

app.get('/objects/:folder/:name.txt', async (req, res) => {
    const { folder, name } = req.params;
    const filePath = path.join(LOCAL_ROOT, 'objects', folder, `${name}.txt`);

    try {
        const code = await fsPromises.readFile(filePath, 'utf8');
        return res.type('text/plain').send(code);
    } catch {
        return res.status(404).send('Object code not found');
    }
});

app.get('/objects/:name.txt', async (req, res) => {
    const { name } = req.params;
    const filePath = path.join(LOCAL_ROOT, 'objects', `${name}.txt`);

    try {
        const code = await fsPromises.readFile(filePath, 'utf8');
        return res.type('text/plain').send(code);
    } catch {
        return res.status(404).send('Object code not found');
    }
});

app.get('/objects/:folder/:name.png', async (req, res) => {
    const { folder, name } = req.params;
    const filePath = path.join(LOCAL_ROOT, 'objects', folder, `${name}.png`);

    try {
        await fsPromises.access(filePath);
        return res.sendFile(filePath);
    } catch {
        return res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
    }
});

app.get('/objects/:name.png', async (req, res) => {
    const { name } = req.params;
    const filePath = path.join(LOCAL_ROOT, 'objects', `${name}.png`);

    try {
        await fsPromises.access(filePath);
        return res.sendFile(filePath);
    } catch {
        return res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
    }
});

app.get('/api/objects', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 24, 1), 100);
    const query = req.query.q || '';
    const group = req.query.group || '';
    const sortBy = req.query.sort || 'name';
    const sortOrder = req.query.order || 'asc';

    try {
        let filtered = [...objectsCache.items];

        if (group) {
            filtered = filtered.filter(obj => obj.group === group);
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(obj =>
                obj.name.toLowerCase().includes(lowerQuery) ||
                obj.folder?.toLowerCase().includes(lowerQuery) ||
                obj.group?.toLowerCase().includes(lowerQuery)
            );
        }

        if (sortBy === 'shuffle') {
            filtered = shuffleArray(filtered);
        } else {
            filtered.sort((a, b) => {
                let valA, valB;

                switch (sortBy) {
                    case 'name':
                        valA = (a.name || '').toLowerCase();
                        valB = (b.name || '').toLowerCase();
                        return sortOrder === 'asc'
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                    case 'group':
                        valA = (a.group || '').toLowerCase();
                        valB = (b.group || '').toLowerCase();
                        return sortOrder === 'asc'
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                    case 'created':
                        valA = new Date(a.created).getTime() || 0;
                        valB = new Date(b.created).getTime() || 0;
                        break;
                    case 'updated':
                        valA = new Date(a.updated).getTime() || 0;
                        valB = new Date(b.updated).getTime() || 0;
                        break;
                    default:
                        valA = (a.name || '').toLowerCase();
                        valB = (b.name || '').toLowerCase();
                        return sortOrder === 'asc'
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                }

                return sortOrder === 'asc' ? valA - valB : valB - valA;
            });
        }

        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / perPage);
        const startIndex = (page - 1) * perPage;
        const paginatedItems = filtered.slice(startIndex, startIndex + perPage);

        res.json({
            objects: paginatedItems,
            pagination: { page, perPage, totalCount, totalPages },
            group: group || null
        });

    } catch (error) {
        console.error('Objects API error:', error);
        res.status(500).json({ error: 'Failed to fetch objects', details: error.message });
    }
});

app.get('/api/objects/groups', (req, res) => {
    res.json({
        groups: objectsCache.groups.map(g => ({
            name: g,
            count: objectsCache.items.filter(o => o.group === g).length
        }))
    });
});

app.get('/api/objects/:id', async (req, res) => {
    const id = req.params.id;

    let obj = objectsCache.items.find(o => o.id === id);
    if (!obj) {
        obj = objectsCache.items.find(o => o.name.toLowerCase() === id.toLowerCase());
    }

    if (!obj) {
        return res.status(404).json({ error: 'Object not found' });
    }

    const codePath = path.join(LOCAL_ROOT, 'objects', obj.filePath + '.txt');
    let code = '';
    try {
        code = await fsPromises.readFile(codePath, 'utf8');
    } catch {
        // code not available
    }

    res.json({
        ...obj,
        code: code
    });
});


app.get('/objects', async (req, res) => {
    const query = req.query.q || '';
    const group = req.query.group || '';
    const sortBy = req.query.sort || 'name';
    const sortOrder = req.query.order || 'asc';

    const renderedHtml = objectDbTemplate({
        title: group ? `Objects: ${group}` : 'Object Database',
        query,
        group,
        sortBy,
        sortOrder,
        groups: objectsCache.groups
    });

    res.status(200).send(renderedHtml);
});

app.get('/tools', (req, res) => {
    res.render('tools');
});

app.get('/api/live-sessions', (req, res) => {
    const sessions = {};
    for (const [trackId, players] of liveSessions) {
        if (players.size > 0) {
            sessions[trackId] = players.size;
        }
    }
    res.json(sessions);
});

const ghostsRouter = require('./ghosts');
app.use('/api/ghosts', (req, res, next) => {
    req.trackLinksLookup = trackLinksLookup;
    req.findPlayerAliases = findPlayerAliases;
    next();
}, ghostsRouter);

const CACHE_REFRESH_INTERVAL = 10 * 60 * 1000;

const searchCache = new Map();
const SEARCH_CACHE_TTL = 60000;
const SEARCH_CACHE_MAX = 1000;

function getCachedSearch(cacheKey) {
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL) {
        return cached.results;
    }
    return null;
}

function setCachedSearch(cacheKey, results) {
    if (searchCache.size >= SEARCH_CACHE_MAX) {
        const oldest = [...searchCache.entries()]
            .sort((a, b) => a[1].timestamp - b[1].timestamp)
            .slice(0, 100);
        oldest.forEach(([key]) => searchCache.delete(key));
    }

    searchCache.set(cacheKey, {
        results: results,
        timestamp: Date.now()
    });
}

async function refreshCaches() {
    try {
        console.log('Auto-refreshing caches...');
        searchCache.clear();
        await loadPlayerLinksFromDb();
        await loadTrackLinksFromDb();
        //await loadLinkedTrackStatsCache();
        //await loadDbTracksCache();
        await loadDbTracksAndStatsCache();
        await loadPlaylistsFromDb();
        await loadObjectsCache();
        console.log(`Cache refreshed: ${dbTracksCache.all.length} tracks, ${playerLinks.length} players, ${trackLinks.length} track links, ${playlistsCache.length} playlists`);
    } catch (error) {
        console.error('Auto-refresh failed:', error);
    }
}

async function startServer() {
    await loadPlayerLinksFromDb();
    await loadTrackLinksFromDb();
    await loadDbTracksAndStatsCache();
    await loadPlaylistsFromDb();
    await loadObjectsCache();

    setupLiveRacing(server);

    setInterval(refreshCaches, CACHE_REFRESH_INTERVAL);

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
}

startServer();