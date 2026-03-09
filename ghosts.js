// ghosts.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('https://db.freerider.app');
const JWT_SECRET = process.env.JWT_SECRET;

// for actions that need a real user
function requireAuth(req, res, next) {
    const cookies = req.cookies || {};
    const nbbToken = cookies['nbb_token'];

    if (!nbbToken) {
        return res.status(401).json({ error: 'Please log in' });
    }

    try {
        const decoded = jwt.verify(nbbToken, JWT_SECRET);
        req.user = {
            uid: decoded.uid,
            username: decoded.username
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Session expired' });
    }
}

// allows guests
function optionalAuth(req, res, next) {
    const cookies = req.cookies || {};
    const nbbToken = cookies['nbb_token'];

    if (nbbToken && JWT_SECRET) {
        try {
            const decoded = jwt.verify(nbbToken, JWT_SECRET);
            req.user = {
                uid: decoded.uid,
                username: decoded.username
            };
        } catch (error) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
}

function formatGhostTime(ticks, fps = 30) {
    const totalSeconds = ticks / fps;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toFixed(2).padStart(5, '0')}`;
}

router.get('/frhd-leaderboard/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const frhdModule = await import('frhdv2');
        const { getTrackLeaderboard } = frhdModule;

        const raw = await getTrackLeaderboard(parseInt(id));
        const leaderboard = (raw?.track_leaderboard || []).filter(function(race) {
            return race.u_id && race.user && race.user.u_name;
        });

        if (leaderboard.length === 0) {
            return res.json({ leaderboard: [], totalEntries: 0 });
        }

        const uIds = leaderboard.map(r => r.u_id).join(',');
        const url = new URL('https://www.freeriderhd.com/track_api/load_races');
        url.searchParams.set('ajax', 'true');
        url.searchParams.set('t_1', 'ref');
        url.searchParams.set('t_2', 'desk');

        const batchRes = await fetch(url.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ t_id: id, u_ids: uIds }).toString()
        });

        const batchJson = await batchRes.json();

        const raceByUid = {};
        for (const entry of (batchJson.data || [])) {
            if (entry.user?.u_id) {
                raceByUid[entry.user.u_id] = entry.race;
            }
        }

        const entries = leaderboard.map(function(race) {
            const raceData = raceByUid[race.u_id] || {};
            const code = typeof raceData.code === 'string'
                ? (() => { try { return JSON.parse(raceData.code); } catch { return null; } })()
                : raceData.code || null;

            return {
                rank: race.place,
                username: race.user.d_name || race.user.u_name,
                userId: race.u_id,
                isGuest: false,
                time: race.run_time || '',
                timeTicks: raceData.run_ticks || 0,
                vehicle: raceData.vehicle || 'BMX',
                verified: false,
                hatColor: '#000000',
                hatType: 'none',
                vehicleColor: '',
                riderColor: '',
                crBmx: false,
                crMtb: false,
                modsUsed: [],
                keyUrl: `/api/ghosts/frhd-race/${id}/${race.u_id}`,
                ghostCode: code,
                ghostUrl: `/api/ghosts/frhd-race/${id}/${race.u_id}`,
                source: 'frhd'
            };
        });

        res.json({ leaderboard: entries, totalEntries: entries.length });

    } catch (error) {
        console.error('FRHD leaderboard fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch FRHD leaderboard', details: error.message });
    }
});

router.get('/frhd-race/:id/:uid', async (req, res) => {
    const { id, uid } = req.params;

    try {
        const url = new URL('https://www.freeriderhd.com/track_api/load_races');
        url.searchParams.set('ajax', 'true');
        url.searchParams.set('t_1', 'ref');
        url.searchParams.set('t_2', 'desk');

        const body = new URLSearchParams({ t_id: id, u_ids: uid });

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });

        const json = await response.json();

        if (!json.result || !json.data || !json.data[0]) {
            return res.status(404).json({ error: 'No race found' });
        }

        const race = json.data[0].race;
        const code = typeof race.code === 'string' ? JSON.parse(race.code) : race.code;

        res.json(code);

    } catch (error) {
        console.error('FRHD race relay error:', error);
        res.status(500).json({ error: 'Failed to fetch race data', details: error.message });
    }
});

// upload ghost - allows guests
router.post('/upload', optionalAuth, async (req, res) => {
    try {
        const { trackType, trackId, timeTicks, timeFormatted, vehicle, ghostData, keyData, guestUsername,
        hatColor, hatType, vehicleColor, riderColor, crBmx, crMtb, modsUsed } = req.body;

        if (!trackType || !trackId || !timeTicks || !ghostData) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['frhd', 'bhr', 'cr', 't'].includes(trackType)) {
            return res.status(400).json({ error: 'Invalid track type' });
        }

        const isGuest = !req.user;
        const userId = req.user?.uid || 0;
        
        let username;
        if (req.user) {
            username = req.user.username;
        } else if (guestUsername && guestUsername.trim()) {
            username = guestUsername.trim().substring(0, 30).replace(/[<>"'&]/g, '');
        } else {
            username = 'Guest';
        }

        // cpgh ghost to blob
        const ghostBuffer = Buffer.from(ghostData, 'base64');
        const ghostBlob = new Blob([ghostBuffer], { type: 'application/octet-stream' });

        // keypress data to blob
        const keyJson = JSON.stringify(keyData || {});
        const keyBlob = new Blob([keyJson], { type: 'application/json' });

        const formData = new FormData();
        formData.append('track_type', trackType);
        formData.append('track_id', trackId);
        formData.append('user_id', userId);
        formData.append('username', username);
        formData.append('is_guest', isGuest);
        formData.append('time_ticks', parseInt(timeTicks));
        formData.append('time_formatted', timeFormatted || formatGhostTime(timeTicks));
        formData.append('vehicle', vehicle || 'BMX');
        formData.append('ghost_data', ghostBlob, `ghost_${trackType}_${trackId}_${username}_${Date.now()}.cpgh`);
        formData.append('key_data', keyBlob, `keys_${trackType}_${trackId}_${username}_${Date.now()}.json`);
        formData.append('verified', false);
        formData.append('hat_color', hatColor || '#000000');
        formData.append('hat_type', hatType || 'none');
        formData.append('vehicle_color', vehicleColor || '');
        formData.append('rider_color', riderColor || '');
        formData.append('cr_bmx', crBmx || false);
        formData.append('cr_mtb', crMtb || false);
        formData.append('mods_used', JSON.stringify(modsUsed || []));

        // create new ghost
        const record = await pb.collection('ghosts').create(formData);
        console.log(`[Ghost] New${isGuest ? ` (guest: ${username})` : ''}: ${username} on ${trackType}/${trackId}: ${timeFormatted}`);

        res.json({
            success: true,
            ghostId: record.id,
            message: isGuest ? `Ghost uploaded as "${username}"!` : 'Ghost uploaded!',
            isGuest: isGuest,
            username: username
        });

    } catch (error) {
        console.error('Ghost upload error:', error);
        res.status(500).json({ error: 'Failed to upload ghost', details: error.message });
    }
});

// get leaderboard for a track
router.get('/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const includeGuests = req.query.guests !== 'false';

    if (!['frhd', 'bhr', 'cr', 't'].includes(type)) {
        return res.status(400).json({ error: 'Invalid track type' });
    }

    try {
        let filter = `track_type = "${type}" && track_id = "${id}"`;
        if (!includeGuests) {
            filter += ' && is_guest = false';
        }

        const result = await pb.collection('ghosts').getList(1, limit, {
            filter: filter,
            sort: 'time_ticks',
            requestKey: `leaderboard-${type}-${id}-${Date.now()}`
        });

        const leaderboard = result.items.map((ghost, index) => ({
            rank: index + 1,
            username: ghost.username,
            userId: ghost.user_id,
            isGuest: ghost.is_guest || false,
            time: ghost.time_formatted,
            timeTicks: ghost.time_ticks,
            vehicle: ghost.vehicle,
            hatColor: ghost.hat_color,
            hatType: ghost.hat_type,
            vehicleColor: ghost.vehicle_color,
            riderColor: ghost.rider_color,
            crBmx: ghost.cr_bmx,
            crMtb: ghost.cr_mtb,
            modsUsed: Array.isArray(ghost.mods_used) ? ghost.mods_used : [],
            verified: ghost.verified,
            ghostUrl: pb.files.getURL(ghost, ghost.ghost_data),
            keyUrl: ghost.key_data ? pb.files.getURL(ghost, ghost.key_data) : null,
            uploadedAt: ghost.created
        }));

        res.json({
            trackType: type,
            trackId: id,
            leaderboard,
            totalEntries: result.totalItems
        });

    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// get best ghost for a track
router.get('/:type/:id/best', async (req, res) => {
    const { type, id } = req.params;
    const includeGuests = req.query.guests !== 'false';

    if (!['frhd', 'bhr', 'cr', 't'].includes(type)) {
        return res.status(400).json({ error: 'Invalid track type' });
    }

    try {
        let filter = `track_type = "${type}" && track_id = "${id}"`;
        if (!includeGuests) {
            filter += ' && is_guest = false';
        }

        const result = await pb.collection('ghosts').getList(1, 1, {
            filter: filter,
            sort: 'time_ticks',
            requestKey: `best-ghost-${type}-${id}-${Date.now()}`
        });

        if (result.items.length === 0) {
            return res.json({ hasGhost: false });
        }

        const ghost = result.items[0];

        res.json({
            hasGhost: true,
            username: ghost.username,
            userId: ghost.user_id,
            isGuest: ghost.is_guest || false,
            time: ghost.time_formatted,
            timeTicks: ghost.time_ticks,
            vehicle: ghost.vehicle,
            hatColor: ghost.hat_color,
            hatType: ghost.hat_type,
            vehicleColor: ghost.vehicle_color,
            riderColor: ghost.rider_color,
            crBmx: ghost.cr_bmx,
            crMtb: ghost.cr_mtb,
            ghostUrl: pb.files.getURL(ghost, ghost.ghost_data),
            keyUrl: ghost.key_data ? pb.files.getURL(ghost, ghost.key_data) : null
        });

    } catch (error) {
        console.error('Best ghost error:', error);
        res.status(500).json({ error: 'Failed to fetch ghost' });
    }
});

// get user's ghosts
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 20, 100);

    try {
        const result = await pb.collection('ghosts').getList(page, perPage, {
            filter: `username = "${username}"`,
            sort: '-created',
            requestKey: `user-ghosts-${username}-${Date.now()}`
        });

        const ghosts = result.items.map(ghost => ({
            trackType: ghost.track_type,
            trackId: ghost.track_id,
            time: ghost.time_formatted,
            timeTicks: ghost.time_ticks,
            vehicle: ghost.vehicle,
            verified: ghost.verified,
            hatColor: ghost.hat_color,
            hatType: ghost.hat_type,
            vehicleColor: ghost.vehicle_color,
            riderColor: ghost.rider_color,
            crBmx: ghost.cr_bmx,
            crMtb: ghost.cr_mtb,
            ghostUrl: pb.files.getURL(ghost, ghost.ghost_data),
            keyUrl: ghost.key_data ? pb.files.getURL(ghost, ghost.key_data) : null,
            uploadedAt: ghost.created
        }));

        res.json({
            username,
            ghosts,
            pagination: {
                page,
                perPage,
                totalItems: result.totalItems,
                totalPages: result.totalPages
            }
        });

    } catch (error) {
        console.error('User ghosts error:', error);
        res.status(500).json({ error: 'Failed to fetch user ghosts' });
    }
});

/*
// delete ghost (own ghosts only, requires login)
router.delete('/:type/:id', requireAuth, async (req, res) => {
    const { type, id } = req.params;

    if (!['frhd', 'bhr', 'cr', 't'].includes(type)) {
        return res.status(400).json({ error: 'Invalid track type' });
    }

    try {
        const result = await pb.collection('ghosts').getList(1, 1, {
            filter: `track_type = "${type}" && track_id = ${id} && user_id = ${req.user.uid}`,
            requestKey: `delete-ghost-${type}-${id}-${Date.now()}`
        });

        if (result.items.length === 0) {
            return res.status(404).json({ error: 'Ghost not found or not yours' });
        }

        await pb.collection('ghosts').delete(result.items[0].id);

        console.log(`[Ghost] Deleted: ${req.user.username} on ${type}/${id}`);

        res.json({ success: true, message: 'Ghost deleted' });

    } catch (error) {
        console.error('Ghost delete error:', error);
        res.status(500).json({ error: 'Failed to delete ghost' });
    }
});
*/

// get all ghosts (for ghost mode in db view)
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = Math.min(parseInt(req.query.perPage) || 24, 100);
    const sortBy = req.query.sort || 'time_ticks';
    const sortOrder = req.query.order || 'asc';
    const query = req.query.q || '';
    const trackType = req.query.type || '';
    const player = req.query.player || '';
    
    const trackLinksLookup = req.trackLinksLookup || new Map();
    const findPlayerAliases = req.findPlayerAliases || ((name) => ({ aliases: [name] }));

    try {
        let filter = '';
        const filterParts = [];
        
        if (trackType && ['frhd', 'bhr', 'cr', 't'].includes(trackType)) {
            filterParts.push(`track_type = "${trackType}"`);
        }
        
        if (player) {
            const playerInfo = findPlayerAliases(player);
            console.log('[Ghosts API] Player aliases for', player, ':', playerInfo.aliases);
            
            if (playerInfo.aliases && playerInfo.aliases.length > 0) {
                const aliasConditions = playerInfo.aliases.map(alias => {
                    const escaped = alias.replace(/"/g, '\\"');
                    return `username ~ "${escaped}"`;
                }).join(' || ');
                filterParts.push(`(${aliasConditions})`);
            } else {
                const escapedPlayer = player.replace(/"/g, '\\"');
                filterParts.push(`username ~ "${escapedPlayer}"`);
            }
        }

        if (query) {
            const escapedQuery = query.replace(/"/g, '\\"');
            filterParts.push(`(username ~ "${escapedQuery}")`);
        }
        
        if (filterParts.length > 0) {
            filter = filterParts.join(' && ');
        }
        
        let sortField;
        switch (sortBy) {
            case 'time_ticks':
                sortField = sortOrder === 'asc' ? 'time_ticks' : '-time_ticks';
                break;
            case 'name':
                sortField = sortOrder === 'asc' ? 'username' : '-username';
                break;
            case 'published':
                sortField = sortOrder === 'asc' ? 'created' : '-created';
                break;
            case 'shuffle':
                sortField = '@random';
                break;
            default:
                sortField = 'time_ticks';
        }

        const result = await pb.collection('ghosts').getList(page, perPage, {
            filter: filter || undefined,
            sort: sortField,
            requestKey: `ghosts-list-${page}-${Date.now()}`
        });

        const tracksByType = { frhd: [], bhr: [], cr: [], t: [] };
        for (const ghost of result.items) {
            if (tracksByType[ghost.track_type]) {
                tracksByType[ghost.track_type].push(ghost.track_id);
            }
        }

        const trackCache = new Map();

        for (const [type, ids] of Object.entries(tracksByType)) {
            if (ids.length === 0) continue;

            const uniqueIds = [...new Set(ids)];

            if (type === 't') {
                const uniqueIds = [...new Set(ids)];
                for (const id of uniqueIds) {
                    const linked = trackLinksLookup.get(`t-${id}`) ||
                        Array.from(trackLinksLookup.values()).find(l => l.canonical === id);
                    if (linked) {
                        trackCache.set(`t-${id}`, {
                            name: linked.name || id,
                            authors: linked.authors ? linked.authors.join(', ') : '',
                            authorsArray: linked.authors || [],
                            username: ''
                        });
                    }
                }
                continue;
            }

            try {
                const idFilter = uniqueIds.map(id => `_id = "${id}"`).join(' || ');

                const tracks = await pb.collection(type).getFullList({
                    filter: idFilter,
                    fields: '_id,name,authors,username',
                    requestKey: `ghost-tracks-${type}-${Date.now()}`
                });

                for (const track of tracks) {
                    const cacheKey = `${type}-${track._id}`;

                    let authorsArray = [];
                    if (track.authors) {
                        try {
                            if (typeof track.authors === 'string') {
                                authorsArray = JSON.parse(track.authors);
                            } else if (Array.isArray(track.authors)) {
                                authorsArray = track.authors;
                            }
                        } catch (e) {
                            authorsArray = [track.authors];
                        }
                    }

                    trackCache.set(cacheKey, {
                        name: track.name || `${type.toUpperCase()} Track #${track._id}`,
                        authors: Array.isArray(authorsArray) ? authorsArray.join(', ') : (track.authors || ''),
                        authorsArray: authorsArray,
                        username: track.username || ''
                    });
                }
            } catch (e) {
                console.log(`Track batch lookup failed for ${type}:`, e.message);
            }
        }

        const ghosts = result.items.map(ghost => {
            const cacheKey = `${ghost.track_type}-${ghost.track_id}`;
            const trackInfo = trackCache.get(cacheKey) || {
                name: `Track #${ghost.track_id}`,
                authors: '',
                authorsArray: [],
                username: ''
            };

            const linked = trackLinksLookup.get(cacheKey);

            let badges = [ghost.track_type];
            let trackName = trackInfo.name;
            let trackAuthors = trackInfo.authors;
            let trackAuthorsArray = trackInfo.authorsArray;
            let urlType = ghost.track_type;
            let urlId = ghost.track_id;

            if (linked) {
                if (linked.name) {
                    trackName = linked.name;
                }

                badges = [...new Set(linked.tracks.map(t => t.type))];

                if (linked.authors && linked.authors.length > 0) {
                    trackAuthorsArray = [...linked.authors];
                    trackAuthors = trackAuthorsArray.join(', ');
                }

                const typePriority = ['t', 'cr', 'bhr', 'frhd'];
                for (const priorityType of typePriority) {
                    const found = linked.tracks.find(t => t.type === priorityType);
                    if (found) {
                        urlType = found.type;
                        urlId = found.id;
                        break;
                    }
                }
            }

            return {
                id: ghost.id,
                trackType: ghost.track_type,
                trackId: ghost.track_id,
                trackName: trackName,
                trackAuthors: trackAuthors,
                trackAuthorsArray: trackAuthorsArray,
                trackUsername: trackInfo.username,
                badges: badges,
                urlType: urlType,
                urlId: urlId,
                ghostUsername: ghost.username,
                ghostUserId: ghost.user_id,
                isGuest: ghost.is_guest || false,
                time: ghost.time_formatted,
                timeTicks: ghost.time_ticks,
                vehicle: ghost.vehicle,
                hatColor: ghost.hat_color,
                hatType: ghost.hat_type,
                vehicleColor: ghost.vehicle_color,
                riderColor: ghost.rider_color,
                crBmx: ghost.cr_bmx,
                crMtb: ghost.cr_mtb,
                modsUsed: Array.isArray(ghost.mods_used) ? ghost.mods_used : [],
                verified: ghost.verified,
                ghostUrl: pb.files.getURL(ghost, ghost.ghost_data),
                keyUrl: ghost.key_data ? pb.files.getURL(ghost, ghost.key_data) : null,
                uploadedAt: ghost.created
            };
        });

        res.json({
            ghosts,
            pagination: {
                page,
                perPage,
                totalItems: result.totalItems,
                totalPages: result.totalPages
            },
            player: player || null
        });

    } catch (error) {
        console.error('Ghosts list error:', error);
        res.status(500).json({ error: 'Failed to fetch ghosts' });
    }
});

module.exports = router;