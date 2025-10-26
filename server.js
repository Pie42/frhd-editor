const express = require('express');
const app = express();
app.set('view cache', false);
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

const PORT = 3000;
const MAX_ID = 1100000;

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

app.use(express.static(path.join(__dirname, '/')));

// dynamic routes

// A. discussion route: /discuss.html?id=<type>-<id>
app.get('/discuss.html', async (req, res) => {
    const { id: rawCombinedId } = req.query; 
    
    if (!rawCombinedId) {
        return res.status(400).send('Missing Discussion ID. Usage: /discuss.html?id=<type>-<id>');
    }

    const parts = rawCombinedId.split('-');

    if (parts.length < 2) {
        return res.status(400).send('Invalid Discussion ID format. Expected: <type>-<id>');
    }
    
    const type = parts[0].toLowerCase();
    const trackIdString = parts.slice(1).join('-'); 

    const allowedTypes = ['tracks', 'bhr', 'frhd'];
    if (!allowedTypes.includes(type)) {
        return res.status(404).send(`Invalid track type in ID: ${type}. Must be one of: ${allowedTypes.join(', ')}`);
    }

    const { isValid, id: numericTrackId } = validateId(trackIdString);

    if (!isValid) {
        return res.status(404).send('Invalid Discussion Track ID Range');
    }

    const uniquePageId = `${type}-${numericTrackId}`;

    // initialize
    let trackData = {
        pageId: uniquePageId, // used for hyvor page-id
        id: numericTrackId,
        name: `${type.toUpperCase()} Track #${numericTrackId} Discussion`,
        type: type, 
        authors: '',
        description: '',
        published: 'unknown date',
        size: 'unknown size',
        thumbnail: '',
        sourceUrl: `/${type}/${numericTrackId}`
    };

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


// server listener
app.listen(PORT, () => {
    console.log(`Minimal server running on http://localhost:${PORT}`);
    console.log('Test paths:');
    console.log(`- http://localhost:${PORT}/frhd/977281 (server-side fetch)`);
    console.log(`- http://localhost:${PORT}/bhr/10309 (server-side fetch)`);
});
