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

const PORT = 3000;

// persistent disk mount for Render
const PERSISTENT_ROOT_DISK = '/var/data'; 

// maps /var/data/cr/trackcodes to the public URL /data/cr/trackcodes
['cr', 'bhr', 'frhd'].forEach(type => {
    app.use(`/data/${type}/trackcodes`, express.static(path.join(PERSISTENT_ROOT_DISK, type, 'trackcodes')));
    app.use(`/data/${type}/thumbnails`, express.static(path.join(PERSISTENT_ROOT_DISK, type, 'thumbnails')));
});

const CR_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'cr', 'trackcodes');
const CR_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'cr', 'thumbnails');
const BHR_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'bhr', 'trackcodes');
const BHR_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'bhr', 'thumbnails');
const FRHD_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'frhd', 'trackcodes');
const FRHD_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'frhd', 'thumbnails');
const PLUS_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'plus', 'trackcodes');
const PLUS_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'plus', 'thumbnails');

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

// metadata
let crMetadata = [];
let bhrMetadata = [];
let frhdMetadata = [];
let plusMetadata = [];

const CR_METADATA_PATH = path.join(__dirname, 'data', 'cr', 'tracks.csv');
const BHR_METADATA_PATH = path.join(__dirname, 'data', 'bhr', 'tracks.csv');
const FRHD_METADATA_PATH = path.join(__dirname, 'data', 'frhd', 'tracks.csv');
const PLUS_METADATA_PATH = path.join(__dirname, 'data', 'plus', 'tracks.csv');

// csv metadata loading
function loadMetadata(name, filePath) {
    try {
        console.log(`${name} - loading metadata from: ${filePath}`);
        const csvContent = fs.readFileSync(filePath, 'utf8').trim();

        const lines = csvContent.split('\n');
        if (lines.length < 2) {
            console.warn(`${name} - metadata CSV file is empty or missing header.`);
            return [];
        }

        const headers = lines[0].split(',').map(h => h.trim());

        return lines.slice(1).map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
                .map(v => v.trim().replace(/^"|"$/g, ''));

            if (values.length !== headers.length) {
                console.warn(`${name} - skipping line due to column mismatch: ${line}`);
                return null;
            }

            const track = {};
            headers.forEach((header, index) => {
                track[header] = (header === 'id' || header === 'favorites')
                    ? parseInt(values[index], 10)
                    : values[index];
            });
            return track;
        }).filter(Boolean);

    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`${name} - metadata file not found at ${filePath}. Using empty array.`);
        } else {
            console.error(`${name} - failed to load or parse metadata CSV:`, e.message);
        }
        return [];
    }
}

crMetadata = loadMetadata('cr', CR_METADATA_PATH);
bhrMetadata = loadMetadata('bhr', BHR_METADATA_PATH);
frhdMetadata = loadMetadata('frhd', FRHD_METADATA_PATH);
plusMetadata = loadMetadata('plus', PLUS_METADATA_PATH);

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

// API endpoints
app.get('/api/playlists', (req, res) => {
    res.json({
        playlists: playlists.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            icon: p.icon,
            trackCount: p.tracks.length
        }))
    });
});

app.get('/api/playlist/:id', (req, res) => {
    const playlist = findPlaylist(req.params.id);
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
});

app.get('/api/daily/:type', (req, res) => {
    const type = req.params.type;
    let metadata;
    
    if (type === 'frhd') metadata = frhdMetadata;
    else if (type === 'bhr') metadata = bhrMetadata;
    else if (type === 'cr') metadata = crMetadata;
    else if (type === 'plus' || type === 't') metadata = plusMetadata;
    else return res.status(400).json({ error: 'Invalid type' });
    
    if (metadata.length === 0) {
        return res.status(404).json({ error: 'No tracks available' });
    }
    
    const seed = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
    const track = metadata[seed % metadata.length];
    const trackId = track.slug || track.id;
    const urlType = type === 'plus' ? 't' : type;
    
    res.json({
        id: track.id,
        slug: track.slug,
        trackId: trackId,
        name: track.name || `Track #${track.id}`,
        authors: track.authors || track.username || 'Unknown',
        thumbnail: `/${urlType}/${trackId}.png`,
        url: `/${urlType}/${trackId}`,
        type: type === 'plus' ? 'plus' : type,
        specialType: 'daily'
    });
});

