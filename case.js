require('./settings')
require('./App/menu');
const {
    downloadContentFromMessage,
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    InteractiveMessage,
    getContentType
} = require('@whiskeysockets/baileys');
const {
    exec
} = require('child_process');
const systeminformation = require('systeminformation');
const cheerio = require("cheerio");
const os = require('os');
const chalk = require('chalk');
const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment-timezone');
const sharp = require('sharp');
const path = require('path');
const jimp = require('jimp');
const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');
const qrCodeReader = require('qrcode-reader');
const {
    fromBuffer
} = require("file-type");
const undici = require("undici");
const ms = require('parse-ms');
const {
    extension
} = require("mime-types");
const {
    html
} = require("js-beautify");
const {
    createWriteStream
} = require('fs');
const {
    promisify,
    util
} = require('util');
const stream = require('stream');
const quoteApi = require('@neoxr/quote-api')
const {
    Sticker
} = require('wa-sticker-formatter')
const {
    getVideoInfo,
    downloadAudio,
    downloadVideo
} = require('hybrid-ytdl');
const yts = require('yt-search');
const {
    addAfkUser,
    checkAfkUser,
    getAfkId,
    getAfkPosition,
    getAfkReason,
    getAfkTime
} = require('./App/afk');
const {
    addExif
} = require('./App/function/exif')
const {
    smsg,
    await,
    clockString,
    delay,
    enumGetKey,
    fetchBuffer,
    fetchJson,
    format,
    formatDate,
    formatp,
    generateProfilePicture,
    getBuffer,
    getGroupAdmins,
    getRandom,
    isUrl,
    json,
    logic,
    msToDate,
    parseMention,
    runtime,
    sleep,
    sort,
    toNumber
} = require('./App/function/myfunc');
const {
    bytesToSize,
    checkBandwidth,
    formatSize,
    jsonformat,
    nganuin,
    shorturl,
    color
} = require("./App/function/funcc");
const {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg,
    addExifAvatar
} = require('./App/function/converter');
const {
    remini
} = require('./App/remini');
const {
    tmpfiles,
    Uguu,
    gofile,
    catbox,
    mediaUploader,
    videy,
    caliph,
    doods,
    picu,
    btch
} = require('./App/uploader');
const pipeline = promisify(stream.pipeline);
const aiGroupStatus = new Map();
const {
    execSync
} = require('child_process');
const afk = JSON.parse(fs.readFileSync('./storage/afk.json'));
const owner = JSON.parse(fs.readFileSync('./storage/role/owner.json'));
const pluginController = require('./lib/plug.js');
const {
    handleAIPrivate,
    replyAI
} = require('./lib/handlers/aiPrivateHandler');
const StateManager = require('./App/stateManager');
const {
    handleNext,
    handleStop
} = require('./lib/NextStop');
const handleAI = require('./lib/handlers/aiClaude');
const Mirror = require('./lib/handlers/tlMirror');
const {
    handleAnilistSearch,
    handleAnilistDetail,
    handleAnilistPopular
} = require('./lib/handlers/aiAnilist');
const {
    handleAppleMusicSearch,
    handleAppleMusicDownload
} = require('./lib/handlers/dlAppleMusic');
const {
    handleTtsave
} = require('./lib/handlers/dlTtsave');
const {
    tiktokSearchVideo,
    tiktokDownloaderVideo
} = require('./lib/handlers/tiktok');
const {
    ttSearch,
    sendVideoAlbum
} = require('./lib/handlers/searchTt');
const { stickerSearch, downloadPinterest } = require('./lib/handlers/restapi.js');
const fetchTwitterMedia = require('./lib/handlers/dlTwitter');
const handlePxpic = require('./lib/handlers/dlPxpic');
const { handleIgram } = require('./lib/handlers/dlIgram');
const {
    handleFacebookDownload
} = require('./lib/handlers/dlFesnuk');
const pkg = require(process.cwd() + "/package.json")
const botInfo = { uptime: runtime(process.uptime()) };

moment.locale('id');

const searchResults = new Map();
const userStates = new Map();
const setState = (userId, state, data = null) => {
    userStates.set(userId, {
        state,
        timestamp: Date.now(),
        data
    });
};

const getState = (userId) => {
    const state = userStates.get(userId);
    if (!state) return null;

    if (Date.now() - state.timestamp > 5 * 60 * 1000) {
        userStates.delete(userId);
        return null;
    }
    return state;
};

function formatMessage(text, mentions = []) {
    // Ganti semua placeholder mention dengan format yang benar
    mentions.forEach(jid => {
        const mentionFormat = `@${jid.replace(/@.+/, '')}`;
        // Ganti semua instance dari nomor tersebut dengan format mention
        text = text.replace(new RegExp(jid.replace(/@.+/, ''), 'g'), mentionFormat.slice(1));
    });
    return text;
}
async function sendMessageWithMentions(rinn, conn, msg, text, additionalMentions = []) {
    if (msg.key && msg.key.remoteJid) {
        // Gabungkan mentions dari sender dan mentions tambahan
        const mentionedJid = [
            msg.sender || msg.key.participant || msg.key.remoteJid,
            ...additionalMentions
        ].filter(Boolean); // Filter out any undefined values

        // Format ulang pesan dengan mentions
        const formattedText = formatMessage(text, mentionedJid);

        await rinn.sendMessage(msg.key.remoteJid, {
            text: formattedText,
            mentions: mentionedJid
        }, {
            quoted: msg
        });
    }
}
try {
    let rawData = fs.readFileSync(`./storage/${tempatDB}`);
    global.db.data = JSON.parse(rawData) || {};
} catch (err) {
    console.error(`⚠️ Gagal memuat ${tempatDB}, menggunakan struktur default.`);
    global.db.data = {};
}

const CDN = [
    'cdn.pd1.workers.dev',
    'cdn.pd6.workers.dev',
    'cdn.pd7.workers.dev',
    'cdn.pd8.workers.dev',
    'cdn.pd10.workers.dev'
];

module.exports.handleIncomingMessage = async (rinn, msg, m) => {
    try {
        const body = m.body
        const budy = m.text
const validPrefixes = prefa
const prefix = validPrefixes.find(p => body && body.startsWith(p)) || ''
const isCmd = prefix !== '' && body.length > prefix.length
        const from = m.key.remoteJid
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1);
        const full_args = body.replace(command, '').slice(1).trim();
        const botNumber = await rinn.decodeJid(rinn.user.id);
        const senderNumber = m.sender ? m.sender.replace(/[^0-9]/g, '') : '';
        const {
            type,
            fromMe
        } = m
        const sender = msg.key.remoteJid;
        const itsMe = (m && m.sender && m.sender == botNumber) || false;
        const text = q = args.join(" ");
        var msg_text = (typeof m.text === 'string') ? m.text : '';
        const fatkuns = m && (m.quoted || m);
        const quoted = (fatkuns?.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] :
            (fatkuns?.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] :
            (fatkuns?.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] :
            m.quoted || m;
        const mime = ((quoted?.msg || quoted) || {}).mimetype || '';
        const qmsg = (quoted?.msg || quoted);
        const isMedia = /image|video|sticker|audio/.test(mime);
        const isImage = (type === 'imageMessage')
        const isVideo = (type === 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isAudio = (type == 'audioMessage')
        const groupMetadata = m.isGroup ? await rinn.groupMetadata(m.chat).catch(e => {}) : {};
        const participants = m.isGroup ? await groupMetadata.participants || [] : [];
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) || [] : [];
        const isAfkOn = checkAfkUser(m.sender, afk)
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
        const isBot = botNumber.includes(senderNumber)
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
        const groupOwner = m.isGroup ? groupMetadata.owner || '' : '';
        const isGroupOwner = m.isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false;
        const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
        const timezone = 'Asia/Jakarta';
        const jam = moment().tz(timezone).format('dddd DD-MM-YYYY HH:mm:ss');
        const isGroup = sender.endsWith('@g.us');
        const pushname = msg.pushName || 'User';
        const isCreator = (() => {
            if (!global.owner) return false;
            const ownerNumber = global.owner.replace(/[^0-9]/g, '');
            return senderNumber === ownerNumber;
        })();
        const packnames = `Sticker`;
        const authors = `Dibuat pada\n${jam}\n`;
        const more = String.fromCharCode(8206);
        const readmore = more.repeat(4001);

        // Cek apakah pesan me-reply bot
        const isReplyToBot = msg.message?.extendedTextMessage?.contextInfo?.participant === global.nomorbot;

        // Cek apakah ada mention ke bot
        const hasMention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(global.nomorbot);
        console.log(
            chalk.green(`[${new Date().toLocaleTimeString()}]`) +
            chalk.blue(` Group: `) + chalk.bold(msg.key.remoteJid.includes('@g.us') ? msg.key.remoteJid : 'Private Chat') +
            chalk.blue(` Pesan diterima dari `) +
            chalk.bold(msg.key.participant || sender) +
            chalk.yellow(` "${budy || ''}"`) +
            chalk.magenta(` (Type: ${m.mtype})`)
        );

        function pickRandom(list) {
            return list[Math.floor(list.length * Math.random())]
        }
        if (!db.data.settings) db.data.settings = {};
        if (!db.data.settings[botNumber]) db.data.settings[botNumber] = {};

        let chats = db.data.chats[m.chat] || {};
        if (typeof chats !== 'object') db.data.chats[m.chat] = {};
        db.data.chats[m.chat] = chats;

        if (!('badword' in chats)) chats.badword = false;

        let setting = db.data.settings[botNumber] || {};
        if (typeof setting !== 'object') db.data.settings[botNumber] = {};

        if (!('autobio' in setting)) setting.autobio = false;
        if (!('autoread' in setting)) setting.autoread = false;
        if (!('autorecordtype' in setting)) setting.autorecordtype = false;
        if (!('autorecord' in setting)) setting.autorecord = false;
        if (!('autotype' in setting)) setting.autotype = false;
        if (!rinn.public) {
            if (!isCreator && !m.key.fromMe) return;
        };

        if (db.data.settings[botNumber].online) {
            if (command) {
                rinn.sendPresenceUpdate('unavailable', m.chat);
            }
        }

        if (db.data.settings[botNumber].autoread) {
            rinn.readMessages([m.key]);
        }

        if (db.data.settings[botNumber].autobio) {
            rinn.updateProfileStatus(`Telah Berjalan Selama ${botInfo.uptime}`).catch(_ => _);
        }

        if (db.data.settings[botNumber].autorecordtype) {
            if (command) {
                let mix = ['composing', 'recording'];
                let mix2 = mix[Math.floor(mix.length * Math.random())];
                rinn.sendPresenceUpdate(mix2, m.chat);
            }
        }

        if (db.data.settings[botNumber].autorecord) {
            if (command) {
                let mix = ['recording'];
                let mix2 = mix[Math.floor(mix.length * Math.random())];
                rinn.sendPresenceUpdate(mix2, m.chat);
            }
        }

        if (db.data.settings[botNumber].autotype) {
            if (command) {
                let pos = ['composing'];
                rinn.sendPresenceUpdate(pos, m.chat);
            }
        }
        async function reactionMessage(emo) {
            rinn.sendMessage(m.chat, {
                react: {
                    text: emo,
                    key: m.key
                }
            });
        }
        if (m.isGroup && !m.key.fromMe) {
            let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
            for (let ment of mentionUser) {
                if (checkAfkUser(ment, afk)) {
                    let getId2 = getAfkId(ment, afk)
                    let getReason2 = getAfkReason(getId2, afk)
                    let getTimee = Date.now() - getAfkTime(getId2, afk)
                    let anu2 = ms(getTimee)
                    m.reply(
                        `Jangan ganggu dia\n\n` +
                        `*Alasan:* ${getReason2}\n` +
                        `*Sejak:* ${anu2.hours} Jam, ${anu2.minutes} Menit, ${anu2.seconds} Detik`
                    )
                }
            }

            if (checkAfkUser(m.sender, afk)) {
                let getId = getAfkId(m.sender, afk)
                let getReason = getAfkReason(getId, afk)
                let getTime = Date.now() - getAfkTime(getId, afk)
                let anu = ms(getTime)
                afk.splice(getAfkPosition(m.sender, afk), 1)
                fs.writeFileSync('./storage/afk.json', JSON.stringify(afk))
                rinn.sendTextWithMentions(
                    m.chat,
                    `Selamat datang kembali @${m.sender.split('@')[0]}\n\n` +
                    `Kamu telah afk selama: ${anu.hours} Jam, ${anu.minutes} Menit, ${anu.seconds} Detik`,
                    m
                )
            }
        }
        if (db.data.chats[m.chat].antiviewonce && m.isGroup && m.mtype == 'viewOnceMessageV2') {
            let val = {
                ...m
            };
            let msg = val.message?.viewOnceMessage?.message || val.message?.viewOnceMessageV2?.message;
            delete msg[Object.keys(msg)[0]].viewOnce;
            val.message = msg;
            await rinn.sendMessage(m.chat, {
                forward: val
            }, {
                quoted: m
            });
        }
        // Handle private chat tanpa prefix
        if (!isGroup && !prefix) {
            console.log('Private chat terdeteksi...');
            await handleAIPrivate(rinn, msg, budy);
            return;
        }
        const pluginContext = {
            rinn,
            msg,
            m,
            command,
            prefix,
            args,
            text: q,
            from,
            sender,
            isGroup,
            groupMetadata,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            isCreator,
            pushname,
            reply: (text) => reply(rinn, msg, text),
            sendMessageWithMentions: (text, mentions) => sendMessageWithMentions(rinn, conn, msg, text, mentions),
            reactionMessage: (emo) => reactionMessage(emo),
            setState,
            getState,
        };

        let pluginHandled = false;
        if (isCmd) {
            pluginHandled = await pluginController.handleCommand(m, pluginContext, command);
        }
        if (!pluginHandled && isCmd) {
        switch (command) {

case 'owner': {
var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
"contactMessage": {
"displayName": "Nomor Developer",
"vcard": `BEGIN:VCARD
VERSION:3.0
N:;;;;
FN: Rizky
item1.TEL;waid=6281391620354:+6281391620354
item1.X-ABLabel:Ponsel
X-WA-BIZ-DESCRIPTION: JANGAN DI SPAM
X-WA-BIZ-NAME:
END:VCARD`,
}
}), {
userJid: m.chat,
quoted: m
})
rinn.relayMessage(m.chat, contact.message, {
messageId: contact.key.id
})
}
break;




            case 'tikel':
            case 'stiker':
            case 'sticker':
            case 's': {
                try {
                    if (!quoted && !(msg.message?.imageMessage || msg.message?.videoMessage)) {
                        return rinn.sendMessage(sender, {
                            text: `Kirim/Reply Gambar/Video/Gif Dengan Caption ${prefix + command}`,
                            quoted: msg
                        });
                    }

                    let mediaData;
                    if (quoted) {
                        if (!/image|video/g.test(mime)) {
                            return rinn.sendMessage(sender, {
                                text: 'Media yang di-reply harus berupa gambar/video/gif!',
                                quoted: msg
                            });
                        }

                        if (/video/g.test(mime)) {
                            if ((quoted.msg || quoted).seconds > 10) {
                                return rinn.sendMessage(sender, {
                                    text: 'Maksimal durasi video 10 detik!',
                                    quoted: msg
                                });
                            }
                        }

                        mediaData = await rinn.downloadAndSaveMediaMessage(quoted);
                    } else {
                        if (msg.message.imageMessage) {
                            media = await rinn.downloadAndSaveMediaMessage(quoted);
                        } else if (msg.message.videoMessage) {
                            if (msg.message.videoMessage.seconds > 10) {
                                return rinn.sendMessage(sender, {
                                    text: 'Maksimal durasi video 10 detik!',
                                    quoted: msg
                                });
                            }
                            mediaData = await rinn.downloadAndSaveMediaMessage(quoted);
                        }
                    }

                    let packname = args.length > 1 ? args.join(' ') : packnames;
                    let author = authors;

                    const stickerMetadata = {
                        type: 'full',
                        pack: packname,
                        author: author,
                        quality: 100 // You can adjust quality (1-100)
                    };

                    if (/image/.test(mime)) {
                        let sticker = await new Sticker(mediaData, stickerMetadata)
                            .toBuffer();
                        await rinn.sendFile(m.chat, sticker, 'sticker.webp', '', m);
                    } else if (/video/.test(mime)) {
                        let sticker = await rinn.sendVideoAsSticker(m.chat, mediaData, m, stickerMetadata);
                        await fs.unlinkSync(sticker);
                    }

                } catch (error) {
                    console.error('Error in sticker creation:', error);
                    await reply(rinn, msg, 'Gagal membuat sticker! Pastikan media yang dikirim valid.');
                }
            }
            break;
            case 'smeme':
            case 'stickermeme':
            case 'stickmeme': {
                if (!/webp/.test(mime) && /image/.test(mime)) {
                    if (!text) return m.reply(`Penggunaan: ${prefix + command} teks atas|teks bawah\nIsi dengan "_" jika ingin salah satu bagian kosong`);

                    atas = text.split('|')[0] ? text.split('|')[0] : '';
                    bawah = text.split('|')[1] ? text.split('|')[1] : '';

                    // First download the media as a file
                    let mediaPath = await rinn.downloadAndSaveMediaMessage(quoted);

                    // Read the file into a buffer
                    let mediaBuffer = fs.readFileSync(mediaPath);

                    // Upload the buffer using catbox
                    let mem;
                    try {
                        mem = await catbox(mediaBuffer);

                        // Clean up the temporary file
                        fs.unlinkSync(mediaPath);

                        let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`;

                        await rinn.sendImageAsSticker(m.chat, meme, m, {
                            packname: packnames,
                            author: authors
                        });
                    } catch (err) {
                        console.error('Error in smeme:', err);

                        // Clean up the temporary file
                        if (fs.existsSync(mediaPath)) {
                            fs.unlinkSync(mediaPath);
                        }

                        // Try alternative uploaders if available
                        try {
                            // Try Uguu as fallback
                            mem = await Uguu(mediaBuffer);

                            let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`;

                            await rinn.sendImageAsSticker(m.chat, meme, m, {
                                packname: packnames,
                                author: authors
                            });
                        } catch (altErr) {
                            console.error('All uploaders failed:', altErr);
                            return m.reply('Gagal mengupload gambar. Coba lagi nanti.');
                        }
                    }
                } else {
                    m.reply(`Kirim atau balas gambar dengan caption ${prefix + command} teks_atas|teks_bawah untuk membuat meme!`);
                }
            }
            break;
            case 'qc': {
                let text, orang;

                // Handle quoted message case
                if (m.quoted) {
                    const quotedMsg = m.quoted;
                    text = quotedMsg.text || '';
                    if (!text) {
                        return rinn.sendMessage(sender, {
                            text: 'Pesan yang di-reply harus mengandung text!'
                        }, {
                            quoted: msg
                        });
                    }
                    orang = quotedMsg.sender || quotedMsg.participant || msg.quoted.key.participant;
                }
                // Handle direct message case
                else {
                    if (!args[0]) {
                        return rinn.sendMessage(sender, {
                            text: 'Mana teksnya?',
                            quoted: msg
                        });
                    }
                    text = args.join(' ');
                    orang = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msg.sender;
                }

                // Color mapping
                const colorMap = {
                    '--merah': '#FF0000',
                    '--biru': '#0000FF',
                    '--hijau': '#00FF00',
                    '--kuning': '#FFFF00',
                    '--pink': '#FFC0CB',
                    '--ungu': '#800080',
                    '--orange': '#FFA500',
                    '--coklat': '#A52A2A',
                    '--abu': '#808080',
                    '--putih': '#FFFFFF'
                };

                // Check for color flags
                let backgroundColor = '#2E4053';
                for (const [flag, color] of Object.entries(colorMap)) {
                    if (text.includes(flag)) {
                        backgroundColor = color;
                        text = text.replace(flag, '').trim();
                        break;
                    }
                }

                // Get avatar and name
                const avatar = await rinn.profilePictureUrl(orang).catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg');
                const number = await rinn.getName(orang);

                // Prepare quote JSON
                const json = {
                    "type": "quote",
                    "format": "png",
                    "backgroundColor": backgroundColor,
                    "width": 512,
                    "height": 768,
                    "scale": 2,
                    "messages": [{
                        "entities": [],
                        "avatar": true,
                        "from": {
                            "id": 1,
                            "name": number,
                            "photo": {
                                "url": avatar
                            }
                        },
                        "text": text,
                        "replyMessage": {}
                    }]
                };

                // Create sticker function
                async function createSticker(req, url, quality) {
                    let stickerMetadata = {
                        type: 'full',
                        pack: packnames,
                        author: authors,
                        quality
                    }
                    return (new Sticker(req ? req : url, stickerMetadata)).toBuffer()
                }

                // Process and send sticker
                await reactionMessage('🕐');
                const res = await quoteApi(json)
                const buffer = Buffer.from(res.image, 'base64')
                let stiker = await createSticker(buffer, false)
                rinn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            }
            break;

