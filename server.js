const express = require('express');
const app = express();
app.set('view cache', false);
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

const PORT = 3000;
const MAX_ID = 1500000;
const CR_MAX_ID = 1470321;
const FRHD_MAX_ID = 1015000;
const PAGE_METADATA_FILE = 'page.json';
// persistent disk mount
const PERSISTENT_ROOT_DISK = '/var/data'; 

// cr trackcodes / thumbnails location on disk
const CR_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'cr', 'trackcodes'); 
const CR_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'cr', 'thumbnails'); 

const FRHD_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'frhd', 'trackcodes'); 
//const FRHD_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'frhd', 'thumbnails'); 

const FORUM_LINKS_PATH = path.join(PERSISTENT_ROOT_DISK, 'forum-links.json');

app.use('/data/frhd/trackcodes', express.static(FRHD_TRACKCODES_ROOT));

// user uploaded pages path
const USER_TRACKS_ROOT = '/var/data/page'; 

app.use(express.static(path.join(__dirname, '/')));
app.use('/data/page', express.static(USER_TRACKS_ROOT));
app.use('/data/cr/trackcodes', express.static(CR_TRACKCODES_ROOT)); // maps /var/data/cr/trackcodes to the public URL /data/cr/trackcodes
app.use('/data/cr/thumbnails', express.static(CR_THUMBNAILS_ROOT));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://forum.freerider.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

const trackTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/track.ejs'), 'utf8'));
const discussTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/discuss.ejs'), 'utf8'));

let bhrMetadata = [];
const BHR_METADATA_PATH = path.join(__dirname, 'data', 'bhr', 'tracks.csv');

let crMetadata = [];
const CR_METADATA_PATH = path.join(__dirname, 'data', 'cr', 'tracks.csv');

let frhdMetadata = [];
const FRHD_METADATA_PATH = path.join(__dirname, 'data', 'frhd', 'tracks.csv');

function loadBhrMetadata() {
    try {
        console.log(`bhr - loading metadata from: ${BHR_METADATA_PATH}`);
        const csvContent = fs.readFileSync(BHR_METADATA_PATH, 'utf8').trim();
        
        const lines = csvContent.split('\n');
        if (lines.length < 2) {
            console.warn('bhr - metadata CSV file is empty or missing header.');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1);
        
        const parsedData = dataRows.map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
            
            if (values.length !== headers.length) {
                console.warn(`bhr - skipping line due to column mismatch: ${line}`);
                return null;
            }

            const track = {};
            headers.forEach((header, index) => {
                const value = (header === 'id' || header === 'upvotes' || header === 'downvotes' || header === 'favorites')
                    ? parseInt(values[index], 10)
                    : values[index];
                track[header] = value;
            });
            return track;
        }).filter(t => t !== null);

        bhrMetadata = parsedData;
        console.log(`bhr - successfully loaded ${bhrMetadata.length} tracks.`);
        
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`bhr - metadata file not found at ${BHR_METADATA_PATH}. Using empty array.`);
        } else {
            console.error('bhr - failed to load or parse BHR metadata CSV:', e.message);
        }
        bhrMetadata = [];
    }
}

loadBhrMetadata();

function loadCrMetadata() {
    try {
        console.log(`bhr - loading metadata from: ${CR_METADATA_PATH}`);
        const csvContent = fs.readFileSync(CR_METADATA_PATH, 'utf8').trim();
        
        const lines = csvContent.split('\n');
        if (lines.length < 2) {
            console.warn('cr - metadata CSV file is empty or missing header.');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1);
        
        const parsedData = dataRows.map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
            
            if (values.length !== headers.length) {
                console.warn(`cr - skipping line due to column mismatch: ${line}`);
                return null;
            }

            const track = {};
            headers.forEach((header, index) => {
                const value = (header === 'id' || header === 'upvotes' || header === 'downvotes' || header === 'favorites')
                    ? parseInt(values[index], 10)
                    : values[index];
                track[header] = value;
            });
            return track;
        }).filter(t => t !== null);

        crMetadata = parsedData;
        console.log(`cr - successfully loaded ${crMetadata.length} tracks.`);
        
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`cr - metadata file not found at ${CR_METADATA_PATH}. Using empty array.`);
        } else {
            console.error('cr - failed to load or parse CR metadata CSV:', e.message);
        }
        crMetadata = [];
    }
}

loadCrMetadata();

function loadFrhdMetadata() {
    try {
        console.log(`frhd - loading metadata from: ${FRHD_METADATA_PATH}`);
        const csvContent = fs.readFileSync(FRHD_METADATA_PATH, 'utf8').trim();
        
        const lines = csvContent.split('\n');
        if (lines.length < 2) {
            console.warn('frhd - metadata CSV file is empty or missing header.');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1);
        
        const parsedData = dataRows.map(line => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
            
            if (values.length !== headers.length) {
                console.warn(`frhd - skipping line due to column mismatch: ${line}`);
                return null;
            }

            const track = {};
            headers.forEach((header, index) => {
                const value = (header === 'id' || header === 'upvotes' || header === 'downvotes' || header === 'favorites')
                    ? parseInt(values[index], 10)
                    : values[index];
                track[header] = value;
            });
            return track;
        }).filter(t => t !== null);

        frhdMetadata = parsedData;
        console.log(`frhd - successfully loaded ${frhdMetadata.length} tracks.`);
        
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`frhd - metadata file not found at ${FRHD_METADATA_PATH}. Using empty array.`);
        } else {
            console.error('frhd - failed to load or parse FRHD metadata CSV:', e.message);
        }
        frhdMetadata = [];
    }
}

loadFrhdMetadata();

const validateId = (id) => {
    const trackId = parseInt(id, 10);
    if (isNaN(trackId) || trackId < 1 || trackId > MAX_ID) {
        return { isValid: false, id: null };
    }
    return { isValid: true, id: trackId };
};