app.get('/api/random/:type', (req, res) => {
    const type = req.params.type;
    let metadata;
    
    if (type === 'frhd') metadata = frhdMetadata;
    else if (type === 'bhr') metadata = bhrMetadata;
    else if (type === 'cr') metadata = crMetadata;
    else if (type === 'plus' || type === 't') metadata = plusMetadata;
    else return res.status(400).json({ error: 'Invalid type' });
    
    if (metadata.length === 0) {
        return res.status(404).json({ error: 'No tracks available' });
    }
    
    const randomIndex = Math.floor(Math.random() * metadata.length);
    const track = metadata[randomIndex];
    const trackId = track.slug || track.id;
    const urlType = type === 'plus' ? 't' : type;
    
    res.json({
        id: track.id,
        slug: track.slug,
        trackId: trackId,
        name: track.name || `Track #${track.id}`,
        authors: track.authors || track.username || 'Unknown',
        thumbnail: `/${urlType}/${trackId}.png`,
        url: `/${urlType}/${trackId}`,
        type: type === 'plus' ? 'plus' : type,
        specialType: 'random'
    });
});

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
                    cr: user.cr === true,
                    plus: user.plus === true
                }
            };
        }
    }
    
    return {
        canonical: normalizedInput,
        displayName: username,
        aliases: [username],
        normalizedAliases: [normalizedInput],
        platforms: {
            frhd: false,
            bhr: false,
            cr: false,
            plus: false
        }
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

function normalizeAuthorName(name) {
    return name?.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function buildAuthorIndex() {
    const authorIndex = new Map();
    
    const addToIndex = (track, type) => {
        let authors = [];
        
        if (track.authors) {
            if (typeof track.authors === 'string' && track.authors.startsWith('[')) {
                try {
                    authors = JSON.parse(track.authors.replace(/""/g, '"'));
                } catch (e) {
                    authors = [track.authors];
                }
            } else if (typeof track.authors === 'string') {
                authors = track.authors.split(',').map(a => a.trim());
            }
        }
        
        if (track.username && !authors.includes(track.username)) {
            authors.push(track.username);
        }
        
        for (const author of authors) {
            if (!author) continue;
            
            const userInfo = findUserAliases(author);
            const canonical = userInfo.canonical;
            
            if (!authorIndex.has(canonical)) {
                authorIndex.set(canonical, {
                    canonical: canonical,
                    displayName: userInfo.displayName,
                    aliases: userInfo.aliases,
                    tracks: []
                });
            }
            
            const existingTrack = authorIndex.get(canonical).tracks.find(
                t => t.type === type && t.id === track.id
            );
            
            if (!existingTrack) {
                authorIndex.get(canonical).tracks.push({
                    type,
                    id: track.id,
                    name: track.name
                });
            }
        }
    };
    
    frhdMetadata.forEach(t => addToIndex(t, 'frhd'));
    bhrMetadata.forEach(t => addToIndex(t, 'bhr'));
    crMetadata.forEach(t => addToIndex(t, 'cr'));
    plusMetadata.forEach(t => addToIndex(t, 'plus'));
    
    return authorIndex;
}

let authorIndex = new Map();

function rebuildAuthorIndex() {
    authorIndex = buildAuthorIndex();
    console.log(`Built author index with ${authorIndex.size} unique authors`);
}

rebuildAuthorIndex();

function formatSize(bytes) {
    if (bytes === null || bytes === undefined || bytes === 0 || isNaN(bytes)) { return ''; }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function getBhrTrackData(trackId) {
    const numericId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId;
    
    const metadata = bhrMetadata.find(t => t.id === numericId);

    if (!metadata) {
        console.log(`[BHR] Metadata not found for ID ${trackId} (numeric: ${numericId}).`);
        return null;
    }

    const codePath = path.join(__dirname, 'data', 'bhr', 'trackcodes', `${trackId}.txt`);
    //const codePath = path.join(BHR_TRACKCODES_ROOT, `${trackId}.txt`);
    let trackCode = '';
    
    try {
        trackCode = fs.readFileSync(codePath, 'utf8').trim();
    } catch (e) {
        console.error(`[BHR] Failed to read track code file ${codePath}. Track may be invalid or file missing.`);
    }

    let authors;
    try {
        authors = JSON.parse(metadata.authors).join(', ');
    } catch (e) {
        if (typeof metadata.authors === 'string') {
            const cleanedAuthorsString = metadata.authors.replace(/""/g, '"'); 
            try {
                authors = JSON.parse(cleanedAuthorsString).join(', ');
            } catch (e2) {
                authors = metadata.authors || 'Unknown';
            }
        } else {
            authors = metadata.authors || 'Unknown';
        }
    }
    
    const rawSize = metadata.size ? parseInt(metadata.size, 10) : trackCode.length;
    const sizeString = formatSize(rawSize);

    return {
        id: metadata.id,
        name: metadata.name,
        authors: authors,
        code: trackCode,
        size: sizeString,
        description: metadata.description || '', 
        published_at: metadata.published_at || null 
    };
}

async function getCrTrackData(trackId) {
    const numericId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId;
    
    const metadata = crMetadata.find(t => t.id === numericId);

    if (!metadata) {
        console.log(`[CR] Metadata not found for ID ${trackId} (numeric: ${numericId}).`);
        return null;
    }

    const codePath = path.join(CR_TRACKCODES_ROOT, `${trackId}.txt`);
    //const codePath = path.join(CR_TRACKCODES_ROOT, `${trackId}.txt`);
    
    let trackCode = '';
    
    try {
        trackCode = fs.readFileSync(codePath, 'utf8').trim();
    } catch (e) {
        console.error(`[CR] Failed to read track code file ${codePath}. Track may be invalid or file missing.`, e);
    }

    return {
        id: metadata.id,
        name: metadata.name,
        authors: metadata.username,
        code: trackCode
    };
}

async function getPlusTrackData(trackId) {
    const numericId = parseInt(trackId, 10);
    const isNumeric = !isNaN(numericId) && numericId > 0;
    
    const metadata = isNumeric
        ? plusMetadata.find(t => t.id === numericId)
        : plusMetadata.find(t => t.slug === trackId || t.id === trackId);

    if (!metadata) {
        console.log(`[PLUS] Metadata not found for ID ${trackId}.`);
        return null;
    }

    const fileId = metadata.slug || metadata.id;
    const codePath = path.join(__dirname, 'data', 'plus', 'trackcodes', `${fileId}.txt`);
    let trackCode = '';
    
    try {
        trackCode = fs.readFileSync(codePath, 'utf8').trim();
    } catch (e) {
        console.error(`[Plus] Failed to read track code file ${codePath}. Track may be invalid or file missing.`);
    }

    let authors;
    try {
        authors = JSON.parse(metadata.authors).join(', ');
    } catch (e) {
        if (typeof metadata.authors === 'string') {
            const cleanedAuthorsString = metadata.authors.replace(/""/g, '"'); 
            try {
                authors = JSON.parse(cleanedAuthorsString).join(', ');
            } catch (e2) {
                authors = metadata.authors || 'Unknown';
            }
        } else {
            authors = metadata.authors || 'Unknown';
        }
    }
    
    const rawSize = metadata.size ? parseInt(metadata.size, 10) : trackCode.length;
    const sizeString = formatSize(rawSize);

    return {
        id: metadata.slug || metadata.id,
        name: metadata.name,
        authors: authors,
        code: trackCode,
        size: sizeString,
        description: metadata.description || '', 
        published_at: metadata.published_at || null 
    };
}

function sanitizePath(inputPath) {
    if (!inputPath) return '';
    let cleanPath = path.normalize(inputPath).replace(/^(\.\.(\/|\\|$))+/, '');
    cleanPath = cleanPath.replace(/^(\/|\\)|(\/|\\)$/g, '');
    return cleanPath;
}

function findClosestIds(metadata, id) {
    if (metadata.length === 0) return { nextId: null, prevId: null };

    const sorted = [...metadata].sort((a, b) => a.id - b.id);

    let prev = null;
    let next = null;

    for (const t of sorted) {
        if (t.id < id) prev = t.id;
        if (t.id > id && next === null) next = t.id;
    }

    if (prev === null) prev = sorted[sorted.length - 1].id;
    if (next === null) next = sorted[0].id;

    return { nextId: next, prevId: prev };
}


// dynamic routes

function parseNumericValue(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    
    const str = String(val).toLowerCase().trim();
    
    // Handle "1.4m", "9.3k" etc.
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
    //if (typeof val === 'number') return val;
    
    if (val < 1000) return val;
    if (val < 1000000) return (val / 1000).toFixed(1) + 'k';
    return (val / 1000000).toFixed(1) + 'm';
    }

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function processTrackData(options) {
    const { type, query, sortBy, sortOrder, page, perPage, author, playlist } = options;
    
    let allTracks = [];
    let allUsers = [];
    
    if (options.ghosts === 'true') {
    allTracks = allTracks.filter(track => {
        return track.hasGhost || track.ghoster;
    });
}
    if (playlist) {
        const playlistData = findPlaylist(playlist);
        if (playlistData) {
            for (const trackRef of playlistData.tracks) {
                let track = null;
                let user = null;
                
                if (trackRef.type === 'frhd') {
                    track = frhdMetadata.find(t => t.id === trackRef.id);
                } else if (trackRef.type === 'bhr') {
                    track = bhrMetadata.find(t => t.id === trackRef.id);
                } else if (trackRef.type === 'cr') {
                    track = crMetadata.find(t => t.id === trackRef.id);
                } else if (trackRef.type === 'plus') {
                    track = plusMetadata.find(t => t.id === trackRef.id);
                }

                if (track) {
                    allTracks.push({ ...track, type: trackRef.type });
                }

                if (user) {
                    allUsers.push({ ...user, type: trackRef.type });
                }
            }
        }
    } else {
        if (type === 'all' || type === 'frhd') {
            allTracks = allTracks.concat(
                frhdMetadata.map(t => ({ ...t, type: 'frhd' }))
            );
        }
        
        if (type === 'all' || type === 'bhr') {
            allTracks = allTracks.concat(
                bhrMetadata.map(t => ({ ...t, type: 'bhr' }))
            );
        }
        
        if (type === 'all' || type === 'cr') {
            allTracks = allTracks.concat(
                crMetadata.map(t => ({ ...t, type: 'cr' }))
            );
        }

        if (type === 'plus') {
            allTracks = allTracks.concat(
                plusMetadata.map(t => ({ ...t, type: 'plus' }))
            );
        }

        if (sortBy === 'shuffle' && !query && !author && !playlist) {
            allTracks = shuffleArray(allTracks);
        }
    }
    
allTracks = allTracks.map(track => {
    let authors = track.authors || track.username || 'Unknown';
    let authorsArray = [];
    
    if (typeof authors === 'string' && authors.startsWith('[')) {
        try {
            authorsArray = JSON.parse(authors.replace(/""/g, '"'));
            authors = authorsArray.join(', ');
        } catch (e) {
            authorsArray = [authors];
        }
    } else if (typeof authors === 'string') {
        authorsArray = authors.split(',').map(a => a.trim());
    }
    
    const linked = findLinkedTracks(track.type, track.id);
    let badges = [track.type];
    let urlType = track.type;
    let urlId = track.slug || track.id;
    
    let combinedUpvotes = parseNumericValue(track.upvotes);
    let combinedDownvotes = parseNumericValue(track.downvotes);
    let combinedPlays = parseNumericValue(track.plays);
    let combinedFavorites = parseNumericValue(track.favorites);
    
    if (linked) {
    badges = linked.tracks.map(t => t.type);
    
    if (linked.authors && linked.authors.length > 0) {
        authorsArray = [...linked.authors];
        authors = authorsArray.join(', ');
    }
    
    const typePriority = ['cr', 'bhr', 'frhd', 'plus'];
    for (const priorityType of typePriority) {
        const found = linked.tracks.find(t => t.type === priorityType);
        if (found) {
            urlType = found.type;
            let linkedMeta = null;
            if (found.type === 'plus') {
                linkedMeta = plusMetadata.find(m => m.id === found.id);
            }
            urlId = linkedMeta?.slug || found.id;
            break;
        }
    }
        
        for (const linkedTrack of linked.tracks) {
            if (linkedTrack.type === track.type && linkedTrack.id === track.id) {
                continue;
            }
            
            let linkedMeta = null;
            if (linkedTrack.type === 'frhd') {
                linkedMeta = frhdMetadata.find(t => t.id === linkedTrack.id);
            } else if (linkedTrack.type === 'bhr') {
                linkedMeta = bhrMetadata.find(t => t.id === linkedTrack.id);
            } else if (linkedTrack.type === 'cr') {
                linkedMeta = crMetadata.find(t => t.id === linkedTrack.id);
            } else if (linkedTrack.type === 'plus') {
                linkedMeta = plusMetadata.find(t => t.id === linkedTrack.id);
            }
            
            if (linkedMeta) {
                combinedUpvotes += parseNumericValue(linkedMeta.upvotes);
                combinedDownvotes += parseNumericValue(linkedMeta.downvotes);
                combinedPlays += parseNumericValue(linkedMeta.plays);
                combinedFavorites += parseNumericValue(linkedMeta.favorites);
            }
        }
    }

     const unparsedUpvotes = unparseNumericValue(combinedUpvotes);
            const unparsedDownvotes = unparseNumericValue(combinedDownvotes);
            const unparsedPlays = unparseNumericValue(combinedPlays);
            const unparsedFavorites = unparseNumericValue(combinedFavorites);
    
    return {
        ...track,
        authors,
        authorsArray,
        badges,
        slug: track.slug,
        urlType,
        urlId,
        upvotes: unparsedUpvotes,
        downvotes: unparsedDownvotes,
        plays: unparsedPlays,
        favorites: unparsedFavorites,
        name: track.name || `Track #${track.id}`,
        canonicalId: linked ? linked.canonical : `${track.type}-${track.id}`
    };
});
    
    if (type === 'all') {
        const seenCanonical = new Set();
        allTracks = allTracks.filter(track => {
            if (track.canonicalId.startsWith('frhd-') || 
                track.canonicalId.startsWith('bhr-') || 
                track.canonicalId.startsWith('cr-')) {
                return true;
            }
            
            if (seenCanonical.has(track.canonicalId)) {
                return false;
            }
            seenCanonical.add(track.canonicalId);
            return true;
        });
    }
    
    if (author) {
    const authorAliases = findUserAliases(author);
    
    allTracks = allTracks.filter(track => {
        if (track.username) {
            const trackUserAliases = findUserAliases(track.username);
            if (trackUserAliases.canonical === authorAliases.canonical) {
                return true;
            }
        }

        if (track.authorsArray) {
            for (const trackAuthor of track.authorsArray) {
                if (!trackAuthor) continue;
                const trackAuthorAliases = findUserAliases(trackAuthor);
                if (trackAuthorAliases.canonical === authorAliases.canonical) {
                    return true;
                }
            }
        }
        
        return false;
    });
}
    
if (query) {
    const lowerQuery = query.toLowerCase();
    
    let queryUserAliases = null;
    for (const user of userLinks) {
        const matchesAlias = user.aliases.some(alias => 
            alias.toLowerCase().includes(lowerQuery) || 
            lowerQuery.includes(alias.toLowerCase())
        );
        if (matchesAlias) {
            queryUserAliases = {
                canonical: user.canonical,
                displayName: user.displayName,
                aliases: user.aliases,
                normalizedAliases: user.aliases.map(a => normalizeAuthorName(a))
            };
            break;
        }
    }
    
    allTracks = allTracks.filter(track => {
        if (track.name && track.name.toLowerCase().includes(lowerQuery)) {
            return true;
        }
        
        if (track.id && track.id.toString().includes(lowerQuery)) {
            return true;
        }
        
        if (track.description && track.description.toLowerCase().includes(lowerQuery)) {
            return true;
        }
        
        if (queryUserAliases) {
            if (track.username) {
                const trackUserAliases = findUserAliases(track.username);
                if (trackUserAliases.canonical === queryUserAliases.canonical) {
                    return true;
                }
            }
            
            if (track.authorsArray && track.authorsArray.length > 0) {
                for (const author of track.authorsArray) {
                    if (!author) continue;
                    const authorAliases = findUserAliases(author);
                    if (authorAliases.canonical === queryUserAliases.canonical) {
                        return true;
                    }
                }
            }
        }
        
        if (track.username && track.username.toLowerCase().includes(lowerQuery)) {
            return true;
        }
        
        if (track.authorsArray && track.authorsArray.length > 0) {
            for (const author of track.authorsArray) {
                if (author && author.toLowerCase().includes(lowerQuery)) {
                    return true;
                }
            }
        }
        
        return false;
    });
}
    
    const isShuffled = sortBy === 'shuffle' && !query && !author && !playlist;

    if (!isShuffled) {
    allTracks.sort((a, b) => {
        let valA, valB;

        switch (sortBy) {
            case 'id':
                valA = parseInt(a.id) || 0;
                valB = parseInt(b.id) || 0;
                break;
            case 'name':
                valA = (a.name || '').toLowerCase();
                valB = (b.name || '').toLowerCase();
                return sortOrder === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
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
                valA = 0;
                valB = 0;
        }

        if (sortOrder === 'asc') {
            return valA - valB;
        } else {
            return valB - valA;
        }
    });
    }
    
    const totalCount = allTracks.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedTracks = allTracks.slice(startIndex, startIndex + perPage);
    
    return {
        tracks: paginatedTracks,
        totalCount,
        totalPages
    };
}

app.get('/db', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 24, 1), 100);
    const type = req.query.type || 'all';
    const query = req.query.q || '';
    const sortBy = req.query.sort || 'shuffle';
    const sortOrder = req.query.order || 'desc';
    
    const authors = req.query.authors || '';
    const ghosts = req.query.ghosts || '';
    
    const { tracks, totalCount, totalPages } = processTrackData({
        type, query, sortBy, sortOrder, page, perPage, authors, ghosts
    });
    
    const renderedHtml = dbTemplate({
        title: type === 'all' ? 'All Tracks' : `${type.toUpperCase()} Tracks`,
        tracks,
        totalCount,
        totalPages,
        page,
        perPage,
        type,
        query,
        sortBy,
        sortOrder
    });
    
    res.status(200).send(renderedHtml);
});