case 'menu':
            case 'help': {
                try {
                    await reactionMessage('🕐');

                    const menuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄` +
                        `Silahkan pilih menu dibawah ini`;
                    let sections = [{
                        title: "Select Menu",
                        rows: [{
                                title: '📚All Menu',
                                description: `Tampilkan semua list menu sekaligus`,
                                id: `${prefix}allmenu`
                        },
                        {
                                title: '🤖AI Menu',
                                description: `Menu Artificial Intelligence`,
                                id: `${prefix}aimenu`
                            },
                            {
                                title: '🎆Anime Menu',
                                description: `Berisi info anime dan manga`,
                                id: `${prefix}animekmenu`
                            },
                            {
                                title: '📥Download Menu',
                                description: `Unduh file dengan mudah`,
                                id: `${prefix}dlmenu`
                            },
                            {
                                title: '👥Group Menu',
                                description: `Manajemen grup kalian`,
                                id: `${prefix}grupmenu`
                            },
                            {
                                title: '🔎Search Menu',
                                description: `Cari apa saja yang ada di internet`,
                                id: `${prefix}searchmenu`
                            },
                            {
                                title: '🖼️Sticker Menu',
                                description: `Generate dan dapatkan stiker WA yang kamu suka`,
                                id: `${prefix}stickmenu`
                            },
                            {
                                title: '🛠️Tools Menu',
                                description: `Alat alat yang dapat membantumu`,
                                id: `${prefix}tlmenu`
                            },
                            {
                                title: '🗿Other Menu',
                                description: `Menu tambahan yang mungkin berguna`,
                                id: `${prefix}othermenu`
                            },
                            {
                                title: '🗝️Owner Menu',
                                description: `Menu khusus pemilik bot ini~`,
                                id: `${prefix}ownermenu`
                            },
                        ]
                    }, ]

                    let listMessage = {
                        title: 'Click Here⎙',
                        sections
                    };
                    rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [{
                                buttonId: `${prefix}ping`,
                                buttonText: {
                                    displayText: 'PING'
                                },
                                type: 1,
                            },
                            {
                                buttonId: `${prefix}neofetch`,
                                buttonText: {
                                    displayText: 'Neofetch'
                                },
                                type: 1,
                            },
                            {
                                buttonId: 'action',
                                buttonText: {
                                    displayText: 'ini pesan interactiveMeta'
                                },
                                type: 4,
                                nativeFlowInfo: {
                                    name: 'single_select',
                                    paramsJson: JSON.stringify(listMessage),
                                },
                            },
                        ],
                        headerType: 1,
                        viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "99999999999999999999999",
 caption: menuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m });
                    
                    await rinn.sendMessage(m.chat, {
                        audio: fs.readFileSync("./lib/audio/audio.mp3"),
                        mimetype: 'audio/mp4',
                        ptt: true
                    }, {
                        quoted: m
                    });

                } catch (error) {
                    console.error('Error in menu command:', error);
                    await reply(rinn, m, 'Error occurred while displaying menu');
                }
                }
                break;

case 'allmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${allMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.menu`,
 buttonText: {
 displayText: "Main Menu"
 }, type: 1
 },
 {
 buttonId: `.aimenu`,
 buttonText: {
 displayText: "AI Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: fs.readFileSync('./lib/image/header.jpg'),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'aimenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${aiMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.allmenu`,
 buttonText: {
 displayText: "All Menu"
 }, type: 1
 },
 {
 buttonId: `.animekmenu`,
 buttonText: {
 displayText: "Anime Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'animekmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${animeMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.aimenu`,
 buttonText: {
 displayText: "AI Menu"
 }, type: 1
 },
 {
 buttonId: `.dlmenu`,
 buttonText: {
 displayText: "Download Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'dlmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${downloadMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.animemenu`,
 buttonText: {
 displayText: "Anime Menu"
 }, type: 1
 },
 {
 buttonId: `.grupmenu`,
 buttonText: {
 displayText: "Group Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'grupmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${groupMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.dlmenu`,
 buttonText: {
 displayText: "Download Menu"
 }, type: 1
 },
 {
 buttonId: `.searchmenu`,
 buttonText: {
 displayText: "Search Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 }
 break;
 case 'searchmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${searchMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.grupmenu`,
 buttonText: {
 displayText: "Group Menu"
 }, type: 1
 },
 {
 buttonId: `.stickmenu`,
 buttonText: {
 displayText: "Sticker Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'stickmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${stickerMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.searchmenu`,
 buttonText: {
 displayText: "Search Menu"
 }, type: 1
 },
 {
 buttonId: `.tlmenu`,
 buttonText: {
 displayText: "Tool Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'tlmenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${toolsMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.stickmenu`,
 buttonText: {
 displayText: "Sticker Menu"
 }, type: 1
 },
 {
 buttonId: `.othermenu`,
 buttonText: {
 displayText: "Download Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 case 'othermenu': {
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${animeMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.tlmenu`,
 buttonText: {
 displayText: "Tool Menu"
 }, type: 1
 },
 {
 buttonId: `.allmenu`,
 buttonText: {
 displayText: "All Menu"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;
 
 
 case 'ownermenu': {
if (!isCreator) return
		const MenuText = `
╔┅━┅━┅━*[ 𝗜𝗡𝗙𝗢 ]*━┅━┅━┅⋄
│  〆 Runtime: ${botInfo.uptime}
│  〆 Type: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│  〆 Mode: ${rinn.public ? 'Public' : 'Self'}
│  〆 Version: ${pkg.version}
│  〆 Prefix: ${prefix}
│  〆 Total chat: ${Object.keys(global.db.data.chats).length}
│  〆 ${jam}
╚┅━┅━┅━┅━┅━┅━┅━┅━┅━┅⋄
${readmore}
${ownerMenu(prefix, bill)}`;
 
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.reportbug`,
 buttonText: {
 displayText: "Report Bug"
 }, type: 1
 },
 {
 buttonId: `.owner`,
 buttonText: {
 displayText: "Owner"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "1234567890",
 caption: MenuText,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: `Halo *${pushname} 👋🏻*`,
 body: `${m.sender.split('@')[0]}`,
 thumbnailUrl: pickRandom(ftreply),
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })
 } 
 break;

            case 'ping':
                const startTime = Date.now();
                const uptime = os.uptime();
                const systemInfo = await systeminformation.getStaticData();
                const cpuInfo = systemInfo.cpu;
                const memoryInfo = systemInfo.mem;

                const pingMessage = `Waktu ping: ${Date.now() - startTime}ms
Uptime: ${formatUptime(uptime)}
OS: ${os.platform()} ${os.release()}
CPU: ${cpuInfo.manufacturer} ${cpuInfo.brand} - ${cpuInfo.speed}GHz
            `;
                await rinn.sendMessage(msg.key.remoteJid, {
                    text: pingMessage
                }, {
                    quoted: msg
                });
                break;
            case 'bratvideo': {
                const text = args.join(' ');
                if (!text) return reply(rinn, msg, `Contoh: ${prefix + command} hai`);
                if (text.length > 250) return reply(rinn, msg, `Karakter terbatas, max 250!`);
                const words = text.split(" ");
                const tempDir = path.join(process.cwd(), 'lib');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
                const framePaths = [];
                try {
                    for (let i = 0; i < words.length; i++) {
                        const currentText = words.slice(0, i + 1).join(" ");
                        const res = await axios.get(
                            `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(currentText)}`, {
                                responseType: "arraybuffer"
                            }
                        );
                        const framePath = path.join(tempDir, `frame${i}.mp4`);
                        fs.writeFileSync(framePath, res.data);
                        framePaths.push(framePath);
                    }
                    const fileListPath = path.join(tempDir, "filelist.txt");
                    let fileListContent = "";
                    for (let i = 0; i < framePaths.length; i++) {
                        fileListContent += `file '${framePaths[i]}'\n`;
                        fileListContent += `duration 0.7\n`;
                    }
                    fileListContent += `file '${framePaths[framePaths.length - 1]}'\n`;
                    fileListContent += `duration 2\n`;
                    fs.writeFileSync(fileListPath, fileListContent);
                    const outputVideoPath = path.join(tempDir, "output.mp4");
                    execSync(
                        `ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${outputVideoPath}`
                    );
                    await rinn.sendMessage(msg.key.remoteJid, {
                        video: {
                            url: outputVideoPath
                        },
                        caption: 'Done...'
                    }, {
                        quoted: msg
                    });
                    framePaths.forEach((frame) => {
                        if (fs.existsSync(frame)) fs.unlinkSync(frame);
                    });
                    if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath);
                    if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath);
                } catch (error) {
                    console.error('Brat Video Error:', error);
                    reply(rinn, msg, 'Terjadi kesalahan');
                }
            }
            break;
            case 'brat': {
                let text;

                if (args.length >= 1) {
                    text = args.slice(0).join(" ");
                } else if (m.quoted && m.quoted.text) {
                    text = m.quoted.text;
                } else {
                    await rinn.sendMessage(sender, {
                        text: "Input teks atau reply teks yang ingin dijadikan brat!"
                    }, {
                        quoted: msg
                    });
                    return;
                }

                if (!text) {
                    return rinn.sendMessage(sender, {
                        text: `Penggunaan: ${prefix + command} <teks>`
                    }, {
                        quoted: msg
                    });
                }

                let ngawiStik = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`);
                await rinn.sendImageAsSticker(m.chat, ngawiStik, m, {
                    packname: packnames,
                    author: authors
                });
            }
            break;
            case 'yts': {
                if (!text) return m.reply('Masukkan kata kunci pencarian!')

                await reactionMessage('🕐');

                let ytsSearch = await yts(text)
                if (!ytsSearch || !ytsSearch.all || ytsSearch.all.length === 0) return m.reply("Video tidak ditemukan!")

                let results = ytsSearch.all.slice(0, 7) // Ambil maksimal 7 hasil
                let teks = `🔎 *Hasil Pencarian YouTube untuk:* _${text}_\n\n`
                let cards = []

                for (let video of results) {
                    teks += `*🎬 ${video.title}*\n📅 ${video.ago} | ⏳ ${video.timestamp} | 👁 ${video.views}\n🔗 ${video.url}\n\n`

                    let imgsc = await prepareWAMessageMedia({
                        image: {
                            url: video.thumbnail
                        }
                    }, {
                        upload: rinn.waUploadToServer
                    })
                    cards.push({
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: video.title,
                            hasMediaAttachment: true,
                            ...imgsc
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                name: "cta_copy",
                                buttonParamsJson: `{
                            "display_text": "Salin Link",
                            "copy_code": "${video.url}"
                        }`
                            }]
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: `👤 ${video.author?.name || "Unknown"} | 👁 ${video.views} | ⏳ ${video.timestamp}`
                        })
                    })
                }

                const msg = await generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.fromObject({
                                    text: `🔎 Berikut adalah hasil pencarian untuk *${text}*`
                                }),
                                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                    cards: cards
                                })
                            })
                        }
                    }
                }, {
                    userJid: sender,
                    quoted: m
                })

                rinn.relayMessage(m.chat, msg.message, {
                    messageId: msg.key.id
                })

                await rinn.sendMessage(m.chat, {
                    react: {
                        text: '',
                        key: m.key
                    }
                })
            }
            break;
case 'play3': {
                if(!text) return m.reply("Masukan Query Parameters!");
                m.reply(mess.wait);
                let anu = `https://api.diioffc.web.id/api/search/ytplay?query=${encodeURIComponent(text)}`;
                const res = await fetch(anu);
                const response = await res.json();
                let url = `${response.result.url}`;
                let caption = `- *Title:* ${response.result.title}\n- *Description:* ${response.result.description}\n- *Views:* ${response.result.views}`;
                try {
                    rinn.sendMessage(m.chat, {
                        image: {url: response.result.thumbnail},
                        caption: caption,
                        footer: "Youtube Play",
                        buttons: [
                            {
                                buttonId: `.ytmp3 ${url}`,
                                buttonText: {
                                    displayText: "Audio"
                                }, type: 1
                            },
                            {
                                buttonId: `.ytmp4 ${url}`,
                                buttonText: {
                                    displayText: "Video"
                                }, type: 1
                            }
                        ],
                        headerType: 1,
                        viewOnce: true,
                        
                    }, { quoted: m })
                } catch (error) {
                    console.log(error);
                    m.reply("Error", error)
                }
            }
            break;
            case "ytmp3": {
                m.reply(mess.wait);
                let anu = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`;
                const res = await fetch(anu);
                const response = await res.json();
                try {
                    rinn.sendMessage(m.chat, {
                        audio: { url: response.data.dl },
                        mimeType: "audio/mpeg",
                        ptt: false
                    }, { quoted: m })
                } catch (error) {
                    console.log(error)
                    m.reply("Error", error)
                }
            }
            break;
            case "ytmp4": {
                m.reply(mess.wait);
                let anu = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`;
                const res = await fetch(anu);
                const response = await res.json();
                try {
                    rinn.sendMessage(m.chat, {
                        video: { url: response.data.dl },
                        mimeType: 'video/mp4',
                        caption: '`No inpo`'
                    }, { quoted: m })
                } catch (error) {
                    console.log(error);
                    m.reply("Error", error)
                }
            }
            break;
            case 'playvid':
case 'ytdlmp4':
case 'ytdlmp3': {
    if (!args[0]) {
        return reply(rinn, msg, `Example: ${prefix + command} <YouTube URL/Query>`);
    }

    try {
        await reply(rinn, msg, `🔍 Searching and processing your request...`);
        let url = args[0];
        let query = args.join(' ');
        
        // Check if input is URL or search query
        const isUrl = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+/.test(url);
        
        // If not URL, search for video
        if (!isUrl) {
            const searchResults = await yts(query);
            if (!searchResults.videos.length) {
                return reply(rinn, msg, '❌ No videos found for your query!');
            }
            url = searchResults.videos[0].url;
        }
        
        // Get video info using the library's getVideoInfo function
        const videoInfo = await getVideoInfo(url);
        
        if (!videoInfo || !videoInfo.status) {
            return reply(rinn, msg, '❌ Failed to fetch video information. Please try again.');
        }
        
        // Format duration from seconds to minutes:seconds
        const formatDuration = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        };
        
        // Prepare response message
        let infoMessage = `🎥 *YouTube Downloader*\n\n`;
        infoMessage += `*Title:* ${videoInfo.title}\n`;
        infoMessage += `*Channel:* ${videoInfo.creator}\n`;
        infoMessage += `*Duration:* ${formatDuration(videoInfo.duration)}\n`;
        infoMessage += `*Views:* ${videoInfo.views}\n`;
        infoMessage += `*Uploaded:* ${videoInfo.uploaded}\n\n`;
        
        // Create message options with preview
        const messageOptions = {
            text: infoMessage,
            contextInfo: {
                externalAdReply: {
                    title: videoInfo.title,
                    body: `Duration: ${formatDuration(videoInfo.duration)} • Channel: ${videoInfo.creator}`,
                    mediaType: 1,
                    thumbnailUrl: videoInfo.thumbnail,
                    mediaUrl: url,
                    sourceUrl: url,
                    renderLargerThumbnail: true
                }
            }
        };
        
        if (command === 'playvid' || command === 'ytdlmp4') {
            // Choose quality for video - default to 720p
            const quality = args[1] && ['144', '240', '360', '480', '720', '1080'].includes(args[1]) 
                ? args[1] 
                : '720';
                
            messageOptions.text += `*Selected Quality:* ${quality}p\n`;
            messageOptions.text += `_Downloading video, please wait..._`;
            
            await rinn.sendMessage(sender, messageOptions, { quoted: msg });
            
            // Download video using API 2 as specified in docs
            const videoResult = await downloadVideo(url, quality);
            
            if (!videoResult || !videoResult.status) {
                return reply(rinn, msg, '❌ Failed to get video download link. Please try again.');
            }
            
            // Validate download URL
            if (!videoResult.downloadUrl) {
                return reply(rinn, msg, '❌ No download URL returned. Please try again or try a different video.');
            }
            
            try {
                // Use axios to get the video as arraybuffer instead of getBuffer
                const response = await axios({
                    method: 'GET',
                    url: videoResult.downloadUrl,
                    responseType: 'arraybuffer'
                });
                
                // Validate the response
                if (!response.data || !response.data.byteLength) {
                    return reply(rinn, msg, '❌ Received empty data from download server. Please try again.');
                }
                
                // Log for debugging
                console.log(`Downloaded video size: ${response.data.byteLength} bytes`);
                
                // Send video with thumbnail
                await rinn.sendMessage(sender, {
                    video: Buffer.from(response.data),
                    caption: `${videoInfo.title}\n\nRequested by: @${msg.pushName || 'User'}`,
                    mimetype: 'video/mp4',
                    fileName: `${videoInfo.title.replace(/[^\w\s]/gi, '').substring(0, 50)}.mp4`,
                    contextInfo: {
                        externalAdReply: {
                            title: videoInfo.title,
                            body: `Duration: ${formatDuration(videoInfo.duration)} • Channel: ${videoInfo.creator}`,
                            mediaType: 1,
                            thumbnailUrl: videoInfo.thumbnail,
                            mediaUrl: url,
                            sourceUrl: url,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: msg });
                
            } catch (downloadError) {
                console.error('Video download error:', downloadError);
                return reply(rinn, msg, `❌ Failed to download video: ${downloadError.message}`);
            }
            
        } else if (command === 'ytdlmp3') {
            // Choose bitrate for audio - default to 320kbps
            const bitrate = args[1] && ['64', '128', '192', '256', '320'].includes(args[1]) 
                ? args[1] 
                : '320';
                
            messageOptions.text += `*Selected Bitrate:* ${bitrate}kbps\n`;
            messageOptions.text += `_Downloading audio, please wait..._`;
            
            await rinn.sendMessage(sender, messageOptions, { quoted: msg });
            
            // Download audio using API 2 as specified in docs
            const audioResult = await downloadAudio(url, bitrate, "api2");
            
            if (!audioResult || !audioResult.status) {
                return reply(rinn, msg, '❌ Failed to get audio download link. Please try again.');
            }
            
            // Validate download URL
            if (!audioResult.downloadUrl) {
                return reply(rinn, msg, '❌ No download URL returned. Please try again or try a different video.');
            }
            
            try {
                // Use axios to get the audio as arraybuffer instead of getBuffer
                const response = await axios({
                    method: 'GET',
                    url: audioResult.downloadUrl,
                    responseType: 'arraybuffer'
                });
                
                // Validate the response
                if (!response.data || !response.data.byteLength) {
                    return reply(rinn, msg, '❌ Received empty data from download server. Please try again.');
                }
                
                // Log for debugging
                console.log(`Downloaded audio buffer size: ${response.data.byteLength} bytes`);
                
                // Create a safe filename from the title
                const safeFilename = videoInfo.title.replace(/[^\w\s]/gi, '').substring(0, 50) + '.mp3';
                
                // Send audio with thumbnail
                await rinn.sendMessage(sender, {
                    audio: Buffer.from(response.data),
                    mimetype: 'audio/mp4',
                    fileName: safeFilename,
                    contextInfo: {
                        externalAdReply: {
                            title: videoInfo.title,
                            body: `Duration: ${formatDuration(videoInfo.duration)} • Channel: ${videoInfo.creator}`,
                            mediaType: 1,
                            thumbnailUrl: videoInfo.thumbnail,
                            mediaUrl: url,
                            sourceUrl: url,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: msg });
                
            } catch (downloadError) {
                console.error('Audio download error:', downloadError);
                return reply(rinn, msg, `❌ Failed to download audio: ${downloadError.message}`);
            }
        }
        
    } catch (error) {
        console.error('YouTube download error:', error);
        await reply(rinn, msg, `❌ Error: ${error.message || 'Failed to process YouTube download. Please try again later.'}`);
    }
}
break;
case '8font': case 'dafont': {
    if (!text) return m.reply(`⚠️ *Masukan nama font !*\n\n*Contoh : 8font roboto*`);
    
   await reactionMessage("🕖");

    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent({
            image: { url }
        }, { upload: rinn.waUploadToServer });
        return imageMessage;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let push = [];
    try {
        let { data } = await axios.get(`https://api-ape.my.id/search/8font?query=${encodeURIComponent(text)}`);
        let fonts = data.data.fonts;

        if (!fonts || fonts.length === 0) {
            return m.reply(`🔍 *Tidak ada hasil pencarian untuk:* ${text}`);
        }

        shuffleArray(fonts);
        let ult = fonts.splice(0, 8); // Mengambil maksimal 10 hasil
        let i = 1;

        for (let font of ult) {
            push.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `📌 *Nama font*: ${font.title}\n📂 *Kategori*: ${font.categories.join(", ")}\n🗓️ *Diunggah*: ${font.date}`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `🎁 *Preview ${i++}*`,
                    hasMediaAttachment: true,
                    imageMessage: await createImage(font.image)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            "name": "cta_url",
                            "buttonParamsJson": `{"display_text":"Download Font","url":"${font.link}"}`
                        }
                    ]
                })
            });
        }

        const bot = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `📑 *Berhasil Memuat 8 Hasil Pencarian untuk:* ${text}`
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [
                                ...push
                            ]
                        })
                    })
                }
            }
        }, {});

        await rinn.relayMessage(m.chat, bot.message, {
            messageId: bot.key.id
        }).catch((err) => m.reply(`❌ *Terjadi Kesalahan: ${err.message}*`));
    } catch (error) {
        console.error(error);
        m.reply(`❌ *Terjadi kesalahan saat mengambil data. Coba lagi nanti!*`);
    }
}
break
            

            // Case baru untuk menangani respons angka
            

            case 'cancel': {
                const userState = getState(sender);
                if (userState && userState.state === 'awaiting_selection') {
                    userStates.delete(sender);
                    await reply(rinn, msg, 'Pencarian dibatalkan.');
                }
            }
            break;

            case 'ai':
            case 'claude': {
                await handleAI(rinn, msg, sender, args, prefix, command);
            }
            break;
            case 'blackbox':
            case 'bb': {
                if (!args.length) {
                    rinn.sendMessage(sender, {
                        text: 'Halo, Mau Bertanya Apa?'
                    }, {
                        quoted: msg
                    });
                    return;
                }
                const query = args.join(' ');
                let anu = `https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(query)}`;
                let res = await fetch(anu)
                let response = await res.json();
                let teks = `${response.data}`
                try {
                    rinn.sendMessage(sender, {
                        text: teks
                    }, {
                        quoted: m
                    });
                } catch (error) {
                    console.log('Error pada aiBlackbox:', error);
                    await reply(rinn, msg, `Maaf, terjadi kesalahan: ${error.message}`);
                }
            }
            break;
