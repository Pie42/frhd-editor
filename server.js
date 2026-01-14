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

const USE_LOCAL_FILES = true;

const LOCAL_ROOT = USE_LOCAL_FILES
    ? path.join(__dirname, 'data') 
    : PERSISTENT_ROOT_DISK;

// maps /var/data/cr/trackcodes to the public URL /data/cr/trackcodes
['cr', 'bhr', 'frhd', 'tm', 'app'].forEach(type => {
    app.use(`/data/${type}/trackcodes`, express.static(path.join(LOCAL_ROOT, type, 'trackcodes')));
    app.use(`/data/${type}/thumbnails`, express.static(path.join(LOCAL_ROOT, type, 'thumbnails')));
});

app.use('/avatars', express.static(path.join(LOCAL_ROOT, 'avatars')));

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json({ limit: '20mb' }));
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

// templates
const trackTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/track.ejs'), 'utf8'));
const dbTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/db.ejs'), 'utf8'));

// playlists
let playlistsCache = [];

async function loadPlaylistsFromDb() {
    console.log('Loading playlists from PocketBase...');
    
    try {
        // Load ALL playlists, not just show=true
        const records = await pb.collection('playlists').getFullList({
            sort: '-created',
            expand: 'frhd_track,bhr_track,cr_track,tm_track,app_track,db_track,playlists',
            requestKey: `playlists-${Date.now()}`
        });
        
        console.log(`  Found ${records.length} playlist records`);
        
        playlistsCache = records.map(record => {
            const tracks = [];
            const childPlaylists = [];
            
            if (record.expand?.frhd_track) {
                const frhdTracks = Array.isArray(record.expand.frhd_track) 
                    ? record.expand.frhd_track 
                    : [record.expand.frhd_track];
                for (const track of frhdTracks) {
                    tracks.push({
                        type: 'frhd',
                        id: track._id,
                        name: track.name,
                        recordId: track.id
                    });
                }
            }
            
            if (record.expand?.bhr_track) {
                const bhrTracks = Array.isArray(record.expand.bhr_track) 
                    ? record.expand.bhr_track 
                    : [record.expand.bhr_track];
                for (const track of bhrTracks) {
                    tracks.push({
                        type: 'bhr',
                        id: track._id,
                        name: track.name,
                        recordId: track.id
                    });
                }
            }
            
            if (record.expand?.cr_track) {
                const crTracks = Array.isArray(record.expand.cr_track) 
                    ? record.expand.cr_track 
                    : [record.expand.cr_track];
                for (const track of crTracks) {
                    tracks.push({
                        type: 'cr',
                        id: track._id,
                        name: track.name,
                        recordId: track.id
                    });
                }
            }

            if (record.expand?.tm_track) {
                const tmTracks = Array.isArray(record.expand.tm_track)
                    ? record.expand.tm_track
                    : [record.expand.tm_track];
                for (const track of tmTracks) {
                    tracks.push({
                        type: 'tm',
                        id: track._id,
                        name: track.name,
                        recordId: track.id
                    });
                }
            }

            if (record.expand?.app_track) {
                const appTracks = Array.isArray(record.expand.app_track)
                    ? record.expand.app_track
                    : [record.expand.app_track];
                for (const track of appTracks) {
                    tracks.push({
                        type: 'app',
                        id: track._id,
                        name: track.name,
                        recordId: track.id
                    });
                }
            }
            
            if (record.expand?.db_track) {
                const dbTracks = Array.isArray(record.expand.db_track) 
                    ? record.expand.db_track 
                    : [record.expand.db_track];
                for (const dbRecord of dbTracks) {
                    const linked = trackLinks.find(l => l.canonical === dbRecord.canonical);
                    if (linked && linked.tracks.length > 0) {
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
                            name: linked.name || dbRecord.name,
                            recordId: dbRecord.id,
                            fromDb: true
                        });
                    }
                }
            }
            
            // Handle nested playlists
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

function findPlayerAliases(username) {
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
            return {
                canonical: player.canonical,
                displayName: player.displayName,
                aliases: player.aliases || [],
                normalizedAliases: (player.aliases || []).map(a => normalizeAuthorName(a)),
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
            expand: 'frhd_id,bhr_id,cr_id,tm_id,app_id,remix_of',
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
            
            return {
                canonical: record.canonical,
                name: record.name,
                authors: record.authors || [],
                published: record.published || null,
                description: record.description || null,
                tracks: tracks,
                remixOf: remixOf.length > 0 ? remixOf : null
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

/*let linkedTrackStatsCache = new Map();

async function loadLinkedTrackStatsCache() {
    console.log('Loading stats for linked tracks...');
    
    const needed = { frhd: new Set(), bhr: new Set(), cr: new Set(), tm: new Set(), app: new Set() };
    
    for (const link of trackLinks) {
        for (const track of link.tracks) {
            if (needed[track.type]) {
                needed[track.type].add(track.id);
            }
        }
    }
    
    console.log(`Need: frhd=${needed.frhd.size}, bhr=${needed.bhr.size}, cr=${needed.cr.size}, tm=${needed.tm.size}, app=${needed.app.size}`);
    
    const fieldsByType = {
        frhd: '_id,upvotes,downvotes,votes,plays,favorites,description',
        bhr: '_id,upvotes,downvotes,votes,plays,favorites,description',
        cr: '_id,upvotes,downvotes,votes,plays,favorites,description',
        tm: '_id,description',
        app: '_id,description'
    };
    
    for (const type of ['frhd', 'bhr', 'cr', 'tm', 'app']) {
        if (needed[type].size === 0) continue;
        
        try {
            const ids = Array.from(needed[type]);
            
            for (let i = 0; i < ids.length; i += 100) {
                const batch = ids.slice(i, i + 100);
                const filter = batch.map(id => `_id = ${id}`).join(' || ');
                
                const records = await pb.collection(type).getFullList({
                    filter: filter,
                    fields: fieldsByType[type],
                    requestKey: `linked-cache-${type}-${i}-${Date.now()}`
                });
                
                for (const record of records) {
                    const cacheKey = `${type}-${record._id}`;
                    linkedTrackStatsCache.set(cacheKey, {
                        upvotes: record.upvotes,
                        downvotes: record.downvotes,
                        votes: record.votes,
                        plays: record.plays,
                        favorites: record.favorites,
                        description: record.description || ''
                    });
                }
            }
            
            console.log(`  ${type}: cached`);
        } catch (e) {
            console.error(`Failed to cache ${type} stats:`, e.message);
        }
    }
    
    console.log(`Linked track stats cache loaded: ${linkedTrackStatsCache.size} tracks`);
}*/

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
    let badges = [track.type];
    let urlType = track.type;
    let urlId = track.id;
    let authors = track.authors;
    let authorsArray = track.authorsArray || [];
    let name = track.name;
    let description = track.description || '';
    let canonical = null;
    let remixOf = null;
    let remixCount = 0;

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
        
        const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
        for (const priorityType of typePriority) {
            const found = linked.tracks.find(t => t.type === priorityType);
            if (found) {
                urlType = found.type === 'app' ? 't' : found.type;
                urlType = found.type;
                urlId = found.id;
                break;
            }
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

async function loadDbTracksAndStatsCache() {
    console.log('Loading db tracks and stats cache...');
    
    const needed = { frhd: new Set(), bhr: new Set(), cr: new Set(), tm: new Set(), app: new Set() };
    
    for (const link of trackLinks) {
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

/*async function loadDbTracksCache() {
    console.log('Loading db tracks cache (show=true)...');
    
    for (const type of ['frhd', 'bhr', 'cr', 'tm', 'app']) {
        try {
            const records = await pb.collection(type).getFullList({
                filter: 'show = true',
                requestKey: `cache-${type}-${Date.now()}`
            });
            
            dbTracksCache[type] = records.map(r => transformRecord(r, type));
            console.log(`  ${type}: ${dbTracksCache[type].length} tracks`);
        } catch (e) {
            console.error(`Failed to load ${type} db cache:`, e.message);
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
    
    const linkedCanonicals = new Set(trackLinks.map(link => link.canonical));
    
    const seenCanonical = new Set();
    dbTracksCache.all = allTracks.filter(track => {
        if (!linkedCanonicals.has(track.canonicalId)) return false;
        if (seenCanonical.has(track.canonicalId)) return false;
        seenCanonical.add(track.canonicalId);
        return true;
    });
    
    dbTracksCache.lastUpdated = Date.now();
    console.log(`DB tracks cache loaded: ${dbTracksCache.all.length} total tracks (from db collection)`);
}*/

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
        let allTracks = [];
        
        if (playlist) {
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
            playlistTracks.forEach(t => {
                if (tracksByType[t.type]) {
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

            allTracks = [];
            playlistTracks.forEach(trackRef => {
                const key = `${trackRef.type}-${trackRef.id}`;
                const track = fetchedTracks.get(key);
                if (track) {
                    allTracks.push(track);
                }
            });

            allTracks = allTracks.map(processTrackWithLinks);
            allTracks = sortTracks(allTracks, sortBy, sortOrder);

            const playlistInfo = {
                id: playlistData.id,
                canonical: playlistData.canonical,
                name: playlistData.name,
                username: playlistData.username,
                description: playlistData.description,
                totalTracks: playlistData.tracks.length
            };

            return res.json({
                tracks: allTracks,
                pagination: {
                    page: 1,
                    perPage: allTracks.length,
                    totalCount: allTracks.length,
                    totalPages: 1
                },
                playlist: playlistInfo,
                allLoaded: true
            });
        }
        
        if (author) {
            if (type === 'db') {
                allTracks = filterCachedTracks(dbTracksCache.all, query, author);
                allTracks = sortTracks(allTracks, sortBy, sortOrder);

                return res.json({
                    tracks: allTracks,
                    pagination: {
                        page: 1,
                        perPage: allTracks.length,
                        totalCount: allTracks.length,
                        totalPages: 1
                    },
                    playlist: null,
                    allLoaded: true
                });
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

            return res.json({
                tracks: allTracks,
                pagination: {
                    page: 1,
                    perPage: allTracks.length,
                    totalCount: allTracks.length,
                    totalPages: 1
                },
                playlist: null,
                allLoaded: true
            });
        }

        if (type === 'db') {
            allTracks = filterCachedTracks(dbTracksCache.all, query, '');
            allTracks = sortTracks(allTracks, sortBy, sortOrder);
            
            const totalCount = allTracks.length;
            const totalPages = Math.ceil(totalCount / perPage);
            const startIndex = (page - 1) * perPage;
            const paginatedTracks = allTracks.slice(startIndex, startIndex + perPage);
            
            return res.json({
                tracks: paginatedTracks,
                pagination: { page, perPage, totalCount, totalPages },
                playlist: null
            });
        }
        
        if (['frhd', 'bhr', 'cr', 'tm', 'app'].includes(type)) {
            const filterString = buildFilterString({ type, query, author, showOnly: false });
            
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
        
        const collections = ['frhd', 'bhr', 'cr', 'tm', 'app'];
        
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
        
        res.json({
            tracks: paginatedTracks,
            pagination: { page, perPage, totalCount, totalPages },
            playlist: null
        });
        
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
        else if (query.match(/^year=(\d{4})$/i)) {
            const year = query.match(/^year=(\d{4})$/i)[1];
            filterParts.push(`published >= "${year}-01-01" && published <= "${year}-12-31"`);
        }
        else if (query.match(/^id=(\d+)$/i)) {
            const id = query.match(/^id=(\d+)$/i)[1];
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

            const playerInfo = findPlayerAliases(query);
            if (playerInfo.aliases && playerInfo.aliases.length > 1) {
                for (const alias of playerInfo.aliases) {
                    const escapedAlias = alias.replace(/"/g, '\\"');
                    if (escapedAlias.toLowerCase() !== escapedQuery.toLowerCase()) {
                        searchFields.push(`authors ~ "${escapedAlias}"`);
                        if (['frhd', 'bhr', 'cr'].includes(type)) {
                            searchFields.push(`username ~ "${escapedAlias}"`);
                        }
                    }
                }
            }

            filterParts.push(`(${searchFields.join(' || ')})`);
        }
    }
    
    if (author) {
        const playerInfo = findPlayerAliases(author);
        const aliases = playerInfo.aliases && playerInfo.aliases.length > 0
            ? playerInfo.aliases
            : [author];

        const aliasConditions = aliases.flatMap(alias => {
            const escaped = alias.replace(/"/g, '\\"');
            const conditions = [`authors ~ '"${escaped}"'`];

            if (['frhd', 'bhr', 'cr'].includes(type)) {
                conditions.push(`username = "${escaped}"`);
            }

            return conditions;
        });

        filterParts.push(`(${aliasConditions.join(' || ')})`);
    }
    
    return filterParts.length > 0 ? filterParts.join(' && ') : '';
}

function filterCachedTracks(tracks, query, author) {
    let filtered = [...tracks];
    
    if (author && !query) {
        const playerInfo = findPlayerAliases(author);
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
                const lowerQuery = query.toLowerCase();
                filtered = filtered.filter(t => 
                    t._searchName.includes(lowerQuery) ||
                    t._searchAuthors.includes(lowerQuery)
                );
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
        else if (query.match(/^type:(frhd|bhr|cr|tm|app)$/i)) {
            const filterType = query.match(/^type:(frhd|bhr|cr|tm|app)$/i)[1].toLowerCase();
            filtered = filtered.filter(t => t.type === filterType);
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
            const lowerQuery = query.toLowerCase();
            const playerInfo = findPlayerAliases(query);
            const isPlayerSearch = playerInfo.aliases && playerInfo.aliases.length > 1;
            
            if (isPlayerSearch) {
                const aliasesLower = playerInfo.aliases.map(a => a.toLowerCase());
                const matchingIndices = new Set();
                
                for (const alias of aliasesLower) {
                    const indices = authorIndex.get(alias);
                    if (indices) {
                        indices.forEach(idx => matchingIndices.add(idx));
                    }
                }
                
                filtered = filtered.filter((t, idx) => {
                    if (matchingIndices.has(idx)) return true;
                    if (t._searchName.includes(lowerQuery)) return true;
                    if (t._searchDescription.includes(lowerQuery)) return true;
                    if (t._searchCanonicalId.includes(lowerQuery)) return true;
                    return false;
                });
            } else {
                filtered = filtered.filter(t => 
                    t._searchName.includes(lowerQuery) ||
                    t._searchUsername.includes(lowerQuery) ||
                    t._searchAuthors.includes(lowerQuery) ||
                    t._searchDescription.includes(lowerQuery) ||
                    t.id?.toString().includes(query) ||
                    t._searchCanonicalId.includes(lowerQuery) ||
                    t._searchAuthorsArray.some(a => a?.includes(lowerQuery))
                );
            }
        }
    }
    
    if (author) {
        const playerInfo = findPlayerAliases(author);
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


let authorIndex = new Map();
let nameIndex = new Map();
let canonicalIndex = new Map();

function buildSearchIndexes() {
    console.log('Building search indexes...');
    
    authorIndex.clear();
    nameIndex.clear();
    canonicalIndex.clear();
    
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
        
        track.name?.toLowerCase().split(/\s+/).forEach(word => {
            if (word.length < 2) return;
            if (!nameIndex.has(word)) nameIndex.set(word, new Set());
            nameIndex.get(word).add(idx);
        });
    });
    
    console.log(`  Search indexes built: ${authorIndex.size} authors, ${nameIndex.size} name words, ${canonicalIndex.size} canonicals`);
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
    
    const linked = trackLinks.find(l => l.canonical === id);
    if (!linked || linked.tracks.length === 0) {
        return res.status(404).send('Track code not found');
    }
    
    const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
    let primaryTrack = linked.tracks[0];
    for (const priorityType of typePriority) {
        const found = linked.tracks.find(t => t.type === priorityType);
        if (found) {
            primaryTrack = found;
            break;
        }
    }
    
    const filePath = path.join(LOCAL_ROOT, primaryTrack.type, 'trackcodes', `${primaryTrack.id}.txt`);
    
    try {
        const code = await fsPromises.readFile(filePath, 'utf8');
        return res.type('text/plain').send(code);
    } catch {
        if (primaryTrack.type === 'frhd') {
            const code = await frhdTxtFallback(primaryTrack.id, filePath);
            if (code) return res.type('text/plain').send(code);
        }
        return res.status(404).send('Track code not found');
    }
});

app.get('/t/:id.png', async (req, res) => {
    const id = req.params.id;
    
    const linked = trackLinks.find(l => l.canonical === id);
    if (!linked || linked.tracks.length === 0) {
        return res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
    }
    
    const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
    let primaryTrack = linked.tracks[0];
    for (const priorityType of typePriority) {
        const found = linked.tracks.find(t => t.type === priorityType);
        if (found) {
            primaryTrack = found;
            break;
        }
    }
    
    const filePath = path.join(LOCAL_ROOT, primaryTrack.type, 'thumbnails', `${primaryTrack.id}.png`);
    
    try {
        await fsPromises.access(filePath);
        return res.sendFile(filePath);
    } catch {
        if (primaryTrack.type === 'frhd') {
            const redirectUrl = await frhdPngFallback(primaryTrack.id);
            if (redirectUrl) return res.redirect(302, redirectUrl);
        }
        return res.sendFile(path.join(__dirname, 'data', 'default-thumbnail.png'));
    }
});

app.get('/t/:id', async (req, res) => {
    const id = req.params.id;
    
    const linked = trackLinks.find(l => l.canonical === id);
    if (!linked || linked.tracks.length === 0) {
        return res.status(404).send('Track not found');
    }
    
    const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
    let primaryTrack = linked.tracks[0];
    for (const priorityType of typePriority) {
        const found = linked.tracks.find(t => t.type === priorityType);
        if (found) {
            primaryTrack = found;
            break;
        }
    }
    
    const type = primaryTrack.type;
    const trackId = primaryTrack.id;
    
    let trackData = {
        id: trackId,
        canonical: linked.canonical,
        name: linked.name || `Track #${trackId}`,
        authors: linked.authors?.join(', ') || 'Unknown',
        authorsArray: linked.authors || [],
        code: '',
        type: type,
        description: '',
        published: '',
        size: '',
        forumUrl: '',
        thumbnail: `/t/${linked.canonical}.png`,
        permalink: `https://freerider.app/t/${linked.canonical}`,
        badges: [...new Set(linked.tracks.map(t => t.type))]
    };
    
    try {
        const record = await pb.collection(type).getFirstListItem(`_id = ${trackId}`, {
            requestKey: `track-${type}-${trackId}-${Date.now()}`
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
            
            trackData = {
                ...trackData,
                ...processed,
                canonical: linked.canonical,
                name: linked.name || processed.name,
                authorsArray: linked.authors || processed.authorsArray,
                authors: linked.authors?.join(', ') || processed.authors,
                pageId: `t-${linked.canonical}`,
                sourceUrl: `/t/${linked.canonical}`,
                description: description,
                size: formatSize(parseInt(record.size) || 0),
                published: publishedDate,
                thumbnail: `/t/${linked.canonical}.png`,
                permalink: `https://freerider.app/t/${linked.canonical}`,
                badges: [...new Set(linked.tracks.map(t => t.type))]
            };
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
        
        const forumLink = await getForumLinkForTrack(type, trackId);
        if (forumLink) {
            trackData.forumUrl = forumLink.forumUrl;
        }
        
    } catch (error) {
        console.error(`Track ${linked.canonical} error:`, error.message);
    }
    
    if (req.query.json === 'true') {
        return res.json({
            id: trackData.id,
            canonical: trackData.canonical,
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            trackUrl: `/t/${linked.canonical}.txt`,
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
    
    const renderedHtml = trackTemplate({
        trackId: linked.canonical,
        trackType: 't',
        track: trackData
    });
    
    res.status(200).send(renderedHtml);
});

function createTrackHandler(type) {
    return async (req, res) => {
        const trackId = req.params.id;
        const numericId = parseInt(trackId, 10);

        const linked = findLinkedTracks(type, numericId);
        if (linked) {
            const typePriority = ['cr', 'tm', 'bhr', 'frhd', 'app'];
            const typeIndex = typePriority.indexOf(type);
            
            for (let i = 0; i < typeIndex; i++) {
                const earlier = linked.tracks.find(t => t.type === typePriority[i]);
                if (earlier) {
                    const redirectUrl = `/${earlier.type}/${earlier.id}${req.query.json === 'true' ? '?json=true' : ''}`;
                    return res.redirect(301, redirectUrl);
                }
            }
        }

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

        const renderedHtml = trackTemplate({
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

const CACHE_REFRESH_INTERVAL = 15 * 60 * 1000;

async function refreshCaches() {
    try {
        console.log('Auto-refreshing caches...');
        await loadPlayerLinksFromDb();
        await loadTrackLinksFromDb();
        //await loadLinkedTrackStatsCache();
        //await loadDbTracksCache();
        await loadDbTracksAndStatsCache();
        await loadPlaylistsFromDb();
        console.log(`Cache refreshed: ${dbTracksCache.all.length} tracks, ${playerLinks.length} players, ${trackLinks.length} track links, ${playlistsCache.length} playlists`);
    } catch (error) {
        console.error('Auto-refresh failed:', error);
    }
}

async function startServer() {
    await loadPlayerLinksFromDb();
    await loadTrackLinksFromDb();
    //await loadLinkedTrackStatsCache();
    //await loadDbTracksCache();
    await loadDbTracksAndStatsCache();
    await loadPlaylistsFromDb();

    setupLiveRacing(server);

    setInterval(refreshCaches, CACHE_REFRESH_INTERVAL);

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
}

startServer();