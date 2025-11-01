const express = require('express');
const app = express();
app.set('view cache', false);
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

const PORT = 3000;
const MAX_ID = 1100000;
const PAGE_METADATA_FILE = 'page.json';
const PERSISTENT_ROOT = '/var/data/page';

app.use(express.static(path.join(__dirname, '/')));
app.use('/data/page', express.static(PERSISTENT_ROOT));

app.use(express.json({ limit: '20mb' }));

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

const validateId = (id) => {
    const trackId = parseInt(id, 10);
    if (isNaN(trackId) || trackId < 1 || trackId > MAX_ID) {
        return { isValid: false, id: null };
    }
    return { isValid: true, id: trackId };
};

function formatSize(bytes) {
    if (bytes === null || bytes === undefined || bytes === 0 || isNaN(bytes)) { return '0 Bytes'; }
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

    const globalMetadataPath = path.join(PERSISTENT_ROOT, PAGE_METADATA_FILE);
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
    
    const trackFilePath = path.join(PERSISTENT_ROOT, `${sanitizedUserId}.txt`);
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
        type: 'user',
        size: formatSize(trackCode.length),
        description: metadata.metadata?.description || '',
        published: metadata.uploaded_at ? new Date(metadata.uploaded_at).toLocaleDateString() : 'Unknown Date',
        thumbnail: metadata.imageUrl || '/data/bhr/thumbnails/default.png',
        sourceUrl: metadata.trackUrl
    };
}

async function getPageTrackData(userId, trackSlug) {
    const sanitizedUserId = sanitizePath(userId);
    
    if (!sanitizedUserId || sanitizedUserId !== userId) {
        return null;
    }

    const globalMetadataPath = path.join(PERSISTENT_ROOT, sanitizedUserId, PAGE_METADATA_FILE);
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
    
    const trackFilePath = path.join(PERSISTENT_ROOT, sanitizedUserId, `${trackSlug}.txt`);
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
        description: metadata.metadata?.description || '',
        published: metadata.uploaded_at ? new Date(metadata.uploaded_at).toLocaleDateString() : 'Unknown Date',
        thumbnail: metadata.imageUrl || '/data/bhr/thumbnails/default.png',
        sourceUrl: metadata.trackUrl,
        pageName: metadata.name
    };
}