case "autoai": {
rinn.autoai = rinn.autoai ||{};
        if (!text) return m.reply(`*Contoh:* .autoai *[on/off/reset]*`);

        if (text.toLowerCase() === "on") {
            rinn.autoai[m.sender] = {
                  pesan: []
            };
        m.reply("[ ✅ ] *Auto AI diaktifkan!* Sekarang bot akan merespon chat secara otomatis.");
        } else if (text.toLowerCase() === "off") {
          delete rinn.autoai[m.sender];
          m.reply("[ ❌ ] *Auto AI dimatikan!* Sekarang bot hanya merespon jika dipanggil.");
        } else {
          return m.reply(`*Contoh:* .autoai *[on/off/reset]*`);
        }
    }
    break;
            case 'ig':
            case 'instagram': {
                const url = args.length > 0 ? args[0] : '';
                await handleIgram(m, rinn, msg, url, prefix);
            }
            break;
            case 'twitter':
            case 'tw':
            case 'twdl': {
                if (!text) {
                    return reply(m.chat, `📌 *Gunakan format:* ${prefix + command} <Twitter URL>`);
                }
                await reactionMessage('🕐');
                try {
                    let result = await fetchTwitterMedia(text);
                    if (!result || result.download.length === 0) {
                        return reply(m.chat, "🗿 Error. Pastikan link benar atau coba lagi nanti.");
                    }

                    let caption = `*Twitter/X Downloader*\n🔗 *Sumber:* ${text}\n🎬 *Judul:* ${result.title}\n🕒 *Durasi:* ${result.duration}\n📷 *Thumbnail:* ${result.thumbnail || "Tidak tersedia"}`;

                    for (let media of result.download) {
                        if (media.type === "video") {
                            await rinn.sendMessage(m.chat, {
                                video: {
                                    url: media.url
                                },
                                mimetype: "video/mp4",
                                caption
                            }, {
                                quoted: msg
                            });
                        } else {
                            await rinn.sendFile(m.chat, media.url, "twitter.jpg", caption, m);
                        }
                    }
                } catch (error) {
                    console.error("Error sending media:", error.message);
                    reply(m.chat, "😹 Error saat mengunduh media.");
                }
            }
            break;

            case 'tiktoksearch':
            case 'tiktoks':
            case 'ttsearch': {
                if (!text) return reply(`Gini carinya*${prefix + command} jj epep*`);
                try {
                    await reactionMessage('🕐');
                    let search = await tiktokSearchVideo(text);
                    let teks = `🎥 *${search.videos[0].title}*\n\n` +
                        `🆔 *Video ID* : ${search.videos[0].video_id}\n` +
                        `👤 *Username* : ${search.videos[0].author.unique_id}\n` +
                        `🏷️ *Nickname* : ${search.videos[0].author.nickname}\n` +
                        `⏳ *Duration* : ${search.videos[0].duration} detik\n` +
                        `❤️ *VT Like* : ${search.videos[0].digg_count}\n` +
                        `💬 *Comment* : ${search.videos[0].comment_count}\n` +
                        `🔄 *Share* : ${search.videos[0].share_count}\n\n` +
                        `🔗 *Link*: https://www.tiktok.com/@${search.videos[0].author.unique_id}/video/${search.videos[0].video_id}`;
                    let list = '';
                    let no = 1;
                    for (let i of search.videos) {
                        list += `\n${no++}. 🎵 *${i.title}*\n` +
                            `⏳ Duration: ${i.duration} detik\n` +
                            `❤️ Likes: ${i.digg_count}\n` +
                            `💬 Comments: ${i.comment_count}\n` +
                            `🔄 Shares: ${i.share_count}\n` +
                            `🔗 Link: https://www.tiktok.com/@${i.author.unique_id}/video/${i.video_id}\n`;
                    }
                    await rinn.sendMessage(
                        m.chat, {
                            video: {
                                url: `https://tikwm.com${search.videos[0].play}`
                            },
                            caption: teks
                        }, {
                            quoted: msg
                        }
                    );
                    if (search.videos.length > 1) {
                        await rinn.sendMessage(
                            m.chat, {
                                text: `📚 *Daftar Video Lainnya:*\n${list}`
                            }, {
                                quoted: msg
                            }
                        );
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            break;
            case 'ttslide':
            case 'tiktokfoto':
            case 'tiktokmp4':
            case 'tt':
            case 'ttnowm':
            case 'tiktok': {
                if (!text) return reply(`Masukkan link\n*${prefix + command} https://vt.tiktok.com/ZS8KdFQcQ/*`);
                try {
                    await reactionMessage('🕐');
                    let anu = await tiktokDownloaderVideo(text);
                    let item = 0;
                    for (let imgs of anu.data) {
                        if (imgs.type == "nowatermark") {
                            await rinn.sendMessage(
                                m.chat, {
                                    video: {
                                        url: imgs.url
                                    },
                                    caption: `🎥 *Video Info* :\n📍 Region: ${anu.region}\n⏳ Duration: ${anu.duration}\n📅 Taken: ${anu.taken_at}\n\n📊 *Statistik Info* :\n👁️ Views: ${anu.stats.views}\n❤️ Likes: ${anu.stats.likes}\n💬 Comment: ${anu.stats.comment}\n🔄 Share: ${anu.stats.share}\n📥 Download: ${anu.stats.download}\n\n👤 *Author Info* :\n📝 Fullname: ${anu.author.fullname}\n🏷️ Nickname: ${anu.author.nickname}\n\n🎵 *Music Info* :\n🎼 Title: ${anu.music_info.title}\n🎤 Author: ${anu.music_info.author}\n💿 Album: ${anu.music_info.album}\n\n📝 *Caption* :\n${anu.title || 'No Caption'}`
                                }, {
                                    quoted: msg
                                }
                            );
                        }
                        if (imgs.type == "photo") {
                            if (item == 0) {
                                await rinn.sendMessage(
                                    m.chat, {
                                        image: {
                                            url: imgs.url
                                        },
                                        caption: `🖼️ *Photo Info* :\n📍 Region: ${anu.region}\n📅 Taken: ${anu.taken_at}\n\n📊 *Statistik Info* :\n👁️ Views: ${anu.stats.views}\n❤️ Likes: ${anu.stats.likes}\n💬 Comment: ${anu.stats.comment}\n🔄 Share: ${anu.stats.share}\n📥 Download: ${anu.stats.download}\n\n👤 *Author Info* :\n📝 Fullname: ${anu.author.fullname}\n🏷️ Nickname: ${anu.author.nickname}\n\n🎵 *Music Info* :\n🎼 Title: ${anu.music_info.title}\n🎤 Author: ${anu.music_info.author}\n💿 Album: ${anu.music_info.album}\n\n📝 *Caption* :\n${anu.title || 'No Caption'}${m.isGroup ? anu.data.length > 1 ? "\n📥 _Sisa foto dikirim ke private chat_\n" : "\n" : "\n"}`
                                    }, {
                                        quoted: msg
                                    }
                                );
                            } else {
                                await rinn.sendMessage(
                                    m.sender, {
                                        image: {
                                            url: imgs.url
                                        }
                                    }, {
                                        quoted: msg
                                    }
                                );
                            }
                            item += 1;
                            await sleep(2000);
                        }
                    }
                } catch (error) {
                    console.log(error);
                    await reply('⚠️ Gagal mengambil data dari TikTok. Pastikan URL valid atau coba lagi nanti.');
                }
            }
            break;

            case 'ttaudio':
            case 'tiktokmp3':
            case 'ttmp3':
            case 'tiktokaudio': {
                if (!text) return reply(`Masukkan link\n*${prefix + command} https://vt.tiktok.com/ZS8KdFQcQ/*`);
                try {
                    await reactionMessage('🕐');
                    let anu = await tiktokDownloaderVideo(text);
                    let audio = anu.music_info.url;
                    await rinn.sendMessage(
                        m.chat, {
                            text: `🎵 *TikTok Audio*\n\n` +
                                `🎼 *Title:* ${anu.music_info.title || '-'}\n` +
                                `🎤 *Author:* ${anu.music_info.author || '-'}\n` +
                                `💿 *Album:* ${anu.music_info.album || '-'}\n\n` +
                                `🔗 *Source:* ${text}`
                        }, {
                            quoted: msg
                        }
                    );
                    await rinn.sendMessage(
                        m.chat, {
                            audio: {
                                url: audio
                            },
                            mimetype: 'audio/mpeg',
                            fileName: `${anu.music_info.title || 'audio'}.mp3`
                        }, {
                            quoted: msg
                        }
                    );
                } catch (error) {
                    console.error(error);
                    await reply(`❌ Terjadi kesalahan saat mengambil audio. Coba lagi nanti, ya Kak!`);
                }
            }
            break;

            case 'next': {
                await handleNext(rinn, msg, sender, 'pinterest', 'igreels');
            }
            break;
            case 'stop': {
                await handleStop(rinn, msg, sender, 'pinterest', 'igreels');
            }
            break;
            case 'pinterest':
            

            
            case 'fb':
            case 'fesnuk':
            case 'fbdl': {
                if (!args[0]) {
                    await rinn.sendMessage(sender, {
                        text: `Please provide a Facebook video URL\n\nExample: ${prefix}fb https://www.facebook.com/watch?v=123456789`
                    }, {
                        quoted: msg
                    });
                    return;
                }

                const url = args[0];
                // More lenient URL validation that accepts various Facebook URL formats
                if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
                    await rinn.sendMessage(sender, {
                        text: '❌ Invalid Facebook video URL. Please provide a valid Facebook video link.'
                    }, {
                        quoted: msg
                    });
                    return;
                }

                await handleFacebookDownload(rinn, msg, url);
            }
            break;
            case 'igreels':
            case 'reels': {
                if (!args.length) {
                    await reply(rinn, msg, `Masukan kata kunci!\ncontoh:\n\n${prefix + command} Alya`);
                    return;
                }

                try {
                    await reactionMessage('🕐');
                    // Search Instagram Reels
                    const query = args.join(' ');
                    const response = await axios.get(`https://api.vreden.my.id/api/instagram/reels?query=${encodeURIComponent(query)}`);

                    if (!response.data.result.media || response.data.result.media.length === 0) {
                        await reply(rinn, msg, 'Tidak ada reels ditemukan. Silakan coba kata kunci lain.');
                        return;
                    }

                    // Format results
                    const reels = response.data.result.media.map(reel => ({
                        url: reel.reels.url,
                        thumbnail: reel.reels.thumbnail,
                        caption: `*[Instagram Reels]*\n\n` +
                            `> *Upload by:* ${reel.profile.username}\n` +
                            `> *Full Name:* ${reel.profile.full_name}\n` +
                            `> *Duration:* ${reel.reels.duration}s\n` +
                            `> *Caption:* ${reel.caption.text}\n` +
                            `> *Stats:*\n` +
                            `> 👁 Views: ${reel.statistics.play_count}\n` +
                            `> ❤️ Likes: ${reel.statistics.like_count}\n` +
                            `> 💬 Comments: ${reel.statistics.comment_count}\n` +
                            `> 🔄 Shares: ${reel.statistics.share_count}\n\n` +
                            `> *Link:* ${reel.reels.video}`
                    }));

                    // Save reels to state
                    StateManager.setState(sender, 'igreels_search', {
                        reels: reels,
                        currentIndex: 0,
                        query: query,
                        itemKey: 'reels'
                    });

                    // Send first video
                    await rinn.sendMessage(sender, {
                        video: {
                            url: reels[0].url
                        },
                        caption: `${reels[0].caption}\n\n*Hasil pencarian untuk:* "${query}"\n*Reels:* 1/${reels.length}\n\nKetik *.next* untuk reels selanjutnya\nKetik *.stop* untuk berhenti`,
                        gifPlayback: false
                    }, {
                        quoted: msg
                    });


                } catch (error) {
                    console.error("Error pada fitur igreels:", error);

                    let errorMsg = 'Terjadi kesalahan saat mencari reels.';

                    if (error.response) {
                        if (error.response.status === 404) {
                            errorMsg = 'Instagram API tidak dapat diakses. Silakan coba lagi nanti.';
                        } else {
                            errorMsg = 'Gagal mengambil data dari Instagram. Silakan coba lagi.';
                        }
                    } else if (error.code === 'ENOTFOUND') {
                        errorMsg = 'Gagal mengakses server. Periksa koneksi internet Anda.';
                    }

                    await reply(rinn, msg, errorMsg);
                }
            }
            break;
case 'upsw':

            case 'ambilsw':
            case 'getsw': {
                if (isGroup) return reply(rinn, msg, "❌ Command ini hanya bisa digunakan di chat pribadi!");

                const quoted = m.quoted || m;
                if (!quoted) return reply(rinn, msg, "📌 Balas pesan gambar/video yang ingin diambil!");

                const mime = (quoted.msg || quoted).mimetype || '';

                if (/image/.test(mime)) {
                    const media = await quoted.download();
                    return rinn.sendMessage(m.chat, {
                        image: media,
                        caption: `Retrieved by ${pushname}`
                    }, {
                        quoted: m
                    });
                }

                if (/video/.test(mime)) {
                    const media = await quoted.download();
                    return rinn.sendMessage(m.chat, {
                        video: media,
                        caption: `Retrieved by ${pushname}`
                    }, {
                        quoted: m
                    });
                }

                return reply(rinn, msg, "❌ Hanya bisa mengambil gambar atau video dari pesan yang dikutip!");
            }
            break;
            case 'servermc':
            case 'mc': {
                if (!args.length) {
                    await rinn.sendMessage(sender, {
                        text: `Masukan Nama Ip Server Nya\nContoh\n${prefix}servermc <ip> java\n${prefix}servermc <ip> bedrock`
                    }, {
                        quoted: msg
                    });
                    return;
                }

                try {
                    if (args[1]?.toLowerCase() === 'java') {
                        const response = await axios.get('https://api.mcsrvstat.us/3/' + args[0]);
                        const jav = response.data;

                        // Check if server is offline or data is invalid
                        if (!jav || jav.online === false) {
                            await reply(rinn, msg, "Server sedang offline atau tidak ditemukan");
                            return;
                        }

                        let capt = `⏤͟͟͞͞╳── *[ sᴇʀᴠᴇʀᴍᴄ - ᴊᴀᴠᴀ ]* ── .々─ᯤ\n`;
                        capt += `│    =〆 ɪᴘ: ${jav.hostname || args[0]}\n`;
                        capt += `│    =〆 ᴘᴏʀᴛ: ${jav.port || '25565'}\n`;
                        capt += `│    =〆 ᴠᴇʀsɪ: ${jav.version || 'N/A'}\n`;
                        capt += `│    =〆 ᴏɴʟɪɴᴇ: ${jav.online ? 'Yes' : 'No'}\n`;
                        capt += `│    =〆 ᴘʟᴀʏᴇʀ: ${jav.players?.online || 0} \\ ${jav.players?.max || 0}\n`;
                        capt += `⏤͟͟͞͞╳────────── .✦`;

                        await reply(rinn, msg, capt);

                    } else if (args[1]?.toLowerCase() === 'bedrock') {
                        const response = await axios.get('https://api.mcsrvstat.us/bedrock/3/' + args[0]);
                        const bed = response.data;

                        // Check if server is offline or data is invalid
                        if (!bed || bed.online === false) {
                            await reply(rinn, msg, "Server sedang offline atau tidak ditemukan");
                            return;
                        }

                        let capt = `⏤͟͟͞͞╳── *[ sᴇʀᴠᴇʀᴍᴄ - ʙᴇᴅʀᴏᴄᴋ ]* ── .々─ᯤ\n`;
                        capt += `│    =〆 ɪᴘ: ${bed.hostname || args[0]}\n`;
                        capt += `│    =〆 ᴘᴏʀᴛ: ${bed.port || '19132'}\n`;
                        capt += `│    =〆 ᴠᴇʀsɪ: ${bed.version || 'N/A'}\n`;
                        capt += `│    =〆 ᴏɴʟɪɴᴇ: ${bed.online ? 'Yes' : 'No'}\n`;
                        capt += `│    =〆 ᴘʟᴀʏᴇʀ: ${bed.players?.online || 0} \\ ${bed.players?.max || 0}\n`;
                        capt += `⏤͟͟͞͞╳────────── .✦`;

                        await reply(rinn, msg, capt);
                    } else {
                        await rinn.sendMessage(sender, {
                            text: `Masukan Nama Ip Server Nya\nContoh\n${prefix}servermc <ip> java\n${prefix}servermc <ip> bedrock`
                        }, {
                            quoted: msg
                        });
                    }
                } catch (error) {
                    console.error('Error in servermc:', error);
                    await reply(rinn, msg, `Terjadi kesalahan saat mengecek server: ${error.message}`);
                }
            }
            break;
            case 'toimg': {
                try {
                    // Periksa apakah ada pesan yang di-reply
                    if (!m.quoted) {
                        await reply(rinn, msg, 'Reply stiker yang ingin diubah menjadi gambar');
                        return;
                    }

                    // Periksa mime type dari pesan yang di-quoted
                    const mime = (m.quoted.msg || m.quoted).mimetype || '';

                    // Periksa apakah mime type adalah stiker
                    if (!mime.includes('webp')) {
                        await reply(rinn, msg, 'Pesan yang di-reply harus berupa stiker');
                        return;
                    }

                    // Download media
                    const buffer = await m.quoted.download();

                    // Kirim hasil konversi
                    await rinn.sendMessage(sender, {
                        image: buffer,
                        caption: 'Nih hasil convert stikernya'
                    }, {
                        quoted: msg
                    });

                } catch (error) {
                    console.error('Error in toimg:', error);
                    await reply(rinn, msg, `Terjadi kesalahan saat mengkonversi stiker: ${error.message}`);
                }
            }
            break;
            case 'togif': {
                try {
                    // Periksa apakah ada pesan yang di-reply
                    if (!m.quoted) {
                        await reply(rinn, msg, 'Reply stiker yang ingin diubah menjadi video gif');
                        return;
                    }

                    // Periksa mime type dari pesan yang di-quoted
                    const mime = (m.quoted.msg || m.quoted).mimetype || '';

                    // Periksa apakah mime type adalah stiker
                    if (!mime.includes('webp')) {
                        await reply(rinn, msg, 'Pesan yang di-reply harus berupa stiker');
                        return;
                    }

                    // Download sticker
                    const media = await m.quoted.download();

                    const url = await require('./App/tovideo').convert(media);

                    // Send as video
                    await rinn.sendMessage(sender, {
                        video: {
                            url: url
                        },
                        caption: 'Ini dia'
                    }, {
                        quoted: msg
                    });

                } catch (error) {
                    console.error('Error in tovideo:', error);
                    await reply(rinn, msg, `Terjadi kesalahan saat mengkonversi ke video: ${error.message}`);
                }
            }
            break;
            case 'pixeldrain': {
                if (!args[0]) return reply(rinn, msg, `Masukkan link pixeldrain!\nContoh: ${prefix}pixeldrain https://pixeldrain.com/u/abc123`);

                try {
                    await reactionMessage('🕐');
                    const url = args[0];
                    const regex = /\/u\/([a-zA-Z0-9]+)/;
                    const match = url.match(regex);

                    if (!match) {
                        return reply(rinn, msg, 'Link pixeldrain tidak valid! Pastikan formatnya benar.');
                    }

                    const fileId = match[1];
                    await reply(rinn, msg, 'Sedang memproses...');

                    // Get file info
                    const {
                        data: fileInfo
                    } = await axios.get(`https://pixeldrain.com/api/file/${fileId}/info`);

                    // Get random CDN host
                    const rhost = CDN[Math.floor(Math.random() * CDN.length)];

                    // Generate download links
                    const cdnLink = `https://${rhost}/api/file/${fileId}`;
                    const directLink = `https://pixeldrain.com/api/file/${fileId}`;

                    // Format file size
                    const fileSize = formatSize(fileInfo.size);

                    const caption = `*PIXELDRAIN DOWNLOADER*\n\n` +
                        `*Nama File:* ${fileInfo.name}\n` +
                        `*Ukuran:* ${fileSize}\n` +
                        `*Views:* ${fileInfo.views}\n` +
                        `*Upload Date:* ${formatDate(fileInfo.date_upload)}\n\n` +
                        `*Download Links:*\n` +
                        `1. CDN: ${cdnLink}\n` +
                        `2. Direct: ${directLink}`;

                    await rinn.sendMessage(sender, {
                        text: caption,
                        contextInfo: {
                            externalAdReply: {
                                title: fileInfo.name,
                                body: `${fileSize} • ${formatDate(fileInfo.date_upload)}`,
                                thumbnailUrl: pickRandom(ftreply),
                                mediaType: 1
                            }
                        }
                    }, {
                        quoted: msg
                    });

                } catch (error) {
                    console.error('Pixeldrain error:', error);
                    await reply(rinn, msg, `Gagal mengunduh file: ${error.message}`);
                }
            }
            break;
            case 'hdvid':
            case 'reminivid': {
                if (!quoted) return rinn.sendMessage(sender, {
                    text: `Balas Video Dengan Caption ${prefix}hdvid fps`
                }, {
                    quoted: msg
                });
                if (!/video/.test(mime)) return rinn.sendMessage(sender, {
                    text: 'Kirim/balas video dengan caption *.hdvid* 60'
                }, {
                    quoted: msg
                });

                const fps = parseInt(args[0]);
                if (!fps) return rinn.sendMessage(sender, {
                    text: 'Masukkan fps, contoh: *.hdvid* 60'
                }, {
                    quoted: msg
                });
                if (fps > 30) return rinn.sendMessage(sender, {
                    text: 'Maksimal fps adalah 30 fps!'
                }, {
                    quoted: msg
                });
                if ((quoted.msg || quoted).seconds > 30) return rinn.sendMessage(sender, {
                    text: 'Maksimal video 30 detik!'
                }, {
                    quoted: msg
                });

                await rinn.sendMessage(sender, {
                    text: 'Wait... Executing the [ffmpeg] and [remini] libraries, This process may take 5-15 minutes'
                }, {
                    quoted: msg
                });

                const chdir = "hd_video";
                const timestamp = Date.now();
                const pndir = `${chdir}/${m.sender}`;
                const rsdir = `${chdir}/result-${m.sender}`;
                const fdir = `${pndir}/frames/${timestamp}`;
                const rfdir = `${rsdir}/frames/${timestamp}`;
                const rname = `${rsdir}/${m.sender}-${timestamp}.mp4`;
                const tempFile = `${pndir}/temp-${timestamp}.json`;

                // Create directories if they don't exist
                const dirs = [chdir, pndir, rsdir, `${pndir}/frames`, fdir, `${rsdir}/frames`, rfdir];
                dirs.forEach(dir => {
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
                        recursive: true
                    });
                });

                try {
                    // Download and save media
                    const media = await quoted.download();
                    fs.writeFileSync(`${pndir}/${timestamp}`, media);

                    // Get video information
                    await new Promise((resolve, reject) => {
                        exec(`ffprobe -v quiet -print_format json -show_format -show_streams ${pndir}/${timestamp}`, (error, stdout) => {
                            if (error) reject(error);
                            else {
                                fs.writeFileSync(tempFile, stdout);
                                resolve();
                            }
                        });
                    });

                    // Read video info
                    const videoInfo = JSON.parse(fs.readFileSync(tempFile));
                    const videoStream = videoInfo.streams.find(s => s.codec_type === 'video');
                    const width = parseInt(videoStream.width);
                    const height = parseInt(videoStream.height);

                    // Calculate new dimensions maintaining aspect ratio and ensuring upscaling
                    let newWidth, newHeight;
                    const aspectRatio = width / height;

                    if (width > height) {
                        // Landscape orientation
                        if (width < 1920) {
                            newWidth = 1920;
                            newHeight = Math.round(1920 / aspectRatio);
                        } else {
                            newWidth = width;
                            newHeight = height;
                        }
                    } else {
                        // Portrait orientation
                        if (height < 1920) {
                            newHeight = 1920;
                            newWidth = Math.round(1920 * aspectRatio);
                        } else {
                            newHeight = height;
                            newWidth = width;
                        }
                    }

                    // Make sure dimensions are even numbers
                    newWidth = Math.floor(newWidth / 2) * 2;
                    newHeight = Math.floor(newHeight / 2) * 2;

                    // Extract frames with proper resolution
                    await new Promise((resolve, reject) => {
                        exec(`ffmpeg -i ${pndir}/${timestamp} -vf "fps=${fps},scale=${newWidth}:${newHeight}:flags=lanczos" ${fdir}/frame-%04d.png`, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });

                    // Process frames with remini
                    const images = fs.readdirSync(fdir);
                    let result = {};

                    for (let i = 0; i < images.length; i++) {
                        const image = images[i];
                        result[image] = remini(fs.readFileSync(`${fdir}/${image}`), "enhance");
                    }

                    const values = await Promise.all(Object.values(result));
                    Object.keys(result).forEach((key, index) => {
                        result[key] = values[index];
                    });

                    // Save enhanced frames
                    for (let i of Object.keys(result)) {
                        fs.writeFileSync(`${rfdir}/${i}`, result[i]);
                    }

                    // Combine frames back into video with high quality settings
                    await new Promise((resolve, reject) => {
                        const ffmpegCommand = `ffmpeg -framerate ${fps} -i ${rfdir}/frame-%04d.png -i ${pndir}/${timestamp} ` +
                            `-c:v libx264 -preset slower -crf 18 -x264-params "aq-mode=3:aq-strength=0.8" ` +
                            `-vf "scale=${newWidth}:${newHeight}:flags=lanczos,format=yuv420p" ` +
                            `-maxrate 8M -bufsize 16M ` +
                            `-c:a aac -b:a 192k -ar 48000 ` +
                            `-movflags +faststart ` +
                            `-strict experimental -shortest ${rname}`;

                        exec(ffmpegCommand, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });

                    // Send result in HD
                    await rinn.sendMessage(sender, {
                        video: fs.readFileSync(rname),
                        caption: `✨ Video telah ditingkatkan ke resolusi ${newWidth}x${newHeight}`,
                        gifPlayback: false,
                        jpegThumbnail: null,
                        mimetype: 'video/mp4',
                        height: newHeight,
                        width: newWidth,
                        headerType: 4
                    }, {
                        quoted: msg,
                        mediaUploadTimeoutMs: 1000 * 60 * 5
                    });

                    // Cleanup
                    dirs.forEach(dir => {
                        if (fs.existsSync(dir)) {
                            fs.rmSync(dir, {
                                recursive: true,
                                force: true
                            });
                        }
                    });
                    if (fs.existsSync(tempFile)) {
                        fs.unlinkSync(tempFile);
                    }

                } catch (error) {
                    console.error('HD Video processing error:', error);
                    await rinn.sendMessage(sender, {
                        text: `Error processing video: ${error.message}`
                    }, {
                        quoted: msg
                    });
                }
            }
            break;
            case 'removebg':
            case 'enhance':
            case 'upscale':
            case 'restore':
            case 'colorize': {
                await handlePxpic(rinn, msg, sender, quoted, mime, command);
            }
            break;
            case 'waifu': {
                try {
                    const tmpDir = 'tmp';
                    if (!fs.existsSync(tmpDir)) {
                        fs.mkdirSync(tmpDir, {
                            recursive: true
                        });
                    }

                    const filename = `${tmpDir}/anime-${Date.now()}.jpg`;

                    // Fetch and download image
                    const response = await axios({
                        method: 'get',
                        url: 'https://www.archive-ui.biz.id/asupan/anime',
                        responseType: 'arraybuffer'
                    });

                    // Save image to tmp folder
                    fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));

                    // Send the image
                    await rinn.sendMessage(sender, {
                        image: fs.readFileSync(filename),
                        caption: `Ini waifunya...`,
                    }, {
                        quoted: msg
                    });

                    // Delete temporary file
                    fs.unlinkSync(filename);

                } catch (error) {
                    console.error("Error pada fitur anime:", error);
                    await m.reply('Terjadi kesalahan saat mengambil gambar anime.');
                }
            }
            break;
            case 'anilist': {
                if (!args[0]) {
                    await rinn.sendMessage(sender, {
                        text: `Masukan judul anime!\ncontoh:\n\n${prefix + command} one piece`
                    }, {
                        quoted: msg
                    });
                    return;
                }
                const query = args.join(' ');
                await handleAnilistSearch(rinn, msg, query);
            }
            break;

            case 'anilistinfo': {
                if (!args[0]) {
                    await rinn.sendMessage(sender, {
                        text: `Masukan link anime!\ncontoh:\n\n${prefix + command} https://anilist.co/anime/...`
                    }, {
                        quoted: msg
                    });
                    return;
                }
                const url = args[0];
                await handleAnilistDetail(rinn, msg, url);
            }
            break;

            case 'anilisttop': {
                await handleAnilistPopular(rinn, msg);
            }
            break;

            case 'amsearch': {
                if (!args[0]) {
                    await rinn.sendMessage(sender, {
                        text: `Masukan judul lagu/artist!\ncontoh:\n\n${prefix + command} taylor swift`
                    }, {
                        quoted: msg
                    });
                    return;
                }
                const query = args.join(' ');
                await handleAppleMusicSearch(rinn, msg, query);
            }
            break;

            case 'amdl': {
                if (!args[0]) {
                    await rinn.sendMessage(sender, {
                        text: `Masukan link Apple Music!\ncontoh:\n\n${prefix + command} https://music.apple.com/...`
                    }, {
                        quoted: msg
                    });
                    return;
                }
                const url = args[0];
                await handleAppleMusicDownload(rinn, msg, url);
            }
            break;
            case 'upload': {
                await Mirror(m, rinn, reply, args, prefix, command, msg);
            }
            break;
            case 'tourl': {
                try {
                    if (!quoted) return reply(rinn, msg, 'Reply gambar yang ingin ditingkatkan kualitasnya!');
                    if (!/image\/(jpe?g|png)/.test(mime)) return reply(rinn, msg, 'Format tidak didukung! Kirim gambar dengan format jpg/jpeg/png');

                    let buffer = await quoted.download();
                    let caturl = await catbox(buffer);
                    let btchurl = await btch(buffer);

                    let caption = `✨ *Media to URL Uploader* ✨\n\n`
                    caption += `> 📂 *Ukuran media:* ${formatSize(buffer.length)}\n`;
                    caption += `> 🔗 *Tautan hasil*\n`;
                    caption += `> 🔗 *Tautan 1:* ${caturl}\n`;
                    caption += `> 🔗 *Tautan 2:* ${btchurl}\n\n`
                    caption += `💡 *Tips:* Gunakan fitur ini untuk berbagi media dengan lebih mudah tanpa perlu mengunggah ulang.`;

                    reply(rinn, msg, caption);
                } catch (e) {
                    console.error(e);
                    reply(rinn, msg, "⚠️ Terjadi kesalahan saat mengupload media");
                }
            }
            break;

            case 'get':
            case 'fetch': {
                if (!text) return reply(rinn, msg, `> Masukan atau reply url yang ingin kamu ambil data nya`);

                try {
                    const urls = text.match(/(https?:\/\/[^\s]+)/g);
                    if (!urls) return reply(rinn, msg, "⚠️ URL tidak valid");

                    for (let url of urls) {
                        let data = await undici.fetch(url);
                        let mime = data.headers.get("content-type").split(";")[0];
                        let cap = `*– 乂 Fetch - Url*\n> *- Request :* ${url}`;

                        let body;
                        if (/\html/gi.test(mime)) {
                            body = await data.text();
                            await rinn.sendMessage(m.chat, {
                                document: Buffer.from(html(body)),
                                caption: cap,
                                fileName: "result.html",
                                mimetype: mime,
                            }, {
                                quoted: m
                            });
                        } else if (/\json/gi.test(mime)) {
                            body = await data.json();
                            reply(rinn, msg, JSON.stringify(body, null, 2));
                        } else if (/image|video|audio/gi.test(mime)) {
                            body = await data.arrayBuffer();
                            await rinn.sendMessage(m.chat, {
                                [mime.split('/')[0]]: Buffer.from(body),
                                caption: cap,
                                fileName: `result.${extension(mime)}`,
                                mimetype: mime
                            }, {
                                quoted: m
                            });
                        } else {
                            try {
                                body = await data.buffer();
                            } catch (e) {
                                body = await data.text();
                            }
                            reply(rinn, msg, jsonformat(body));
                        }
                    }
                } catch (e) {
                    console.error(e);
                    reply(rinn, msg, "⚠️ Terjadi kesalahan saat mengambil data");
                }
            }
            break;
            case 'getpp':
            case 'getppwa': {
                if (!quoted) return reply(rinn, msg, 'reply pesan kalau mau getpp');
                try {
                    const getpp = await rinn.profilePictureUrl(quoted.sender, 'image');
                    await rinn.sendMessage(m.chat, {
                        image: {
                            url: getpp
                        },
                        caption: 'nih kak'
                    }, {
                        quoted: m
                    });
                } catch (e) {
                    reply(rinn, msg, 'Terjadi kesalahan saat mengambil foto profil');
                }
            }
            break;
            case 'joingroup':
            case 'joingrup':
            case 'joingc':
            case 'join': {
                try {
                    if (!isCreator) return m.reply(mess.owner);
                    if (!text) return m.reply('Masukkan Link Grup yaa!');
                    if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply('Link-nya invalid nih!');
                    let result = args[0].split('https://chat.whatsapp.com/')[1];
                    rinn.groupAcceptInvite(result);
                    await m.reply(`Sudah gabung ke grup! 🎉`);
                } catch {
                    m.reply('Gagal gabung ke grup, coba lagi nanti!');
                }
            }
            break;

            case 'outgroup':
            case 'outgrup':
            case 'outgc':
            case 'out':
                if (!isCreator) return m.reply(mess.owner);
                if (!m.isGroup) return m.reply(mess.group);
                m.reply('Selamat tinggal, semuanya 🥺');
                await rinn.groupLeave(m.chat);
                break;
            case 'setppbot':
            case 'setpp': {
                if (!isCreator) return reply(rinn, msg, 'Fitur khusus owner!');

                let q = quoted;
                let mime = (q.msg || q).mimetype || q.mediaType || '';

                if (/image/g.test(mime) && !/webp/g.test(mime)) {
                    try {
                        let media = await quoted.download();
                        const jimp_1 = await jimp.read(media);
                        const min = jimp_1.getWidth();
                        const max = jimp_1.getHeight();
                        const cropped = jimp_1.crop(0, 0, min, max);
                        const img = await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG);

                        await rinn.updateProfilePicture(botNumber, img);
                        await reactionMessage('✅');
                    } catch (e) {
                        console.error(e);
                        reply(rinn, msg, 'Terjadi kesalahan, coba lagi nanti.');
                    }
                } else if (args[0] && isUrl(args[0])) {
                    try {
                        let media = await getBuffer(args[0]);
                        const jimp_1 = await jimp.read(media);
                        const min = jimp_1.getWidth();
                        const max = jimp_1.getHeight();
                        const cropped = jimp_1.crop(0, 0, min, max);
                        const img = await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG);

                        await rinn.updateProfilePicture(botNumber, img);
                        reply(rinn, msg, 'Sukses mengganti PP Bot');
                    } catch (e) {
                        console.error(e);
                        reply(rinn, msg, 'Terjadi kesalahan, coba lagi nanti.');
                    }
                } else {
                    reply(rinn, msg, `Kirim gambar dengan caption *${prefix + command}* atau tag gambar yang sudah dikirim`);
                }
            }
            break;
            case 'afk': {
                if (!m.isGroup) return m.reply(mess.group); // Cek apakah perintah dijalankan di grup

                if (isAfkOn) return; // Cek apakah pengguna sudah dalam mode AFK

                // Tentukan alasan AFK
                let reason = text ? text : 'Tanpa alasan';

                // Tambahkan pengguna ke daftar AFK
                addAfkUser(m.sender, Date.now(), reason, afk);

                // Kirim pesan konfirmasi dengan mention
                rinn.sendTextWithMentions(
                    m.chat,
                    `*@${m.sender.split('@')[0]}* sedang afk\n` +
                    `*Alasan:* ${reason}`,
                    m
                );
            }
            break;
            case 'request':
            case 'reportbug': {
                if (!text) return m.reply(`Contoh: ${prefix + command} woi, error nih😡`);
                textt = `*| REQUEST/BUG |*`;
                teks1 = `\n\n*User* : @${m.sender.split("@")[0]}\n*Request/Bug* : ${text}`;
                teks2 = `\n\n*Hii ${pushname}, laporan sudah dikirim ke owner*`;
                for (let i of owner) {
                    rinn.sendMessage(i + "@s.whatsapp.net", {
                        text: textt + teks1,
                        mentions: [m.sender],
                    }, {
                        quoted: m,
                    });
                }
                rinn.sendMessage(m.chat, {
                    text: textt + teks2 + teks1,
                    mentions: [m.sender],
                }, {
                    quoted: m,
                });
            }
            break;

            case 'shutdown':
                if (!isCreator) return m.reply(mess.owner);
                m.reply(`Bentar ${command} dulu`);
                await sleep(3000);
                process.exit();
                break;