function formatSize(bytes) {
    if (bytes === null || bytes === undefined || bytes === 0 || isNaN(bytes)) { return ''; }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function loadForumLinks() {
    try {
        const data = await fsPromises.readFile(FORUM_LINKS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return [];
        }
        console.error('Error loading forum links:', e);
        return [];
    }
}

async function saveForumLinks(links) {
    try {
        await fsPromises.writeFile(FORUM_LINKS_PATH, JSON.stringify(links, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving forum links:', e);
        throw e;
    }
}

app.post('/api/forum-link', async (req, res) => {
    try {
        const { trackUrl, forumUrl, submittedBy } = req.body;
        
        if (!trackUrl || !forumUrl) {
            return res.status(400).json({ 
                error: 'Missing required fields: trackUrl and forumUrl' 
            });
        }
        
        const trackMatch = trackUrl.match(/^\/(frhd|bhr|cr|u)\/(.+?)(?:\/(.+))?$/);
        if (!trackMatch) {
            return res.status(400).json({ 
                error: 'Invalid track URL format. Expected: /frhd/123 or /frhd/123/username or /bhr/456 or /cr/789 or /u/username or /u/username/trackslug' 
            });
        }
        
        if (!forumUrl.startsWith('https://forum.freerider.app/')) {
            return res.status(400).json({ 
                error: 'Invalid forum URL. Must start with https://forum.freerider.app/' 
            });
        }
        
        const trackType = trackMatch[1];
        const trackId = trackMatch[2];
        const thirdSegment = trackMatch[3]; // Could be ghostUser for frhd or trackSlug for u
        
        const links = await loadForumLinks();
        
        const existingIndex = links.findIndex(
            link => link.trackUrl === trackUrl
        );
        
        let linkData = {
            trackUrl,
            trackType,
            trackId,
            forumUrl,
            submittedBy: submittedBy || '',
            createdAt: existingIndex >= 0 ? links[existingIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (trackType === 'u') {
            linkData.userId = trackId;
            linkData.trackSlug = thirdSegment || null;
        } else if (trackType === 'frhd' || trackType === 'bhr' || trackType === 'cr') {
            linkData.ghostUser = thirdSegment || null;
        }
        
        if (existingIndex >= 0) {
            links[existingIndex] = linkData;
        } else {
            links.push(linkData);
        }
        
        await saveForumLinks(links);
        
        res.status(200).json({ 
            success: true,
            link: linkData
        });
        
    } catch (err) {
        console.error('Error creating/updating forum link:', err);
        res.status(500).json({ 
            error: `Internal Server Error: ${err.message}` 
        });
    }
});

// GET /api/forum-link/:type/:id/:user - for ghost URLs
app.get('/api/forum-link/:type/:id/:user', async (req, res) => {
    try {
        const { type, id, user } = req.params;
        
        if (!['frhd', 'bhr', 'cr', 'u'].includes(type)) {
            return res.status(400).json({ 
                error: 'Invalid track type. Must be frhd, bhr, cr, or u' 
            });
        }
        
        const trackUrl = `/${type}/${id}/${user}`;
        const links = await loadForumLinks();
        
        const link = links.find(l => l.trackUrl === trackUrl);
        
        if (!link) {
            return res.status(404).json({ 
                error: 'No forum link found for this track' 
            });
        }
        
        res.status(200).json(link);
        
    } catch (err) {
        console.error('Error fetching forum link:', err);
        res.status(500).json({ 
            error: `Internal Server Error: ${err.message}` 
        });
    }
});

// GET /api/forum-link/:type/:id
app.get('/api/forum-link/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        
        if (!['frhd', 'bhr', 'cr', 'u'].includes(type)) {
            return res.status(400).json({ 
                error: 'Invalid track type. Must be frhd, bhr, cr, or u' 
            });
        }
        
        const trackUrl = `/${type}/${id}`;
        const links = await loadForumLinks();
        
        const link = links.find(l => l.trackUrl === trackUrl);
        
        if (!link) {
            return res.status(404).json({ 
                error: 'No forum link found for this track' 
            });
        }
        
        res.status(200).json(link);
        
    } catch (err) {
        console.error('Error fetching forum link:', err);
        res.status(500).json({ 
            error: `Internal Server Error: ${err.message}` 
        });
    }
});

// GET /api/forum-links
app.get('/api/forum-links', async (req, res) => {
    try {
        const links = await loadForumLinks();
        res.status(200).json({ 
            links,
            count: links.length 
        });
    } catch (err) {
        console.error('Error fetching forum links:', err);
        res.status(500).json({ 
            error: `Internal Server Error: ${err.message}` 
        });
    }
});

// DELETE /api/forum-link/:type/:id - Delete a forum link
/*
app.delete('/api/forum-link/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const trackUrl = `/${type}/${id}`;
        
        const links = await loadForumLinks();
        const filteredLinks = links.filter(l => l.trackUrl !== trackUrl);
        
        if (links.length === filteredLinks.length) {
            return res.status(404).json({ 
                error: 'No forum link found for this track' 
            });
        }
        
        await saveForumLinks(filteredLinks);
        
        res.status(200).json({ 
            success: true,
            message: 'Forum link deleted successfully' 
        });
        
    } catch (err) {
        console.error('Error deleting forum link:', err);
        res.status(500).json({ 
            error: `Internal Server Error: ${err.message}` 
        });
    }
});
*/

// helper function to get forum link for track metadata
async function getForumLinkForTrack(trackType, trackId, thirdParam = null) {
    const links = await loadForumLinks();
    const trackUrl = thirdParam ? `/${trackType}/${trackId}/${thirdParam}` : `/${trackType}/${trackId}`;
    return links.find(l => l.trackUrl === trackUrl);
}

async function getBhrTrackData(trackId) {
    // look up metadata
    const metadata = bhrMetadata.find(t => t.id === trackId);

    if (!metadata) {
        console.log(`[BHR] Metadata not found for ID ${trackId}.`);
        return null;
    }

    // fetch trackcode
    const codePath = path.join(__dirname, 'data', 'bhr', 'trackcodes', `${trackId}.txt`);
    let trackCode = '';
    
    try {
        trackCode = fs.readFileSync(codePath, 'utf8').trim();
    } catch (e) {
        console.error(`[BHR] Failed to read track code file ${codePath}. Track may be invalid or file missing.`);
    }

    // format object
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
    
    // calculate track size
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
    const metadata = crMetadata.find(t => t.id === trackId);

    if (!metadata) {
        console.log(`[CR] Metadata not found for ID ${trackId}.`);
        return null;
    }

    const codePath = path.join(CR_TRACKCODES_ROOT, `${trackId}.txt`);
    
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

function sanitizePath(inputPath) {
    if (!inputPath) return '';
    let cleanPath = path.normalize(inputPath).replace(/^(\.\.(\/|\\|$))+/, '');
    cleanPath = cleanPath.replace(/^(\/|\\)|(\/|\\)$/g, '');
    return cleanPath;
}

async function getUserTrackData(userId) {
    const sanitizedUserId = sanitizePath(userId);
    
    if (!sanitizedUserId || sanitizedUserId !== userId) {
        return null;
    }

    const globalMetadataPath = path.join(USER_TRACKS_ROOT, PAGE_METADATA_FILE);
    let tracks = [];
    try {
        const data = await fsPromises.readFile(globalMetadataPath, 'utf8');
        tracks = JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`[Global Lookup] Global metadata file NOT FOUND at ${globalMetadataPath}.`);
        } else {
            console.error(`[Global Lookup] Error loading or parsing metadata:`, e);
        }
        return null;
    }
    
    const metadata = tracks.find(t => t.slug === sanitizedUserId);

    if (!metadata) {
        console.log(`[Global Lookup] Slug '${sanitizedUserId}' not found in global metadata.`);
        return null;
    }

    if (!metadata.trackUrl) {
        console.error(`[Global Lookup] Metadata for '${sanitizedUserId}' is missing trackUrl.`);
        return null;
    }
    
    const urlPrefix = '/data/page/';
    if (!metadata.trackUrl.startsWith(urlPrefix)) {
        console.error(`[Global Lookup] trackUrl has unexpected format: ${metadata.trackUrl}`);
        return null;
    }
    
    const relativeTrackPath = metadata.trackUrl.substring(urlPrefix.length);
    const trackFilePath = path.join(USER_TRACKS_ROOT, relativeTrackPath);
    
    let trackCode = '';

    try {
        trackCode = await fsPromises.readFile(trackFilePath, 'utf8');
    } catch (e) {
        console.error(`[Global Lookup] Error reading track file for ${sanitizedUserId} at path ${trackFilePath}:`, e);
    }
    
    return {
        id: sanitizedUserId,
        name: metadata.name,
        authors: metadata.authors,
        code: trackCode.trim(),
        type: 'user',
        size: formatSize(trackCode.length),
        description: metadata.description || '',
        published: metadata.uploaded_at ? new Date(metadata.uploaded_at).toLocaleDateString() : '',
        thumbnail: metadata.imageUrl || '/data/bhr/thumbnails/default.png',
        sourceUrl: metadata.trackUrl
    };
}

async function getPageTrackData(userId, trackSlug) {
    const sanitizedUserId = sanitizePath(userId);
    
    if (!sanitizedUserId || sanitizedUserId !== userId) {
        return null;
    }

    const globalMetadataPath = path.join(USER_TRACKS_ROOT, sanitizedUserId, PAGE_METADATA_FILE);
    let tracks = [];
    try {
        const data = await fsPromises.readFile(globalMetadataPath, 'utf8');
        tracks = JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error(`[Global Lookup] Global metadata file NOT FOUND at ${globalMetadataPath}.`);
        } else {
             console.error(`[Global Lookup] Error loading or parsing metadata:`, e);
        }
        return null;
    }
    
    const metadata = tracks.find(t => t.slug === trackSlug);

    if (!metadata) {
        console.log(`[Global Lookup] Slug '${sanitizedUserId}' not found in global metadata.`);
        return null;
    }
    
    const trackFilePath = path.join(USER_TRACKS_ROOT, sanitizedUserId, `${trackSlug}.txt`);
    let trackCode = '';

    try {
        trackCode = await fsPromises.readFile(trackFilePath, 'utf8');
    } catch (e) {
        console.error(`[Global Lookup] Error reading track file for ${sanitizedUserId}:`, e);
    }
    
    return {
        id: sanitizedUserId,
        name: metadata.name,
        authors: metadata.authors,
        code: trackCode.trim(),
        type: 'page',
        size: formatSize(trackCode.length),
        description: metadata.description || '',
        published: metadata.uploaded_at ? new Date(metadata.uploaded_at).toLocaleDateString() : '',
        thumbnail: metadata.imageUrl || '/data/bhr/thumbnails/default.png',
        sourceUrl: metadata.trackUrl,
        pageName: metadata.name,
        permalink: metadata.permalink
    };
}

async function loadUserTracks(sanitizedPagePath) {
    const metadataPath = path.join(USER_TRACKS_ROOT, sanitizedPagePath, PAGE_METADATA_FILE);
    try {
        const data = await fsPromises.readFile(metadataPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return [];
        }
        console.error(`Error loading user track metadata for ${sanitizedPagePath}:`, e);
        return [];
    }
}

async function saveUserTracks(sanitizedPagePath, tracks) {
    const metadataPath = path.join(USER_TRACKS_ROOT, sanitizedPagePath, PAGE_METADATA_FILE);
    try {
        const targetDir = path.join(USER_TRACKS_ROOT, sanitizedPagePath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        await fsPromises.writeFile(metadataPath, JSON.stringify(tracks, null, 2), 'utf8');
    } catch (e) {
        console.error(`Error saving user track metadata for ${sanitizedPagePath}:`, e);
    }
}

const GLOBAL_METADATA_PATH = path.join(USER_TRACKS_ROOT, PAGE_METADATA_FILE);

async function loadGlobalTrackData() {
    try {
        const data = await fsPromises.readFile(GLOBAL_METADATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT' || e instanceof SyntaxError) {
            return [];
        }
        throw e;
    }
}

async function saveGlobalTrackData(data) {
    await fsPromises.writeFile(GLOBAL_METADATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

async function ensurePersistentRootExists() {
    try {
        await fsPromises.mkdir(USER_TRACKS_ROOT, { recursive: true });
        console.log(`[Init] Ensured persistent root directory exists: ${USER_TRACKS_ROOT}`);
    } catch (e) {
        if (e.code !== 'EEXIST') {
            console.error(`ERROR: Could not create persistent root directory ${USER_TRACKS_ROOT}: ${e.message}`);
            throw e; 
        }
    }
}

app.use(express.static(path.join(__dirname, '/')));

async function initializeUserProfile(userId) {
    const sanitizedUserId = sanitizePath(userId);
    if (!sanitizedUserId || sanitizedUserId !== userId) {
        console.error(`[Init Profile] Sanitization failed for userId: ${userId}`);
        return false;
    }

    const globalData = await loadGlobalTrackData();
    const existingEntry = globalData.find(t => t.slug === sanitizedUserId);

    if (existingEntry) {
        return true;
    }

    console.log(`[Init Profile] Creating initial profile entry for '${userId}'.`);
    
    const newProfileData = {
        slug: userId,
        name: userId,
        authors: userId, 
        trackUrl: `/data/page/${userId}/page.txt`,
        imageUrl: `/data/page/${userId}/page.png`,
        metadata: {
            description: `The personal gallery page for user ${userId}.`
        },
        uploaded_at: new Date().toISOString()
    };
    
    try {
        globalData.push(newProfileData);
        await saveGlobalTrackData(globalData);

        const targetDir = path.join(USER_TRACKS_ROOT, sanitizedUserId);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        const rootFilePath = path.join(targetDir, 'page.txt');
        if (!fs.existsSync(rootFilePath)) {
            fs.writeFileSync(rootFilePath, '...');
        }

        console.log(`[Init Profile] Successfully created initial profile entry for '${userId}'.`);
        return true;
    } catch (err) {
        console.error(`[Init Profile] Error initializing profile data: ${err.message}`);
        return false;
    }
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

app.get('/frhd/:id/:user', async (req, res) => {
    const frhdModule = await import('frhdv2');
    const { getTrackData, getTrackCode, getRace } = frhdModule;

    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    if (!getTrackData || !getTrackCode || !getRace) {
        console.error('Server configuration error: Missing required FRHD API functions.');
        return res.status(500).send('Server configuration error');
    }

    const userIdOrName = req.params.user;
    const isDiscussMode = req.query.discuss === 'true';
    const isJsonMode = req.query.json === 'true';
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
            getTrackData(trackId, metadataFields),
        ];

        if (!isCodeCached) {
            fetchPromises.push(getTrackCode(trackId, ['code']));
        }

        fetchPromises.push(getRace(trackId, userIdOrName));

        const resolvedResponses = await Promise.all(fetchPromises);

        const metadataResponse = resolvedResponses[0];
        const codeResponse = isCodeCached ? null : resolvedResponses[1];
        const raceResponse = resolvedResponses[resolvedResponses.length - 1];

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

        if (raceResponse) {
            const raceObject = raceResponse;

            const ghostData = {
                code: raceObject.data,
                vehicle: raceObject.vehicle,
                desktop: raceObject.platform === 'desktop',
                run_ticks: raceObject.runTicks,
                tas: raceObject.data.tas || false
            };

            trackData.ghost = ghostData;
            trackData.ghoster = raceObject.user.displayName || raceObject.user.username;
            trackData.ghostTime = raceObject.runTime;
            trackData.ghostTicks = raceObject.runTicks;
            trackData.tas = raceObject.data.tas || false;

            const fullData = {
                user: raceObject.user,
                ghost: ghostData
            };

            trackData.fullRaceData = JSON.stringify(fullData);
        }

        const rawAuthor = metadata.author || 'Unknown';
        const authorName = typeof rawAuthor === 'object' && rawAuthor !== null
            ? (rawAuthor.name || rawAuthor.username || 'Unknown Author')
            : rawAuthor;

        trackData = {
            ...trackData,
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
            permalink: `https://freerider.app/frhd/${trackId}/${userIdOrName}`
        };

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

        const forumLink = await getForumLinkForTrack('frhd', trackId, userIdOrName);
        if (forumLink) {
            trackData.forumUrl = forumLink.forumUrl;
        }

    } catch (error) {
        console.error(`Error fetching FRHD data for ID ${trackId} and user ${userIdOrName}:`, error);
        trackData = {
            ...trackData,
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
            permalink: `https://freerider.app/frhd/${trackId}/${userIdOrName}`,
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
            permalink: `https://freerider.app/frhd/${trackId}/${userIdOrName}`,
            nextId: trackData.nextId,
            prevId: trackData.prevId,
            ghost: trackData.ghost || null,
            ghoster: trackData.ghoster || null,
            ghostTime: trackData.ghostTime || null,
            ghostTicks: trackData.ghostTicks || null,
            tas: trackData.tas || false
        });
    }

    if (isDiscussMode) {
        const renderedHtml = discussTemplate({
            track: trackData
        });
        return res.status(200).send(renderedHtml);
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'frhd',
        track: trackData
    });

    res.status(200).send(renderedHtml);
});


app.get('/frhd/random', (req, res) => {
    if (frhdMetadata.length === 0) {
        return res.status(404).send('No FRHD tracks available');
    }
    const randomIndex = Math.floor(Math.random() * frhdMetadata.length);
    const randomId = frhdMetadata[randomIndex].id;

    if (req.query.json === 'true') {
        return res.redirect(302, `/frhd/${randomId}?json=true`);
    }
    res.redirect(302, `/frhd/${randomId}`);
});

app.get('/frhd/daily', (req, res) => {
    if (frhdMetadata.length === 0) {
        return res.status(404).send('No FRHD tracks available');
    }
    const today = new Date();
    const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(dateString);
    const dailyIndex = seed % frhdMetadata.length;
    const dailyId = frhdMetadata[dailyIndex].id;

    if (req.query.json === 'true') {
        return res.redirect(302, `/frhd/${dailyId}?json=true`);
    }

    res.redirect(302, `/frhd/${dailyId}`);
});

app.get('/bhr/random', (req, res) => {
    if (bhrMetadata.length === 0) {
        return res.status(404).send('No BHR tracks available');
    }
    const randomIndex = Math.floor(Math.random() * bhrMetadata.length);
    const randomId = bhrMetadata[randomIndex].id;

    if (req.query.json === 'true') {
        return res.redirect(302, `/bhr/${randomId}?json=true`);
    }

    res.redirect(302, `/bhr/${randomId}`);
});

app.get('/bhr/daily', (req, res) => {
    if (bhrMetadata.length === 0) {
        return res.status(404).send('No BHR tracks available');
    }
    const today = new Date();
    const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(dateString);
    const dailyIndex = seed % bhrMetadata.length;
    const dailyId = bhrMetadata[dailyIndex].id;

    if (req.query.json === 'true') {
        return res.redirect(302, `/bhr/${dailyId}?json=true`);
    }

    res.redirect(302, `/bhr/${dailyId}`);
});

app.get('/cr/random', (req, res) => {
    if (crMetadata.length === 0) {
        return res.status(404).send('No CR tracks available');
    }
    const randomIndex = Math.floor(Math.random() * crMetadata.length);
    const randomId = crMetadata[randomIndex].id;

    if (req.query.json === 'true') {
        return res.redirect(302, `/cr/${randomId}?json=true`);
    }

    res.redirect(302, `/cr/${randomId}`);
});

app.get('/cr/daily', (req, res) => {
    if (crMetadata.length === 0) {
        return res.status(404).send('No CR tracks available');
    }
    const today = new Date();
    const dateString = today.toISOString().split('T')[0].replace(/-/g, '');
    const seed = parseInt(dateString);
    const dailyIndex = seed % crMetadata.length;
    const dailyId = crMetadata[dailyIndex].id;

    if (req.query.json === 'true') {
        return res.redirect(302, `/cr/${dailyId}?json=true`);
    }

    res.redirect(302, `/cr/${dailyId}`);
});

// Serve FRHD thumbnails directly at /frhd/:id.png
app.get('/frhd/:id.png', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    // Try local thumbnail first
    const localThumbnailPath = path.join(__dirname, 'data', 'frhd', 'thumbnails', `${trackId}.png`);
    
    try {
        await fsPromises.access(localThumbnailPath);
        return res.sendFile(localThumbnailPath);
    } catch {
        // If not found locally, fetch metadata and get CDN URL
        try {
            const frhdModule = await import('frhdv2');
            const getTrackData = frhdModule.getTrackData;
            
            const metadataResponse = await getTrackData(trackId, ['img']);
            const metadata = metadataResponse?.track || metadataResponse || {};
            
            let thumbnail = metadata.img;
            if (thumbnail) {
                // Replace dimensions with 768x250
                thumbnail = thumbnail.replace(/(\d+x\d+)/, '768x250');
                return res.redirect(302, thumbnail);
            }
        } catch (error) {
            console.error(`Error fetching FRHD thumbnail metadata for ${trackId}:`, error);
        }
        
        // Fallback to default thumbnail
        const defaultThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', 'default.png');
        return res.sendFile(defaultThumbnailPath);
    }
});