app.get('/api/db', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(Math.max(parseInt(req.query.perPage) || 24, 1), 100);
    const type = req.query.type || 'all';
    const query = req.query.q || '';
    const sortBy = req.query.sort || 'shuffle';
    const sortOrder = req.query.order || 'desc';
    const author = req.query.author || '';
    const playlist = req.query.playlist || '';
    
if (type === 'user') {
    let users = userLinks
        .filter(user => {
            return true;
        })
        .map(user => {
            const authorData = authorIndex.get(user.canonical);
            return {
                type: 'user',
                canonical: user.canonical,
                displayName: user.displayName,
                aliases: user.aliases,
                avatar: `/data/users/avatars/${user.canonical}.png`,
                trackCount: authorData ? authorData.tracks.length : 0,
                platforms: {
                    frhd: !!user.frhdUserId,
                    bhr: !!user.bhrUserId,
                    cr: !!user.crUserId
                }
            };
        });
    
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
    } else {
        users.sort((a, b) => sortOrder === 'asc' ? a.trackCount - b.trackCount : b.trackCount - a.trackCount);
    }
    
    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedUsers = users.slice(startIndex, startIndex + perPage);
    
    return res.json({
        tracks: paginatedUsers,
        pagination: { page, perPage, totalCount, totalPages },
        playlist: null
    });
}
    
    const { tracks, totalCount, totalPages } = processTrackData({
        type, query, sortBy, sortOrder, page, perPage, author, playlist
    });
    
    let playlistInfo = null;
    if (playlist) {
        const p = findPlaylist(playlist);
        if (p) {
            playlistInfo = { id: p.id, name: p.name, icon: p.icon, description: p.description };
        }
    }
    
    res.json({
        tracks: tracks,
        pagination: { page, perPage, totalCount, totalPages },
        playlist: playlistInfo
    });
});