case 'delcase': {
 if (!isCreator) return m.reply(mess.owner)
 if (!text) return m.reply('Masukkan nama case yang ingin dihapus')
 const fs = require('fs')
 const namaFile = 'case.js'
 fs.readFile(namaFile, 'utf8', (err, data) => {
 if (err) {
 console.error('Terjadi kesalahan saat membaca file:', err)
 return m.reply('Gagal membaca file')
 }
 const casePattern = new RegExp(`case ['"]${text}['"]:[\\s\\S]*?break;`, 'g')
 if (!casePattern.test(data)) {
 return m.reply(`Case '${text}' tidak ditemukan`)
 }
 const newContent = data.replace(casePattern, '')
 fs.writeFile(namaFile, newContent, 'utf8', (err) => {
 if (err) {
 console.error('Terjadi kesalahan saat menulis file:', err)
 return m.reply('Gagal menghapus case')
 }
 m.reply(`Case '${text}' berhasil dihapus`)
 })
 })
}
break;
case 'addcaseatas': {
    if (!isCreator) return m.reply(mess.owner)
    if (!text) return m.reply('Mana case nya');
    const fs = require('fs');
    const namaFile = 'case.js';
    const caseBaru = `${text}`;
    fs.readFile(namaFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Terjadi kesalahan saat membaca file:', err);
            return m.reply('Gagal membaca file');
        }
        const posisiAwal = data.indexOf("switch (command) {");
        if (posisiAwal !== -1) {
            const posisiInsert = posisiAwal + "switch (command) {".length;
            const kodeBaruLengkap = data.slice(0, posisiInsert) + '\n\n' + caseBaru + '\n' + data.slice(posisiInsert);
            fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
                if (err) {
                    m.reply('Terjadi kesalahan saat menulis file: ' + err);
                } else {
                    m.reply('Case baru berhasil ditambahkan.');
                }
            });
        } else {
            m.reply('Tidak dapat menemukan switch statement dalam file.');
        }
    });
}
break;
			case 'totalcase': 
			const feature = () => {
			var mytext = fs.readFileSync("./case.js").toString();
			var numUpper = (mytext.match(/case '/g) || []).length;
			return numUpper;
		}
				m.reply(`✨ *Total Fitur yang Tersedia di ${botName}:* ${feature()} Fitur`);
			break;


            case 'autoread':
                if (!isCreator) return m.reply(mess.owner);
                if (args.length < 1) return m.reply(`Contoh: ${prefix + command} true/false?`);
                if (q === 'true') {
                    db.data.settings[botNumber].autoread = true;
                    m.reply(`Auto-read berhasil diubah ke ${q}`);
                } else if (q === 'false') {
                    db.data.settings[botNumber].autoread = false;
                    m.reply(`Auto-read berhasil dimatikan, jadi gak bakal dibaca otomatis nih!`);
                }
                break;

            case 'unavailable':
                if (!isCreator) return m.reply(mess.owner);
                if (args.length < 1) return m.reply(`Contoh: ${prefix + command} true/false?`);
                if (q === 'true') {
                    db.data.settings[botNumber].online = true;
                    m.reply(`Wah, sekarang bot aku lagi online, bisa nyapa-nyapa nih!`);
                } else if (q === 'false') {
                    db.data.settings[botNumber].online = false;
                    m.reply(`Oke, bot aku jadi offline dulu ya, nanti nyapa-nyapanya kalau sudah aktif lagi 😎`);
                }
                break;

            case 'autorecordtype':
                if (!isCreator) return m.reply(mess.owner);
                if (args.length < 1) return m.reply(`Contoh: ${prefix + command} true/false?`);
                if (q === 'true') {
                    db.data.settings[botNumber].autorecordtype = true;
                    m.reply(`Auto-record typing berhasil diubah ke ${q}!`);
                } else if (q === 'false') {
                    db.data.settings[botNumber].autorecordtype = false;
                    m.reply(`Auto-record typing dimatikan, gak bakal ada rekaman ketik lagi ya!`);
                }
                break;

            case 'autorecord':
                if (!isCreator) return m.reply(mess.owner);
                if (args.length < 1) return m.reply(`Contoh: ${prefix + command} true/false?`);
                if (q === 'true') {
                    db.data.settings[botNumber].autorecord = true;
                    m.reply(`Auto-record berhasil diubah ke ${q}, jadi semua aktivitas terrekam otomatis!`);
                } else if (q === 'false') {
                    db.data.settings[botNumber].autorecord = false;
                    m.reply(`Auto-record dimatikan, gak bakal ada rekaman otomatis lagi!`);
                }
                break;

            case 'autotype':
                if (!isCreator) return m.reply(mess.owner);
                if (args.length < 1) return m.reply(`Contoh: ${prefix + command} true/false?`);
                if (q === 'true') {
                    db.data.settings[botNumber].autotype = true;
                    m.reply(`Auto-typing berhasil diubah ke ${q}, jadi bot bakal ngetik otomatis deh!`);
                } else if (q === 'false') {
                    db.data.settings[botNumber].autotype = false;
                    m.reply(`Auto-typing dimatikan, jadi bot gak bakal ngetik otomatis lagi!`);
                }
                break;

            case 'autobio':
                if (!isCreator) return m.reply(mess.owner);
                if (args.length < 1) return m.reply(`Contoh: ${prefix + command} true/false?`);
                if (q == 'true') {
                    db.data.settings[botNumber].autobio = true;
                    m.reply(`AutoBio berhasil diubah ke ${q}, biografi otomatis aktif!`);
                } else if (q == 'false') {
                    db.data.settings[botNumber].autobio = false;
                    m.reply(`AutoBio berhasil dimatikan. Gak ada lagi bio otomatis nih!`);
                }
                break;

case 'delete': case 'del': {
if (m.isGroup) {
if (!isCreator && !m.isAdmin) return m.reply(mess.admin)
if (!m.quoted) return m.reply("reply pesannya")
if (m.quoted.fromMe) {
rinn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: true, id: m.quoted.id, participant: m.quoted.sender}})
} else {
if (!m.isBotAdmin) return m.reply(mess.botAdmin)
rinn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender}})
}} else {
if (!isCreator) return m.reply(mess.owner)
if (!m.quoted) return m.reply(example("reply pesan"))
rinn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender}})
}
}
break
            case 'setppgroup':
            case 'setppgrup':
            case 'setppgc': {
                if (!m.isGroup) return m.reply(mess.group)
                if (!isAdmins) return m.reply(mess.admin)
                if (!isBotAdmins) return m.reply(mess.botAdmin)
                if (!quoted) return m.reply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                if (!/image/.test(mime)) return m.reply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                if (/webp/.test(mime)) return m.reply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                let media = await rinn.downloadAndSaveMediaMessage(quoted)
                await rinn.updateProfilePicture(m.chat, {
                    url: media
                }).catch((err) => fs.unlinkSync(media))
                await reactionMessage('✅');
            }
            break

            case 'deleteppgroup':
            case 'delppgc':
            case 'deleteppgc':
            case 'delppgroup': {
                if (!m.isGroup) return m.reply(mess.group);
                if (!isAdmins && !isCreator) return m.reply(mess.admin);
                if (!isBotAdmins) return m.reply(mess.botAdmin);
                await rinn.removeProfilePicture(m.chat)
            }
            break;

            case 'audioplay':
            case 'videoplay': {
                const userState = getState(sender);
                if (!userState || userState.state !== 'awaiting_format') {
                    return;
                }

                const {
                    videoInfo
                } = userState.data;
                const isAudio = command === 'audioplay';

                try {
                    await reactionMessage('⌛');

                    if (isAudio) {
                        // Send audio
                        await rinn.sendMessage(msg.key.remoteJid, {
                            audio: {
                                url: videoInfo.mp3
                            },
                            mimetype: 'audio/mpeg',
                            fileName: `${videoInfo.title}.mp3`,
                            contextInfo: {
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: videoInfo.title,
                                    body: `Channel: ${videoInfo.author}`,
                                    mediaType: 2,
                                    thumbnailUrl: videoInfo.thumbnail,
                                    renderLargerThumbnail: true,
                                    mediaUrl: videoInfo.url,
                                    sourceUrl: videoInfo.Url
                                }
                            }
                        }, {
                            quoted: msg
                        });
                    } else {
                        // Send video
                        await rinn.sendMessage(msg.key.remoteJid, {
                            video: {
                                url: videoInfo.mp4
                            },
                            caption: `✨ *${videoInfo.title}*\nChannel: ${videoInfo.author}\n\n`,
                            mimetype: 'video/mp4',
                            fileName: `${videoInfo.title}.mp4`
                        }, {
                            quoted: msg
                        });
                    }

                } catch (error) {
                    console.error(`Error processing ${isAudio ? 'audio' : 'video'}:, error`);
                    await reply(rinn, msg, `Gagal memproses ${isAudio ? 'audio' : 'video'}. Silakan coba lagi nanti.`);
                } finally {
                    userStates.delete(sender);
                }
            }
            break;