// Serve FRHD trackcode directly at /frhd/:id.txt
app.get('/frhd/:id.txt', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const codeFilePath = path.join(FRHD_TRACKCODES_ROOT, `${trackId}.txt`);
    
    try {
        const code = await fsPromises.readFile(codeFilePath, 'utf8');
        return res.type('text/plain').send(code);
    } catch {
        try {
            const frhdModule = await import('frhdv2');
            const getTrackCode = frhdModule.getTrackCode;
            
            const codeResponse = await getTrackCode(trackId, ['code']);
            const code = codeResponse?.track?.code || codeResponse?.code || codeResponse || '';
            
            if (code) {
                try {
                    await fsPromises.mkdir(FRHD_TRACKCODES_ROOT, { recursive: true });
                    await fsPromises.writeFile(codeFilePath, code, 'utf8');
                    console.log(`[FRHD Cache] Track ${trackId} code successfully cached to ${codeFilePath}`);
                } catch (writeError) {
                    console.error(`[FRHD Cache] Failed to write track code ${trackId}:`, writeError);
                }
                
                return res.type('text/plain').send(code);
            } else {
                return res.status(404).send('Track code not found');
            }
        } catch (error) {
            console.error(`Error fetching FRHD track code for ${trackId}:`, error);
            return res.status(500).send('Error fetching track code');
        }
    }
});