app.get('/api/authors-by-platform', (req, res) => {
    const platform = req.query.platform || 'all';
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 24;
    const query = req.query.q || '';
    const sortBy = req.query.sort || 'shuffle';
    const sortOrder = req.query.order || 'desc';
    
    let users = userLinks
        .filter(user => {
            if (platform === 'all') return true;
            return user[platform] === true;
        })
        .map(user => {
            const authorData = authorIndex.get(user.canonical);
            
            return {
                type: 'user',
                canonical: user.canonical,
                displayName: user.displayName,
                aliases: user.aliases,
                avatar: `/data/users/avatars/${user.canonical}.png`,
                trackCount: authorData ? authorData.tracks.length : 0,
                platforms: {
                    frhd: user.frhd === true,
                    bhr: user.bhr === true,
                    cr: user.cr === true,
                    plus: user.plus === true
                }
            };
        });
    
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
    } else {
        users.sort((a, b) => sortOrder === 'asc' ? a.trackCount - b.trackCount : b.trackCount - a.trackCount);
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

app.get('/api/author/:name', (req, res) => {
    const authorName = req.params.name;
    const normalized = normalizeAuthorName(authorName);
    const authorData = authorIndex.get(normalized);
    
    if (!authorData) {
        return res.status(404).json({ error: 'Author not found' });
    }
    
    res.json({
        displayName: authorData.displayName,
        trackCount: authorData.tracks.length,
        tracks: authorData.tracks
    });
});

app.get('/api/authors', (req, res) => {
    const authors = Array.from(authorIndex.entries()).map(([key, value]) => ({
        id: key,
        displayName: value.displayName,
        trackCount: value.tracks.length
    })).sort((a, b) => b.trackCount - a.trackCount);
    
    res.json({ authors });
});

app.get('/api/user-aliases/:name', (req, res) => {
    const username = req.params.name;
    const userInfo = findUserAliases(username);
    const authorData = authorIndex.get(userInfo.canonical);
    
    res.json({
        canonical: userInfo.canonical,
        displayName: userInfo.displayName,
        aliases: userInfo.aliases,
        platforms: userInfo.platforms,
        trackCount: authorData ? authorData.tracks.length : 0,
        tracks: authorData ? authorData.tracks : []
    });
});

app.get('/api/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 24;
    const query = req.query.q || '';
    
    let users = userLinks.map(user => {
        const authorData = authorIndex.get(user.canonical);
        return {
            canonical: user.canonical,
            displayName: user.displayName,
            aliases: user.aliases,
            avatar: `/data/users/avatars/${user.canonical}.png`,
            trackCount: authorData ? authorData.tracks.length : 0
        };
    });
    
    if (query) {
        const lowerQuery = query.toLowerCase();
        users = users.filter(user => 
            user.displayName.toLowerCase().includes(lowerQuery) ||
            user.canonical.toLowerCase().includes(lowerQuery) ||
            user.aliases.some(a => a.toLowerCase().includes(lowerQuery))
        );
    }
    
    users.sort((a, b) => b.trackCount - a.trackCount);
    
    const totalCount = users.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const paginatedUsers = users.slice(startIndex, startIndex + perPage);
    
    res.json({
        users: paginatedUsers,
        pagination: {
            page,
            perPage,
            totalCount,
            totalPages
        }
    });
});

// Redirect /plus/* to /t/*
app.get('/plus/:id.txt', (req, res) => res.redirect(301, `/t/${req.params.id}.txt`));
app.get('/plus/:id.png', (req, res) => res.redirect(301, `/t/${req.params.id}.png`));
app.get('/plus/:id', (req, res) => {
    const query = req.query.json === 'true' ? '?json=true' : '';
    res.redirect(301, `/t/${req.params.id}${query}`);
});

// Redirect /user/* to /u/*
app.use('/user', (req, res) => {
    const redirectPath = `/u${req.path}`;
    const queryString = req.url.split('?')[1];
    const fullRedirect = queryString ? `${redirectPath}?${queryString}` : redirectPath;
    res.redirect(301, fullRedirect);
});

// Serve user page trackcode directly at /u/:id.txt
app.get('/u/:id.txt', async (req, res) => {
    const userId = req.params.id;
    const sanitizedUserId = sanitizePath(userId);
    
    if (!sanitizedUserId || sanitizedUserId !== userId) {
        return res.status(404).send('Invalid user ID');
    }

    try {
        await initializeUserProfile(userId);
        const trackData = await getUserTrackData(userId);

        if (!trackData || !trackData.code) {
            return res.status(404).send('Track code not found');
        }

        res.type('text/plain').send(trackData.code);
    } catch (error) {
        console.error(`Error fetching user track code for ${userId}:`, error);
        return res.status(500).send('Error fetching track code');
    }
});

// Serve user page thumbnail directly at /u/:id.png
app.get('/u/:id.png', async (req, res) => {
    const userId = req.params.id;
    const sanitizedUserId = sanitizePath(userId);
    
    if (!sanitizedUserId || sanitizedUserId !== userId) {
        return res.status(404).send('Invalid user ID');
    }

    try {
        await initializeUserProfile(userId);
        const trackData = await getUserTrackData(userId);

        if (!trackData || !trackData.thumbnail) {
            const defaultThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', 'default.png');
            return res.sendFile(defaultThumbnailPath);
        }

        if (trackData.thumbnail.startsWith('/data/page/')) {
            const thumbnailPath = path.join(USER_TRACKS_ROOT, trackData.thumbnail.substring('/data/page/'.length));
            
            try {
                await fsPromises.access(thumbnailPath);
                return res.sendFile(thumbnailPath);
            } catch {
                const defaultThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', 'default.png');
                return res.sendFile(defaultThumbnailPath);
            }
        } else {
            const defaultThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', 'default.png');
            return res.sendFile(defaultThumbnailPath);
        }
    } catch (error) {
        console.error(`Error fetching user thumbnail for ${userId}:`, error);
        const defaultThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', 'default.png');
        return res.sendFile(defaultThumbnailPath);
    }
});

// random and daily tracks
function randomTrack(metadata, urlPrefix) {
    return (req, res) => {
        if (metadata.length === 0) {
            return res.status(404).send(`No tracks available`);
        }
        const randomIndex = Math.floor(Math.random() * metadata.length);
        const track = metadata[randomIndex];
        const trackId = track.slug || track.id;
        res.redirect(302, `/${urlPrefix}/${trackId}${req.query.json === 'true' ? '?json=true' : ''}`);
    };
}

function dailyTrack(metadata, urlPrefix) {
    return (req, res) => {
        if (metadata.length === 0) {
            return res.status(404).send(`No tracks available`);
        }
        const seed = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''));
        const track = metadata[seed % metadata.length];
        const trackId = track.slug || track.id;
        res.redirect(302, `/${urlPrefix}/${trackId}${req.query.json === 'true' ? '?json=true' : ''}`);
    };
}

