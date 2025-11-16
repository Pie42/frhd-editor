const express = require('express');
const app = express();
app.set('view cache', false);
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

const PORT = 3000;
const MAX_ID = 1500000;
const PAGE_METADATA_FILE = 'page.json';
// persistent disk mount
const PERSISTENT_ROOT_DISK = '/var/data'; 

// cr trackcodes / thumbnails location on disk
const CR_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'cr', 'trackcodes'); 
const CR_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'cr', 'thumbnails'); 

const FRHD_TRACKCODES_ROOT = path.join(PERSISTENT_ROOT_DISK, 'frhd', 'trackcodes'); 
//const FRHD_THUMBNAILS_ROOT = path.join(PERSISTENT_ROOT_DISK, 'frhd', 'thumbnails'); 

app.use('/data/frhd/trackcodes', express.static(FRHD_TRACKCODES_ROOT));

// user uploaded pages path
const USER_TRACKS_ROOT = '/var/data/page'; 

app.use(express.static(path.join(__dirname, '/')));
app.use('/data/page', express.static(USER_TRACKS_ROOT));
app.use('/data/cr/trackcodes', express.static(CR_TRACKCODES_ROOT)); // maps /var/data/cr/trackcodes to the public URL /data/cr/trackcodes
app.use('/data/cr/thumbnails', express.static(CR_THUMBNAILS_ROOT));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

const trackTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/track.ejs'), 'utf8'));
const discussTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/discuss.ejs'), 'utf8'));

let bhrMetadata = [];
const BHR_METADATA_PATH = path.join(__dirname, 'data', 'bhr', 'tracks.csv');

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

let crMetadata = [];
const CR_METADATA_PATH = path.join(__dirname, 'data', 'cr', 'tracks.csv');

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

// dynamic routes

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
        }
    } catch (error) {
        console.error(`CR track ${trackId} error`, error);
        trackData.name = `CR track #${trackId} error`;
    }

    if (isJsonMode) {
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            trackUrl: `/data/cr/trackcodes/${trackId}.txt`,
            description: trackData.description,
            published: trackData.published,
            size: trackData.size,
            permalink: `https://freerider.app/cr/${trackId}`
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
            size: formatSize(metadata.size || code.length),
            permalink: `https://freerider.app/frhd/${trackId}`
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
            permalink: `https://freerider.app/frhd/${trackId}`
        };
    }

    if (req.query.json === 'true') {
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            trackUrl: `/data/frhd/trackcodes/${trackId}.txt`,
            description: trackData.description,
            published: trackData.published,
            size: trackData.size,
            permalink: `https://freerider.app/frhd/${trackId}`
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
        }
    } catch (error) {
        console.error(`BHR track ${trackId} error`, error);
        trackData.name = `BHR track #${trackId} error`;
    }

    if (isJsonMode) {
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type,
            trackUrl: `/data/bhr/trackcodes/${trackId}.txt`,
            description: trackData.description,
            published: trackData.published,
            size: trackData.size,
            permalink: `https://freerider.app/bhr/${trackId}`
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

        // Add discussion-specific fields
        trackData.pageId = userId;
        trackData.userId = userId;
        trackData.sourceUrl = `/u/${userId}`;

        if (json) {
            return res.json({
                name: trackData.name,
                authors: trackData.authors,
                thumbnail: trackData.thumbnail,
                trackURL: trackData.trackUrl,
                description: trackData.description,
                id: userId,
                type: 'user'
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

// Similar modifications for /u/:userId/:trackSlug
app.get('/u/:userId/:trackSlug', async (req, res) => {
    const { userId, trackSlug } = req.params;
    const isDiscussMode = req.query.discuss === 'true';
    const json = req.query.json === 'true';
    
    try {
        const trackData = await getPageTrackData(userId, trackSlug);

        if (!trackData) {
            return res.status(404).send(`Track "${trackSlug}" not found for user "${userId}".`);
        }

        // Add discussion-specific fields
        trackData.pageId = `page-${userId}-${trackSlug}`;
        trackData.sourceUrl = `/u/${userId}/${trackSlug}`;

        if (json) {
            return res.json({
                name: trackData.name,
                authors: trackData.authors,
                thumbnail: trackData.thumbnail,
                trackURL: trackData.trackURL,
                description: trackData.description,
                id: trackSlug,
                type: 'page'
            });
        }

        if (isDiscussMode) {
            const renderedHtml = discussTemplate({
                track: trackData
            });
            return res.status(200).send(renderedHtml);
        }

        trackData.userId = userId;
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