// Serve BHR thumbnails directly at /bhr/:id.png
app.get('/bhr/:id.png', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const localThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', `${trackId}.png`);
    
    try {
        await fsPromises.access(localThumbnailPath);
        return res.sendFile(localThumbnailPath);
    } catch {
        return res.status(404).send('Thumbnail not found');
    }
});

// Serve BHR trackcode directly at /bhr/:id.txt
app.get('/bhr/:id.txt', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const codeFilePath = path.join(__dirname, 'data', 'bhr', 'trackcodes', `${trackId}.txt`);
    
    try {
        const code = await fsPromises.readFile(codeFilePath, 'utf8');
        res.type('text/plain').send(code);
    } catch {
        return res.status(404).send('Track code not found');
    }
});

// Serve CR thumbnails directly at /cr/:id.png
app.get('/cr/:id.png', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const localThumbnailPath = path.join(CR_THUMBNAILS_ROOT, `${trackId}.png`);
    
    try {
        await fsPromises.access(localThumbnailPath);
        return res.sendFile(localThumbnailPath);
    } catch {
        return res.status(404).send('Thumbnail not found');
    }
});

// Serve CR trackcode directly at /cr/:id.txt
app.get('/cr/:id.txt', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const codeFilePath = path.join(CR_TRACKCODES_ROOT, `${trackId}.txt`);
    
    try {
        const code = await fsPromises.readFile(codeFilePath, 'utf8');
        res.type('text/plain').send(code);
    } catch {
        return res.status(404).send('Track code not found');
    }
});

