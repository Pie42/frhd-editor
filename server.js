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
['cr', 'bhr', 'frhd'].forEach(type => {
    app.use(`/data/${type}/trackcodes`, express.static(path.join(LOCAL_ROOT, type, 'trackcodes')));
    app.use(`/data/${type}/thumbnails`, express.static(path.join(LOCAL_ROOT, type, 'thumbnails')));
});

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

// templates
const trackTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/track.ejs'), 'utf8'));
const dbTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/db.ejs'), 'utf8'));

// playlists
let playlists = [];
const PLAYLISTS_PATH = path.join(__dirname, 'data', 'playlists.json');

function loadPlaylists() {
    try {
        const data = fs.readFileSync(PLAYLISTS_PATH, 'utf8');
        playlists = JSON.parse(data);
        console.log(`Loaded ${playlists.length} playlists`);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('No playlists.json found, starting with empty array');
            playlists = [];
        } else {
            console.error('Error loading playlists:', e);
            playlists = [];
        }
    }
}

loadPlaylists();

function findPlaylist(playlistId) {
    return playlists.find(p => p.id === playlistId);
}

// user links for aliased usernames
let userLinks = [];
const USER_LINKS_PATH = path.join(__dirname, 'data', 'user-links.json');

function loadUserLinks() {
    try {
        const data = fs.readFileSync(USER_LINKS_PATH, 'utf8');
        userLinks = JSON.parse(data);
        console.log(`Loaded ${userLinks.length} user links`);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('No user-links.json found, starting with empty array');
            userLinks = [];
        } else {
            console.error('Error loading user links:', e);
            userLinks = [];
        }
    }
}

loadUserLinks();

function normalizeAuthorName(name) {
    return name?.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function findUserAliases(username) {
    const normalizedInput = normalizeAuthorName(username);
    
    for (const user of userLinks) {
        const matchesAlias = user.aliases.some(alias => 
            normalizeAuthorName(alias) === normalizedInput
        );
        
        if (matchesAlias) {
            return {
                canonical: user.canonical,
                displayName: user.displayName,
                aliases: user.aliases,
                normalizedAliases: user.aliases.map(a => normalizeAuthorName(a)),
                platforms: {
                    frhd: user.frhd === true,
                    bhr: user.bhr === true,
                    cr: user.cr === true
                }
            };
        }
    }
    
    return {
        canonical: normalizedInput,
        displayName: username,
        aliases: [username],
        normalizedAliases: [normalizedInput],
        platforms: { frhd: false, bhr: false, cr: false }
    };
}

// track links for cross-platform tracks
let trackLinks = [];
const TRACK_LINKS_PATH = path.join(__dirname, 'data', 'track-links.json');

function loadTrackLinks() {
    try {
        const data = fs.readFileSync(TRACK_LINKS_PATH, 'utf8');
        trackLinks = JSON.parse(data);
        console.log(`Loaded ${trackLinks.length} track links`);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log('No track-links.json found, starting with empty array');
            trackLinks = [];
        } else {
            console.error('Error loading track links:', e);
            trackLinks = [];
        }
    }
}

loadTrackLinks();