app.get('/cr/random', randomTrack(crMetadata, 'cr'));
app.get('/cr/daily', dailyTrack(crMetadata, 'cr'));
app.get('/bhr/random', randomTrack(bhrMetadata, 'bhr'));
app.get('/bhr/daily', dailyTrack(bhrMetadata, 'bhr'));
app.get('/frhd/random', randomTrack(frhdMetadata, 'frhd'));
app.get('/frhd/daily', dailyTrack(frhdMetadata, 'frhd'));
app.get('/t/random', randomTrack(plusMetadata, 't'));
app.get('/t/daily', dailyTrack(plusMetadata, 't'));

// trackcodes and thumbnails routing
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
            return res.status(404).send('Thumbnail not found');
        }
    };
}

async function frhdTxtFallback(trackId, filePath) {
    const frhdModule = await import('frhdv2');
    const codeResponse = await frhdModule.getTrackCode(trackId, ['code']);
    const code = codeResponse?.track?.code || codeResponse?.code || '';
    if (code) {
        await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
        await fsPromises.writeFile(filePath, code, 'utf8');
        return code;
    }
    return null;
}

async function frhdPngFallback(trackId) {
    const frhdModule = await import('frhdv2');
    const metadata = await frhdModule.getTrackData(trackId, ['img']);
    let thumbnail = metadata?.track?.img || metadata?.img;
    if (thumbnail) {
        return thumbnail.replace(/(\d+x\d+)/, '768x250');
    }
    return null;
}