// Simplified /discuss.html - only handles default page and user galleries
app.get('/discuss.html', async (req, res) => {
    const { id: rawId } = req.query;
    
    if (!rawId) {
        return res.sendFile(path.join(__dirname, 'templates', 'discuss.html'));
    }

    const parts = rawId.split('-');
    
    // Handle old format with type prefix
    if (parts.length > 1 && ['frhd', 'bhr', 'cr'].includes(parts[0].toLowerCase())) {
        const type = parts[0].toLowerCase();
        const id = parts.slice(1).join('-');
        return res.redirect(301, `/${type}/${id}?discuss=true`);
    }
    const { id: userId } = req.query;
    
    // Case 1: No ID = default discussion landing page
    if (!userId) {
        return res.sendFile(path.join(__dirname, 'templates', 'discuss.html'));
    }

    // Case 2: User gallery discussion
    await initializeUserProfile(userId);
    const fetchedData = await getUserTrackData(userId);

    let trackData = {
        pageId: userId,
        id: userId,
        type: 'u',
        name: `${fetchedData?.name || userId} gallery`,
        authors: fetchedData?.authors || userId,
        description: fetchedData?.description || '',
        published: fetchedData?.published || '',
        size: fetchedData?.size || '',
        thumbnail: fetchedData?.thumbnail || '/data/bhr/thumbnails/default.png',
        sourceUrl: `/u/${userId}`
    };

    // Render the discussion template
    const renderedHtml = discussTemplate({
        track: trackData
    });

    res.status(200).send(renderedHtml);
});