case "listgc": case "listgrup": {
if (!isCreator) return
let teks = `\n *乂 List all group chat*\n`
let a = await rinn.groupFetchAllParticipating()
let gc = Object.values(a)
teks += `\n* *Total group :* ${gc.length}\n`
for (const u of gc) {
teks += `\n* *ID :* ${u.id}
* *Nama :* ${u.subject}
* *Member :* ${u.participants.length}
* *Status :* ${u.announce == false ? "Terbuka": "Hanya Admin"}
* *Pembuat :* ${u?.subjectOwner ? u?.subjectOwner.split("@")[0] : "Sudah Keluar"}\n`
}
return m.reply(teks)
}
break;





case "cekidch": case "idch": {
if (!text) return m.reply(`${prefix}${command} linkchnya`)
if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await rinn.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`
return m.reply(teks)
}
break;



case 'upsaluran': {
if (!isCreator) return
try {
if (!mime && !text) {
return reply(`Balas Pesan DenganPerintah *${prefix + command}*`)
}
media = mime ? await quoted.download() : null
let defaultCaption = "Sukses"
if (/image/.test(mime)) {
rinn.sendMessage(idSaluran, {
image: media,
caption: text ? text : defaultCaption
})
m.reply(`📸 Gambar berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
} else if (/video/.test(mime)) {
rinn.sendMessage(idSaluran, {
video: media,
caption: text ? text : defaultCaption
})
m.reply(`🎥 Video berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
} else if (/audio/.test(mime)) {
rinn.sendMessage(idSaluran, {
audio: media,
mimetype: mime,
ptt: true
})
m.reply(`🎵 Audio berhasil diunggah ke saluran`)
} else if (/text/.test(mime) || text) {
rinn.sendMessage(idSaluran, {
text: text ? text : defaultCaption
})
m.reply(`💬 Pesan teks berhasil dikirim ke saluran: "${text ? text : defaultCaption}"`)
} else {
reply(`Error`)
}
} catch (error) {
console.error(error)
reply(`Error`)
}
}
break;



case 'getcase': {
 const getCase = (cases) => {
 return "case " + `'${cases}'` + fs.readFileSync("./case.js").toString().split('case \'' + cases + '\'')[1].split("break;")[0] + "break;"
 }
 try {
 if (!isCreator) return m.reply('ngapain')
 if (!q) return m.reply(`contoh : ${prefix + command} antilink`)
 let nana = await getCase(q)
 m.reply(nana)
 } catch (err) {
 console.log(err)
 m.reply(`Case ${q} tidak di temukan`)
 }
 }
 break;

case 'play': {
 if (!args[0]) {
 await rinn.sendMessage(sender, {
 text: `Masukan judul/link!\ncontoh:\n\n${prefix + command} Kingslayer\n${prefix + command} https://youtube.com/watch?v=example`,
 quoted: msg
 });
 return;
 }
 await reactionMessage('⌛');
 try {
 const searchQuery = args.join(' ');
 const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-_]+/;
 let videoInfo;
 let videoUrl;

 // Define the download functions from ytdl.js
 const ppp = {
 api: {
 base: "https://media.savetube.me/api",
 info: "/v2/info",
 download: "/download",
 cdn: "/random-cdn"
 },

 headers: {
 'accept': '*/*',
 'content-type': 'application/json',
 'origin': 'https://yt.savetube.me',
 'referer': 'https://yt.savetube.me/',
 'user-agent': 'Postify/1.0.0'
 },

 crypto: {
 hexToBuffer: (hexString) => {
 const matches = hexString.match(/.{1,2}/g);
 return Buffer.from(matches.join(''), 'hex');
 },

 decrypt: async (enc) => {
 try {
 const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
 const data = Buffer.from(enc, 'base64');
 const iv = data.slice(0, 16);
 const content = data.slice(16);
 const key = ppp.crypto.hexToBuffer(secretKey);

 const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
 let decrypted = decipher.update(content);
 decrypted = Buffer.concat([decrypted, decipher.final()]);

 return JSON.parse(decrypted.toString());
 } catch (error) {
 throw new Error(`${error.message}`);
 }
 }
 },

 isUrl: (str) => {
 try {
 new URL(str);
 return /youtube\.com|youtu\.be/.test(str);
 } catch (_) {
 return false;
 }
 },

 youtube: (url) => {
 const patterns = [
 /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
 /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
 /youtu\.be\/([a-zA-Z0-9_-]{11})/
 ];
 for (let pattern of patterns) {
 if (pattern.test(url)) return url.match(pattern)[1];
 }
 return null;
 },

 request: async (endpoint, data = {}, method = 'post') => {
 try {
 const { data: response } = await axios({
 method,
 url: `${endpoint.startsWith('http') ? '' : ppp.api.base}${endpoint}`,
 data: method === 'post' ? data : undefined,
 params: method === 'get' ? data : undefined,
 headers: ppp.headers
 });

 return {
 status: true,
 code: 200,
 data: response
 };
 } catch (error) {
 return {
 status: false,
 code: error.response?.status || 500,
 error: error.message
 };
 }
 },

 getCDN: async () => {
 const response = await ppp.request(ppp.api.cdn, {}, 'get');
 if (!response.status) return response;
 return {
 status: true,
 code: 200,
 data: response.data.cdn
 };
 },

 download: async (link, format) => {
 if (!ppp.isUrl(link)) {
 return {
 status: false,
 code: 400,
 error: "URL gak valid. Coba pake URL YouTube."
 };
 }

 const id = ppp.youtube(link);
 if (!id) {
 return {
 status: false,
 code: 400,
 error: "Gagal dapet ID video."
 };
 }

 try {
 const cdnx = await ppp.getCDN();
 if (!cdnx.status) return cdnx;
 const cdn = cdnx.data;

 const videoInfo = await ppp.request(`https://${cdn}${ppp.api.info}`, {
 url: `https://www.youtube.com/watch?v=${id}`
 });
 if (!videoInfo.status) return videoInfo;

 const decrypted = await ppp.crypto.decrypt(videoInfo.data.data);

 const downloadData = await ppp.request(`https://${cdn}${ppp.api.download}`, {
 id: id,
 downloadType: format === 'mp3' ? 'audio' : 'video',
 quality: format === 'mp3' ? format : '720',
 key: decrypted.key
 });

 if (!downloadData.data.data || !downloadData.data.data.downloadUrl) {
 return {
 status: false,
 code: 500,
 error: "Gagal ambil link download."
 };
 }

 return {
 status: true,
 code: 200,
 result: {
 title: decrypted.title || "Gak tau judulnya",
 thumbnail: decrypted.thumbnail,
 duration: decrypted.duration,
 views: decrypted.views,
 author: decrypted.author,
 format: format,
 download: downloadData.data.data.downloadUrl
 }
 };

 } catch (error) {
 return {
 status: false,
 code: 500,
 error: error.message
 };
 }
 }
 };

 if (ytRegex.test(searchQuery)) {
 // Direct URL provided
 videoUrl = searchQuery;
 
 // Get video metadata
 const mp4Result = await ppp.download(videoUrl, 'mp4');
 const mp3Result = await ppp.download(videoUrl, 'mp3');
 
 if (!mp4Result.status || !mp3Result.status) {
 throw new Error('Gagal mendapatkan informasi video');
 }

 videoInfo = {
 title: mp4Result.result.title,
 thumbnail: mp4Result.result.thumbnail,
 duration: mp4Result.result.duration,
 views: mp4Result.result.views,
 author: mp4Result.result.author,
 mp4: mp4Result.result.download,
 mp3: mp3Result.result.download
 };
 } else {
 // Search query provided - USING YOUR EXISTING SEARCH API
 const searchResponse = await axios.get(`https://vapis.my.id/api/yts?q=${encodeURIComponent(searchQuery)}`);
 if (!searchResponse.data.status || !searchResponse.data.data || searchResponse.data.data.length === 0) {
 throw new Error('Video tidak ditemukan');
 }

 const firstVideo = searchResponse.data.data[0];
 videoUrl = firstVideo.url;
 
 // Get video and audio using the ytdl method
 const mp4Result = await ppp.download(videoUrl, 'mp4');
 const mp3Result = await ppp.download(videoUrl, 'mp3');
 
 if (!mp4Result.status || !mp3Result.status) {
 throw new Error('Gagal mendapatkan informasi video');
 }

 videoInfo = {
 title: firstVideo.title || mp4Result.result.title,
 thumbnail: firstVideo.thumbnail || mp4Result.result.thumbnail,
 duration: firstVideo.duration || mp4Result.result.duration,
 views: firstVideo.views || mp4Result.result.views,
 author: firstVideo.channel || mp4Result.result.author,
 mp4: mp4Result.result.download,
 mp3: mp3Result.result.download
 };
 }
 
 let caption = Buffer.from('*Pencarian Ditemukan!* ✨\n\n╔╾┅━┅━┅━┅━┅━┅━┅━┅⋄\n┇❏ `Judul:` ' + videoInfo.title + '\n┇❏ `Channel:` ' + videoInfo.author + '\n┇❏ `Durasi:` ' + videoInfo.duration + '\n┇❏ `Views:` ' + videoInfo.views + '\n╚╾┅━┅━┅━┅━┅━┅━┅━┅⋄\n').toString();
 rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [
 {
 buttonId: `.audioplay`,
 buttonText: {
 displayText: "Audio"
 }, type: 1
 },
 {
 buttonId: `.videoplay`,
 buttonText: {
 displayText: "Video"
 }, type: 1
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: `...`,
 mimeType: 'application/msword',
 fileLength: "99999999999999999999999",
 caption: caption,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: 'YouTube',
 body: `${jam}`,
 thumbnailUrl: `${videoInfo.thumbnail}`,
 sourceUrl: null,
 mediaType: 1,
 renderLargerThumbnail: true
 },
 },
 }, { quoted: m })

 await reactionMessage('✅');
 // Store video info in state
 setState(sender, 'awaiting_format', {
 videoInfo
 });

 } catch (error) {
 console.error("Error pada fitur play:", error);

 let errorMsg = `Terjadi error: ${error.message}`;

 if (error.message === 'Video tidak ditemukan') {
 errorMsg = 'Video tidak ditemukan. Silakan coba kata kunci lain.';
 } else if (error.message === 'Gagal mendapatkan informasi video') {
 errorMsg = 'Gagal mendapatkan informasi video. Silakan coba lagi nanti.';
 } else if (error.response && error.response.status === 404) {
 errorMsg = 'API tidak dapat diakses. Silakan coba lagi nanti.';
 } else if (error.code === 'ENOTFOUND') {
 errorMsg = 'Gagal mengakses server. Periksa koneksi internet Anda.';
 }

 await reply(rinn, msg, errorMsg);
 }
 }
 break;