app.get('/cr/:id.txt', txtRouting(path.join(__dirname, 'data', 'cr', 'trackcodes')));
app.get('/cr/:id.png', pngRouting(path.join(__dirname, 'data', 'cr', 'thumbnails')));
app.get('/bhr/:id.txt', txtRouting(path.join(__dirname, 'data', 'bhr', 'trackcodes')));
app.get('/bhr/:id.png', pngRouting(path.join(__dirname, 'data', 'bhr', 'thumbnails')));
app.get('/frhd/:id.txt', txtRouting(path.join(__dirname, 'data', 'frhd', 'trackcodes'), frhdTxtFallback));
app.get('/frhd/:id.png', pngRouting(path.join(__dirname, 'data', 'frhd', 'thumbnails'), frhdPngFallback));
app.get('/t/:id.txt', txtRouting(path.join(__dirname, 'data', 'plus', 'trackcodes')));
app.get('/t/:id.png', pngRouting(path.join(__dirname, 'data', 'plus', 'thumbnails')));

//txtRouting(path.join(BHR_TRACKCODES_ROOT, `${trackId}.txt`));
//pngRouting(path.join(BHR_THUMBNAILS_ROOT, `${trackId}.png`));

app.get('/frhd/:id', async (req, res) => {
    const frhdModule = await import('frhdv2');
    const getTrackData = frhdModule.getTrackData;
    const getTrackCode = frhdModule.getTrackCode;

    if (!getTrackData || !getTrackCode) {
        return res.status(500).send('Server configuration error');
    }

    const trackId = req.params.id;

    let trackData = {};

    const cacheDir = FRHD_TRACKCODES_ROOT;
    const cacheFilePath = path.join(cacheDir, `${trackId}.txt`);
    let code = '';
    let isCodeCached = false;

    try {
        code = await fsPromises.readFile(cacheFilePath, 'utf8');
        code = code.trim();
        isCodeCached = true;
        console.log(`[FRHD] Track ${trackId} code loaded from cache.`);
    } catch (e) {
        console.log(`[FRHD] Track ${trackId} code not found in cache.`);
    }

    try {
        const metadataFields = ['title', 'author', 'descr', 'img', 'p_ts', 'size'];

        const fetchPromises = [
            getTrackData(trackId, metadataFields)
        ];

        if (!isCodeCached) {
            fetchPromises.push(getTrackCode(trackId, ['code']));
        }

        const [metadataResponse, codeResponse] = await Promise.all(fetchPromises);

        const metadata = metadataResponse?.track || metadataResponse || {};

        if (!isCodeCached && codeResponse) {
            const freshCode = codeResponse?.track?.code || codeResponse?.code || codeResponse || '';
            code = freshCode;

            if (code) {
                try {
                    await fsPromises.mkdir(cacheDir, { recursive: true });
                    await fsPromises.writeFile(cacheFilePath, code, 'utf8');
                    console.log(`[FRHD Cache] Track ${trackId} code successfully cached to ${cacheFilePath}`);
                } catch (writeError) {
                    console.error(`[FRHD Cache] Failed to write track code ${trackId}:`, writeError);
                }
            }
        }

        const rawAuthor = metadata.author || 'Unknown';
        const authorName = typeof rawAuthor === 'object' && rawAuthor !== null
            ? (rawAuthor.name || rawAuthor.username || 'Unknown Author')
            : rawAuthor;

        trackData = {
            pageId: `frhd-${trackId}`,
            id: trackId,
            name: metadata.title || `FRHD Track #${trackId}`,
            authors: authorName,
            code: code,
            type: 'frhd',
            sourceUrl: `/frhd/${trackId}`,
            description: metadata.descr || '',
            published: metadata.p_ts
                ? new Date(metadata.p_ts * 1000).toLocaleDateString()
                : '',
            forumUrl: '',
            size: formatSize(metadata.size || code.length),
            permalink: `https://freerider.app/frhd/${trackId}`
        };

        trackData.ghost = '';
        trackData.ghoster = '';
        trackData.ghostTime = '';
        trackData.ghostTicks = '';

        let specificThumbnailFound = false;
        const localThumbnailPath = path.join(__dirname, 'data', 'frhd', 'thumbnails', `${trackId}.png`);

        try {
            await fsPromises.access(localThumbnailPath);
            trackData.thumbnail = `/data/frhd/thumbnails/${trackId}.png`;
            specificThumbnailFound = true;
        } catch {
            // File not found locally
        }

        if (!specificThumbnailFound) {
            let thumbnail = metadata.img;
            if (thumbnail) {
                thumbnail = thumbnail.replace(/(\d+x\d+)/, '768x250');
            }
            trackData.thumbnail = thumbnail || '/data/bhr/thumbnails/default.png';
        }

        const forumLink = await getForumLinkForTrack('frhd', trackId);
        if (forumLink) {
            trackData.forumUrl = forumLink.forumUrl;
        }

    } catch (error) {
        console.error(`Error fetching FRHD data for ID ${trackId}:`, error);
        trackData = {
            pageId: `frhd-${trackId}`,
            id: trackId,
            name: '',
            authors: '',
            code: '',
            type: 'frhd',
            sourceUrl: `/frhd/${trackId}`,
            thumbnail: '/data/bhr/thumbnails/default.png',
            description: '',
            published: '',
            size: '',
            permalink: `https://freerider.app/frhd/${trackId}`,
            nextId: '',
            prevId: ''
        };
    }

    if (frhdMetadata.length > 0) {
        const currentIndex = frhdMetadata.findIndex(t => t.id === trackId);
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % frhdMetadata.length;
            const prevIndex = (currentIndex - 1 + frhdMetadata.length) % frhdMetadata.length;
            trackData.nextId = frhdMetadata[nextIndex].id;
            trackData.prevId = frhdMetadata[prevIndex].id;
        }
        else {
            const { nextId, prevId } = findClosestIds(frhdMetadata, trackId);
            trackData.nextId = nextId;
            trackData.prevId = prevId;
        }
    }

    if (req.query.json === 'true') {
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            id: trackData.id,
            trackUrl: `/data/frhd/trackcodes/${trackId}.txt`,
            description: trackData.description,
            published: trackData.published,
            size: trackData.size,
            permalink: `https://freerider.app/frhd/${trackId}`,
            nextId: trackData.nextId,
            prevId: trackData.prevId
        });
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'frhd',
        track: trackData
    });

    res.status(200).send(renderedHtml);
});