app.get('/cr/:id', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const isDiscussMode = req.query.discuss === 'true';
    const isJsonMode = req.query.json === 'true';
    let trackData = {
        id: trackId,
        name: `CR Track #${trackId}`,
        authors: 'Unknown',
        code: '',
        type: 'cr',
        description: '',
        published: '',
        size: '',
        forumUrl: '',
        thumbnail: '/data/bhr/thumbnails/default.png',
        permalink: `https://freerider.app/cr/${trackId}`
    };

    try {
        const fetchedData = await getCrTrackData(trackId);

        if (fetchedData) {
            trackData = {
                ...fetchedData,
                pageId: `cr-${trackId}`,
                type: 'cr',
                sourceUrl: `/cr/${trackId}`,
                permalink: `https://freerider.app/cr/${trackId}`
            };

            const metadata = crMetadata.find(t => t.id === trackId);
            if (metadata) {
                trackData.description = metadata.description || '';
                trackData.size = metadata.size ? formatSize(parseInt(metadata.size, 10)) : formatSize(trackData.code.length);
                trackData.published = metadata.published_at
                    ? new Date(metadata.published_at).toLocaleDateString()
                    : '';
            }

            const localThumbnailPath = path.join(CR_THUMBNAILS_ROOT, `${trackId}.png`);
            try {
                await fsPromises.access(localThumbnailPath);
                trackData.thumbnail = `/data/cr/thumbnails/${trackId}.png`;
            } catch {
                trackData.thumbnail = metadata?.thumbnail_url || '/data/bhr/thumbnails/default.png';
            }

            const forumLink = await getForumLinkForTrack('cr', trackId);
            if (forumLink) {
                trackData.forumUrl = forumLink.forumUrl;
            }
        }
    } catch (error) {
        console.error(`CR track ${trackId} error`, error);
        trackData.name = `CR track #${trackId} error`;
    }

    if (crMetadata.length > 0) {
        const currentIndex = crMetadata.findIndex(t => t.id === trackId);
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % crMetadata.length;
            const prevIndex = (currentIndex - 1 + crMetadata.length) % crMetadata.length;
            trackData.nextId = crMetadata[nextIndex].id;
            trackData.prevId = crMetadata[prevIndex].id;
        }
        else {
            const { nextId, prevId } = findClosestIds(crMetadata, trackId);
            trackData.nextId = nextId;
            trackData.prevId = prevId;
        }
    }

    if (isJsonMode) {
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            id: trackData.id,
            trackUrl: `/data/cr/trackcodes/${trackId}.txt`,
            description: trackData.description,
            published: trackData.published,
            size: trackData.size,
            permalink: `https://freerider.app/cr/${trackId}`,
            nextId: trackData.nextId,
            prevId: trackData.prevId
        });
    }

    if (isDiscussMode) {
        const renderedHtml = discussTemplate({
            track: trackData
        });
        return res.status(200).send(renderedHtml);
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'cr',
        track: trackData
    });

    res.status(200).send(renderedHtml);
});

app.get('/frhd/:id', async (req, res) => {
    const frhdModule = await import('frhdv2');
    const getTrackData = frhdModule.getTrackData;
    const getTrackCode = frhdModule.getTrackCode;

    if (!getTrackData || !getTrackCode) {
        return res.status(500).send('Server configuration error');
    }

    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const isDiscussMode = req.query.discuss === 'true';
    const isJsonMode = req.query.json === 'true';
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

    if (isDiscussMode) {
        const renderedHtml = discussTemplate({
            track: trackData
        });
        return res.status(200).send(renderedHtml);
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'frhd',
        track: trackData
    });

    res.status(200).send(renderedHtml);
});