async function loadUserTracks(sanitizedPagePath) {
    const metadataPath = path.join(PERSISTENT_ROOT, sanitizedPagePath, PAGE_METADATA_FILE);
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
    const metadataPath = path.join(PERSISTENT_ROOT, sanitizedPagePath, PAGE_METADATA_FILE);
    try {
        const targetDir = path.join(PERSISTENT_ROOT, sanitizedPagePath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        await fsPromises.writeFile(metadataPath, JSON.stringify(tracks, null, 2), 'utf8');
    } catch (e) {
        console.error(`Error saving user track metadata for ${sanitizedPagePath}:`, e);
    }
}

const GLOBAL_METADATA_PATH = path.join(PERSISTENT_ROOT, PAGE_METADATA_FILE);

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
        
        const targetDir = path.join(PERSISTENT_ROOT, sanitizedUserId);
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

// A. discussion route: /discuss.html?id=<type>-<id>
app.get('/discuss.html', async (req, res) => {
    const { id: rawCombinedId, json } = req.query;
    
    if (!rawCombinedId) {
        return res.sendFile(path.join(__dirname, 'templates', 'discuss.html'));
    }

    const parts = rawCombinedId.split('-');
    const uniquePageId = rawCombinedId;

    let type = parts.length > 1 ? parts[0].toLowerCase() : 'u';
    let identifier = parts.length > 1 ? parts.slice(1).join('-') : rawCombinedId; 
    let trackData = {
        pageId: uniquePageId, 
        id: identifier,
        name: `${rawCombinedId} Discussion`, 
        type: type, 
        authors: '',
        description: '',
        published: 'unknown date',
        size: 'unknown size',
        thumbnail: '/data/bhr/thumbnails/default.png',
        sourceUrl: ''
    };
    
    let fetchedData = null;

    if (parts.length === 1) {
        const userId = rawCombinedId;

        await initializeUserProfile(userId); 

        fetchedData = await getUserTrackData(userId); 

        if (fetchedData) {
            trackData = {
                ...trackData,
                ...fetchedData,
                type: 'u',
                name: `${fetchedData.name || userId} gallery`,
                sourceUrl: `/u/${userId}`
            };
            trackData.thumbnail = fetchedData.thumbnail || trackData.thumbnail;
        } else {
            trackData = {
                ...trackData,
                ...fetchedData,
                type: 'u',
                name: `${fetchedData.name || userId} gallery`,
                sourceUrl: `/u/${userId}`
            };
            trackData.thumbnail = fetchedData.thumbnail || trackData.thumbnail;
        }
    } 
    else if (parts.length >= 3 && parts[0].toLowerCase() === 'page') {
        const userId = parts[1];
        let trackSlug = parts.slice(2).join('-');
        type = 'page';

        trackSlug = trackSlug
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]+/g, '')
            .replace(/^-+|-+$/g, '');

        fetchedData = await getPageTrackData(userId, trackSlug);

        if (fetchedData) {
            trackData = {
                ...trackData,
                ...fetchedData,
                type: 'page',
                name: `${fetchedData.name}`,
                sourceUrl: `/u/${userId}/${trackSlug}`
            };
            trackData.thumbnail = fetchedData.thumbnail || trackData.thumbnail;
        } else {
             trackData.name = `User Track: ${userId}/${trackSlug} (Not Found)`;
        }
    }
    // B. track discussion (requires numeric ID for fetching)
    else if (['frhd', 'bhr', 'tracks'].includes(type)) {

    const numericTrackId = parseInt(identifier, 10);
        
        if (!isNaN(numericTrackId) && numericTrackId > 0) {
            trackData.id = numericTrackId;
            trackData.name = `${type.toUpperCase()} Track #${numericTrackId} Discussion`;
            trackData.sourceUrl = `/${type}/${numericTrackId}`;

    // fetch data based on type
    if (type === 'frhd') {
    let specificThumbnailFound = false;

    // check for the local file first
    const localThumbnailPath = path.join(
        __dirname, 
        'data',
        type, // which is 'frhd'
        'thumbnails', 
        `${numericTrackId}.png`
    );
    
    try {
        await fsPromises.access(localThumbnailPath); 
        
        // if it exists, set the thumbnail URL immediately
        trackData.thumbnail = `/data/${type}/thumbnails/${numericTrackId}.png`;
        specificThumbnailFound = true;
        
    } catch (e) {
        // file not found locally
    }
    
    // external api fetch, frhdv2 based on calc's frhd
    try {
        const frhdModule = await import('frhdv2');
        const getTrackData = frhdModule.getTrackData;
        
        if (!getTrackData) {
            throw new Error("Missing FRHD data function.");
        }

        // fetch all req metadata
        const metadataResponse = await getTrackData(numericTrackId, [
            'title', 'author', 'descr', 'img', 'p_ts', 'size'
        ]);

        const metadata = metadataResponse?.track || metadataResponse || {};

        if (metadata.title) {
            // process everything except thumbnail
            const rawAuthor = metadata.author || 'Unknown';
            const authorName = typeof rawAuthor === 'object' && rawAuthor !== null
                ? (rawAuthor.name || rawAuthor.username || 'Unknown Author')
                : rawAuthor;

            const publishedDate = metadata.p_ts 
                ? new Date(metadata.p_ts * 1000).toLocaleDateString()
                : 'Unknown Date';

            trackData.name = metadata.title;
            trackData.authors = authorName;
            trackData.description = metadata.descr || trackData.description;
            trackData.published = publishedDate;
            trackData.size = formatSize(metadata.size);

            // only update trackData.thumbnail from the API if a local file was not found, change size
            if (!specificThumbnailFound) {
                let thumbnail = metadata.img;
                if (thumbnail) {
                    thumbnail = thumbnail.replace(/(\d+x\d+)/, '768x250');
                }
                trackData.thumbnail = thumbnail || trackData.thumbnail;
            }
        } else {
            trackData.name = `FRHD Track #${numericTrackId} Discussion (Not Found)`;
        }

    } catch (error) {
        console.error(`Error fetching FRHD data for discussion page ID ${uniquePageId}:`, error);
        trackData.name = `FRHD Track #${numericTrackId} Discussion (Fetch Error)`;
    }

    if (json === 'true') {
        // send trackData as JSON
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            id: trackData.id,
            type: trackData.type
        });
    }
} else if (type === 'bhr') {
        const metadata = bhrMetadata.find(t => t.id === numericTrackId);

        if (metadata) {
            // process authors stored as JSON string in CSV
            let authors;
            try {
                authors = JSON.parse(metadata.authors).join(', ');
            } catch (e) {
                if (typeof metadata.authors === 'string') {
                    // replace escaped double quotes with standard double quotes
                    const cleanedAuthorsString = metadata.authors.replace(/""/g, '"'); 
                    try {
                        authors = JSON.parse(cleanedAuthorsString).join(', ');
                    } catch (e2) {
                        // final fallback to raw string
                        authors = metadata.authors || 'Unknown';
                    }
                } else {
                    authors = metadata.authors || 'Unknown';
                }
            }
            
            trackData.name = metadata.name || trackData.name;
            trackData.authors = authors;
            trackData.description = metadata.description || trackData.description;
            trackData.size = metadata.size ? formatSize(parseInt(metadata.size, 10)) : trackData.size; 
            trackData.published = metadata.published_at 
                ? new Date(metadata.published_at).toLocaleDateString()
                : trackData.published;

            let specificThumbnailFound = false;
        
        const localThumbnailPath = path.join(
            __dirname,
            'data',
            type, 
            'thumbnails', 
            `${numericTrackId}.png`
        );
        
        try {
            // check if file exists with promises
            await fsPromises.access(localThumbnailPath); 
            trackData.thumbnail = `/data/${type}/thumbnails/${numericTrackId}.png`;
            specificThumbnailFound = true;
            
        } catch (e) {
            // file does not exist
        }
        
        if (!specificThumbnailFound && metadata.thumbnail_url) {
             trackData.thumbnail = metadata.thumbnail_url;
        }
            
        } else {
            trackData.name = `BHR Track #${numericTrackId} Discussion (Not Found)`;
        }
    } 
        }}

    if (json === 'true') {
        // send data as json for hyvor
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            id: trackData.id,
            type: trackData.type
        });
    }

    // render the discussion template with the track data
    const renderedHtml = discussTemplate({
        track: trackData
    });

    res.status(200).send(renderedHtml);
});