case 'spotify': {
 if (!args.length) {
 rinn.sendMessage(sender, {
 text: `Masukan judul/link!\ncontoh:\n\n${prefix + command} 1番輝く星\n${prefix + command} https://open.spotify.com/track/xxxxx`
 }, {
 quoted: msg
 });
 return;
 }

 try {
 const query = args.join(' ');
 const spotifyRegex = /^https?:\/\/open\.spotify\.com\/(track|album|playlist)\/[\w\-]+/;

 if (spotifyRegex.test(query)) {
 } else {
 try {
 console.log('Mencari dengan keyword:', query);
 const searchRes = await axios.get(`https://vapis.my.id/api/spotifys?q=${encodeURIComponent(query)}`);

 if (!searchRes.data || !searchRes.data.data || !searchRes.data.data.length) {
 throw new Error('Lagu tidak ditemukan');
 }

 const tracks = searchRes.data.data.slice(0, 10);

 // Simpan hasil pencarian ke dalam Map dengan ID user sebagai key
 searchResults.set(sender, tracks);
 // Set state user ke 'awaiting_selection'
 setState(sender, 'awaiting_selection', {
 tracks
 });

 let sections = tracks.map((track, index) => ({
 title: "Pilih lagu",
 rows: [{
 title: `${index + 1}. ${track.nama}`,
 description: `${track.artis}`,
 id: `.${index + 1}`
 }
 ]
 }));
 let listMessage = {
 title: 'Click Here⎙',
 sections
 };

 const caption = `*Hasil Pencarian Spotify*\n\nSilahkan pilih lagu yang ingin didownload:`;
 const thumbnailUrl = tracks[0].image || "https://i.ibb.co/vxLRS6J/spotify-logo.png";
 
 await rinn.sendMessage(m.chat, {
 footer: botName,
 buttons: [{
 buttonId: `${prefix}cancel`,
 buttonText: {
 displayText: 'Cancel'
 },
 type: 1,
 },
 {
 buttonId: 'action',
 buttonText: {
 displayText: 'ini pesan interactiveMeta'
 },
 type: 4,
 nativeFlowInfo: {
 name: 'single_select',
 paramsJson: JSON.stringify(listMessage),
 },
 },
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync('./package.json'),
 fileName: ownerName,
 mimeType: 'application/msword',
 fileLength: "99999999999999999999999",
 caption: caption,
 contextInfo: {
 isForwarded: true,
 mentionedJid: [m.sender],
 forwardedNewsletterMessageInfo: {
 newsletterJid: idSaluran,
 newsletterName: namaSaluran
 },
 externalAdReply: {
 title: 'Spotify Music',
 body: `${tracks[0].nama} - ${tracks[0].artis}`,
 thumbnailUrl: thumbnailUrl,
 sourceUrl: 'https://open.spotify.com',
 mediaType: 1,
 renderLargerThumbnail: true
 },
 }
 }, {
 quoted: msg
 });
 } catch (error) {
 console.error('Error pencarian:', error);
 throw error;
 }
 }
 } catch (e) {
 console.error("Error pada fitur spotify:", e);
 await reply(rinn, msg, `Error: ${e.message}`);
 }
}
break;





case '1':
 case '2':
 case '3':
 case '4':
 case '5':
 case '6':
 case '7':
 case '8':
 case '9':
 case '10': {
 const userState = getState(sender);

 if (!userState || userState.state !== 'awaiting_selection') {
 return;
 }

 const selectedIndex = parseInt(command) - 1;
 const tracks = userState.data.tracks;

 if (selectedIndex < 0 || selectedIndex >= tracks.length) {
 await reply(rinn, msg, 'Nomor tidak valid. Silakan pilih nomor yang benar.');
 return;
 }

 try {
 const selectedTrack = tracks[selectedIndex];

 // Kirim pesan loading
 await rinn.sendMessage(sender, {
 text: `⌛ Sedang memproses audio...\n\n*Judul:* ${selectedTrack.nama}\n*Artis:* ${selectedTrack.artis}`
 }, {
 quoted: msg
 });

 // Download lagu menggunakan URL Spotify
 const downloadRes = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(selectedTrack.link)}`);

 if (!downloadRes.data || !downloadRes.data.data) {
 throw new Error('Format respons API tidak valid');
 }

 const songData = {
 title: downloadRes.data.data.title,
 artist: downloadRes.data.data.artis,
 thumbnail: downloadRes.data.data.image,
 url: downloadRes.data.data.download,
 duration: downloadRes.data.data.durasi,
 spotifyUrl: selectedTrack.url
 };

 // Kirim audio
 await rinn.sendMessage(m.chat, {
 audio: {
 url: songData.url
 },
 mimetype: 'audio/mpeg',
 fileName: `${songData.title || 'audio'}.mp3`,
 ptt: false,
 contextInfo: {
 externalAdReply: {
 showAdAttribution: true,
 title: songData.title,
 mediaType: 1,
 previewType: 1,
 body: songData.artist,
 thumbnailUrl: songData.thumbnail,
 renderLargerThumbnail: true,
 mediaUrl: songData.spotifyUrl,
 sourceUrl: songData.spotifyUrl
 }
 }
 }, {
 quoted: msg
 });

 // Hapus state setelah selesai
 userStates.delete(sender);

 } catch (error) {
 console.error('Error downloading:', error);
 await reply(rinn, msg, `Gagal mengunduh lagu: ${error.message}`);
 }
 }
 break;

case 'gimage':
case 'simg':
case 'searchimage':
 {
 if (!text) return m.reply('Masukkan kata kunci pencarian!')
 await reactionMessage('🔍')
 try {
 let response = await fetchJson(`https://api.siputzx.my.id/api/images?query=${text}`)
 
 if (!response.status) return m.reply("Error: API response status not OK")
 
 let aray = response.data || []
 
 if (aray.length === 0) {
 return m.reply("Tidak ada hasil gambar yang ditemukan")
 }
 
 aray = aray.slice(0, 20) 
 await m.reply(`🔎 *Hasil Pencarian Foto untuk:* _${text}_`)
 let cards = []
 let total = 0
 
 for (let i of aray) {
 try {
 if (!i.url) {
 console.log('Image URL not found in data item:', i)
 continue
 }
 
 let imageUrl = i.url
 let imgsc = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: rinn.waUploadToServer })
 cards.push({
 header: proto.Message.InteractiveMessage.Header.fromObject({
 title: `Foto Ke ${++total}`,
 hasMediaAttachment: true,
 ...imgsc
 }),
 nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
 buttons: [
 {
 name: "cta_copy",
 buttonParamsJson: `{ "display_text": "Salin Link", "copy_text": "${imageUrl}" }`
 }
 ]
 }),
 footer: proto.Message.InteractiveMessage.Footer.create({
 text: `🔗 ${imageUrl}`
 })
 })
 } catch (err) {
 console.error(`Error processing image:`, err)
 }
 }
 
 if (cards.length === 0) {
 return m.reply('Tidak dapat memproses gambar, coba kata kunci lain!')
 }
 
 const msg = await generateWAMessageFromContent(m.chat, {
 viewOnceMessage: {
 message: {
 messageContextInfo: {
 deviceListMetadata: {},
 deviceListMetadataVersion: 2
 },
 interactiveMessage: proto.Message.InteractiveMessage.fromObject({
 carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
 cards: cards
 })
 })
 }
 }
 }, {
 userJid: m.sender,
 quoted: m
 })
 
 rinn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
 await rinn.sendMessage(m.chat, { react: { text: '', key: m.key } })
 } catch (error) {
 console.error('Main error:', error)
 return m.reply('Terjadi kesalahan saat mencari foto! Coba lagi nanti.')
 }
 }
 break;