app.get('/bhr/:id', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    const isDiscussMode = req.query.discuss === 'true';
    const isJsonMode = req.query.json === 'true';

    let trackData = {
        id: trackId,
        name: `BHR Track #${trackId}`,
        authors: 'Unknown',
        code: '',
        type: 'bhr',
        description: '',
        published: '',
        size: '',
        forumUrl: '',
        thumbnail: '/data/bhr/thumbnails/default.png',
        permalink: `https://freerider.app/bhr/${trackId}`
    };

    try {
        const fetchedData = await getBhrTrackData(trackId);

        if (fetchedData) {
            trackData = {
                ...trackData,
                ...fetchedData,
                pageId: `bhr-${trackId}`,
                type: 'bhr',
                sourceUrl: `/bhr/${trackId}`,
                permalink: `https://freerider.app/bhr/${trackId}`
            };

            const metadata = bhrMetadata.find(t => t.id === trackId);
            if (metadata) {
                trackData.description = metadata.description || '';

                trackData.size = metadata.size
                    ? formatSize(parseInt(metadata.size, 10))
                    : formatSize(trackData.code.length);

                trackData.published = metadata.published_at
                    ? new Date(metadata.published_at).toLocaleDateString()
                    : '';
            }

            const localThumbnailPath = path.join(__dirname, 'data', 'bhr', 'thumbnails', `${trackId}.png`);
            try {
                await fsPromises.access(localThumbnailPath);
                trackData.thumbnail = `/data/bhr/thumbnails/${trackId}.png`;
            } catch {
                trackData.thumbnail = metadata?.thumbnail_url || '/data/bhr/thumbnails/default.png';
            }

            const forumLink = await getForumLinkForTrack('bhr', trackId);
            if (forumLink) {
                trackData.forumUrl = forumLink.forumUrl;
            }
        }
    } catch (error) {
        console.error(`BHR track ${trackId} error`, error);
        trackData.name = `BHR track #${trackId} error`;
    }

    if (bhrMetadata.length > 0) {
        const currentIndex = bhrMetadata.findIndex(t => t.id === trackId);
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % bhrMetadata.length;
            const prevIndex = (currentIndex - 1 + bhrMetadata.length) % bhrMetadata.length;
            trackData.nextId = bhrMetadata[nextIndex].id;
            trackData.prevId = bhrMetadata[prevIndex].id;
        }
        else {
            const { nextId, prevId } = findClosestIds(bhrMetadata, trackId);
            trackData.nextId = nextId;
            trackData.prevId = prevId;
        }
    }

    if (isJsonMode) {
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            id: trackData.id,
            trackUrl: `/data/bhr/trackcodes/${trackId}.txt`,
            description: trackData.description,
            published: trackData.published,
            size: trackData.size,
            permalink: `https://freerider.app/bhr/${trackId}`,
            nextId: trackData.nextId,
            prevId: trackData.prevId
        });
    }

    if (isDiscussMode) {
        const renderedHtml = discussTemplate({
            track: trackData
        });
        return res.status(200).send(renderedHtml);
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'bhr',
        track: trackData
    });

    res.status(200).send(renderedHtml);
});

app.get('/u/:id', async (req, res) => {
    const userId = req.params.id;
    const isDiscussMode = req.query.discuss === 'true';
    const json = req.query.json === 'true';

    try {
        await initializeUserProfile(userId);
        const trackData = await getUserTrackData(userId);

        if (!trackData) {
            return res.status(404).send(`Data not found for user "${userId}".`);
        }

        // fetch created tracks
        let createdTracks = [];
        try {
            const frhdModule = await import('frhdv2');
            const getUser = frhdModule.getUser;
            
            if (getUser) {
                const userData = await getUser(userId);
                
                if (userData && userData.createdTracks && userData.createdTracks.cache) {
                    createdTracks = Array.from(userData.createdTracks.cache.values()).map(track => ({
                        id: track.id,
                        title: track.title || `Track #${track.id}`,
                        author: track.author?.username || track.author?.displayName || userData.displayName,
                        url: `https://freerider.app/frhd/${track.id}`,
                        thumbnail: `https://freerider.app/frhd/${track.id}.png`,
                    }));
                    
                    console.log(`[User ${userId}] Found ${createdTracks.length} created tracks`);
                }
            }
        } catch (apiError) {
            console.error(`[User ${userId}] Failed to fetch created tracks from FRHD API:`, apiError);
        }

        trackData.pageId = userId;
        trackData.userId = userId;
        trackData.sourceUrl = `/u/${userId}`;
        trackData.createdTracks = createdTracks;

        const forumLink = await getForumLinkForTrack('u', userId);
        if (forumLink) {
            trackData.forumUrl = forumLink.forumUrl;
        } else {
            trackData.forumUrl = '';
        }

        if (json) {
            return res.json({
                name: trackData.name,
                authors: trackData.authors,
                thumbnail: trackData.thumbnail,
                trackURL: trackData.trackUrl,
                description: trackData.description,
                id: userId,
                type: 'user',
                createdTracks: createdTracks,
                forumUrl: trackData.forumUrl
            });
        }

        if (isDiscussMode) {
            const renderedHtml = discussTemplate({
                track: trackData
            });
            return res.status(200).send(renderedHtml);
        }

        // Render the normal track template
        const renderedHtml = trackTemplate({
            trackId: false,
            trackType: 'user',
            track: trackData,
        });

        res.status(200).send(renderedHtml);

    } catch (error) {
        console.error(`Error processing /u/${userId}:`, error);
        res.status(500).send('Internal Server Error while fetching track.');
    }
});