// B. frhd route: /frhd/:id
app.get('/frhd/:id', async (req, res) => {
    const frhdModule = await import('frhdv2');

    const getTrackData = frhdModule.getTrackData;
    const getTrackCode = frhdModule.getTrackCode;

    if (!getTrackData || !getTrackCode) {
        console.error("frhdv2 module is installed but does not export required functions (getTrackData/getTrackCode).");
        return res.status(500).send('Server configuration error: Required track functions not found.');
    }

    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    let trackData = {};

    try {
        const [metadataResponse, codeResponse] = await Promise.all([
            getTrackData(trackId, ['title', 'author']), // fetch metadata
            getTrackCode(trackId, ['code']) // fetch the track code
        ]);

        // metadata from getTrackData
        const metadata = metadataResponse?.track || metadataResponse || {};

        const rawAuthor = metadata.author || 'Unknown';
        const authorName = typeof rawAuthor === 'object' && rawAuthor !== null
            ? (rawAuthor.name || rawAuthor.username || 'Unknown Author')
            : rawAuthor;

        // code from getTrackCode
        const code = codeResponse?.track?.code || codeResponse?.code || codeResponse || '';

        // map data to template variable
        trackData = {
            id: trackId,
            name: metadata.title || `FRHD Track #${trackId}`,
            authors: authorName,
            code: code,
            type: 'frhd' 
        };

    } catch (error) {
        console.error(`error fetching FRHD data with frhdv2 for ID ${trackId}:`, error);
        trackData = { id: trackId, name: `FRHD Track #${trackId} (Error)`, authors: 'System', code: '', type: 'frhd' };
    }

    
    if (req.query.json === 'true') {
        // send data as json for hyvor
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type
        });
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'frhd',
        track: trackData
    });

    res.status(200).send(renderedHtml);
});