case 'cekbaterai': {
 try {
 
 const batteryData = await systeminformation.battery();
 
 if (!batteryData.hasBattery) {
 m.reply('Tidak dapat mendeteksi baterai pada sistem.');
 break;
 }

 const level = Math.floor(batteryData.percent);
 const isCharging = batteryData.isCharging;
 const timeRemaining = batteryData.timeRemaining;
 
 let message = `🔋 *Status Baterai*\n\n`;
 message += `📊 Level: ${level}%\n`;
 message += `⚡ Status: ${isCharging ? 'Sedang charging' : 'Tidak charging'}\n`;
 
 
 if (timeRemaining > 0) {
 const hours = Math.floor(timeRemaining / 60);
 const minutes = timeRemaining % 60;
 message += `⏳ ${isCharging ? 'Waktu sampai penuh' : 'Sisa waktu'}: ${hours}j ${minutes}m\n`;
 }

 message += '\n';
 
 
 if (level <= 20) {
 message += '⚠️ *Peringatan:* Baterai lemah, segera charge!';
 } else if (level >= 80 && isCharging) {
 message += '✅ *Info:* Baterai sudah hampir penuh.';
 }

 m.reply(message);
 } catch (error) {
 m.reply(`❌ Terjadi error: ${error.message}`);
 console.error('Battery check error:', error);
 }}
 break;

case 'readerqr': case 'bacaqr':
 if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.quotedMessage) {
 return rinn.sendMessage(m.chat, { text: "❌ Harap reply gambar QR Code untuk membacanya." }, { quoted: m });
 }

 let quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
 
 if (!quotedMessage.imageMessage) {
 return rinn.sendMessage(m.chat, { text: "❌ Harap reply gambar QR Code, bukan teks atau media lain." }, { quoted: m });
 }

 try {
 const stream = await downloadContentFromMessage(quotedMessage.imageMessage, "image");
 let buffer = Buffer.from([]);

 for await (const chunk of stream) {
 buffer = Buffer.concat([buffer, chunk]);
 }

 let imagePath = "./tmp/temp_qr.jpg"; 
 fs.writeFileSync(imagePath, buffer);

 jimp.read(imagePath, (err, image) => {
 if (err) {
 return rinn.sendMessage(m.chat, { text: "❌ Gagal membaca gambar QR Code." }, { quoted: m });
 }

 const qr = new qrCodeReader();
 qr.callback = (error, result) => {
 if (error || !result) {
 return rinn.sendMessage(m.chat, { text: "❌ QR Code tidak valid atau tidak ditemukan." }, { quoted: m });
 }

 rinn.sendMessage(m.chat, { text: `✅ Hasil QR Code: ${result.result}` }, { quoted: m });
 };

 qr.decode(image.bitmap);
 });

 } catch (error) {
 console.error("Error membaca QR:", error);
 rinn.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat membaca QR Code." }, { quoted: m });
 }

 break;



case 'pin': case 'pinterest': {
 if (!args.length) {
 await reply(rinn, msg, `Masukan kata kunci!\ncontoh:\n\n${prefix + command} Alya`);
 return;
 }
 const pins = require('./lib/handlers/dlPin');
 try {
 await reactionMessage('🕐');
 // Search Pinterest using pinsearch function
 const query = args.join(' ');
 const results = await pins(query);

 if (!results.length) {
 await reply(rinn, msg, 'Tidak ada gambar ditemukan. Silakan coba kata kunci lain.');
 return;
 }

 // Format results
 const images = results.map(result => ({
 url: result.image_large_url || result.image_small_url,
 caption: `乂───『[ Pinterest ]』───乂`
 }));

 // Save images to state
 StateManager.setState(sender, 'pinterest_search', {
 images: images,
 currentIndex: 0,
 query: query
 });

 await rinn.sendMessage(sender, {
 image: {
 url: images[0].url
 },
 caption: `${images[0].caption}\n\n*Hasil pencarian untuk:* "${query}"\n*Image:* 1/${images.length}`,
 headerType: 6,
 buttons: [{
 buttonId: `.next`,
 buttonText: {
 displayText: 'Next'
 },
 type: 1,
 },
 {
 buttonId: `.next`,
 buttonText: {
 displayText: 'Stop'
 },
 type: 1,
 },
 ],
 headerType: 1,
 viewOnce: true
 }, {
 quoted: msg
 });

 } catch (error) {
 console.error("Error pada fitur pinterest:", error);

 let errorMsg = 'Terjadi kesalahan saat mencari gambar.';

 if (error.response) {
 if (error.response.status === 404) {
 errorMsg = 'Pinterest API tidak dapat diakses. Silakan coba lagi nanti.';
 } else {
 errorMsg = 'Gagal mengambil data dari Pinterest. Silakan coba lagi.';
 }
 } else if (error.code === 'ENOTFOUND') {
 errorMsg = 'Gagal mengakses server. Periksa koneksi internet Anda.';
 }

 await reply(rinn, msg, errorMsg);
 }
}
break;

case 'ttsalbum':
case 'ttsearchalbum': {
 if (!args.length) {
 await reply(rinn, msg, `Masukan kata kunci!\ncontoh:\n\n${prefix + command} dance`);
 return;
 }
 try {
 await reactionMessage('🕐');
 
 // Search TikTok videos
 const query = args.join(' ');
 const videos = await ttSearch(query, 5); // Search for 5 videos

 if (!videos.length) {
 await reply(rinn, msg, 'Tidak ada video ditemukan. Silakan coba kata kunci lain.');
 return;
 }

 // Prepare caption
 const caption = `*Hasil pencarian TikTok untuk:* "${query}"\n*Total Video:* ${videos.length}`;

 // Send videos as album
 await sendVideoAlbum(rinn, msg, videos, caption);

 } catch (error) {
 console.error("Error pada fitur tiktok search:", error);

 let errorMsg = 'Terjadi kesalahan saat mencari video TikTok.';

 if (error.response) {
 if (error.response.status === 404) {
 errorMsg = 'TikTok API tidak dapat diakses. Silakan coba lagi nanti.';
 } else {
 errorMsg = 'Gagal mengambil data dari TikTok. Silakan coba lagi.';
 }
 } else if (error.code === 'ENOTFOUND') {
 errorMsg = 'Gagal mengakses server. Periksa koneksi internet Anda.';
 }

 await reply(rinn, msg, errorMsg);
 }
}
break;



