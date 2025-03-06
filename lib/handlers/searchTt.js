const axios = require ('axios')
const FormData = require ('form-data')
const baileys = require ('@whiskeysockets/baileys')

const ttSearch = async (query, count = 3) => {
    try {
        let d = new FormData();
        d.append("keywords", query);
        d.append("count", count);
        d.append("cursor", 0);
        d.append("web", 1);
        d.append("hd", 1);

        let h = { headers: { ...d.getHeaders() } };
        let { data } = await axios.post("https://tikwm.com/api/feed/search", d, h);

        if (!data.data || !data.data.videos) return [];
        
        const baseURL = "https://tikwm.com";
        return data.data.videos.map(video => ({
            play: baseURL + video.play
        }));
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function sendVideoAlbum(rinn, m, videos, caption) {
    const album = baileys.generateWAMessageFromContent(m.chat, {
        albumMessage: {
            expectedVideoCount: videos.length, 
            contextInfo: m.quoted ? {
                remoteJid: m.quoted.key.remoteJid,
                fromMe: m.quoted.key.fromMe,
                stanzaId: m.quoted.key.id,
                participant: m.quoted.key.participant || m.quoted.key.remoteJid,
                quotedMessage: m.quoted.message
            } : {}
        }
    }, { quoted: m });

    await rinn.relayMessage(album.key.remoteJid, album.message, {
        messageId: album.key.id
    });

    for (const [index, video] of videos.entries()) {
        const msg = await baileys.generateWAMessage(album.key.remoteJid, {
            video: { url: video.play },
            ...(index === 0 ? { caption } : {}) 
        }, {
            upload: rinn.waUploadToServer
        });

        msg.message.messageContextInfo = {
            messageAssociation: {
                associationType: 1,
                parentMessageKey: album.key
            }
        };
        await rinn.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id
        });
    }
}

module.exports = { ttSearch, sendVideoAlbum };