// C. bhr route: /bhr/:id
app.get('/bhr/:id', async (req, res) => {
    const { isValid, id: trackId } = validateId(req.params.id);
    if (!isValid) {
        return res.status(404).send('invalid id');
    }

    let trackData = { id: trackId, name: `BHR Track #${trackId}`, authors: 'Unknown', code: '', type: 'bhr' };

    try {
        const fetchedData = await getBhrTrackData(trackId); 

        if (fetchedData) {
            // merge fetched data, keep 'type'
            trackData = { ...fetchedData, type: 'bhr' };
        } else {
            console.error(`bhr track ${trackId} not found`);
            trackData.name = `BHR track #${trackId} not found`;
        }

    } catch (error) {
        console.error(`bhr track ${trackId} error`, error);
        trackData.name = `BHR track #${trackId} error`;
    }

    if (req.query.json === 'true') {
        // send data as json for hyvor
        return res.json({
            name: trackData.name,
            authors: trackData.authors,
            thumbnail: trackData.thumbnail,
            type: trackData.type
        });
    }

    const renderedHtml = trackTemplate({
        trackId: trackId,
        trackType: 'bhr',
        track: trackData
    });


    res.status(200).send(renderedHtml);
});



/*
// D. fr.app /tracks route: /tracks/:id
app.get('/tracks/:id', (req, res) => {
});*/

// E. /u/:id route
app.get('/u/:id', async (req, res) => {
    const userId = req.params.id; // e.g., 'ness'
    const trackSlug = false;

    try {
        await initializeUserProfile(userId);
        const trackData = await getUserTrackData(userId, trackSlug);

        if (!trackData) {
            return res.status(404).send(`Data not found for user "${userId}".`);
        }

        trackData.userId = userId;

        // render the track template
        const renderedHtml = trackTemplate({
            trackId: trackSlug,
            trackType: 'user',
            track: trackData,
        });

        res.status(200).send(renderedHtml);

    } catch (error) {
        console.error(`Error processing /u/${userId}:`, error);
        res.status(500).send('Internal Server Error while fetching track.');
    }

    console.log(`page for user: ${userId}`);
});
// F. /u/:id/:trackSlug route (Specific user track page)

app.get('/u/:userId/:trackSlug', async (req, res) => {
    const { userId, trackSlug } = req.params;
    
    try {
        const trackData = await getPageTrackData(userId, trackSlug);

        if (!trackData) {
            return res.status(404).send(`Track "${trackSlug}" not found for user "${userId}".`);
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

        const targetDir = path.join(PERSISTENT_ROOT, sanitizedPagePath);

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
        
        let trackSlug = fileName.split('.').slice(0, -1).join('.');
        
        if (trackSlug !== 'page') {
            trackSlug = trackSlug
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]+/g, '')
                .replace(/^-+|-+$/g, '');
        }
        const newTrack = {
            slug: trackSlug,
            name: trackMetadata.name,
            authors: trackMetadata.author, 
            trackUrl: trackUrl,
            imageUrl: imageUrl,
            metadata: trackMetadata,
            uploaded_at: new Date().toISOString()
        };

        const existingIndex = tracks.findIndex(t => t.slug === trackSlug);
        if (existingIndex > -1) {
            tracks[existingIndex] = newTrack;
        } else {
            tracks.push(newTrack);
        }

        await saveUserTracks(sanitizedPagePath, tracks);

        let permalink;
        const basePermalink = `https://freerider.app/u/${sanitizedPagePath}`;

        if (trackSlug === 'page') { 
            permalink = basePermalink; // freerider.app/u/ness
        } else {
            permalink = `${basePermalink}/${trackSlug}`; // freerider.app/u/ness/toronto
        }
        
        res.status(200).json({ 
            trackUrl: trackUrl,
            imageUrl: imageUrl,
            permalink: `https://freerider.app/u/${sanitizedPagePath}/${trackSlug}` 
        });

    } catch (err) {
        console.error("Server-side file writing error:", err);
        res.status(500).json({ error: `Internal Server Error: Failed to save files (${err.message})` });
    }
});

// server listener
app.listen(PORT, () => {
    console.log(`Minimal server running on http://localhost:${PORT}`);
    console.log('Test paths:');
    console.log(`- http://localhost:${PORT}/frhd/977281 (server-side fetch)`);
    console.log(`- http://localhost:${PORT}/bhr/10309 (server-side fetch)`);
});
