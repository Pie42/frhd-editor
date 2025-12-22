const express = require('express');
const router = express.Router();
const fsPromises = require('fs').promises;
const path = require('path');

const PERSISTENT_ROOT_DISK = '/var/data';
const FORUM_LINKS_PATH = path.join(PERSISTENT_ROOT_DISK, 'forum-links.json');

async function loadForumLinks() {
    try {
        const data = await fsPromises.readFile(FORUM_LINKS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        if (e.code === 'ENOENT') return [];
        console.error('Error loading forum links:', e);
        return [];
    }
}

async function saveForumLinks(links) {
    await fsPromises.writeFile(FORUM_LINKS_PATH, JSON.stringify(links, null, 2), 'utf8');
}

async function getForumLinkForTrack(trackType, trackId, thirdParam = null) {
    const links = await loadForumLinks();
    const trackUrl = thirdParam ? `/${trackType}/${trackId}/${thirdParam}` : `/${trackType}/${trackId}`;
    return links.find(l => l.trackUrl === trackUrl);
}

// GET /api/forum-links
router.get('/forum-links', async (req, res) => {
    try {
        const links = await loadForumLinks();
        res.status(200).json({ links, count: links.length });
    } catch (err) {
        console.error('Error fetching forum links:', err);
        res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
});

// POST /api/forum-link
router.post('/forum-link', async (req, res) => {
    try {
        const { trackUrl, forumUrl, submittedBy } = req.body;
        
        if (!trackUrl || !forumUrl) {
            return res.status(400).json({ error: 'Missing required fields: trackUrl and forumUrl' });
        }
        
        const trackMatch = trackUrl.match(/^\/(frhd|bhr|cr|u)\/(.+?)(?:\/(.+))?$/);
        if (!trackMatch) {
            return res.status(400).json({ error: 'Invalid track URL format' });
        }
        
        if (!forumUrl.startsWith('https://forum.freerider.app/')) {
            return res.status(400).json({ error: 'Invalid forum URL' });
        }
        
        const trackType = trackMatch[1];
        const trackId = trackMatch[2];
        const thirdSegment = trackMatch[3];
        
        const links = await loadForumLinks();
        const existingIndex = links.findIndex(link => link.trackUrl === trackUrl);
        
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
        } else {
            linkData.ghostUser = thirdSegment || null;
        }
        
        if (existingIndex >= 0) {
            links[existingIndex] = linkData;
        } else {
            links.push(linkData);
        }
        
        await saveForumLinks(links);
        res.status(200).json({ success: true, link: linkData });
        
    } catch (err) {
        console.error('Error creating/updating forum link:', err);
        res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
});

async function getForumLinkHandler(req, res) {
    try {
        const { type, id, user } = req.params;
        
        if (!['frhd', 'bhr', 'cr', 'u'].includes(type)) {
            return res.status(400).json({ error: 'Invalid track type' });
        }
        
        const trackUrl = user ? `/${type}/${id}/${user}` : `/${type}/${id}`;
        const links = await loadForumLinks();
        const link = links.find(l => l.trackUrl === trackUrl);
        
        if (!link) {
            return res.status(404).json({ error: 'No forum link found for this track' });
        }
        
        res.status(200).json(link);
        
    } catch (err) {
        console.error('Error fetching forum link:', err);
        res.status(500).json({ error: `Internal Server Error: ${err.message}` });
    }
}

router.get('/forum-link/:type/:id/:user', getForumLinkHandler);
router.get('/forum-link/:type/:id', getForumLinkHandler);

module.exports = { router, getForumLinkForTrack };