app.get('/u/:userId/:trackSlug', async (req, res) => {
    const { userId, trackSlug } = req.params;
    const isDiscussMode = req.query.discuss === 'true';
    const json = req.query.json === 'true';
    
    try {
        const trackData = await getPageTrackData(userId, trackSlug);

        if (!trackData) {
            return res.status(404).send(`Track "${trackSlug}" not found for user "${userId}".`);
        }

        // fetch created tracks
        let createdTracks = [];
        try {
            const frhdModule = await import('frhdv2');
            const getUser = frhdModule.getUser;
            
            if (getUser) {
                const userData = await getUser(userId);
                
                if (userData && userData.createdTracks && userData.createdTracks.cache) {
                    createdTracks = Array.from(userData.createdTracks.cache.values()).map(track => ({
                        id: track.id,
                        title: track.title || `Track #${track.id}`,
                        author: track.author?.username || track.author?.displayName || userData.displayName,
                        url: `https://freerider.app/frhd/${track.id}`,
                        thumbnail: `https://freerider.app/frhd/${track.id}.png`,
                    }));
                    
                    console.log(`[User ${userId}] Found ${createdTracks.length} created tracks`);
                }
            }
        } catch (apiError) {
            console.error(`[User ${userId}] Failed to fetch created tracks from FRHD API:`, apiError);
        }

        trackData.pageId = `page-${userId}-${trackSlug}`;
        trackData.sourceUrl = `/u/${userId}/${trackSlug}`;
        trackData.userId = userId;
        trackData.createdTracks = createdTracks;

        const forumLink = await getForumLinkForTrack('u', userId);
        if (forumLink) {
            trackData.forumUrl = forumLink.forumUrl;
        } else {
            trackData.forumUrl = '';
        }

        if (json) {
            return res.json({
                name: trackData.name,
                authors: trackData.authors,
                thumbnail: trackData.thumbnail,
                trackURL: trackData.trackURL,
                description: trackData.description,
                id: trackSlug,
                type: 'page',
                createdTracks: createdTracks,
                forumUrl: trackData.forumUrl
            });
        }

        if (isDiscussMode) {
            const renderedHtml = discussTemplate({
                track: trackData
            });
            return res.status(200).send(renderedHtml);
        }

        const renderedHtml = trackTemplate({
            trackId: trackSlug,
            trackType: 'page',
            track: trackData,
        });

        res.status(200).send(renderedHtml);

    } catch (error) {
        console.error(`Error processing /u/${userId}/${trackSlug}:`, error);
        res.status(500).send('Internal Server Error while fetching track.');
    }
});

app.post('/api/upload-track', async (req, res) => {
    try {
        const { 
            pagePath, // the unique page identifier (e.g., 'ness' or '')
            fileName, 
            fileContent,
            imageContent,
            imageFileName,
            trackMetadata 
        } = req.body; 
        
        console.log(`[Upload Debug] Page Path: "${pagePath}", File Name: "${fileName}", File Content Status: ${fileContent ? 'Present (Length: ' + fileContent.length + ')' : 'Missing/Empty'}`);

        if (!fileName || !fileContent) {
            return res.status(400).json({ error: "Missing required fields: fileName, or fileContent. (Track or filename is likely empty)" });
        }

        const effectivePagePath = pagePath || ''; 
        let sanitizedPagePath = effectivePagePath;
        
        if (effectivePagePath !== '') {
            sanitizedPagePath = sanitizePath(effectivePagePath);
            if (!sanitizedPagePath) {
                return res.status(400).json({ error: "Invalid pagePath provided after sanitization." });
            }
        }

        const targetDir = path.join(USER_TRACKS_ROOT, sanitizedPagePath);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log(`Created nested directory: ${targetDir}`);
        }

        const trackFilePath = path.join(targetDir, fileName);
        const trackBuffer = Buffer.from(fileContent, "base64");
        fs.writeFileSync(trackFilePath, trackBuffer);
        let trackUrl;

        if (sanitizedPagePath === '') {
            trackUrl = `/data/page/${fileName}`;
        } else {
            trackUrl = `/data/page/${sanitizedPagePath}/${fileName}`;
        }
        
        let imageUrl = null;
        let finalImageFileName = imageFileName;

        if (imageContent && finalImageFileName) {
            const imageFilePath = path.join(targetDir, finalImageFileName);
            const imageBuffer = Buffer.from(imageContent, "base64");
            fs.writeFileSync(imageFilePath, imageBuffer);
            
            if (sanitizedPagePath === '') {
                imageUrl = `/data/page/${finalImageFileName}`;
            } else {
                imageUrl = `/data/page/${sanitizedPagePath}/${finalImageFileName}`;
            }
        }

        const tracks = await loadUserTracks(sanitizedPagePath);
        
        let trackSlug = sanitizedPagePath ? fileName.split('.').slice(0, -1).join('.') : trackMetadata.author;
        
        if (trackSlug !== 'page') {
            trackSlug = trackSlug
                .toLowerCase()
        }

        const userSegment = sanitizedPagePath ? `/${sanitizedPagePath}` : '';
        const basePermalink = `https://freerider.app/u${userSegment}`;

        let permalink;
        if (trackSlug === 'page') { 
            permalink = basePermalink; // freerider.app/u/ness
        } else {
            permalink = `${basePermalink}/${trackSlug}`; // freerider.app/u/ness/toronto
        }

        const newTrack = {
            slug: trackSlug,
            name: trackMetadata.name,
            authors: trackMetadata.all_authors,
            description: trackMetadata.desc,
            trackUrl: trackUrl,
            imageUrl: imageUrl,
            metadata: trackMetadata,
            uploaded_at: new Date().toISOString(),
            permalink: permalink
        };

        const existingIndex = tracks.findIndex(t => t.slug === trackSlug);
        if (existingIndex > -1) {
            tracks[existingIndex] = newTrack;
        } else {
            tracks.push(newTrack);
        }

        await saveUserTracks(sanitizedPagePath, tracks);
        
        res.status(200).json({ 
            trackUrl: trackUrl,
            imageUrl: imageUrl,
            permalink: permalink
        });

    } catch (err) {
        console.error("Server-side file writing error:", err);
        res.status(500).json({ error: `Internal Server Error: Failed to save files (${err.message})` });
    }
});

async function startServer() {
    try {
        await ensurePersistentRootExists();
    } catch (error) {
        console.error("Failed to initialize server due to critical file system error:", error);
        process.exit(1); 
    }

    app.listen(PORT, () => {
        console.log(`Minimal server running on http://localhost:${PORT}`);
        console.log('Test paths:');
        console.log(`- http://localhost:${PORT}/frhd/977281 (server-side fetch)`);
        console.log(`- http://localhost:${PORT}/bhr/10309 (server-side fetch)`);
    });
}

startServer();