case 'stickersearch':
case 'stikersearch': {
 if (!args.length) {
 await reply(rinn, msg, `Masukan kata kunci!\ncontoh:\n\n${prefix + command} Genshin impact`);
 return;
 }

 const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

 try {
 await reactionMessage('🕐');
 
 // Search stickers
 const query = args.join(' ');
 const result = await stickerSearch(query);

 if (!result || !result.result || !result.result.sticker || result.result.sticker.length === 0) {
 await reply(rinn, msg, 'Tidak ada stiker ditemukan. Silakan coba kata kunci lain.');
 return;
 }

 const stickers = result.result.sticker;
 const stickerSetTitle = result.result.title || 'Sticker Set';

 // Prepare caption
 const caption = `*Hasil pencarian stiker:* "${query}"\n*Set Stiker:* ${stickerSetTitle}\n*Total Stiker:* ${stickers.length}`;

 // Send first sticker to group
 if (stickers.length > 0) {
 await rinn.sendImageAsSticker(m.chat, stickers[0], m, {
 packname: "https://archive-ui.tanakadomp.biz.id",
 author: authors
 });
 }

 // Send remaining stickers to private chat
 if (stickers.length > 1) {
 const remainingStickers = stickers.slice(1);
 
 for (const stickerUrl of remainingStickers) {
 await rinn.sendImageAsSticker(m.sender, stickerUrl, m, {
 packname: "https://archive-ui.tanakadomp.biz.id",
 author: authors
 });
 
 // Delay between sending stickers
 await delay(5000); // 5 seconds delay
 }

 // Send completion message to group
 await reply(rinn, msg, `Sisa ${remainingStickers.length} stiker telah dikirim ke chat pribadi Anda.`);
 }

 } catch (error) {
 console.error("Error pada fitur sticker search:", error);

 let errorMsg = 'Terjadi kesalahan saat mencari stiker.';

 if (error.response) {
 if (error.response.status === 404) {
 errorMsg = 'Stiker API tidak dapat diakses. Silakan coba lagi nanti.';
 } else {
 errorMsg = 'Gagal mengambil data stiker. Silakan coba lagi.';
 }
 } else if (error.code === 'ENOTFOUND') {
 errorMsg = 'Gagal mengakses server. Periksa koneksi internet Anda.';
 }

 await reply(rinn, msg, errorMsg);
 }
}
break;

case 'pinterestdl':


case 'pinterestdl':


case 'pinterestdl':
case 'pindl': {
 if (!args.length) {
 await reply(rinn, msg, `Masukan URL Pinterest!\ncontoh:\n\n${prefix + command} https://id.pinterest.com/pin/862439397377053654`);
 return;
 }

 try {
 await reactionMessage('🕐');
 
 // Get Pinterest URL from arguments
 const pinterestUrl = args[0];

 const pinterestRegex = /^https?:\/\/(www\.|id\.)?pinterest\.com\/pin\/\d+\/?$/;
 if (!pinterestRegex.test(pinterestUrl)) {
 await reply(rinn, msg, 'URL Pinterest tidak valid. Pastikan menggunakan format yang benar.');
 return;
 }

 // Download Pinterest content
 const result = await downloadPinterest(pinterestUrl);

 if (!result || !result.status || !result.data) {
 await reply(rinn, msg, 'Gagal mengunduh konten. Silakan periksa URL atau coba lagi.');
 return;
 }

 // Determine content type (video or image)
 const mediaType = result.data.url.toLowerCase().includes('.mp4') ? 'video' : 'image';

 // Prepare caption
 const caption = `*Pinterest Download*\n*Dibuat pada:* ${result.data.created_at}\n*Tipe:* ${mediaType.toUpperCase()}`;

 // Send media
 if (mediaType === 'video') {
 await rinn.sendMessage(msg.chat, {
 video: { url: result.data.url },
 caption: caption
 }, { quoted: msg });
 } else {
 await rinn.sendMessage(msg.chat, {
 image: { url: result.data.url },
 caption: caption
 }, { quoted: msg });
 }

 } catch (error) {
 console.error("Error pada fitur pinterest download:", error);

 let errorMsg = 'Terjadi kesalahan saat mengunduh konten Pinterest.';

 if (error.response) {
 if (error.response.status === 404) {
 errorMsg = 'Konten tidak ditemukan. Pastikan URL masih aktif.';
 } else {
 errorMsg = 'Gagal mengunduh konten. Silakan coba lagi.';
 }
 } else if (error.code === 'ENOTFOUND') {
 errorMsg = 'Gagal mengakses server. Periksa koneksi internet Anda.';
 }

 await reply(rinn, msg, errorMsg);
 }
}
break;

case 'play2': {
 if (!text) return m.reply(penggunaan('Cari apa?'))
 await reactionMessage('🔎');

 let ytsSearch = await yts(text)
 const anuan = ytsSearch.all
 if (!anuan.length) return m.reply("Tidak ditemukan hasil untuk pencarian tersebut!")

 let teksnya = "📽 *Hasil Pencarian YouTube*\n\nPilih salah satu untuk mendengarkan atau menonton:"
 
 let sections = []
 let addedTitles = new Set()

 for (let res of anuan.slice(0, 7)) {
 let title = res.title
 let channel = res.author.name || "Unknown"
 let duration = res.timestamp
 let views = res.views
 
 if (!addedTitles.has(title)) {
 sections.push({
 "title": title, 
 "rows": []
 })
 addedTitles.add(title)
 }

 let sectionIndex = sections.findIndex(sec => sec.title === title)

 sections[sectionIndex].rows.push({
 "title": "🎶 Play Audio",
 "description": `📢 ${channel} • ⏳ ${duration}`,
 "id": `.ytdlmp3 ${res.url}`
 })
 sections[sectionIndex].rows.push({
 "title": "📺 Play Video",
 "description": `📢 ${channel} • ⏳ ${duration}`,
 "id": `.ytdlmp4 ${res.url}`
 })
 }

 let msgii = generateWAMessageFromContent(m.chat, { 
 viewOnceMessage: { 
 message: { 
 "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 }, 
 interactiveMessage: proto.Message.InteractiveMessage.create({
 contextInfo: { mentionedJid: [m.sender], externalAdReply: { showAdAttribution: true }}, 
 body: proto.Message.InteractiveMessage.Body.create({ text: teksnya }), 
 footer: proto.Message.InteractiveMessage.Footer.create({ text: global.foother }), 
 nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
 buttons: [{
 "name": "single_select",
 "buttonParamsJson": `{ "title": "Pilih Opsi", "sections": ${JSON.stringify(sections)} }`
 }]
 })
 }) 
 } 
 }
 }, { userJid: m.sender, quoted: null }) 

 await rinn.relayMessage(msgii.key.remoteJid, msgii.message, { messageId: msgii.key.id })
}
break;
case 'addcase': {
  if (!isCreator) return m.reply(mess.owner)
  if (!text) return m.reply('Tambahkan case yang mau dimasukkan');
  const NAMA_FILE = './case.js';
  const caseBaru = text;
  try {
    fs.readFile(NAMA_FILE, 'utf8', (err, data) => {
      if (err) throw err;
      const posisiAwalGimage = data.indexOf("case 'addcase':");
      if (posisiAwalGimage !== -1) {
        const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
        fs.writeFile(NAMA_FILE, kodeBaruLengkap, 'utf8', (err) => {
          if (err) {
            m.reply('Error File:', err);
          } else {
            m.reply('Sukses menambah case');
          }
        });
      } else {
        m.reply('Gagal menambah case');
      }
    });
  } catch (err) {
    console.error('Error saat membaca file:', err);
    return;
  }
}
break;
            default:
                if (budy.startsWith('=>')) {
                    if (!isCreator) return;

                    function Return(sul) {
                        sat = JSON.stringify(sul, null, 2);
                        bang = util.format(sat);
                        if (sat == undefined) {
                            bang = util.format(sul);
                        }
                        return rinn.sendMessage(sender, {
                            text: bang
                        }, {
                            quoted: msg
                        });
                    }
                    try {
                        reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)));
                    } catch (e) {
                        rinn.sendMessage(sender, {
                            text: String(e)
                        }, {
                            quoted: msg
                        });
                    }
                }

                if (budy.startsWith('>')) {
                    if (!isCreator) return;
                    let kode = budy.trim().split(/ +/)[0];
                    let teks;
                    try {
                        teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
                    } catch (e) {
                        teks = e;
                    } finally {
                        await rinn.sendMessage(sender, {
                            text: require('util').format(teks)
                        }, {
                            quoted: msg
                        });
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isCreator) return;
                    exec(budy.slice(2), (error, stdout) => {
                        if (error) return rinn.sendMessage(sender, {
                            text: `${error}`
                        }, {
                            quoted: msg
                        });
                        if (stdout) return rinn.sendMessage(sender, {
                            text: stdout
                        }, {
                            quoted: msg
                        });
                    });
                }
        }
       }
const historyFile = './storage/autoai.json';
function saveHistory(sender, message) {
    let history = {};
    if (fs.existsSync(historyFile)) {
        history = JSON.parse(fs.readFileSync(historyFile));
    }
    history[sender] = history[sender] || [];
    history[sender].push(message);
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}
rinn.autoai = rinn.autoai || {};
let d = new Date();
d.setTime(d.getTime() + 3600000);
const hariini = d.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' });

if (m.isBaileys && m.fromMe) return;
if (!m.text) return;

if (!rinn.autoai[m.sender]) return;

const skipPrefixes = [".", "#", "!", "/", "\\"];
if (skipPrefixes.some(prefix => m.text.startsWith(prefix))) return;

try {
  if (m.text.toLowerCase().includes("musik") || m.text.toLowerCase().includes("carikan lagu") || 
      m.text.toLowerCase().includes("lagu") || m.text.toLowerCase().includes("carikan musik")) {
      const text = m.text.toLowerCase().replace("lagu", "").replace("musik", "").replace("carikan", "").trim();
      if (text) {
          try {
              let api = await fetch(`https://www.archive-ui.biz.id/search/spotify?q=${text}`);
              let data = await api.json();
              
              if (data.status !== true) return m.reply('Pencarian gagal! Coba lagi nanti.');
              
              let hasil = `乂 *HASIL PENCARIAN SPOTIFY* ◦\n\n`;
              for (let i = 0; i < Math.min(10, data.result.length); i++) {
                  let lagu = data.result[i];
                  hasil += `乂 *${i + 1}.* ${lagu.trackName}\n`;
                  hasil += `乂 *Artis* : ${lagu.artistName}\n`;
                  hasil += `乂 *Durasi* : undefined\n`;
                  hasil += `乂 *URL* : ${lagu.externalUrl}\n\n`;
              }
              hasil += `Ketik ${prefix}spdown <url> untuk download music Spotify!`;
              
              return rinn.sendMessage(m.chat, { text: hasil }, { quoted: m });
          } catch (e) {
              console.log(e);
              return m.reply('Terjadi kesalahan saat mencari musik!');
          }
      }
  }
  
  else if (m.text.toLowerCase().includes("cuaca") || m.text.toLowerCase().includes("weather")) {
      let text = '';
      if (m.text.toLowerCase().includes("cuaca")) {
          text = m.text.toLowerCase().split("cuaca")[1]?.trim();
      } else if (m.text.toLowerCase().includes("weather")) {
          text = m.text.toLowerCase().split("weather")[1]?.trim();
      }
      
      if (text) {
          try {
              let data = await fetchJson(`https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`);
              return m.reply(`*🏙 Cuaca Kota ${data.name}*\n\n*🌤️ Cuaca :* ${data.weather[0].main}\n*📝 Deskripsi :* ${data.weather[0].description}\n*🌡️ Suhu Rata-rata :* ${data.main.temp} °C\n*🤔 Terasa Seperti :* ${data.main.feels_like} °C\n*🌬️ Tekanan :* ${data.main.pressure} hPa\n*💧 Kelembapan :* ${data.main.humidity}%\n*🌪️ Kecepatan Angin :* ${data.wind.speed} Km/h\n*📍Lokasi :*\n- *Bujur :* ${data.coord.lat}\n- *Lintang :* ${data.coord.lon}\n*🌏 Negara :* ${data.sys.country}`);
          } catch (e) {
              return m.reply('Kota Tidak Di Temukan!\n\nContoh :\ncuaca bekasi');
          }
      }
  }
  
  else if (m.text.toLowerCase().includes("flux") || 
      m.text.toLowerCase().includes("gambar") || 
      m.text.toLowerCase().includes("buatin gambar") || 
      m.text.toLowerCase().includes("bikin gambar") || 
      m.text.toLowerCase().includes("foto") || 
      m.text.toLowerCase().includes("buatkan gambar")) {
      
      const triggers = ["foto", "gambar", "buatin gambar", "bikin gambar", "timg"];
      let text = m.text;
      
      for (const trigger of triggers) {
          if (m.text.toLowerCase().includes(trigger)) {
              text = m.text.toLowerCase().split(trigger)[1]?.trim();
              break;
          }
      }
      
      if (text) {
          try {
              m.reply('_Sedang Memproses Gambar..._');
              let apiUrl = `https://api.rynn-archive.biz.id/ai/flux-schnell?text=${encodeURIComponent(text)}`;
              let response = await fetch(apiUrl);
              let buffer = await response.buffer();
              return rinn.sendMessage(m.chat, { 
                  image: buffer, 
                  caption: '*Ini hasil gambarnya kak :v*\n\n> Maaf jika tidak sesuai harapan 😔' 
              }, { quoted: m });
          } catch (error) {
              console.error('Error in flux:', error);
              return m.reply('Terjadi kesalahan saat memproses gambar');
          }
      }
  }
  
  else if (m.text.toLowerCase().startsWith('itu apa') || m.text.toLowerCase().startsWith('apa itu') || m.text.toLowerCase().startsWith('itu')) {
      if (m.quoted && /image/.test(mime)) {
          const pertanyaan = m.text.trim();
          
          const BodyForm = require('form-data');
          const uploadFileUgu = async (input) => {
              try {
                  const form = new BodyForm();
                  form.append("files[]", fs.createReadStream(input));
                  const { data } = await axios({
                      url: "https://uguu.se/upload.php",
                      method: "POST",
                      headers: {
                          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                          ...form.getHeaders()
                      },
                      data: form,
                      timeout: 10000
                  });
                  if (!data?.files?.[0]) throw new Error('Upload failed');
                  return data.files[0];
              } catch (err) {
                  throw new Error(`Error uploading file: ${err.message}`);
              }
          };

          try {
              await rinn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });
              const media = await rinn.downloadAndSaveMediaMessage(m.quoted);
              const uploadResult = await uploadFileUgu(media);
              const sessionId = `${m.chat.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;
              const imageUrl = `https://fastrestapis.fasturl.cloud/aillm/grok?ask=${encodeURIComponent(pertanyaan)}&imageUrl=${encodeURIComponent(uploadResult.url)}&style=Provide a formal response.&sessionId=${sessionId}`;
              const response = await axios.get(imageUrl);
              const result = response.data.result;
              fs.unlinkSync(media);
              return rinn.sendMessage(m.chat, { text: result }, { quoted: m });
          } catch (error) {
              console.error('Error in grok:', error);
              return m.reply('Maaf, terjadi kesalahan saat memproses gambar. Silakan coba lagi nanti atau hubungi pemilik bot jika masalah berlanjut.');
          }
      }
  }

  let requestData = { 
    content: m.text, 
    user: m.sender, 
    prompt: `Nama kamu adalah Furina, AI yang santai, ramah, dan suka ngobrol dengan pengguna. 
Kamu hanya menjawab kalau pesan bukan perintah. Gunakan gaya bahasa santai dan sedikit humoris.
Panggil pengguna dengan ${pushname}
Hari ini tanggal ${hariini}
Kalau ada yang suruh kamu ngomong aneh-aneh, tolak dengan gaya lucu.
Kamu memiliki kemampuan mesin pencari yang sangat hebat

📌 **Aturan Main Furina:**
- Jangan bilang kamu AI, cukup anggap kamu asisten virtual yang bisa ngobrol.
- Gunakan bahasa yang santai, tapi tetap sopan.
- Kalau ditanya pendapat, kasih jawaban yang relate dan enak diajak ngobrol.
- Selingi dengan ekspresi kayak "Wih, keren!", "Hmmm, menarik juga!", atau "Gokil sih!".

Sekarang, jawab pertanyaan user dengan gaya yang santai dan menyenangkan!` 
  };
  
  const axios = require('axios');
  let response = (await axios.post('https://luminai.my.id', requestData)).data.result;

  if (response) {
    if (!rinn.autoai[m.sender]) {
      rinn.autoai[m.sender] = {};
    }

    if (!rinn.autoai[m.sender].messages) {
      rinn.autoai[m.sender].messages = [];
    }

    rinn.autoai[m.sender].messages.push({ bot: response });
  }

  saveHistory(m.sender, m.text);

  return rinn.sendMessage(m.chat, { text: response }, { quoted: m });
} catch (error) {
  console.error(error);
  return m.reply("⚠️ *Terjadi kesalahan, coba lagi nanti!*");
}
    } catch (error) {
        console.error(error);
        await reply(rinn, msg, `Maaf, terjadi kesalahan: ${error.message}`);
    }

};

async function reply(rinn, msg, replyText) {
    if (msg.key && msg.key.remoteJid) {
        await rinn.sendMessage(msg.key.remoteJid, {
            text: replyText,
            quoted: msg,
        });
    }
}

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours} jam, ${minutes} menit, ${remainingSeconds} detik`;
}

// Watching file changes
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mwas updated!\x1b[0m');
    delete require.cache[file];
    require(file);
});