function findLinkedTracks(type, id) {
    for (const link of trackLinks) {
        const match = link.tracks.find(t => t.type === type && t.id === id);
        if (match) {
            return link;
        }
    }
    return null;
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

let linkedTrackStatsCache = new Map();

async function loadLinkedTrackStatsCache() {
    console.log('Loading stats for linked tracks...');
    
    const needed = { frhd: new Set(), bhr: new Set(), cr: new Set() };
    
    for (const link of trackLinks) {
        for (const track of link.tracks) {
            if (needed[track.type]) {
                needed[track.type].add(track.id);
            }
        }
    }
    
    console.log(`Need: frhd=${needed.frhd.size}, bhr=${needed.bhr.size}, cr=${needed.cr.size}`);
    
    for (const type of ['frhd', 'bhr', 'cr']) {
        if (needed[type].size === 0) continue;
        
        try {
            const ids = Array.from(needed[type]);
            
            for (let i = 0; i < ids.length; i += 100) {
                const batch = ids.slice(i, i + 100);
                const filter = batch.map(id => `_id = ${id}`).join(' || ');
                
                const records = await pb.collection(type).getFullList({
                    filter: filter,
                    fields: '_id,upvotes,downvotes,votes,plays,favorites,description',
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
    
    let combinedUpvotes = track.type === 'cr' 
        ? parseNumericValue(track.votes) 
        : parseNumericValue(track.upvotes);
    let combinedDownvotes = parseNumericValue(track.downvotes);
    let combinedPlays = parseNumericValue(track.plays);
    let combinedFavorites = parseNumericValue(track.favorites);
    
    if (linked) {
        if (linked.name) {
            name = linked.name;
        }
        
        badges = [...new Set(linked.tracks.map(t => t.type))];
        
        if (linked.authors && linked.authors.length > 0) {
            authorsArray = [...linked.authors];
            authors = authorsArray.join(', ');
        }
        
        const typePriority = ['cr', 'bhr', 'frhd'];
        for (const priorityType of typePriority) {
            const found = linked.tracks.find(t => t.type === priorityType);
            if (found) {
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
        authors,
        authorsArray,
        badges,
        urlType,
        urlId,
        upvotes: formattedUpvotes,
        downvotes: formattedDownvotes,
        votes: track.type === 'cr' ? formattedUpvotes : null,
        plays: formattedPlays,
        favorites: formattedFavorites,
        canonicalId: linked ? linked.canonical : `${track.type}-${track.id}`
    };
}

function buildFilterString(options) {
    const { type, query, author, showOnly } = options;
    let filterParts = [];
    
    if (showOnly) {
        filterParts.push('show = true');
    }
    
    if (query) {
        const escapedQuery = query.replace(/"/g, '\\"');
        filterParts.push(`(name ~ "${escapedQuery}" || username ~ "${escapedQuery}" || _id ~ "${escapedQuery}")`);
    }
    
    if (author) {
        const userInfo = findUserAliases(author);
        if (userInfo.aliases && userInfo.aliases.length > 1) {
            const aliasConditions = userInfo.aliases.map(alias => {
                const escaped = alias.replace(/"/g, '\\"');
                return `username = "${escaped}" || authors ~ "\\"${escaped}\\""`;
            }).join(' || ');
            filterParts.push(`(${aliasConditions})`);
        } else {
            const escapedAuthor = author.replace(/"/g, '\\"');
            filterParts.push(`(username = "${escapedAuthor}" || authors ~ "\\"${escapedAuthor}\\"")`);
        }
    }
    
    return filterParts.length > 0 ? filterParts.join(' && ') : '';
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
    res.json({
        playlists: playlists.map(p => {
            const lastTrack = p.tracks[p.tracks.length - 1];
            const thumbnail = lastTrack 
                ? `/${lastTrack.type}/${lastTrack.id}.png`
                : null;
            
            return {
                id: p.id,
                name: p.name,
                username: p.username,
                description: p.description,
                color: p.color,
                trackCount: p.tracks.length,
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

    if (!['frhd', 'bhr', 'cr'].includes(type)) {
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

    if (!['frhd', 'bhr', 'cr'].includes(type)) {
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
    const userInfo = findUserAliases(username);
    
    let trackCount = 0;
    
    if (type === 'db') {
        const userCanonical = userInfo.canonical;
        trackCount = dbTracksCache.all.filter(t => {
            if (t.username && findUserAliases(t.username).canonical === userCanonical) return true;
            if (t.authorsArray) {
                for (const a of t.authorsArray) {
                    if (a && findUserAliases(a).canonical === userCanonical) return true;
                }
            }
            return false;
        }).length;
    } 
    else if (['frhd', 'bhr', 'cr'].includes(type)) {
        try {
            const filterString = buildFilterString({
                type,
                query: '',
                author: username,
                showOnly: false
            });
            
            const result = await pb.collection(type).getList(1, 1, {
                filter: filterString || undefined,
                requestKey: `user-count-${type}-${username}-${Date.now()}`
            });
            
            trackCount = result.totalItems;
        } catch (e) {
            console.error(`Failed to get track count for ${username} in ${type}:`, e.message);
            trackCount = 0;
        }
    }
    else if (type === 'all') {
        for (const collectionType of ['frhd', 'bhr', 'cr']) {
            try {
                const filterString = buildFilterString({
                    type: collectionType,
                    query: '',
                    author: username,
                    showOnly: false
                });
                
                const result = await pb.collection(collectionType).getList(1, 1, {
                    filter: filterString || undefined,
                    requestKey: `user-count-all-${collectionType}-${username}-${Date.now()}`
                });
                
                trackCount += result.totalItems;
            } catch (e) {
                console.error(`Failed to get track count for ${username} in ${collectionType}:`, e.message);
            }
        }
    }
    
    res.json({
        canonical: userInfo.canonical,
        displayName: userInfo.displayName,
        aliases: userInfo.aliases,
        platforms: userInfo.platforms,
        trackCount: trackCount
    });
});

app.get('/api/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 24;
    const query = req.query.q || '';
    
    let users = userLinks.map(user => ({
        canonical: user.canonical,
        displayName: user.displayName,
        aliases: user.aliases,
        avatar: `/data/users/avatars/${user.canonical}.png`,
        platforms: {
            frhd: user.frhd === true,
            bhr: user.bhr === true,
            cr: user.cr === true
        }
    }));
    
    if (query) {
        const lowerQuery = query.toLowerCase();
        users = users.filter(user => 
            user.displayName.toLowerCase().includes(lowerQuery) ||
            user.canonical.toLowerCase().includes(lowerQuery) ||
            user.aliases.some(a => a.toLowerCase().includes(lowerQuery))
        );
    }
    
    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedUsers = users.slice(startIndex, startIndex + perPage);
    
    res.json({
        users: paginatedUsers,
        pagination: { page, perPage, totalCount, totalPages }
    });
});

let dbTracksCache = {
    frhd: [],
    bhr: [],
    cr: [],
    all: [],
    lastUpdated: null
};

async function loadDbTracksCache() {
    console.log('Loading db tracks cache (show=true)...');
    
    for (const type of ['frhd', 'bhr', 'cr']) {
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
        ...dbTracksCache.cr
    ].map(processTrackWithLinks);
    
    const seenCanonical = new Set();
    dbTracksCache.all = allTracks.filter(track => {
        if (seenCanonical.has(track.canonicalId)) return false;
        seenCanonical.add(track.canonicalId);
        return true;
    });
    
    dbTracksCache.lastUpdated = Date.now();
    console.log(`DB tracks cache loaded: ${dbTracksCache.all.length} total tracks`);
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

            const tracksByType = { frhd: [], bhr: [], cr: [] };
            playlistData.tracks.forEach(t => {
                if (tracksByType[t.type]) {
                    tracksByType[t.type].push(t.id);
                }
            });

            const fetchedTracks = new Map();

            for (const [type, ids] of Object.entries(tracksByType)) {
                if (ids.length === 0) continue;

                try {
                    const uncachedIds = [];
                    ids.forEach(id => {
                        const cached = dbTracksCache[type]?.find(t => t.id == id);
                        if (cached) {
                            fetchedTracks.set(`${type}-${id}`, cached);
                        } else {
                            uncachedIds.push(id);
                        }
                    });

                    if (uncachedIds.length > 0) {
                        const filter = uncachedIds.map(id => `_id = ${id}`).join(' || ');
                        const records = await pb.collection(type).getFullList({
                            filter: filter,
                            requestKey: `playlist-batch-${type}-${Date.now()}`
                        });

                        records.forEach(record => {
                            const transformed = transformRecord(record, type);
                            fetchedTracks.set(`${type}-${record._id}`, transformed);
                        });
                    }
                } catch (e) {
                    console.error(`Failed to fetch ${type} playlist tracks:`, e.message);
                }
            }

            let allTracks = [];
            playlistData.tracks.forEach(trackRef => {
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
                name: playlistData.name,
                username: playlistData.username,
                description: playlistData.description
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
        
        if (type === 'db') {
            allTracks = filterCachedTracks(dbTracksCache.all, query, author);
            
            if (author) {
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
        
        if (author) {
            const collections = type === 'all' ? ['frhd', 'bhr', 'cr'] : [type];
            
            for (const collectionType of collections) {
                if (!['frhd', 'bhr', 'cr'].includes(collectionType)) continue;
                
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
            
            if (type === 'all') {
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
        
        if (['frhd', 'bhr', 'cr'].includes(type)) {
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
        
        const collections = ['frhd', 'bhr', 'cr'];
        
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
    
    let users = userLinks
        .filter(user => {
            if (user.showProfile !== true) return false;
            if (platform === 'all' || platform === 'db') return true;
            return user[platform] === true;
        })
        .map(user => ({
            type: 'user',
            canonical: user.canonical,
            displayName: user.displayName,
            aliases: user.aliases,
            avatar: `/data/users/avatars/${user.canonical}.png`,
            platforms: {
                frhd: user.frhd === true,
                bhr: user.bhr === true,
                cr: user.cr === true
            }
        }));
    
    if (query) {
        const lowerQuery = query.toLowerCase();
        users = users.filter(user => 
            user.displayName.toLowerCase().includes(lowerQuery) ||
            user.canonical.toLowerCase().includes(lowerQuery) ||
            user.aliases.some(a => a.toLowerCase().includes(lowerQuery))
        );
    }
    
    if (sortBy === 'name') {
        users.sort((a, b) => {
            const cmp = a.displayName.localeCompare(b.displayName);
            return sortOrder === 'asc' ? cmp : -cmp;
        });
    }
    
    res.json({
        users: users,
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
        const numericMatch = query.match(/^(upvotes|downvotes|votes|plays|size|favorites)(>|<|>=|<=|=)(\d+)$/i);
        
        if (numericMatch) {
            const field = numericMatch[1].toLowerCase();
            const operator = numericMatch[2];
            const value = parseInt(numericMatch[3]);
            
            let dbField = field;
            if (type === 'cr' && (field === 'upvotes' || field === 'downvotes')) {
                dbField = 'votes';
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
       else {
    const escapedQuery = query.replace(/"/g, '\\"');
    
    let searchFields = [
        `name ~ "${escapedQuery}"`,
        `username ~ "${escapedQuery}"`,
        `authors ~ "${escapedQuery}"`
    ];
    
    if (type === 'frhd') {
        searchFields.push(`description ~ "${escapedQuery}"`);
    }
    
    if (/^\d+$/.test(query)) {
        searchFields.push(`_id = ${query}`);
    }
    
    filterParts.push(`(${searchFields.join(' || ')})`);
}
    }
    
    if (author) {
        const userInfo = findUserAliases(author);
        if (userInfo.aliases && userInfo.aliases.length > 1) {
            const aliasConditions = userInfo.aliases.map(alias => {
                const escaped = alias.replace(/"/g, '\\"');
                return `username = "${escaped}" || authors ~ "\\"${escaped}\\""`;
            }).join(' || ');
            filterParts.push(`(${aliasConditions})`);
        } else {
            const escapedAuthor = author.replace(/"/g, '\\"');
            filterParts.push(`(username = "${escapedAuthor}" || authors ~ "\\"${escapedAuthor}\\"")`);
        }
    }
    
    return filterParts.length > 0 ? filterParts.join(' && ') : '';
}

function filterCachedTracks(tracks, query, author) {
    let filtered = [...tracks];
    
    if (query) {
        const numericMatch = query.match(/^(upvotes|downvotes|votes|plays|size|favorites)(>|<|>=|<=|=)(\d+)$/i);
        
        if (numericMatch) {
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
        else if (query.match(/^id=(\d+)$/i)) {
            const id = parseInt(query.match(/^id=(\d+)$/i)[1]);
            filtered = filtered.filter(t => t.id === id);
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
        else if (query.match(/^type:(frhd|bhr|cr)$/i)) {
            const filterType = query.match(/^type:(frhd|bhr|cr)$/i)[1].toLowerCase();
            filtered = filtered.filter(t => t.type === filterType);
        }
        else if (query.match(/^has:(description|votes|plays|favorites)$/i)) {
            const hasField = query.match(/^has:(description|votes|plays|favorites)$/i)[1].toLowerCase();
            filtered = filtered.filter(t => {
                switch (hasField) {
                    case 'description': return t.description && t.description.trim() !== '';
                    case 'votes': return parseNumericValue(t.upvotes) > 0 || parseNumericValue(t.votes) > 0;
                    case 'plays': return parseNumericValue(t.plays) > 0;
                    case 'favorites': return parseNumericValue(t.favorites) > 0;
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
        else {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(t => 
                t.name?.toLowerCase().includes(lowerQuery) ||
                t.username?.toLowerCase().includes(lowerQuery) ||
                t.authors?.toLowerCase().includes(lowerQuery) ||
                t.description?.toLowerCase().includes(lowerQuery) ||
                t.id?.toString().includes(query) ||
                t.canonicalId?.toLowerCase().includes(lowerQuery)
            );
        }
    }
    
    if (author) {
        const userInfo = findUserAliases(author);
        filtered = filtered.filter(t => {
            if (t.username && findUserAliases(t.username).canonical === userInfo.canonical) return true;
            if (t.authorsArray) {
                for (const a of t.authorsArray) {
                    if (a && findUserAliases(a).canonical === userInfo.canonical) return true;
                }
            }
            return false;
        });
    }
    
    return filtered;
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

function createTrackHandler(type) {
    return async (req, res) => {
        const trackId = req.params.id;
        const numericId = parseInt(trackId, 10);

        const linked = findLinkedTracks(type, numericId);
        if (linked) {
            const typePriority = ['cr', 'bhr', 'frhd'];
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

app.get('/api/live-sessions', (req, res) => {
    const sessions = {};
    for (const [trackId, players] of liveSessions) {
        if (players.size > 0) {
            sessions[trackId] = players.size;
        }
    }
    res.json(sessions);
});

const CACHE_REFRESH_INTERVAL = 15 * 60 * 1000;

async function refreshCaches() {
    try {
        console.log('Auto-refreshing caches...');
        await loadLinkedTrackStatsCache();
        await loadDbTracksCache();
        console.log(`Cache refreshed: ${dbTracksCache.all.length} tracks`);
    } catch (error) {
        console.error('Auto-refresh failed:', error);
    }
}

async function startServer() {
    await loadLinkedTrackStatsCache();
    await loadDbTracksCache();
    setupLiveRacing(server);

    setInterval(refreshCaches, CACHE_REFRESH_INTERVAL);

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
}

startServer();