function createTrackHandler(type, urlPrefix, metadata, getTrackDataFn, thumbnailRoot) {
    return async (req, res) => {
        const trackId = req.params.id;
        const numericId = parseInt(trackId, 10);
        const isNumeric = !isNaN(numericId) && numericId > 0;

        const linked = findLinkedTracks(type, isNumeric ? numericId : trackId);
        if (linked) {
            const typePriority = ['cr', 'bhr', 'frhd', 'plus'];
            const typeIndex = typePriority.indexOf(type);
            
            for (let i = 0; i < typeIndex; i++) {
                const earlier = linked.tracks.find(t => t.type === typePriority[i]);
                if (earlier) {
                    const earlierUrlPrefix = earlier.type === 'plus' ? 't' : earlier.type;
                    const redirectUrl = `/${earlierUrlPrefix}/${earlier.id}${req.query.json === 'true' ? '?json=true' : ''}`;
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
            thumbnail: '/data/bhr/thumbnails/default.png',
            permalink: `https://freerider.app/${urlPrefix}/${trackId}`
        };

        try {
            const fetchedData = await getTrackDataFn(trackId);

            if (fetchedData) {
                trackData = {
                    ...trackData,
                    ...fetchedData,
                    pageId: `${type}-${trackId}`,
                    type: type,
                    sourceUrl: `/${urlPrefix}/${trackId}`,
                    permalink: `https://freerider.app/${urlPrefix}/${trackId}`
                };

                const meta = isNumeric 
                    ? metadata.find(t => t.id === numericId)
                    : metadata.find(t => t.id === trackId || t.slug === trackId);
                    
                if (meta) {
                    trackData.description = meta.description || '';
                    trackData.size = meta.size 
                        ? formatSize(parseInt(meta.size, 10)) 
                        : formatSize(trackData.code?.length || 0);
                    trackData.published = meta.published_at
                        ? new Date(meta.published_at).toLocaleDateString()
                        : '';
                }

                const localThumbnailPath = path.join(thumbnailRoot, `${trackId}.png`);
                try {
                    await fsPromises.access(localThumbnailPath);
                    trackData.thumbnail = `/data/${type}/thumbnails/${trackId}.png`;
                } catch {
                    trackData.thumbnail = meta?.thumbnail_url || '/data/bhr/thumbnails/default.png';
                }

                const forumLink = await getForumLinkForTrack(type, trackId);
                if (forumLink) {
                    trackData.forumUrl = forumLink.forumUrl;
                }
            }
        } catch (error) {
            console.error(`${type.toUpperCase()} track ${trackId} error`, error);
            trackData.name = `${type.toUpperCase()} track #${trackId} error`;
        }

        if (metadata.length > 0) {
            const currentIndex = metadata.findIndex(t => 
                (isNumeric && t.id === numericId) || t.slug === trackId
            );
            if (currentIndex !== -1) {
                const nextIndex = (currentIndex + 1) % metadata.length;
                const prevIndex = (currentIndex - 1 + metadata.length) % metadata.length;
                trackData.nextId = metadata[nextIndex].slug || metadata[nextIndex].id;
                trackData.prevId = metadata[prevIndex].slug || metadata[prevIndex].id;
            }
        }

        if (req.query.json === 'true') {
            return res.json({
                name: trackData.name,
                authors: trackData.authors,
                thumbnail: trackData.thumbnail,
                type: trackData.type,
                id: trackData.id,
                trackUrl: `/data/${type === 'plus' ? 'plus' : type}/trackcodes/${trackId}.txt`,
                description: trackData.description,
                published: trackData.published,
                size: trackData.size,
                permalink: trackData.permalink,
                nextId: trackData.nextId,
                prevId: trackData.prevId
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

app.get('/bhr/:id', createTrackHandler('bhr', 'bhr', bhrMetadata, getBhrTrackData, path.join(__dirname, 'data', 'bhr', 'thumbnails')));
app.get('/cr/:id', createTrackHandler('cr', 'cr', crMetadata, getCrTrackData, path.join(__dirname, 'data', 'cr', 'thumbnails')));
app.get('/t/:id', createTrackHandler('plus', 't', plusMetadata, getPlusTrackData, path.join(__dirname, 'data', 'plus', 'thumbnails')));

app.get('/api/live-sessions', (req, res) => {
    const sessions = {};
    for (const [trackId, players] of liveSessions) {
        if (players.size > 0) {
            sessions[trackId] = players.size;
        }
    }
    res.json(sessions);
});

async function startServer() {

    setupLiveRacing(server);

    server.listen(PORT, () => {
        console.log(`Server with Live Rider running on http://localhost:${PORT}`);
        console.log(`WebSocket server running on ws://localhost:${PORT}`);
        console.log('Test paths:');
        console.log(`- http://localhost:${PORT}/frhd/977281`);
        console.log(`- http://localhost:${PORT}/bhr/10309`);
    });
}

startServer();