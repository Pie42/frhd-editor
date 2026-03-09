const WebSocket = require('ws');

const BINARY_FRAME_TYPE = 0x01;
const PLAYER_ID_LENGTH = 12;
const liveSessions = new Map();
const WS_OPEN = WebSocket.OPEN;

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function parseCookies(req) {
    const cookies = {};
    const header = req?.headers?.cookie;
    if (!header) return cookies;
    header.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        const key = parts[0].trim();
        cookies[key] = decodeURIComponent(parts.slice(1).join('='));
    });
    return cookies;
}

function generatePlayerId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

function setupLiveRacing(server) {
    const wss = new WebSocket.Server({
        server,
        perMessageDeflate: false
    });

    wss.on('connection', (ws, req) => {
        ws._req = req;
        let trackId = null;
        let playerId = null;
        let playerIdBuffer = null;
        let username = 'Anonymous';
        let session = null;

        ws.on('message', (data, isBinary) => {
            try {
                if (isBinary) {
                    if (!session || !playerId) return;

                    const buffer = Buffer.from(data);
                    if (buffer.length < 5 || buffer[0] !== BINARY_FRAME_TYPE) return;

                    const outLength = 1 + PLAYER_ID_LENGTH + buffer.length - 1;
                    const outBuffer = Buffer.allocUnsafe(outLength);

                    outBuffer[0] = BINARY_FRAME_TYPE;
                    playerIdBuffer.copy(outBuffer, 1);
                    buffer.copy(outBuffer, 1 + PLAYER_ID_LENGTH, 1);

                    for (const [pid, p] of session) {
                        if (pid !== playerId && p.ws.readyState === WS_OPEN) {
                            p.ws.send(outBuffer);
                        }
                    }
                    return;
                }

                const str = typeof data === 'string' ? data : data.toString();
                const msg = JSON.parse(str);

                if (msg.type === 'join') {
                    trackId = msg.trackId;
                    if (trackId === 'undefined/undefined') return;
                    console.log('[Live] Join request for track:', msg.trackId);

                    const cookies = parseCookies(ws._req);
                    const nbbToken = cookies['nbb_token'];
                    if (nbbToken) {
                        try {
                            const decoded = jwt.verify(nbbToken, JWT_SECRET);
                            username = decoded.username || 'Guest';
                        } catch (e) {
                            username = 'Guest';
                        }
                    } else {
                        username = 'Guest';
                    }

                    playerId = generatePlayerId();

                    playerIdBuffer = Buffer.alloc(PLAYER_ID_LENGTH);
                    playerIdBuffer.write(playerId);

                    if (!liveSessions.has(trackId)) {
                        liveSessions.set(trackId, new Map());
                    }

                    session = liveSessions.get(trackId);
                    session.set(playerId, {
                        ws,
                        username,
                        vehicleType: msg.vehicleType || 'BMX',
                        hatColor: msg.hatColor || '#000000',
                        hatType: msg.hatType || 'none',
                        vehicleColor: msg.vehicleColor || null,
                        riderColor: msg.riderColor || null,
                        crBmx: msg.crBmx || false,
                        crMtb: msg.crMtb || false,
                        propeller: msg.propeller || false
                    });

                    const players = [];
                    for (const [id, p] of session) {
                        players.push({
                            playerId: id,
                            username: p.username,
                            vehicleType: p.vehicleType,
                            hatColor: p.hatColor,
                            hatType: p.hatType,
                            vehicleColor: p.vehicleColor,
                            riderColor: p.riderColor,
                            crBmx: p.crBmx,
                            crMtb: p.crMtb,
                            propeller: p.propeller || false
                        });
                    }

                    ws.send(JSON.stringify({
                        type: 'joined',
                        playerId,
                        players
                    }));

                    broadcastJSON(session, {
                        type: 'player_joined',
                        playerId,
                        username,
                        vehicleType: msg.vehicleType || 'BMX',
                        hatColor: msg.hatColor || '#000000',
                        hatType: msg.hatType || 'none',
                        vehicleColor: msg.vehicleColor || null,
                        riderColor: msg.riderColor || null,
                        crBmx: msg.crBmx || false,
                        crMtb: msg.crMtb || false,
                        propeller: msg.propeller || false
                    }, playerId);
                } else if (msg.type === 'ghost-uploaded' && session && playerId) {
                    broadcastJSON(session, {
                        type: 'ghost-uploaded',
                        playerId,
                        username
                    }, playerId);
                } else if (msg.type === 'appearance' && session && playerId) {
                    const playerInfo = session.get(playerId);
                    if (playerInfo) {
                        playerInfo.hatColor = msg.hatColor;
                        playerInfo.hatType = msg.hatType;
                        playerInfo.vehicleColor = msg.vehicleColor;
                        playerInfo.riderColor = msg.riderColor || null;
                        playerInfo.crBmx = msg.crBmx || false;
                        playerInfo.crMtb = msg.crMtb || false;
                        playerInfo.propeller = msg.propeller || false;
                    }

                    broadcastJSON(session, {
                        type: 'appearance',
                        playerId: playerId,
                        hatColor: msg.hatColor,
                        hatType: msg.hatType,
                        vehicleColor: msg.vehicleColor,
                        riderColor: msg.riderColor || null,
                        crBmx: msg.crBmx || false,
                        crMtb: msg.crMtb || false,
                        propeller: msg.propeller || false
                    }, playerId);
                }
            } catch (e) {
                console.error('[Live] Error:', e.message);
            }
        });

        ws.on('close', (code, reason) => {
            console.log('[Live] Connection closed:', code, reason?.toString());
            if (session && playerId) {
                session.delete(playerId);

                if (session.size === 0) {
                    liveSessions.delete(trackId);
                } else {
                    broadcastJSON(session, {
                        type: 'player_left',
                        playerId,
                        username
                    }, playerId);
                }
            }

            session = null;
            playerIdBuffer = null;
        });

        ws.on('error', (e) => {
            console.error('[Live] WS Error:', e.message);
        });
    });

    function broadcastJSON(session, msg, excludeId) {
        const str = JSON.stringify(msg);
        for (const [pid, p] of session) {
            if (pid !== excludeId && p.ws.readyState === WS_OPEN) {
                p.ws.send(str);
            }
        }
    }
}

module.exports = { setupLiveRacing, liveSessions };