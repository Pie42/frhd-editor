const WebSocket = require('ws');

const BINARY_FRAME_TYPE = 0x01;
const PLAYER_ID_LENGTH = 12;
const liveSessions = new Map();
const WS_OPEN = WebSocket.OPEN;

function generatePlayerId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

function setupLiveRacing(server) {
    const wss = new WebSocket.Server({
        server,
        perMessageDeflate: false
    });

    wss.on('connection', (ws) => {
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
                    username = msg.username || 'Anonymous';
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
                        hatType: msg.hatType || 'none'
                    });

                    const players = [];
                    for (const [id, p] of session) {
                        players.push({
                            playerId: id,
                            username: p.username,
                            vehicleType: p.vehicleType,
                            hatColor: p.hatColor,
                            hatType: p.hatType
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
                        hatType: msg.hatType || 'none'
                    }, playerId);
                }
            } catch (e) {
                console.error('[Live] Error:', e.message);
            }
        });

        ws.on('close', () => {
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

module.exports = { setupLiveRacing };