require('./settings')
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
    getContentType,
    getBinaryNodeChildren
} = require('@whiskeysockets/baileys');
const {
    exec
} = require('child_process');
const systeminformation = require('systeminformation');
const cheerio = require("cheerio");
const os = require('os');
const chalk = require('chalk');
const fs = require('fs');
const cron = require('node-cron');
const fetch = require('node-fetch');
const moment = require('moment-timezone');
const momentHijri = require('moment-hijri');
const sharp = require('sharp');
const path = require('path');
const jimp = require('jimp');
const axios = require('axios');
const crypto = require('crypto');
const {
    randomBytes
} = require('crypto');
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
    execSync
} = require('child_process');
const {
    html
} = require("js-beautify");
const {
    createWriteStream
} = require('fs');
const util = require('util');
const { promisify } = require('util')
const stream = require('stream');
const similarity = require('similarity');
const pipeline = promisify(stream.pipeline);
const {
    Sticker
} = require('wa-sticker-js')
const yts = require('yt-search');
const { Pomf, Quax, FastUrl, Catbox, Videy } = require("@zanixongroup/uploader");
const uploadFile = require("cloudku-uploader");

const {
    addAfkUser,
    checkAfkUser,
    getAfkId,
    getAfkPosition,
    getAfkReason,
    getAfkTime
} = require('./App/function/afk');
const {
    addFilter,
    addSpam,
    isFiltered,
    isSpam,
    ResetSpam
} = require('./App/function/antispam');
const { rdGame, iGame, tGame, gameSlot, gameCasinoSolo, gameMerampok, gameBegal, daily, buy, setLimit, addLimit, addUang, setUang, transfer } = require('./App/main/game');
const Func = require("./App/function/funcc");
const { toAudio, toPTT, toVideo, ffmpeg, addExifAvatar, addExif } = require('./App/function/exif');
const { LoadDataBase } = require('./App/function/message');
const prem = require('./App/function/premium');
const StateManager = require('./App/stateManager');
const Uploader = require('./App/uploader');

const pluginController = require('./lib/plug');
const {
    handleAIPrivate,
    replyAI
} = require('./lib/handlers/aiPrivateHandler');
const {
    handleNext,
    handleStop
} = require('./lib/NextStop');
const scraper = require('./lib/handlers/scraper');
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
const restapi = require('./lib/handlers/restapi.js');
const fetchTwitterMedia = require('./lib/handlers/dlTwitter');
const handlePxpic = require('./lib/handlers/dlPxpic');

const aiGroupStatus = new Map();

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

const afk = JSON.parse(fs.readFileSync('./storage/afk.json'));
const premium = JSON.parse(fs.readFileSync('./storage/data/role/premium.json'));

JSON.parse(fs.readFileSync('./storage/database.json'));
let suit = db.game.suit = []
let menfes = db.game.menfes = []
let tekateki = db.game.tekateki = []
let akinator = db.game.akinator = []
let tictactoe = db.game.tictactoe = []
let tebaklirik = db.game.tebaklirik = []
let kuismath = db.game.kuismath = []
let tebaklagu = db.game.tebaklagu = []
let tebakkata = db.game.tebakkata = []
let family100 = db.game.family100 = []
let susunkata = db.game.susunkata = []
let tebakbom = db.game.tebakbom = []
let tebakkimia = db.game.tebakkimia = []
let caklontong = db.game.caklontong = []
let tebaknegara = db.game.tebaknegara = []
let tebakgambar = db.game.tebakgambar = []
let tebakbendera = db.game.tebakbendera = []

const CDN = [
    'cdn.pd1.workers.dev',
    'cdn.pd6.workers.dev',
    'cdn.pd7.workers.dev',
    'cdn.pd8.workers.dev',
    'cdn.pd10.workers.dev'
];

moment.locale('id');
const hijri = momentHijri().format('iD iMMMM iYYYY');
const tgl = moment.tz('Asia/Jakarta').format('DD MMMM YYYY');
const hari = moment.tz('Asia/Jakarta').format('dddd');
const time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
const date = moment.tz('Asia/Jakarta').format('DD/MM/YYYY');
const jam = moment.tz('Asia/Jakarta').format('dddd DD-MM-YYYY HH:mm:ss');
const ucapanWaktu = time < '05:00:00' ? 'Selamat Pagi 🌉' : time < '11:00:00' ? 'Selamat Pagi 🌄' : time < '15:00:00' ? 'Selamat Siang 🏙' : time < '18:00:00' ? 'Selamat Sore 🌅' : time < '19:00:00' ? 'Selamat Sore 🌃' : time < '23:59:00' ? 'Selamat Malam 🌌' : 'Selamat Malam 🌌';

const readmore = String.fromCharCode(8206).repeat(4001);

const uptime = os.uptime();

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${days} hari, ${hours} jam, ${minutes} menit, ${remainingSeconds} detik`;
}
module.exports.handleIncomingMessage = async (rinn, m, store) => {
    try {
        await LoadDataBase(rinn, m);

        const body = m.body
        const budy = m.text
        const validPrefixes = prefa
        const prefix = validPrefixes.find(p => body && body.startsWith(p)) || ''
        const isCmd = prefix !== '' && body.length > prefix.length
        const from = m.key.remoteJid
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1);
        const botNumber = await rinn.decodeJid(rinn.user.id)
        const {
            type,
            fromMe
        } = m
        const sender = m.key.remoteJid;
        const itsMe = (m && m.sender && m.sender == botNumber) || false;
        const text = q = args.join(" ");
        var msg_text = (typeof m.text === 'string') ? m.text : '';

        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
	const qmsg = (quoted.msg || quoted)
        const isMedia = /image|video|sticker|audio/.test(mime);
        const isImage = (type === 'imageMessage')
        const isVideo = (type === 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isAudio = (type == 'audioMessage')

        const isGroup = m.key.remoteJid.endsWith('@g.us');
        const groupMetadata = m.isGroup ? await rinn.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        const groupMembers = m.isGroup ? groupMetadata.participants : ''
    	const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    	const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const isAfkOn = checkAfkUser(m.sender, afk)

        const clientId = rinn.user.id.split(':')[0];
        const senderbot = m.key.fromMe ? rinn.user.id.split(':')[0] + "@s.whatsapp.net" || rinn.user.id : m.key.participant || m.key.remoteJid;
        const senderId = senderbot.split('@')[0];
        const isBot = clientId.includes(senderId);

        const senderNumber = m.sender ? m.sender.replace(/[^0-9]/g, '') : '';
        const isCreator = (() => {
            if (!global.owner) return false;
            const ownerNumber = global.owner.replace(/[^0-9]/g, '');
            return senderNumber === ownerNumber;
        })();
        const isVip = db.users[m.sender] ? db.users[m.sender].vip : false
	const isLimit = db.users[m.sender] ? (db.users[m.sender].limit > 0) : false
	const isPremium = isCreator || prem.checkPremiumUser(m.sender, premium) || false
        const isNsfw = m.isGroup ? db.groups[m.chat].nsfw : false
        prem.expiredCheck(rinn, m, premium);

        const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
        const pushname = m.pushName || 'No Name';
        const almost = 0.72

        if (m.message && m.key.remoteJid !== 'status@broadcast') {
    console.log(`
┌───────── [ CHAT NOTIFICATION ] ────────┐
│ 🕒 Time      : ${chalk.green(new Date().toISOString().slice(0, 19).replace('T', ' '))}
│ 📝 Message   : ${chalk.blue(budy || '')}
│ ⚙️  Type      : ${chalk.blue(m.mtype)}
│ 👤 Sender    : ${chalk.magenta(pushname)} (${chalk.cyan(m.sender)})
│ 🏠 JID       : ${chalk.yellow(groupName || 'Private Chat')} (${chalk.cyan(m.chat || '')})
└────────────────────────────────────────┘`);
     }

        async function Nreply(teks) {
            if (typereply === 'v1') {
                m.reply(teks);
            } else if (typereply === 'v2') {
               rinn.sendMessage(m.chat, {
			text: teks,
			contextInfo: {
				externalAdReply: {
					title: ucapanWaktu,
					body: pushname,
					previewType: "PHOTO",
					thumbnail: fs.readFileSync(Func.pickRandom(thumb)),
					sourceUrl: null
				}
			}
		}, { quoted: m });
            }
        }

        cron.schedule('00 00 * * *', () => {
			let user = Object.keys(db.users)
			for (let jid of user) {
				const limitUser = db.users[jid].vip ? limit.vip : prem.checkPremiumUser(jid, premium) ? limit.premium : limit.free
				db.users[jid].limit = limitUser
				console.log('Reseted Limit')
			}
		}, {
			scheduled: true,
			timezone: 'Asia/Jakarta'
		})

        if (!rinn.public) {
			if (!isCreator && !m.key.fromMe) return
		}

        if (db.set[botNumber].online) {
            if (command) {
                rinn.sendPresenceUpdate('unavailable', m.chat);
            }
        }

        if (db.set[botNumber].autoread) {
            rinn.readMessages([m.key]);
        }

        if (db.set[botNumber].autobio) {
             let setbio = db.set[botNumber]
	     await rinn.updateProfileStatus(`Runtime:\n${runtime(process.uptime())}`).catch(_ => _);
        }

        if (db.set[botNumber].autotyping && rinn.public && isCmd) {
            if (command) {
                let pos = ['composing'];
                rinn.sendPresenceUpdate(pos, m.chat);
            }
        }

         // Group Settings
		if (isGroup) {
			// Mute
			if (db.groups[m.chat].mute && !isCreator) {
				return
			}

			// Anti Link Group
if (db.groups[m.chat].antilink && !isCreator && !isAdmins && isBotAdmins) {
    if (budy.match('chat.whatsapp.com/')) {
        const linkPattern = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
        const [_, code] = budy.match(linkPattern) || [];
        
        let isOwnGroupLink = false;
        if (code) {
            const currentGroupCode = await rinn.groupInviteCode(m.chat);
            isOwnGroupLink = code === currentGroupCode;
        }
        
        if (!isOwnGroupLink) {
            await rinn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }});
            await rinn.sendMessage(m.chat, { 
                text: `Terdeteksi @${m.sender.split('@')[0]} mengirim link grup lain\nPesan telah dihapus.`, 
                mentions: [m.sender] 
            });
        }
    }
}

if (isGroup && db.groups[m.chat].antitoxic) {
    const badwordsPath = path.join("./storage/data/grup/badwords.json");
    const badwords = JSON.parse(fs.readFileSync(badwordsPath, "utf8"));
    if (
      typeof m.msg === "string" &&
      badwords.some((word) => m.msg.toLowerCase().includes(word))
    ) {
      await Nreply(mess.badwords);
      await rinn.sendMessage(m.chat, { delete: m.key });
    }
  }

if (isGroup &&
    db.groups[m.chat].nsfw &&
    /image|webp/.test(mime)
  ) {
    if (!isBotAdmins) return;

    let target = m.quoted ? m.quoted : m;
    const media = await target.download();
    const url = await Uploader.Uguu(media);

    try {
      const response = await fetch(
        `https://www.laurine.site/api/tools/detectporn?url=${url}`,
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data?.data?.labelName?.toLowerCase() === "porn") {
        Nreply(mess.nsfw);
        rinn.sendMessage(m.chat, { delete: m.key });
      }
    } catch (error) {
      console.log("Error fetching Laurine API:", error);
    }
  }

// Anti Delete
if (isGroup && db.groups[m.chat].antidelete) {
    if (m.type == 'protocolMessage' && m.message.protocolMessage.type === 3) {
        const key = m.message.protocolMessage.key;
        
        if (store && store.messages[m.chat] && store.messages[m.chat].array) {
            const deletedMsg = store.messages[m.chat].array.find(msg => msg.key.id === key.id);
            
            if (deletedMsg) {
                const participant = key.participant || key.remoteJid;
                if ((isGroupAdmins && participant === m.sender) || (isCreator && participant === m.sender)) {
                    return;
                }
                
                await rinn.sendMessage(m.chat, {
                    text: `🚫 ANTI DELETE\n\n@${participant.split('@')[0]} telah menghapus pesan`,
                    mentions: [participant]
                });
                
                try {
                    const msgType = getContentType(deletedMsg.message);
                    
                    await rinn.relayMessage(m.chat, {
                        [msgType]: deletedMsg.message[msgType]
                    }, {
                        quoted: m
                    });
                } catch (error) {
                    console.error("Error resending deleted message:", error);
                    await rinn.sendMessage(m.chat, {
                        text: `Gagal mengirim ulang pesan yang dihapus: ${error.message}`
                    }, {
                        quoted: m
                    });
                }
            }
        }
    }
}
			// Anti Virtex Group
			if (db.groups[m.chat].antivirtex && !isCreator && m.isBotAdmin && !m.isAdmin) {
				if (budy.length > 6000) {
					await rinn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
					await rinn.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split('@')[0]} Mengirim Virtex..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Virtex❗*'}, ...m.key }}}, {})
					await rinn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
				}
				if (m.msg.nativeFlowMessage && m.msg.nativeFlowMessage.messageParamsJson && m.msg.nativeFlowMessage.messageParamsJson.length > 3500) {
					await rinn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.id, participant: m.sender }})
					await rinn.relayMessage(m.chat, { extendedTextMessage: { text: `Terdeteksi @${m.sender.split('@')[0]} Mengirim Bug..`, contextInfo: { mentionedJid: [m.key.participant], isForwarded: true, forwardingScore: 1, quotedMessage: { conversation: '*Anti Bug❗*'}, ...m.key }}}, {})
					await rinn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
				}
			}
			
		}

        // Filter Bot
		if (m.isBot) return
		
		// Salam
		if (/^a(s|ss)alamu('|)alaikum(| )(wr|)( |)(wb|)$/.test(budy?.toLowerCase())) {
			const jwb_salam = ['Wa\'alaikumusalam','Wa\'alaikumusalam wr wb','Wa\'alaikumusalam Warohmatulahi Wabarokatuh']
			m.reply(Func.pickRandom(jwb_salam))
                }

        async function reactionMessage(emo) {
            rinn.sendMessage(m.chat, {
                react: {
                    text: emo,
                    key: m.key
                }
            });
        }
        
        // Afk
        if (m.isGroup && !m.key.fromMe) {
            let mentionUser = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
            for (let ment of mentionUser) {
                if (checkAfkUser(ment, afk)) {
                    let getId2 = getAfkId(ment, afk)
                    let getReason2 = getAfkReason(getId2, afk)
                    let getTimee = Date.now() - getAfkTime(getId2, afk)
                    let anu2 = ms(getTimee)
                    rinn.sendMessage(m.chat, { text:
                        `Jangan ganggu dia\n\n` +
                        `*Alasan:* ${getReason2}\n` +
                        `*Sejak:* ${anu2.hours} Jam, ${anu2.minutes} Menit, ${anu2.seconds} Detik`,
                        contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: namaSaluran,
                            newsletterJid: idSaluran,
                        },
                        externalAdReply: {
                            showAdAttribution: true,
                            title: "Sedang A F K",
                            body: "Undangan Grup",
                            thumbnailUrl: "https://files.catbox.moe/6nns2o.jpg",
                            sourceUrl: null,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                });
                }
            }

            if (checkAfkUser(m.sender, afk)) {
                let getId = getAfkId(m.sender, afk)
                let getReason = getAfkReason(getId, afk)
                let getTime = Date.now() - getAfkTime(getId, afk)
                let anu = ms(getTime)
                afk.splice(getAfkPosition(m.sender, afk), 1)
                fs.writeFileSync('./storage/afk.json', JSON.stringify(afk))
                rinn.sendMessage(
                    m.chat,
                    { text: `Selamat datang kembali @${m.sender.split('@')[0]}\n\nKamu telah afk selama: ${anu.hours} Jam, ${anu.minutes} Menit, ${anu.seconds} Detik`,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: namaSaluran,
                            newsletterJid: idSaluran,
                        },
                            externalAdReply: {
                            showAdAttribution: true,
                            title: "Selamat datang kembali",
                            body: "Undangan Grup",
                            thumbnailUrl: "https://files.catbox.moe/6nns2o.jpg",
                            sourceUrl: null,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
               }
                }, {
                    quoted: m
                });
            }
        }

        // Handle private chat tanpa prefix
        if (!isGroup && !prefix) {
    //console.log('Private chat terdeteksi...');
    try {
        await handleAIPrivate(rinn, m, budy);
    } catch (error) {
        console.error('Error handling AI Private message:', error);
    }
}
        // Cek apakah pesan me-reply bot
        const isReplyToBot = m.message?.extendedTextMessage?.contextInfo?.participant === global.nomorbot;
        // Cek apakah ada mention ke bot
        const hasMention = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(global.nomorbot);
if (isGroup && (isReplyToBot || hasMention) && budy) {
    console.log('Reply to bot terdeteksi in group:', budy);
    try {
        await handleAIPrivate(rinn, m, budy);
    } catch (error) {
        console.error('Error handling AI group reply:', error);
    }
}

	// TicTacToe
		let room = Object.values(tictactoe).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
		if (room) {
			let ok
			let isWin = !1
			let isTie = !1
			let isSurrender = !1
			if (!/^([1-9]|(me)?nyerah|surr?ender|off|skip)$/i.test(m.text)) return
			isSurrender = !/^[1-9]$/.test(m.text)
			if (m.sender !== room.game.currentTurn) {
				if (!isSurrender) return !0
			}
			if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
				Nreply({
					'-3': 'Game telah berakhir',
					'-2': 'Invalid',
					'-1': 'Posisi Invalid',
					0: 'Posisi Invalid',
				}[ok])
				return !0
			}
			if (m.sender === room.game.winner) isWin = true
			else if (room.game.board === 511) isTie = true
			let arr = room.game.render().map(v => {
				return {
					X: '❌',
					O: '⭕',
					1: '1️⃣',
					2: '2️⃣',
					3: '3️⃣',
					4: '4️⃣',
					5: '5️⃣',
					6: '6️⃣',
					7: '7️⃣',
					8: '8️⃣',
					9: '9️⃣',
				}[v]
			})
			if (isSurrender) {
				room.game._currentTurn = m.sender === room.game.playerX
				isWin = true
			}
			let winner = isSurrender ? room.game.currentTurn : room.game.winner
			if (isWin) {
				db.users[m.sender].limit += 3
				db.users[m.sender].uang += 3000
			}
			let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\n${isWin ? `@${winner.split('@')[0]} Menang!` : isTie ? `Game berakhir` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}\n❌: @${room.game.playerX.split('@')[0]}\n⭕: @${room.game.playerO.split('@')[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
			if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
			room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
			if (room.x !== room.o) await rinn.sendMessage(room.x, { text: str, mentions: parseMention(str) }, { quoted: m })
			await rinn.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
			if (isTie || isWin) {
				delete tictactoe[room.id]
			}
		}
		
		// Suit PvP
		let roof = Object.values(suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(m.sender))
		if (roof) {
			let win = ''
			let tie = false
			if (m.sender == roof.p2 && /^(acc(ept)?|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(m.text) && m.isGroup && roof.status == 'wait') {
				if (/^(tolak|gamau|nanti|n|ga(k.)?bisa)/i.test(m.text)) {
					Nreply(`@${roof.p2.split`@`[0]} menolak suit,\nsuit dibatalkan`)
					delete suit[roof.id]
					return !0
				}
				roof.status = 'play';
				roof.asal = m.chat;
				clearTimeout(roof.waktu);
				Nreply(`Suit telah dikirimkan ke chat\n\n@${roof.p.split`@`[0]} dan @${roof.p2.split`@`[0]}\n\nSilahkan pilih suit di chat masing-masing klik https://wa.me/${botNumber.split`@`[0]}`)
				if (!roof.pilih) rinn.sendMessage(roof.p, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m })
				if (!roof.pilih2) rinn.sendMessage(roof.p2, { text: `Silahkan pilih \n\nBatu🗿\nKertas📄\nGunting✂️` }, { quoted: m })
				roof.waktu_milih = setTimeout(() => {
					if (!roof.pilih && !roof.pilih2) Nreply(`Kedua pemain tidak niat main,\nSuit dibatalkan`)
					else if (!roof.pilih || !roof.pilih2) {
						win = !roof.pilih ? roof.p2 : roof.p
						Nreply(`@${(roof.pilih ? roof.p2 : roof.p).split`@`[0]} tidak memilih suit, game berakhir`)
					}
					delete suit[roof.id]
					return !0
				}, roof.timeout)
			}
			let jwb = m.sender == roof.p
			let jwb2 = m.sender == roof.p2
			let g = /gunting/i
			let b = /batu/i
			let k = /kertas/i
			let reg = /^(gunting|batu|kertas)/i;
			
			if (jwb && reg.test(m.text) && !roof.pilih && !m.isGroup) {
				roof.pilih = reg.exec(m.text.toLowerCase())[0];
				roof.text = m.text;
				Nreply(`Kamu telah memilih ${m.text} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`);
				if (!roof.pilih2) rinn.sendMessage(roof.p2, { text: '_Lawan sudah memilih_\nSekarang giliran kamu' })
			}
			if (jwb2 && reg.test(m.text) && !roof.pilih2 && !m.isGroup) {
				roof.pilih2 = reg.exec(m.text.toLowerCase())[0]
				roof.text2 = m.text
				Nreply(`Kamu telah memilih ${m.text} ${!roof.pilih ? `\n\nMenunggu lawan memilih` : ''}`)
				if (!roof.pilih) rinn.sendMessage(roof.p, { text: '_Lawan sudah memilih_\nSekarang giliran kamu' })
			}
			let stage = roof.pilih
			let stage2 = roof.pilih2
			if (roof.pilih && roof.pilih2) {
				clearTimeout(roof.waktu_milih)
				if (b.test(stage) && g.test(stage2)) win = roof.p
				else if (b.test(stage) && k.test(stage2)) win = roof.p2
				else if (g.test(stage) && k.test(stage2)) win = roof.p
				else if (g.test(stage) && b.test(stage2)) win = roof.p2
				else if (k.test(stage) && b.test(stage2)) win = roof.p
				else if (k.test(stage) && g.test(stage2)) win = roof.p2
				else if (stage == stage2) tie = true
				db.users[roof.p == win ? roof.p : roof.p2].limit += tie ? 0 : 3
				db.users[roof.p == win ? roof.p : roof.p2].uang += tie ? 0 : 3000
				rinn.sendMessage(roof.asal, { text: `_*Hasil Suit*_${tie ? '\nSERI' : ''}\n\n@${roof.p.split`@`[0]} (${roof.text}) ${tie ? '' : roof.p == win ? ` Menang \n` : ` Kalah \n`}\n@${roof.p2.split`@`[0]} (${roof.text2}) ${tie ? '' : roof.p2 == win ? ` Menang \n` : ` Kalah \n`}\n\nPemenang Mendapatkan\n*Hadiah :* Uang(3000) & Limit(3)`.trim(), mentions: [roof.p, roof.p2] }, { quoted: m })
				delete suit[roof.id]
			}
		}
		
		// Tebak Bomb
		let pilih = '🌀', bomb = '💣';
		if (m.sender in tebakbom) {
			if (!/^[1-9]|10$/i.test(body) && !isCmd && !isCreator) return !0;
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 1) return !0;
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 2) {
				tebakbom[m.sender].board[parseInt(body) - 1] = bomb;
				tebakbom[m.sender].pick++;
				rinn.sendMessage(m.chat, { react: {text: '❌', key: m.key }})
				tebakbom[m.sender].bomb--;
				tebakbom[m.sender].nyawa.pop();
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].nyawa.length < 1) {
					await Nreply(`*GAME TELAH BERAKHIR*\nKamu terkena bomb\n\n ${brd.join('')}\n\n*Terpilih :* ${tebakbom[m.sender].pick}\n_Pengurangan Limit : 1_`);
					rinn.sendMessage(m.chat, { react: { text: '😂', key: m.key }})
					delete tebakbom[m.sender];
				} else await Nreply(`*PILIH ANGKA*\n\nKamu terkena bomb\n ${brd.join('')}\n\nTerpilih: ${tebakbom[m.sender].pick}\nSisa nyawa: ${tebakbom[m.sender].nyawa}`);
				return !0;
			}
			if (tebakbom[m.sender].petak[parseInt(body) - 1] === 0) {
				tebakbom[m.sender].petak[parseInt(body) - 1] = 1;
				tebakbom[m.sender].board[parseInt(body) - 1] = pilih;
				tebakbom[m.sender].pick++;
				tebakbom[m.sender].lolos--;
				let brd = tebakbom[m.sender].board;
				if (tebakbom[m.sender].lolos < 1) {
					db.users[m.sender].uang += 6000
					await Nreply(`*KAMU HEBAT ಠ⁠ᴥ⁠ಠ*\n\n${brd.join('')}\n\n*Terpilih :* ${tebakbom[m.sender].pick}\n*Sisa nyawa :* ${tebakbom[m.sender].nyawa}\n*Bomb :* ${tebakbom[m.sender].bomb}\nBonus Uang 💰 *+6000*`);
					delete tebakbom[m.sender];
				} else Nreply(`*PILIH ANGKA*\n\n${brd.join('')}\n\nTerpilih : ${tebakbom[m.sender].pick}\nSisa nyawa : ${tebakbom[m.sender].nyawa}\nBomb : ${tebakbom[m.sender].bomb}`)
			}
		}
		
		// Akinator
		if (m.sender in akinator) {
			if (m.quoted && akinator[m.sender].key == m.quoted.id) {
				if (budy == '5') {
					akinator[m.sender].isWin = false
					await akinator[m.sender].cancelAnswer()
					let { key } = await Nreply(`🎮 Akinator Game Back :\n\n@${m.sender.split('@')[0]} (${akinator[m.sender].progress.toFixed(2)}) %\n${akinator[m.sender].question}\n\n- 0 - Ya\n- 1 - Tidak\n- 2 - Tidak Tau\n- 3 - Mungkin\n- 4 - Mungkin Tidak\n- 5 - Back`)
					akinator[m.sender].key = key.id
				} else if (akinator[m.sender].isWin && ['benar', 'ya'].includes(budy.toLowerCase())) {
					rinn.sendMessage(m.chat, { react: { text: '🎊', key: m.key }})
					delete akinator[m.sender]
				} else {
					if (!isNaN(budy)) {
						if (akinator[m.sender].isWin) {
							let { key } = await rinn.sendMessage(m.chat, { image: { url: akinator[m.sender].sugestion_photo }, caption: `🎮 Akinator Answer :\n\n@${m.sender.split('@')[0]}\nDia adalah *${akinator[m.sender].sugestion_name}*\n_${akinator[m.sender].sugestion_desc}_\n\n- 5 - Back\n- *Ya* (untuk keluar dari sesi)`, contextInfo: { mentionedJid: [m.sender] }}, { quoted: m })
							akinator[m.sender].key = key.id
						} else {
							await akinator[m.sender].answer(budy)
							if (akinator[m.sender].isWin) {
								let { key } = await rinn.sendMessage(m.chat, { image: { url: akinator[m.sender].sugestion_photo }, caption: `🎮 Akinator Answer :\n\n@${m.sender.split('@')[0]}\nDia adalah *${akinator[m.sender].sugestion_name}*\n_${akinator[m.sender].sugestion_desc}_\n\n- 5 - Back\n- *Ya* (untuk keluar dari sesi)`, contextInfo: { mentionedJid: [m.sender] }}, { quoted: m })
								akinator[m.sender].key = key.id
							} else {
								let { key } = await Nreply(`🎮 Akinator Game :\n\n@${m.sender.split('@')[0]} (${akinator[m.sender].progress.toFixed(2)}) %\n${akinator[m.sender].question}\n\n- 0 - Ya\n- 1 - Tidak\n- 2 - Tidak Tau\n- 3 - Mungkin\n- 4 - Mungkin Tidak\n- 5 - Back`)
								akinator[m.sender].key = key.id
							}
						}
					}
				}
			}
		}
		
		// Game
		const games = { tebaklirik, tekateki, tebaklagu, tebakkata, kuismath, susunkata, tebakkimia, caklontong, tebaknegara, tebakgambar, tebakbendera }
		for (let gameName in games) {
			let game = games[gameName];
			let id = iGame(game, m.chat);
                        if (!game[m.chat + id] || !game[m.chat + id].jawaban) continue;
			if (m.quoted && id == m.quoted.id) {
				if (gameName == 'kuismath') {
					jawaban = game[m.chat + id].jawaban
					const difficultyMap = { 'noob': 1, 'easy': 1.5, 'medium': 2.5, 'hard': 4, 'extreme': 5, 'impossible': 6, 'impossible2': 7 };
					let randMoney = difficultyMap[kuismath[m.chat + id].mode]
					if (!isNaN(budy)) {
						if (budy.toLowerCase() == jawaban) {
							db.users[m.sender].uang += randMoney * 1000
							await Nreply(`Jawaban Benar 🎉\nBonus Uang 💰 *+${randMoney * 1000}*`)
							delete kuismath[m.chat + id]
						} else Nreply('*Jawaban Salah!*')
					}
				} else {
					jawaban = game[m.chat + id].jawaban || ""
					let jawabBenar = /tekateki|tebaklirik|tebaklagu|tebakkata|tebaknegara|tebakbendera/.test(gameName) ? (similarity(budy.toLowerCase(), jawaban) >= almost) : (budy.toLowerCase() == jawaban)
					let bonus = gameName == 'caklontong' ? 9999 : gameName == 'tebaklirik' ? 4299 : gameName == 'susunkata' ? 2989 : 3499
					if (jawabBenar) {
						db.users[m.sender].uang += bonus * 1
						await Nreply(`Jawaban Benar 🎉\nBonus Uang 💰 *+${bonus}*`)
						delete game[m.chat + id]
					} else Nreply('*Jawaban Salah!*')
				}
			}
		}
		
		// Family 100
		if (m.chat in family100) {
			if (m.quoted && m.quoted.id == family100[m.chat].id && !isCmd) {
				let room = family100[m.chat]
				let teks = budy.toLowerCase().replace(/[^\w\s\-]+/, '')
				let isSurender = /^((me)?nyerah|surr?ender)$/i.test(teks)
				if (!isSurender) {
					let index = room.jawaban.findIndex(v => v.toLowerCase().replace(/[^\w\s\-]+/, '') === teks)
					if (room.terjawab[index]) return !0
					room.terjawab[index] = m.sender
				}
				let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
				let caption = `Jawablah Pertanyaan Berikut :\n${room.soal}\n\n\nTerdapat ${room.jawaban.length} Jawaban ${room.jawaban.find(v => v.includes(' ')) ? `(beberapa Jawaban Terdapat Spasi)` : ''}\n${isWin ? `Semua Jawaban Terjawab` : isSurender ? 'Menyerah!' : ''}\n${Array.from(room.jawaban, (jawaban, index) => { return isSurender || room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false }).filter(v => v).join('\n')}\n${isSurender ? '' : `Perfect Player`}`.trim()
				Nreply(caption)
				if (isWin || isSurender) delete family100[m.chat]
			}
		}


        // Plugin
        const pluginContext = {
            rinn, m,
            command,
            prefix, args,
            quoted, mime,
            text: q,
            participants,
            isGroup, groupAdmins, isBotAdmins, isAdmins,
            isCreator,
            isPremium, isVip,
            pushname,
            Nreply,
            reactionMessage,
            setState, getState,
            Func,
            Uploader,
            scraper
        };
        const context = pluginContext;
        const handled = await pluginController.execBefore(m, context);
        if (handled) return

        let pluginHandled = false;
        if (isCmd) {
            pluginHandled = await pluginController.handleCommand(m, pluginContext, command);
        }
        if (!pluginHandled && isCmd) {
            switch (command) {

            // AI Menu
            case 'blackbox':
                case 'bb': {
                    if (!args.length) {
                        rinn.sendMessage(m.chat, {
                            text: 'Halo, Mau Bertanya Apa?'
                        }, {
                            quoted: m
                        });
                        return;
                    }
                    const query = args.join(' ');
                    let anu = `https://api.siputzx.my.id/api/ai/blackboxai?content=${encodeURIComponent(query)}`;
                    let res = await fetch(anu)
                    let response = await res.json();
                    let teks = `${response.data}`
                    try {
                        rinn.sendMessage(m.chat, {
                            text: teks
                        }, {
                            quoted: m
                        });
                    } catch (error) {
                        console.log('Error pada aiBlackbox:', error);
                        await Nreply(`Maaf, terjadi kesalahan: ${error.message}`);
                    }
                }
                break;
                
                // Downloader Menu
                case 'amdl': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args[0]) {
                        await rinn.sendMessage(m.chat, {
                            text: `Masukan link Apple Music!\ncontoh:\n\n${prefix + command} https://music.apple.com/...`
                        }, {
                            quoted: m
                        });
                        return;
                    }
                    const url = args[0];
                    await handleAppleMusicDownload(rinn, m, url);
                    setLimit(m, db)
                }
                break;
                case 'pinterestdl':
                case 'pindl': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args.length) {
                        await Nreply(`Masukan URL Pinterest!\ncontoh:\n\n${prefix + command} https://id.pinterest.com/pin/862439397377053654`);
                        return;
                    }

                    try {
                        await reactionMessage('🕐');

                        const pinterestUrl = args[0];

                        const result = await restapi.downloadPinterest(pinterestUrl);

                        if (!result || !result.status || !result.data) {
                            await Nreply('Gagal mengunduh konten. Silakan periksa URL atau coba lagi.');
                            return;
                        }

                        const mediaType = result.data.url.toLowerCase().includes('.mp4') ? 'video' : 'image';

                        const caption = `*Pinterest Download*\n*Dibuat pada:* ${result.data.created_at}\n*Tipe:* ${mediaType.toUpperCase()}`;

                        if (mediaType === 'video') {
                            await rinn.sendMessage(m.chat, {
                                video: {
                                    url: result.data.url
                                },
                                caption: caption
                            }, {
                                quoted: m
                            });
                        } else {
                            await rinn.sendMessage(m.chat, {
                                image: {
                                    url: result.data.url
                                },
                                caption: caption
                            }, {
                                quoted: m
                            });
                        }
                        setLimit(m, db)

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

                        await Nreply(errorMsg);
                    }
                }
                break;
                case 'pixeldrain': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args[0]) return Nreply(`Masukkan link pixeldrain!\nContoh: ${prefix}pixeldrain https://pixeldrain.com/u/abc123`);

                    try {
                        await reactionMessage('🕐');
                        const url = args[0];
                        const regex = /\/u\/([a-zA-Z0-9]+)/;
                        const match = url.match(regex);

                        if (!match) {
                            return Nreply('Link pixeldrain tidak valid! Pastikan formatnya benar.');
                        }

                        const fileId = match[1];
                        await Nreply('Sedang memproses...');

                        const {
                            data: fileInfo
                        } = await axios.get(`https://pixeldrain.com/api/file/${fileId}/info`);

                        const rhost = CDN[Math.floor(Math.random() * CDN.length)];

                        const cdnLink = `https://${rhost}/api/file/${fileId}`;
                        const directLink = `https://pixeldrain.com/api/file/${fileId}`;

                        const fileSize = Func.formatSize(fileInfo.size);

                        const caption = `*PIXELDRAIN DOWNLOADER*\n\n` +
                            `*Nama File:* ${fileInfo.name}\n` +
                            `*Ukuran:* ${fileSize}\n` +
                            `*Views:* ${fileInfo.views}\n` +
                            `*Upload Date:* ${formatDate(fileInfo.date_upload)}\n\n` +
                            `*Download Links:*\n` +
                            `1. CDN: ${cdnLink}\n` +
                            `2. Direct: ${directLink}`;

                        await rinn.sendMessage(m.chat, {
                            text: caption,
                            contextInfo: {
                                externalAdReply: {
                                    title: fileInfo.name,
                                    body: `${fileSize} • ${formatDate(fileInfo.date_upload)}`,
                                    thumbnailUrl: Func.pickRandom(ftreply),
                                    mediaType: 1
                                }
                            }
                        }, {
                            quoted: m
                        });
                        setLimit(m, db)

                    } catch (error) {
                        console.error('Pixeldrain error:', error);
                        await Nreply(`Gagal mengunduh file: ${error.message}`);
                    }
                }
                break;
                case 'play2': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!text) return Nreply('Cari apa?')
                    await reactionMessage('🔎');

                    let ytsSearch = await yts(text)
                    const anuan = ytsSearch.all
                    if (!anuan.length) return Nreply("Tidak ditemukan hasil untuk pencarian tersebut!")

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
                            "id": `.ytmp3 ${res.url}`
                        })
                        sections[sectionIndex].rows.push({
                            "title": "📺 Play Video",
                            "description": `📢 ${channel} • ⏳ ${duration}`,
                            "id": `.ytmp4 ${res.url}`
                        })
                    }

                    let msgii = generateWAMessageFromContent(m.chat, {
                        viewOnceMessage: {
                            message: {
                                "messageContextInfo": {
                                    "deviceListMetadata": {},
                                    "deviceListMetadataVersion": 2
                                },
                                interactiveMessage: proto.Message.InteractiveMessage.create({
                                    contextInfo: {
                                        mentionedJid: [m.sender],
                                        externalAdReply: {
                                            showAdAttribution: true
                                        }
                                    },
                                    body: proto.Message.InteractiveMessage.Body.create({
                                        text: teksnya
                                    }),
                                    footer: proto.Message.InteractiveMessage.Footer.create({
                                        text: global.foother
                                    }),
                                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                        buttons: [{
                                            "name": "single_select",
                                            "buttonParamsJson": `{ "title": "Pilih Opsi", "sections": ${JSON.stringify(sections)} }`
                                        }]
                                    })
                                })
                            }
                        }
                    }, {
                        userJid: m.sender,
                        quoted: null
                    })

                    await rinn.relayMessage(msgii.key.remoteJid, msgii.message, {
                        messageId: mii.key.id
                    })
                    setLimit(m, db)
                }
                break;
                case 'tt':
                case 'tiktok': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!text) return Nreply(`Masukkan link\n*${prefix + command} https://vt.tiktok.com/ZS8KdFQcQ/*`);
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
                                        quoted: m
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
                                            quoted: m
                                        }
                                    );
                                } else {
                                    await rinn.sendMessage(
                                        m.sender, {
                                            image: {
                                                url: imgs.url
                                            }
                                        }, {
                                            quoted: m
                                        }
                                    );
                                }
                                item += 1;
                                await Func.sleep(2000);
                            }
                        }
                        setLimit(m, db)
                    } catch (error) {
                        console.log(error);
                        await Nreply('⚠️ Gagal mengambil data dari TikTok. Pastikan URL valid atau coba lagi nanti.');
                    }
                }
                break;
                case 'tiktokmp3':
                case 'ttmp3': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!text) return Nreply(`Masukkan link\n*${prefix + command} https://vt.tiktok.com/ZS8KdFQcQ/*`);
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
                                quoted: m
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
                                quoted: m
                            }
                        );
                        setLimit(m, db)
                    } catch (error) {
                        console.error(error);
                        await Nreply(`❌ Terjadi kesalahan saat mengambil audio. Coba lagi nanti, ya Kak!`);
                    }
                }
                break;
                case 'twitter':
                case 'twdl': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!text) {
                        return Nreply(`📌 *Gunakan format:* ${prefix + command} <Twitter URL>`);
                    }
                    await reactionMessage('🕐');
                    try {
                        let result = await fetchTwitterMedia(text);
                        if (!result || result.download.length === 0) {
                            return Nreply("🗿 Error. Pastikan link benar atau coba lagi nanti.");
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
                                    quoted: m
                                });
                            } else {
                                await rinn.sendFile(m.chat, media.url, "twitter.jpg", caption, m);
                            }
                        }
                        setLimit(m, db)
                    } catch (error) {
                        console.error("Error sending media:", error.message);
                        Nreply("😹 Error saat mengunduh media.")
                    }
                }
                break;
                case "ytmp3zx": {
                if (!isLimit) return Nreply(mess.limit)
                    Nreply(mess.wait);
                    let anu = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`;
                    const res = await fetch(anu);
                    const response = await res.json();
                    try {
                        rinn.sendMessage(m.chat, {
                            audio: {
                                url: response.data.dl
                            },
                            mimeType: "audio/mpeg",
                            ptt: false
                        }, {
                            quoted: m
                        })
                    } catch (error) {
                        console.log(error)
                        Nreply("Error", error)
                    }
                    setLimit(m, db)
                }
                break;
                case "ytmp4zx": {
                if (!isLimit) return Nreply(mess.limit)
                    Nreply(mess.wait);
                    let anu = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`;
                    const res = await fetch(anu);
                    const response = await res.json();
                    try {
                        rinn.sendMessage(m.chat, {
                            video: {
                                url: response.data.dl
                            },
                            mimeType: 'video/mp4',
                            caption: '`No inpo`'
                        }, {
                            quoted: m
                        })
                    } catch (error) {
                        console.log(error);
                        Nreply("Error", error)
                    }
                    setLimit(m, db)
                }
                break;
                
                // Fun Menu
                case 'slot': {
			    const Nzreply = await Nreply
				await gameSlot(rinn, Nzreply, m, db)
			}
			break;
			case 'casino': {
			    const Nzreply = await Nreply
				await gameCasinoSolo(rinn, Nzreply, m, prefix, db)
			}
			break;
			case 'rampok': case 'merampok': {
			    const Nzreply = await Nreply
				await gameMerampok(m, Nzreply, db)
			}
			break;
			case 'begal': {
			    const Nzreply = await Nreply
				await gameBegal(rinn, Nzreply, m, db)
			}
			break;
			case 'suitpvp': case 'suit': {
				let poin = 10
				let poin_lose = 10
				let timeout = 60000
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.sender))) Nreply(`Selesaikan suit mu yang sebelumnya`)
				if (m.mentionedJid[0] === m.sender) return Nreply(`Tidak bisa bermain dengan diri sendiri !`)
				if (!m.mentionedJid[0]) return Nreply(`_Siapa yang ingin kamu tantang?_\nTag orangnya..\n\nContoh : ${prefix}suit @${owner[0]}`, m.chat, { mentions: [owner[1] + '@s.whatsapp.net'] })
				if (Object.values(suit).find(roof => roof.id.startsWith('suit') && [roof.p, roof.p2].includes(m.mentionedJid[0]))) return Nreply(`Orang yang kamu tantang sedang bermain suit bersama orang lain :(`)
				let id = 'suit_' + new Date() * 1
				let caption = `_*SUIT PvP*_\n\n@${m.sender.split`@`[0]} menantang @${m.mentionedJid[0].split`@`[0]} untuk bermain suit\n\nSilahkan @${m.mentionedJid[0].split`@`[0]} untuk ketik terima/tolak`
				suit[id] = {
					chat: Nreply(caption),
					id: id,
					p: m.sender,
					p2: m.mentionedJid[0],
					status: 'wait',
					waktu: setTimeout(() => {
						if (suit[id]) Nreply(`_Waktu suit habis_`)
						delete suit[id]
					}, 60000), poin, poin_lose, timeout
				}
			}
			break;
			case 'ttc': case 'ttt': case 'tictactoe': {
				let TicTacToe = require('./App/main/tictactoe');
				if (Object.values(tictactoe).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return Nreply(`Kamu masih didalam game!\nKetik *${prefix}del${command}* Jika Ingin Mengakhiri sesi`);
				let room = Object.values(tictactoe).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
				if (room) {
					Nreply('Partner ditemukan!')
					room.o = m.chat
					room.game.playerO = m.sender
					room.state = 'PLAYING'
					let arr = room.game.render().map(v => {
						return {X: '❌',O: '⭕',1: '1️⃣',2: '2️⃣',3: '3️⃣',4: '4️⃣',5: '5️⃣',6: '6️⃣',7: '7️⃣',8: '8️⃣',9: '9️⃣'}[v]
					})
					let str = `Room ID: ${room.id}\n\n${arr.slice(0, 3).join('')}\n${arr.slice(3, 6).join('')}\n${arr.slice(6).join('')}\n\nMenunggu @${room.game.currentTurn.split('@')[0]}\n\nKetik *nyerah* untuk menyerah dan mengakui kekalahan`
					if (room.x !== room.o) await rinn.sendMessage(room.x, { texr: str, mentions: parseMention(str) }, { quoted: m })
					await rinn.sendMessage(room.o, { text: str, mentions: parseMention(str) }, { quoted: m })
				} else {
					room = {
						id: 'tictactoe-' + (+new Date),
						x: m.chat,
						o: '',
						game: new TicTacToe(m.sender, 'o'),
						state: 'WAITING',
						waktu: setTimeout(() => {
							if (tictactoe[roomnya.id]) Nreply(`_Waktu ${command} habis_`)
							delete tictactoe[roomnya.id]
						}, 300000)
					}
					if (text) room.name = text
					rinn.sendMessage(m.chat, { text: 'Menunggu partner' + (text ? ` mengetik command dibawah ini ${prefix}${command} ${text}` : ''), mentions: m.mentionedJid }, { quoted: m })
					tictactoe[room.id] = room
				}
			}
			break;
			case 'akinator': {
				if (text == 'start') {
					if (akinator[m.sender]) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
					akinator[m.sender] = new Akinator({ region: 'id', childMode: false });
					await akinator[m.sender].start()
					let { key } = await Nreply(`🎮 Akinator Game :\n\n@${m.sender.split('@')[0]}\n${akinator[m.sender].question}\n\n- 0 - Ya\n- 1 - Tidak\n- 2 - Tidak Tau\n- 3 - Mungkin\n- 4 - Mungkin Tidak\n\n${prefix + command} end (Untuk Keluar dari sesi)`)
					akinator[m.sender].key = key.id
					akinator[m.sender].waktu = setTimeout(() => {
						if (akinator[m.sender]) Nreply(`_Waktu ${command} habis_`)
						delete akinator[m.sender];
					}, 3600000)
				} else if (text == 'end') {
					if (!akinator[m.sender]) return Nreply('Kamu tidak Sedang bermain Akinator!')
					delete akinator[m.sender];
					Nreply('Sukses Mengakhiri sessi Akinator')
				} else Nreply(`Example : ${prefix + command} start/end`)
			}
			break;
			case 'tebakbom': {
				if (tebakbom[m.sender]) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				tebakbom[m.sender] = {
					petak: [0, 0, 0, 2, 0, 2, 0, 2, 0, 0].sort(() => Math.random() - 0.5),
					board: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
					bomb: 3,
					lolos: 7,
					pick: 0,
					nyawa: ['❤️', '❤️', '❤️'],
					waktu: setTimeout(() => {
						if (tebakbom[m.sender]) Nreply(`_Waktu ${command} habis_`)
						delete tebakbom[m.sender];
					}, 120000)
				}
				Nreply(`*TEBAK BOM*\n\n${tebakbom[m.sender].board.join("")}\n\nPilih lah nomor tersebut! dan jangan sampai terkena Bom!\nBomb : ${tebakbom[m.sender].bomb}\nNyawa : ${tebakbom[m.sender].nyawa.join("")}`);
			}
			break;
			case 'tekateki': {
				if (iGame(tekateki, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tekateki.json'));
				let { key } = await Nreply(`🎮 Teka Teki Berikut :\n\n${hasil.soal}\n\nWaktu : 60s\nHadiah *+3499*`)
				tekateki[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(tekateki, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tekateki[m.chat + key.id].jawaban)
					delete tekateki[m.chat + key.id]
				}
			}
			break;
			case 'tebaklirik': {
				if (iGame(tebaklirik, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tebaklirik.json'));
				let { key } = await Nreply(`🎮 Tebak Lirik Berikut :\n\n${hasil.soal}\n\nWaktu : 90s\nHadiah *+4299*`)
				tebaklirik[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await Func.sleep(90000)
				if (rdGame(tebaklirik, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tebaklirik[m.chat + key.id].jawaban)
					delete tebaklirik[m.chat + key.id]
				}
			}
			break;
			case 'tebakkata': {
				if (iGame(tebakkata, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tebakkata.json'));
				let { key } = await Nreply(`🎮 Tebak Kata Berikut :\n\n${hasil.soal}\n\nWaktu : 60s\nHadiah *+3499*`)
				tebakkata[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(tebakkata, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tebakkata[m.chat + key.id].jawaban)
					delete tebakkata[m.chat + key.id]
				}
			}
			break;
			case 'family100': {
				if (family100.hasOwnProperty(m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/family100.json'));
				let { key } = await Nreply(`🎮 Tebak Kata Berikut :\n\n${hasil.soal}\n\nWaktu : 5m\nHadiah *+3499*`)
				family100[m.chat] = {
					soal: hasil.soal,
					jawaban: hasil.jawaban,
					terjawab: Array.from(hasil.jawaban, () => false),
					id: key.id
				}
				await Func.sleep(300000)
				if (family100.hasOwnProperty(m.chat)) {
					Nreply('Waktu Habis\nJawaban:\n- ' + family100[m.chat].jawaban.join('\n- '))
					delete family100[m.chat]
				}
			}
			break;
			case 'susunkata': {
				if (iGame(susunkata, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/susunkata.json'));
				let { key } = await Nreply(`🎮 Susun Kata Berikut :\n\n${hasil.soal}\nTipe : ${hasil.tipe}\n\nWaktu : 60s\nHadiah *+2989*`)
				susunkata[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(susunkata, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + susunkata[m.chat + key.id].jawaban)
					delete susunkata[m.chat + key.id]
				}
			}
			break;
			case 'tebakkimia': {
				if (iGame(tebakkimia, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tebakkimia.json'));
				let { key } = await Nreply(`🎮 Tebak Kimia Berikut :\n\n${hasil.unsur}\n\nWaktu : 60s\nHadiah *+3499*`)
				tebakkimia[m.chat + key.id] = {
					jawaban: hasil.lambang.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(tebakkimia, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tebakkimia[m.chat + key.id].jawaban)
					delete tebakkimia[m.chat + key.id]
				}
			}
			break;
			case 'caklontong': {
				if (iGame(caklontong, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/caklontong.json'));
				let { key } = await Nreply(`🎮 Jawab Pertanyaan Berikut :\n\n${hasil.soal}\n\nWaktu : 60s\nHadiah *+9999*`)
				caklontong[m.chat + key.id] = {
					...hasil,
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(caklontong, m.chat, key.id)) {
					Nreply(`Waktu Habis\nJawaban: ${caklontong[m.chat + key.id].jawaban}\n"${caklontong[m.chat + key.id].deskripsi}"`)
					delete caklontong[m.chat + key.id]
				}
			}
			break;
			case 'tebaknegara': {
				if (iGame(tebaknegara, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tebaknegara.json'));
				let { key } = await Nreply(`🎮 Tebak Negara Dari Tempat Berikut :\n\n*Tempat : ${hasil.tempat}*\n\nWaktu : 60s\nHadiah *+3499*`)
				tebaknegara[m.chat + key.id] = {
					jawaban: hasil.negara.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(tebaknegara, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tebaknegara[m.chat + key.id].jawaban)
					delete tebaknegara[m.chat + key.id]
				}
			}
			break;
			case 'tebakgambar': {
				if (iGame(tebakgambar, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tebakgambar.json'));
				let { key } = await rinn.sendFileUrl(m.chat, hasil.img, `🎮 Tebak Gambar Berikut :\n\n${hasil.deskripsi}\n\nWaktu : 60s\nHadiah *+3499*`, m)
				tebakgambar[m.chat + key.id] = {
					jawaban: hasil.jawaban.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(tebakgambar, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tebakgambar[m.chat + key.id].jawaban)
					delete tebakgambar[m.chat + key.id]
				}
			}
			break;
			case 'tebakbendera': {
				if (iGame(tebakbendera, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				const hasil = Func.pickRandom(await Func.fetchJson('https://raw.githubusercontent.com/nazedev/database/refs/heads/master/games/tebakbendera.json'));
				let { key } = await Nreply(`🎮 Tebak Bendera Berikut :\n\n*Bendera : ${hasil.bendera}*\n\nWaktu : 60s\nHadiah *+3499*`)
				tebakbendera[m.chat + key.id] = {
					jawaban: hasil.negara.toLowerCase(),
					id: key.id
				}
				await Func.sleep(60000)
				if (rdGame(tebakbendera, m.chat, key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + tebakbendera[m.chat + key.id].jawaban)
					delete tebakbendera[m.chat + key.id]
				}
			}
			break;
			case 'kuismtk': case 'mtk': {
				const { genMath, modes } = require('./App/main/math');
				const inputMode = ['noob', 'easy', 'medium', 'hard','extreme','impossible','impossible2'];
				if (iGame(kuismath, m.chat)) return Nreply('Masih Ada Sesi Yang Belum Diselesaikan!')
				if (!text) return Nreply(`Mode: ${Object.keys(modes).join(' | ')}\nContoh penggunaan: ${prefix}math medium`)
				if (!inputMode.includes(text.toLowerCase())) return Nreply('Mode tidak ditemukan!')
				let result = await genMath(text.toLowerCase())
				let { key } = await Nreply(`*Berapa hasil dari: ${result.soal.toLowerCase()}*?\n\nWaktu : ${(result.waktu / 1000).toFixed(2)} detik`)
				kuismath[m.chat + key.id] = {
					jawaban: result.jawaban,
					mode: text.toLowerCase(),
					id: key.id
				}
				await Func.sleep(kuismath, result.waktu)
				if (rdGame(m.chat + key.id)) {
					Nreply('Waktu Habis\nJawaban: ' + kuismath[m.chat + key.id].jawaban)
					delete kuismath[m.chat + key.id]
				}
			}
			break;
			case "skibidi": case "tahukahkamu": {
    try {
        let response = await fetch("https://api.ownblox.biz.id/api/tahukahkamu");
        let data = await response.json();
        if (data?.result) {
            Nreply(`*Tahukah Kamu?*\n${data.result}`);
        } else {
            Nreply("Gagal mengambil fakta. Coba lagi nanti!");
        }
    } catch (error) {
        console.error(error);
        Nreply("Terjadi kesalahan saat mengambil fakta!");
    }
}
    break;
                
                // Grup Menu
                case 'afk': {
                    if (!m.isGroup) return Nreply(mess.group); 

                    if (isAfkOn) return;

                    let reason = text ? text : 'Tanpa alasan';

                    addAfkUser(m.sender, Date.now(), reason, afk);

                    rinn.sendMessage(
                        m.chat, { text:
                        `*@${m.sender.split('@')[0]}* sedang afk\n` +
                        `*Alasan:* ${reason}`,
                        contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterName: namaSaluran,
                            newsletterJid: idSaluran,
                        },
                        externalAdReply: {
                            showAdAttribution: true,
                            title: "Sampai jumpa",
                            body: "Undangan Grup",
                            thumbnailUrl: "https://files.catbox.moe/6nns2o.jpg",
                            sourceUrl: null,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                });
                }
                break;
                case 'group': {
				if (!m.isGroup) return Nreply(mess.group)
				if (!isAdmins) return Nreply(mess.admin)
				if (!isBotAdmins) return Nreply(mess.botAdmin)
				let teks = text.split(' ')
				let set = db.groups[m.chat]
				switch (teks[0].toLowerCase()) {
					case "close": case "open":
					await rinn.groupSettingUpdate(m.chat, teks[0] == 'close' ? 'announcement' : 'not_announcement').then(a => Nreply(`*Sukses ${teks[0] == 'open' ? 'Membuka' : 'Menutup'} Group*`))
					break
					case "pesansementara": case "disappearing":
					if (/90|7|1|24/i.test(teks[1])) {
						rinn.sendMessage(m.chat, { disappearingMessagesInChat: /90/i.test(teks[1]) ? 7776000 : /7/i.test(teks[1]) ? 604800 : 86400 })
					} else if (/0|off|false/i.test(teks[1])) {
						rinn.sendMessage(m.chat, { disappearingMessagesInChat: 0 })
					} else Nreply('Silahkan Pilih :\n90 hari, 7 hari, 1 hari, off')
					break
					case "welleave": case "promotedemote": case "antilink": case "antivirtex": case "antidelete": case "mute": case "antitoxic": case "nsfw": case "antitagsw":
					if (/on|true/i.test(teks[1])) {
						if (set[teks[0]]) return Nreply('*Sudah Aktif Sebelumnya*')
						set[teks[0]] = true
						Nreply('*Sukse Change To On*')
					} else if (/off|false/i.test(teks[1])) {
						set[teks[0]] = false
						Nreply('*Sukse Change To Off*')
					} else {
					Nreply(`❗${teks[0].charAt(0).toUpperCase() + teks[0].slice(1)} on/off`)
					}
					break
					default:
					Nreply(`*${m.metadata.subject}*\n\nPembatasan grup\n- Mute : ${set.mute ? '✅' : '❌'}\n- AntiLink : ${set.antilink ? '✅' : '❌'}\n- AntiVirtex : ${set.antivirtex ? '✅' : '❌'}\n- AntiDelete : ${set.antidelete ? '✅' : '❌'}\n- AntiToxic : ${set.antitoxic ? '✅' : '❌'}\n- Antitagsw : ${set.antitagsw ? '✅' : '❌'}\n- Nsfw :  ${set.nsfw ? '❌' : '✅'}\n\nNotifikasi grup\n- Welleave : ${set.welleave ? '✅' : '❌'}\n- PromoteDemote : ${set.promotedemote ? '✅' : '❌'}\n\nLainnya\n- open\n- close\n- PesanSementara\n\nExample:\n${prefix + command} antilink off`)
				}
			}
			break;
                case 'getpp': {
                    if (!quoted) return Nreply('reply pesan kalau mau getpp');
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
                        Nreply('Terjadi kesalahan saat mengambil foto profil');
                    }
                }
                break;
                case 'setppgc': {
                    if (!m.isGroup) return Nreply(mess.group)
                    if (!isAdmins) return Nreply(mess.admin)
                    if (!isBotAdmins) return Nreply(mess.botAdmin)
                    if (!quoted) return Nreply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                    if (!/image/.test(mime)) return Nreply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                    if (/webp/.test(mime)) return Nreply(`Kirim/Reply Image Dengan Caption ${prefix + command}`)
                    let media = await rinn.downloadAndSaveMediaMessage(quoted)
                    await rinn.updateProfilePicture(m.chat, {
                        url: media
                    }).catch((err) => fs.unlinkSync(media))
                    await reactionMessage('✅');
                }
                break;
                case 'delppgc':
                case 'deleteppgc': {
                    if (!m.isGroup) return Nreply(mess.group);
                    if (!isAdmins && !isCreator) return Nreply(mess.admin);
                    if (!isBotAdmins) return Nreply(mess.botAdmin);
                    await rinn.removeProfilePicture(m.chat)
                }
                break;
                case 'setdeskgc':
                    if (!m.isGroup) return Nreply(mess.group);
                    if (!isAdmins && !isGroupOwner && !isCreator) return Nreply(mess.admin);
                    if (!isBotAdmins) return Nreply(mess.botAdmin);
                    if (!text) return Nreply('Text ?')
                    await rinn.groupUpdateDescription(m.chat, text)
                    Nreply(mess.done)
                    break;
                case 'listonline': {
				if (!isGroup) return Nreply(mess.group)
				let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
				if (!store.presences || !store.presences[id]) return Nreply('Sedang Tidak ada yang online!')
				let online = [...Object.keys(store.presences[id]), botNumber]
				await rinn.sendMessage(m.chat, { text: 'List Online:\n\n' + online.map(v => setv + ' @' + v.replace(/@.+/, '')).join`\n`, mentions: online }, { quoted: m }).catch((e) => Nreply('Gagal'))
			}
			break;
            case 'clearchat': {
				if (!isCreator) return Nreply(mess.owner)
				await rinn.chatModify({ delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }] }, m.chat)
				Nreply('Sukses Membersihkan Pesan')
			}
			break;
                case 'adminevent': {
                    if (!m.isGroup) return Nreply(mess.group);
                    if (!isAdmins && !isCreator) return Nreply(mess.admin);
                    if (args.length < 1) return Nreply('true/false?')
                    if (args[0] === 'true') {
                        adminevent = true
                        Nreply(`${command} is enabled`)
                    } else if (args[0] === 'false') {
                        adminevent = false
                        Nreply(`${command} is disabled`)
                    }
                }
                break;
                case 'groupevent': {
                    if (!m.isGroup) return Nreply(mess.group);
                    if (!isAdmins && !isCreator) return Nreply(mess.admin);
                    if (args.length < 1) return Nreply('true/false?')
                    if (args[0] === 'true') {
                        groupevent = true
                        Nreply(`${command} is enabled`)
                    } else if (args[0] === 'false') {
                        groupevent = false
                        Nreply(`${command} is disabled`)
                    }
                }
                break;
                case 'delete':
                case 'del': {
                    if (m.isGroup) {
                        if (!isCreator && !m.isAdmin) return Nreply(mess.admin)
                        if (!m.quoted) return Nreply("reply pesannya")
                        if (m.quoted.fromMe) {
                            rinn.sendMessage(m.chat, {
                                delete: {
                                    remoteJid: m.chat,
                                    fromMe: true,
                                    id: m.quoted.id,
                                    participant: m.quoted.sender
                                }
                            })
                        } else {
                            if (!m.isBotAdmin) return Nreply(mess.botAdmin)
                            rinn.sendMessage(m.chat, {
                                delete: {
                                    remoteJid: m.chat,
                                    fromMe: false,
                                    id: m.quoted.id,
                                    participant: m.quoted.sender
                                }
                            })
                        }
                    } else {
                        if (!isCreator) return Nreply(mess.owner)
                        if (!m.quoted) return Nreply(example("reply pesan"))
                        rinn.sendMessage(m.chat, {
                            delete: {
                                remoteJid: m.chat,
                                fromMe: false,
                                id: m.quoted.id,
                                participant: m.quoted.sender
                            }
                        })
                    }
                }
                break;
                case 'q':
			case 'quoted': {
                 if (!m.quoted) return m.reply('Reply Pesannya!')
				const anu = await m.getQuotedMessage()
				if (!anu) return Nreply('Format Tidak Tersedia!')
				if (!anu.quoted) return Nreply('Pesan Yang Anda Reply Tidak Mengandung Reply')
				await rinn.relayMessage(m.chat, { [anu.quoted.type]: anu.quoted.m }, {})
			};
			break;
			case 'tagme': {
                    if (!m.isGroup) return Nreply(mess.group);
                    rinn.sendMessage(m.chat, {
                        text: `@${m.sender.split('@')[0]}`,
                        mentions: [m.sender]
                    })
                };
                break;
                case 'h':
                case 'hidetag': {
                    if (!m.isGroup) return Nreply(mess.group)
                    if (!isCreator && !isAdmins) return Nreply(mess.admin)
                    if (m.quoted) {
                        rinn.sendMessage(m.chat, {
                            forward: m.quoted.fakeObj,
                            mentions: participants.map(a => a.id)
                        })
                    } else {
                        rinn.sendMessage(m.chat, {
                            text: `@${m.chat} ${q ? q : ''}`,
                            contextInfo: {
                                mentionedJid: participants.map(a => a.id),
                                groupMentions: [{
                                    groupSubject: "Everyone",
                                    groupJid: m.chat
                                }]
                            }
                        }, {
                            quoted: m
                        })
                    }
                }
                break;
                case 'add': case 'invite': {
                    if (!m.isGroup) return Nreply(mess.group);
                    if (!isAdmins && !isCreator) return Nreply(mess.admin);
                    if (!isBotAdmins) return Nreply(mess.botAdmin);

                    if (!text && !m.quoted) {
                        return Nreply(`reply pengguna/masukkan nomor,contoh:\n${prefix + command} +628 xxx xxx`);
                    }
                
                    let link = await rinn.groupInviteCode(m.chat).catch(() => null);
                    if (!link) return Nreply("⚠️ Error: Tidak bisa mendapatkan kode undangan grup.");
                
                    let metadata = await rinn.groupMetadata(m.chat).catch(() => null);
                    if (!metadata) return Nreply("⚠️ Error: Gagal mendapatkan informasi grup.");
                    
                    let groupName = metadata.subject;
                    let existingParticipants = metadata.participants.map(user => user.id);
                    let inputNumbers = [];
                
                    if (m.quoted) {
                        inputNumbers.push(m.quoted.sender.split('@')[0]);
                    }
                
                    if (text) {
                        inputNumbers = inputNumbers.concat(
                            text.split(',')
                                .map(v => v.replace(/[^0-9]/g, ''))
                                .filter(v => v.length > 4 && v.length < 20)
                        );
                    }
                
                    inputNumbers = [...new Set(inputNumbers)];
                    for (const number of inputNumbers) {
                        const jid = `${number}@s.whatsapp.net`;
                
                        if (existingParticipants.includes(jid)) {
                            await Nreply(`⚠️ Pengguna tersebut sudah menjadi anggota grup ini @${number}`);
                            continue;
                        }
                
                        const exists = await rinn.onWhatsApp(jid);
                        if (!exists[0]?.exists) {
                            await Nreply(`⚠️ Pengguna @${number} tidak terdaftar di WhatsApp`);
                            continue;
                        }
                
                        try {
                            const response = await rinn.query({
                                tag: 'iq',
                                attrs: {
                                    type: 'set',
                                    xmlns: 'w:g2',
                                    to: m.chat,
                                },
                                content: [{
                                    tag: 'add',
                                    attrs: {},
                                    content: [{
                                        tag: 'participant',
                                        attrs: { jid },
                                    }],
                                }],
                            });
                
                            const participant = getBinaryNodeChildren(response, 'add');
                            const user = participant[0]?.content.find(item => item.attrs.jid === jid);
                
                            if (user?.attrs.error === '421') {
                                Nreply("⚠️ Tidak dapat menambahkan pengguna tersebut. Mereka telah membatasi undangan ke grup.");
                                continue;
                            }
                
                            if (user?.attrs.error === '408') {
                                await m.reply(`✅ Undangan grup berhasil dikirim ke @${number} karena pengguna baru saja keluar dari grup.`);
                                await rinn.sendMessage(
                                    jid, {
                                        text: `✨ Anda diundang kembali ke grup ini:\nhttps://chat.whatsapp.com/${link}`,
                                        contextInfo: {
                                            externalAdReply: {
                                                title: groupName,
                                                body: null,
                                                thumbnailUrl: await rinn.profilePictureUrl(m.chat, 'image').catch(() => null),
                                                sourceUrl: `https://chat.whatsapp.com/${link}`,
                                                mediaType: 1,
                                                renderLargerThumbnail: false,
                                            },
                                        },
                                    }, { quoted: null }
                                );
                                continue;
                            }
                
                            if (user?.attrs.error === '403') {
                                await rinn.sendMessage(m.chat, {
                                    text: `@${number.split('@')[0]} Gak bisa ditambahin nih\n\nKarena targetnya private banget! 😅\n\nTapi, undangannya bakal dikirim ke\n-> wa.me/${number.replace(/\D/g, '')}\nLewat chat pribadi ya!`,
                                    mentions: [number]
                                    }, { quoted: m });
                                const content = getBinaryNodeChild(user, 'add_request');
                                const { code, expiration } = content.attrs;
                                const pp = await rinn.profilePictureUrl(m.chat).catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60');
                
                                const msgs = generateWAMessageFromContent(
                                    m.chat,
                                    proto.Message.fromObject({
                                        groupInviteMessage: {
                                            groupJid: m.chat,
                                            inviteCode: code,
                                            inviteExpiration: parseInt(expiration),
                                            groupName: groupName,
                                            jpegThumbnail: await Func.reSize(pp, 256, 256),
                                            caption: "Undangan untuk bergabung ke grup WhatsApp saya",
                                        },
                                    }), {
                                        userJid: rinn.user.id,
                                    }
                                );
                                await rinn.sendMessage(jid, {
                                    forward: msgs,
                                    mentions: [jid]
                                });
                            }
                        } catch (err) {
                            console.error(err);
                            await Nreply(`Error occurred while adding @${number}: ${err.message}`);
                        }
                    }
                }
                break;
                case 'dor':
			case 'kick': {
				if (!m.isGroup) return Nreply('Eits, perintah ini cuma bisa dipakai di grup lho, kak! 🤭');
				if (!isCreator && !isAdmins) return Nreply('Maaf ya kak, cuma admin atau owner yang bisa pakai perintah ini. 🙏');
				if (!isBotAdmins) return Nreply('Aku belum jadi admin nih, kak. Jadikan aku admin dulu ya biar bisa bantu! 😢');

				if (!m.quoted && !m.mentionedJid[0] && isNaN(parseInt(args[0]))) {
					return Nreply('Hmm... Kakak mau kick siapa nih? Sebutin dong orangnya! 🤔');
				}
	
				let users = m.mentionedJid[0] 
				? m.mentionedJid[0] 
				: m.quoted 
				? m.quoted.sender 
				: text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

				if (global.owner.includes(users.replace('@s.whatsapp.net', ''))) {
					return Nreply('Eh, itu kan owner aku, kak! Jangan usil dong, nanti aku dimarahin. 😣');
				}

				try {
					await rinn.groupParticipantsUpdate(m.chat, [users], 'remove');
					Nreply('Yey, udah berhasil kak! Bye-bye orang yang tadi~ 👋✨');
				} catch (err) {
					console.error(err);
					Nreply('Aduh, ada yang salah nih waktu aku coba kick orangnya. Coba cek lagi ya, kak. 😥');
				}
			};
			break;
                case 'promote': {
                    if (!m.isGroup) return Nreply(mess.group)
                    if (!isCreator && !isAdmins) return Nreply(mess.admin)
                    if (!isBotAdmins) return Nreply(mess.botAdmin)
                    if (!m.quoted && !m.mentionedJid[0] && isNaN(parseInt(args[0]))) return Nreply('Hmm... kakak mau promote siapa?');
                    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    if (!m.mentionedJid[0] && !m.quoted && !text) return Nreply(`Hmm... kakak mau ${command} siapa? 🤔`)
                    await rinn.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => Nreply(mess.done)).catch((err) => Nreply(mess.error))
                }
                break;
                case 'demote': {
                    if (!m.isGroup) return Nreply(mess.group)
                    if (!isCreator && !isAdmins) return Nreply(mess.admin)
                    if (!isBotAdmins) return Nreply(mess.botAdmin)
                    if (!m.quoted && !m.mentionedJid[0] && isNaN(parseInt(args[0]))) return Nreply('Hmm... kakak kamu demote siapa? 🤔')
                    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                    if (!m.mentionedJid[0] && !m.quoted && !text) return Nreply(`Hmm... kakak mau ${command} siapa? 🤔`)
                    await rinn.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => Nreply(mess.done)).catch((err) => Nreply(mess.error))
                }
                break;
                case 'revoke': {
                    if (!m.isGroup) return Nreply(mess.group);
                    if (!isAdmins && !isCreator) return Nreply(mess.admin);
                    if (!isBotAdmins) return Nreply(mess.botAdmin);
                    await rinn.groupRevokeInvite(m.chat)
                        .then(res => {
                            Nreply(mess.done)
                        }).catch(() => Nreply(mess.error))
                }
                break;
                
                // Info Menu
			case 'cekidch': {
                    if (!text) return Nreply(`${prefix}${command} linkchnya`)
                    if (!text.includes("https://whatsapp.com/channel/")) return Nreply("Link tautan tidak valid")
                    let result = text.split('https://whatsapp.com/channel/')[1]
                    let res = await rinn.newsletterMetadata("invite", result)
                    let teks = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`
                    return Nreply(teks)
                }
                break;
                case 'istgc': {
let teks = `\n *乂 List all group chat*\n`
let a = await rinn.groupFetchAllParticipating()
let gc = Object.values(a)
teks += `\n* *Total group :* ${readmore}${gc.length}\n`
for (const u of gc) {
teks += `\n* *ID :* ${u.id}
* *Nama :* ${u.subject}
* *Member :* ${u.participants.length}
* *Status :* ${u.announce == false ? "Terbuka": "Hanya Admin"}
* *Pembuat :* ${u?.subjectOwner ? u?.subjectOwner.split("@")[0] : "Sudah Keluar"}\n`
}
return Nreply(teks)
}
break;
                case 'servermc': {
                    if (!args.length) {
                        await rinn.sendMessage(m.chat, {
                            text: `Masukan Nama Ip Server Nya\nContoh\n${prefix}servermc <ip> java\n${prefix}servermc <ip> bedrock`
                        }, {
                            quoted: m
                        });
                        return;
                    }

                    try {
                        if (args[1]?.toLowerCase() === 'java') {
                            const response = await axios.get('https://api.mcsrvstat.us/3/' + args[0]);
                            const jav = response.data;

                            if (!jav || jav.online === false) {
                                await Nreply("Server sedang offline atau tidak ditemukan");
                                return;
                            }

                            let capt = `⏤͟͟͞͞╳── *[ sᴇʀᴠᴇʀᴍᴄ - ᴊᴀᴠᴀ ]* ── .々─ᯤ\n`;
                            capt += `│    =〆 ɪᴘ: ${jav.hostname || args[0]}\n`;
                            capt += `│    =〆 ᴘᴏʀᴛ: ${jav.port || '25565'}\n`;
                            capt += `│    =〆 ᴠᴇʀsɪ: ${jav.version || 'N/A'}\n`;
                            capt += `│    =〆 ᴏɴʟɪɴᴇ: ${jav.online ? 'Yes' : 'No'}\n`;
                            capt += `│    =〆 ᴘʟᴀʏᴇʀ: ${jav.players?.online || 0} \\ ${jav.players?.max || 0}\n`;
                            capt += `⏤͟͟͞͞╳────────── .✦`;

                            await Nreply(capt);

                        } else if (args[1]?.toLowerCase() === 'bedrock') {
                            const response = await axios.get('https://api.mcsrvstat.us/bedrock/3/' + args[0]);
                            const bed = response.data;

                            if (!bed || bed.online === false) {
                                await Nreply("Server sedang offline atau tidak ditemukan");
                                return;
                            }

                            let capt = `⏤͟͟͞͞╳── *[ sᴇʀᴠᴇʀᴍᴄ - ʙᴇᴅʀᴏᴄᴋ ]* ── .々─ᯤ\n`;
                            capt += `│    =〆 ɪᴘ: ${bed.hostname || args[0]}\n`;
                            capt += `│    =〆 ᴘᴏʀᴛ: ${bed.port || '19132'}\n`;
                            capt += `│    =〆 ᴠᴇʀsɪ: ${bed.version || 'N/A'}\n`;
                            capt += `│    =〆 ᴏɴʟɪɴᴇ: ${bed.online ? 'Yes' : 'No'}\n`;
                            capt += `│    =〆 ᴘʟᴀʏᴇʀ: ${bed.players?.online || 0} \\ ${bed.players?.max || 0}\n`;
                            capt += `⏤͟͟͞͞╳────────── .✦`;

                            await Nreply(capt);
                        } else {
                            await rinn.sendMessage(m.chat, {
                                text: `Masukan Nama Ip Server Nya\nContoh\n${prefix}servermc <ip> java\n${prefix}servermc <ip> bedrock`
                            }, {
                                quoted: m
                            });
                        }
                    } catch (error) {
                        console.error('Error in servermc:', error);
                        await Nreply(`Terjadi kesalahan saat mengecek server: ${error.message}`);
                    }
                }
                break;

                // Owner Menu
case 'getsession': {
				if (!isCreator) return Nreply(mess.owner)
				await rinn.sendMessage(m.chat, {
					document: fs.readFileSync('./storage/session/creds.json'),
					mimetype: 'application/json',
					fileName: 'creds.json'
				}, { quoted: m });
			}
			break;
			case 'deletesession': case "delsession": {
				if (!isCreator) return Nreply(mess.owner)
				fs.readdir('./storage/session', async function (err, files) {
					if (err) {
						console.error('Unable to scan directory: ' + err);
						return Nreply('Unable to scan directory: ' + err);
					}
					let filteredArray = await files.filter(item => ['session-', 'pre-key', 'sender-key', 'app-state'].some(ext => item.startsWith(ext)));					
					let teks = `Terdeteksi ${filteredArray.length} Session file\n\n`
					if(filteredArray.length == 0) return Nreply(teks);
					filteredArray.map(function(e, i) {
						teks += (i+1)+`. ${e}\n`
					})
					if (text && text == 'true') {
						let { key } = await Nreply('Menghapus Session File..')
						await filteredArray.forEach(function (file) {
							fs.unlinkSync('./storage/session/' + file)
						});
						Func.sleep(2000)
						Nreply('Berhasil Menghapus Semua Sampah Session', { edit: key })
					} else Nreply(teks + `\nKetik _${prefix + command} true_\nUntuk Menghapus`)
				});
			}
			break;
			case 'deletesampah': case "delsampah": {
				if (!isCreator) return Nreply(mess.owner)
				fs.readdir('./tmp/', async function (err, files) {
					if (err) {
						console.error('Unable to scan directory: ' + err);
						return Nreply('Unable to scan directory: ' + err);
					}
					let filteredArray = await files.filter(item => ['gif', 'png', 'bin','mp3', 'mp4', 'jpg', 'webp', 'webm', 'opus', 'jpeg'].some(ext => item.endsWith(ext)));
					let teks = `Terdeteksi ${filteredArray.length} Sampah file\n\n`
					if(filteredArray.length == 0) return Nreply(teks);
					filteredArray.map(function(e, i) {
						teks += (i+1)+`. ${e}\n`
					})
					if (text && text == 'true') {
						let { key } = await Nreply('Menghapus Sampah File..')
						await filteredArray.forEach(function (file) {
							fs.unlinkSync('./tmp/' + file)
						});
						Func.sleep(2000)
						Nreply('Berhasil Menghapus Semua Sampah', { edit: key })
					} else Nreply(teks + `\nKetik _${prefix + command} true_\nUntuk Menghapus`)
				});
			}
			break;
                case "owner": {
                    var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                        "contactMessage": {
                            "displayName": "Nomor Developer",
                            "vcard": `BEGIN:VCARD
VERSION:3.0
N:;;;;
FN: Rinnn
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
                case 'adduang': {
				if (!isCreator) return Nreply(mess.owner)
				if (!args[0] || !args[1] || isNaN(args[1])) return Nreply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx 1000`)
				const nmrnya = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
				const onWa = await rinn.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return Nreply('Nomer Tersebut Tidak Terdaftar Di Whatsapp!')
				if (db.users[nmrnya] && db.users[nmrnya].uang) {
					addUang(args[1], nmrnya, db)
					Nreply('Sukses Add Uang')
				} else {
					Nreply('User tidak terdaftar di database!')
				}
			}
			break;
			case 'addlimit': {
				if (!isCreator) return Nreply(mess.owner)
				if (!args[0] || !args[1] || isNaN(args[1])) return Nreply(`Kirim/tag Nomernya!\nExample:\n${prefix + command} 62xxx 10`)
				const nmrnya = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
				const onWa = await rinn.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return Nreply('Nomer Tersebut Tidak Terdaftar Di Whatsapp!')
				if (db.users[nmrnya] && db.users[nmrnya].limit) {
					addLimit(args[1], nmrnya, db)
					Nreply('Sukses Add limit')
				} else {
					Nreply('User tidak terdaftar di database!')
				}
			}
			break;
                case 'addprem': {
                    if (!isCreator) return Nreply(mess.owner);
                    if (!text) return Nreply(`Contoh:\n${prefix + command} @tag|durasi(s/m/h/d)`);
                    let [teks1, teks2] = text.split`|`;
                    const nmrnya = teks1.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                    const onWa = await rinn.onWhatsApp(nmrnya);
                    if (!onWa.length > 0) return Nreply('Nomor tersebut tidak terdaftar di WhatsApp! ❌');
                    if (teks2) {
                        prem.addPremiumUser(nmrnya, teks2, premium);
                        Nreply(`✅ Berhasil menambahkan @${nmrnya.split('@')[0]} sebagai pengguna *Premium* selama *${teks2}*!`);
                        db.data.users[nmrnya].limit = db.data.users[nmrnya].vip ? global.limit.vip : global.limit.premium;
                        db.data.users[nmrnya].uang = db.data.users[nmrnya].vip ? global.uang.vip : global.uang.premium;
                        db.data.users[nmrnya].premium = true;
                        db.data.users[nmrnya].vip = true;
                    } else {
                        Nreply(`Masukkan durasi yang valid!\nContoh: ${prefix + command} @tag|durasi(s/m/h/d)`);
                    }
                }
                break;
                case 'delprem': {
                    if (!isCreator) return Nreply(mess.owner);
                    if (!text) return Nreply(`Contoh:\n${prefix + command} @tag`);
                    const nmrnya = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                    if (prem.checkPremiumUser(nmrnya, premium)) {
                        premium.splice(prem.getPremiumPosition(nmrnya, premium), 1);
                        fs.writeFileSync('./storage/data/role/premium.json', JSON.stringify(premium));
                        Nreply(`✅ Berhasil menghapus @${nmrnya.split('@')[0]} dari daftar *Premium*!`);
                        db.data.users[nmrnya].limit = db.data.users[nmrnya].vip ? global.limit.vip : global.limit.free;
                        db.data.users[nmrnya].uang = db.data.users[nmrnya].vip ? global.uang.vip : global.uang.free;
                        db.data.users[nmrnya].premium = false;
                        db.data.users[nmrnya].vip = false;
                    } else {
                        Nreply(`⚠️ Pengguna @${nmrnya.split('@')[0]} bukan pengguna *Premium*!`);
                    }
                }
                break;
                case 'joingc': {
                    try {
                        if (!isCreator) return Nreply(mess.owner);
                        if (!text) return Nreply('Masukkan Link Grup yaa!');
                        if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return Nreply('Link-nya invalid nih!');
                        let result = args[0].split('https://chat.whatsapp.com/')[1];
                        rinn.groupAcceptInvite(result);
                        await Nreply(`Sudah gabung ke grup! 🎉`);
                    } catch {
                        Nreply('Gagal gabung ke grup, coba lagi nanti!');
                    }
                }
                break;
                case 'outgc':
                    if (!isCreator) return Nreply(mess.owner);
                    if (!m.isGroup) return Nreply(mess.group);
                    Nreply('Selamat tinggal, semuanya 🥺');
                    await rinn.groupLeave(m.chat);
                    break;
                case 'setppbot': {
                    if (!isCreator) return Nreply(rinn, m, 'Fitur khusus owner!');

                    let q = quoted;
                    let mime = (q.m || q).mimetype || q.mediaType || '';

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
                            Nreply('Terjadi kesalahan, coba lagi nanti.');
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
                            Nreply('Sukses mengganti PP Bot');
                        } catch (e) {
                            console.error(e);
                            Nreply('Terjadi kesalahan, coba lagi nanti.');
                        }
                    } else {
                        Nreply(`Kirim gambar dengan caption *${prefix + command}* atau tag gambar yang sudah dikirim`);
                    }
                }
                break;
			case 'block': {
				if (!isCreator) return Nreply(mess.owner)
				if (!text && !m.quoted) {
					Nreply(`Contoh: ${prefix + command} 62xxx`)
				} else {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat
					await rinn.updateBlockStatus(numbersOnly, 'block').then((a) => Nreply(mess.done)).catch((err) => Nreply('Gagal!'))
				}
			}
			break;
			case 'listblock': {
				let anu = await rinn.fetchBlocklist()
				Nreply(`Total Block : ${anu.length}\n` + anu.map(v => '• ' + v.replace(/@.+/, '')).join`\n`)
			}
			break;
			case 'unblock': {
				if (!isCreator) return Nreply(mess.owner)
				if (!text && !m.quoted) {
					Nreply(`Contoh: ${prefix + command} 62xxx`)
				} else {
					const numbersOnly = m.isGroup ? (text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender) : m.chat
					await rinn.updateBlockStatus(numbersOnly, 'unblock').then((a) => Nreply(mess.done)).catch((err) => Nreply('Gagal!'))
				}
			}
			break;
			case 'listpc': {
				if (!isCreator) return Nreply(mess.owner)
				let anu = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v.id)
                                let setv = Func.pickRandom(listv)
				let teks = `● *LIST PERSONAL CHAT*\n\nTotal Chat : ${anu.length} Chat\n\n`
				if (anu.length === 0) return Nreply(teks)
				for (let i of anu) {
					if (store.messages[i] && store.messages[i].array && store.messages[i].array[0]) {
						let nama = store.messages[i].array[0].pushName
						teks += `${setv} *Nama :* ${nama}\n${setv} *User :* @${i.split('@')[0]}\n${setv} *Chat :* https://wa.me/${i.split('@')[0]}\n\n=====================\n\n`
					}
				}
				await rinn.sendTextMentions(m.chat, teks, m)
			}
			break;
                case 'upsaluran': {
                    if (!isCreator) return
                    try {
                        if (!mime && !text) {
                            return Nreply(`Balas Pesan DenganPerintah *${prefix + command}*`)
                        }
                        media = mime ? await quoted.download() : null
                        let defaultCaption = "Sukses"
                        if (/image/.test(mime)) {
                            rinn.sendMessage(idSaluran, {
                                image: media,
                                caption: text ? text : defaultCaption
                            })
                            Nreply(`📸 Gambar berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
                        } else if (/video/.test(mime)) {
                            rinn.sendMessage(idSaluran, {
                                video: media,
                                caption: text ? text : defaultCaption
                            })
                            Nreply(`🎥 Video berhasil diunggah ke saluran dengan caption: "${text ? text : defaultCaption}"`)
                        } else if (/audio/.test(mime)) {
                            rinn.sendMessage(idSaluran, {
                                audio: media,
                                mimetype: mime,
                                ptt: true
                            })
                            Nreply(`🎵 Audio berhasil diunggah ke saluran`)
                        } else if (/text/.test(mime) || text) {
                            rinn.sendMessage(idSaluran, {
                                text: text ? text : defaultCaption
                            })
                            Nreply(`💬 Pesan teks berhasil dikirim ke saluran: "${text ? text : defaultCaption}"`)
                        } else {
                            Nreply(`Error`)
                        }
                    } catch (error) {
                        console.error(error)
                        reply(`Error`)
                    }
                }
                break;
                

                case 'shutdown':
                    if (!isCreator) return Nreply(mess.owner);
                    Nreply(`Bentar ${command} dulu`);
                    await Func.sleep(3000);
                    process.exit();
                    break;
                case 'backup': {
				if (!isCreator) return Nreply(mess.owner);
				let sender = m.mentionedJid[0] || m.sender || slimecode.parseMention(args[0]) || (args[0].replace(/[@.+-]/g, '').replace(' ', '') + '@s.whatsapp.net') || '';
				let date = new Date();
				let filename = await Func.randomText(12);
				const { execSync } = require('child_process');
				const ls = (await execSync('ls')).toString().split('\n').filter((cek) => cek !== 'node_modules' && cek !== 'package-lock.json' && cek !== '');
				await Nreply('Hasil backup akan dikirim lewat chat pribadi ya!');
				await execSync(`zip -r ${filename}.zip ${ls.join(' ')}`);
				const sentMessage = await rinn.sendMessage(m.sender, {
					document: await fs.readFileSync(`./${filename}.zip`),
					mimetype: 'application/zip',
					fileName: `${filename}.zip`,
					caption: 'Berhasil! Silakan download dan simpan file backup-nya ya.'
				});
				await execSync(`rm -rf ${filename}.zip`);
				console.log(`${filename}.zip telah dihapus dari file lokal.`);
			}
			break;
                case 'addcase': {
                    if (!isCreator) return Nreply(mess.owner)
                    if (!text) return Nreply('Mana case nya');
                    const fs = require('fs');
                    const namaFile = 'case.js';
                    const caseBaru = `${text}`;
                    fs.readFile(namaFile, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Terjadi kesalahan saat membaca file:', err);
                            return Nreply('Gagal membaca file');
                        }
                        const posisiAwal = data.indexOf("switch (command) {");
                        if (posisiAwal !== -1) {
                            const posisiInsert = posisiAwal + "switch (command) {".length;
                            const kodeBaruLengkap = data.slice(0, posisiInsert) + '\n\n' + caseBaru + '\n' + data.slice(posisiInsert);
                            fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
                                if (err) {
                                    Nreply('Terjadi kesalahan saat menulis file: ' + err);
                                } else {
                                    Nreply('Case baru berhasil ditambahkan.');
                                }
                            });
                        } else {
                            Nreply('Tidak dapat menemukan switch statement dalam file.');
                        }
                    });
                }
                break;
                
                case 'getcase': {
                    const getCase = (cases) => {
                        return "case " + `'${cases}'` + fs.readFileSync("./case.js").toString().split('case \'' + cases + '\'')[1].split("break;")[0] + "break;"
                    }
                    try {
                        if (!isCreator) return Nreply('ngapain')
                        if (!q) return Nreply(`contoh : ${prefix + command} antilink`)
                        let nana = await getCase(q)
                        Nreply(nana)
                    } catch (err) {
                        console.log(err)
                        Nreply(`Case ${q} tidak di temukan`)
                    }
                }
                break;
                
                case 'delcase': {
                    if (!isCreator) return Nreply(mess.owner)
                    if (!text) return Nreply('Masukkan nama case yang ingin dihapus')
                    const fs = require('fs')
                    const namaFile = 'case.js'
                    fs.readFile(namaFile, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Terjadi kesalahan saat membaca file:', err)
                            return Nreply('Gagal membaca file')
                        }
                        const casePattern = new RegExp(`case ['"]${text}['"]:[\\s\\S]*?break;`, 'g')
                        if (!casePattern.test(data)) {
                            return Nreply(`Case '${text}' tidak ditemukan`)
                        }
                        const newContent = data.replace(casePattern, '')
                        fs.writeFile(namaFile, newContent, 'utf8', (err) => {
                            if (err) {
                                console.error('Terjadi kesalahan saat menulis file:', err)
                                return Nreply('Gagal menghapus case')
                            }
                            Nreply(`Case '${text}' berhasil dihapus`)
                        })
                    })
                }
                break;
            case 'bot': {
				let teks = text.split(' ')
				let set = db.set[botNumber]
				switch(teks[0]) {
					case "mode":
					if (!isCreator) return Nreply(mess.owner)
					if (teks[1] == 'public') {
						if (rinn.public) return Nreply('*Sudah Aktif Sebelumnya*')
						rinn.public = set.public = true
						Nreply('*Sukse Change To Public Usage*')
					} else if (teks[1] == 'self') {
						rinn.public = set.public = false
						Nreply('*Sukse Change To Self Usage*')
					} else {
						Nreply('Mode self/public')
					}
					break;
					case "anticall": case "autobio": case "autoread": case "autotyping": case "readsw": case "multiprefix":
					if (!isCreator) return Nreply(mess.owner)
					if (teks[1] == 'on') {
						if (set[teks[0]]) return Nreply('*Sudah Aktif Sebelumnya*')
						set[teks[0]] = true
						Nreply('*Sukse Change To On*')
					} else if (teks[1] == 'off') {
						set[teks[0]] = false
						Nreply('*Sukse Change To Off*')
					} else {
						Nreply(`${teks[0].charAt(0).toUpperCase() + teks[0].slice(1)} on/off`)
					}
					break;
					case "set":
					let settingsBot = Object.entries(set).map(([key, value]) => {
						let list = key == 'status' ? new Date(value).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : (typeof value === 'boolean') ? (value ? 'on🟢' : 'off🔴') : value;
						return `- ${key.charAt(0).toUpperCase() + key.slice(1)} : ${list}`;
					}).join('\n');
					Nreply(`Settings Bot @${botNumber.split('@')[0]}\n${settingsBot}`);
					break;
					default:
					if (teks[0] || teks[1]) Nreply(`*Please Sellect Settings :*\n- Mode : *${prefix + command} mode self/public*\n- Anti Call : *${prefix + command} anticall on/off*\n- Auto Bio : *${prefix + command} autobio on/off*\n- Auto Read : *${prefix + command} autoread on/off*\n- Auto Typing : *${prefix + command} autotyping on/off*\n- Read Sw : *${prefix + command} readsw on/off*\n- Multi Prefix : *${prefix + command} multiprefix on/off*`)
				}
				if (!teks[0] && !teks[1]) return rinn.sendMessage(m.chat, { text: `*Bot Telah Online Selama*\n*${Func.runtime(process.uptime())}*` }, { quoted: m })
			}
			break;
			
			// Search Menu
			case '8font': {
                    if (!text) return Nreply(`⚠️ *Masukan nama font !*\n\n*Contoh : 8font roboto*`);

                    await reactionMessage("🕖");

                    async function createImage(url) {
                        const {
                            imageMessage
                        } = await generateWAMessageContent({
                            image: {
                                url
                            }
                        }, {
                            upload: rinn.waUploadToServer
                        });
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
                        let {
                            data
                        } = await axios.get(`https://api-ape.my.id/search/8font?query=${encodeURIComponent(text)}`);
                        let fonts = data.data.fonts;

                        if (!fonts || fonts.length === 0) {
                            return Nreply(`🔍 *Tidak ada hasil pencarian untuk:* ${text}`);
                        }

                        shuffleArray(fonts);
                        let ult = fonts.splice(0, 10);
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
                                    buttons: [{
                                        "name": "cta_url",
                                        "buttonParamsJson": `{"display_text":"Download Font","url":"${font.link}"}`
                                    }]
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
                        }).catch((err) => Nreply(`❌ *Terjadi Kesalahan: ${err.message}*`));
                    } catch (error) {
                        console.error(error);
                        Nreply(`❌ *Terjadi kesalahan saat mengambil data. Coba lagi nanti!*`);
                    }
                }
                break;
			case 'amsearch': {
                    if (!args[0]) {
                        await rinn.sendMessage(m.chat, {
                            text: `Masukan judul lagu/artist!\ncontoh:\n\n${prefix + command} taylor swift`
                        }, {
                            quoted: m
                        });
                        return;
                    }
                    const query = args.join(' ');
                    await handleAppleMusicSearch(rinn, m, query);
                }
                break;
                case 'anilistinfo': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args[0]) {
                        await rinn.sendMessage(m.chat, {
                            text: `Masukan link anime!\ncontoh:\n\n${prefix + command} https://anilist.co/anime/...`
                        }, {
                            quoted: m
                        });
                        return;
                    }
                    const url = args[0];
                    await handleAnilistDetail(rinn, m, url);
                    setLimit(m, db)
                }
                break;
			case 'anilisttop': {
                if (!isLimit) return Nreply(mess.limit)
                    await handleAnilistPopular(rinn, msg);
                    setLimit(m, db)
                }
                break;
			case 'anilist': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args[0]) {
                        await rinn.sendMessage(m.chat, {
                            text: `Masukan judul anime!\ncontoh:\n\n${prefix + command} one piece`
                        }, {
                            quoted: m
                        });
                        return;
                    }
                    const query = args.join(' ');
                    await handleAnilistSearch(rinn, m, query);
                    setLimit(m, db)
                }
                break;
                case 'yts': {
                    if (!text) return Nreply('Masukkan kata kunci pencarian!')

                    await reactionMessage('🕐');

                    let ytsSearch = await yts(text)
                    if (!ytsSearch || !ytsSearch.all || ytsSearch.all.length === 0) return Nreply("Video tidak ditemukan!")

                    let results = ytsSearch.all.slice(0, 7)
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

                    rinn.relayMessage(m.chat, m.message, {
                        messageId: m.key.id
                    })

                    await rinn.sendMessage(m.chat, {
                        react: {
                            text: '',
                            key: m.key
                        }
                    })
                }
                break;
                case 'tiktoksearch':
                case 'tiktoks':
                case 'ttsearch': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!text) return Nreply(`Gini carinya*${prefix + command} jj epep*`);
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
                                quoted: m
                            }
                        );
                        if (search.videos.length > 1) {
                            await rinn.sendMessage(
                                m.chat, {
                                    text: `📚 *Daftar Video Lainnya:*\n${list}`
                                }, {
                                    quoted: m
                                }
                            );
                        }
                        setLimit(m, db)
                    } catch (error) {
                        console.log(error);
                    }
                }
                break;
                case 'ttsalbum':
                case 'ttsearchalbum': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args.length) {
                        await Nreply(`Masukan kata kunci!\ncontoh:\n\n${prefix + command} dance`);
                        return;
                    }
                    try {
                        await reactionMessage('🕐');

                        const query = args.join(' ');
                        const videos = await ttSearch(query, 5);

                        if (!videos.length) {
                            await Nreply('Tidak ada video ditemukan. Silakan coba kata kunci lain.');
                            return;
                        }

                        const caption = `*Hasil pencarian TikTok untuk:* "${query}"\n*Total Video:* ${videos.length}`;

                        await sendVideoAlbum(rinn, m, videos, caption);
                        setLimit(m, db)

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

                        await Nreply(errorMsg);
                    }
                }
                break; 
                case 'pin':
                case 'pinterest': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args.length) {
                        await Nreply(`Masukan kata kunci!\ncontoh:\n\n${prefix + command} Alya`);
                        return;
                    }
                    const pins = require('./lib/handlers/pinSearch');
                    try {
                        await reactionMessage('🕐');
                        const query = args.join(' ');
                        const results = await pins(query);

                        if (!results.length) {
                            await Nreply(rinn, m, 'Tidak ada gambar ditemukan. Silakan coba kata kunci lain.');
                            return;
                        }

                        const images = results.map(result => ({
                            url: result.image_large_url || result.image_small_url,
                            caption: `乂───『[ Pinterest ]』───乂`
                        }));

                        StateManager.setState(sender, 'pinterest_search', {
                            images: images,
                            currentIndex: 0,
                            query: query
                        });

                        await rinn.sendMessage(m.chat, {
                            image: {
                                url: images[0].url
                            },
                            caption: `${images[0].caption}\n\n*Hasil pencarian untuk:* "${query}"\n*Image:* 1/${images.length}`,
                            headerType: 6,
                            buttons: [{
                                    buttonId: '.next',
                                    buttonText: {
                                        displayText: 'Next'
                                    },
                                    type: 1,
                                },
                                {
                                    buttonId: '.stop',
                                    buttonText: {
                                        displayText: 'Stop'
                                    },
                                    type: 1,
                                },
                            ],
                            headerType: 1,
                            viewOnce: true
                        }, {
                            quoted: m
                        });
                        setLimit(m, db)

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

                        await Nreply(errorMsg);
                    }
                }
                break;
                case 'snacksearch': {
                if (!isLimit) return Nreply(mess.limit)
                    async function search(q) {
                        return new Promise(async (resolve, reject) => {
                            await axios.get("https://www.snackvideo.com/discover/" + q)
                                .then((a) => {
                                    let $ = cheerio.load(a.data);
                                    let content = $("#ItemList").text().trim();
                                    if (!content) return reject({
                                        msg: "Video tidak ditemukan!"
                                    });
                                    let json = JSON.parse(content);
                                    let result = json.map((a) => a.innerHTML).map((a) => ({
                                        title: a.name,
                                        thumbnail: a.thumbnailUrl[0],
                                        uploaded: new Date(a.uploadDate).toLocaleString(),
                                        stats: {
                                            watch: a.interactionStatistic[0].userInteractionCount,
                                            likes: a.interactionStatistic[1].userInteractionCount,
                                            comment: a.commentCount,
                                            share: a.interactionStatistic[2].userInteractionCount,
                                        },
                                        author: {
                                            name: a.creator.mainEntity.name,
                                            alt_name: a.creator.mainEntity.alternateName,
                                            bio: a.creator.mainEntity.description,
                                            avatar: a.creator.mainEntity.image,
                                            stats: {
                                                likes: a.creator.mainEntity.interactionStatistic[0].userInteractionCount,
                                                followers: a.creator.mainEntity.interactionStatistic[1].userInteractionCount
                                            }
                                        },
                                        url: a.url
                                    }));
                                    resolve(result);
                                })
                                .catch((error) => {
                                    reject({
                                        msg: error.message
                                    });
                                });
                        });
                    }

                    async function download(url) {
                        return new Promise(async (resolve, reject) => {
                            await axios.get(url).then((a) => {
                                    let $ = cheerio.load(a.data);
                                    let result = {
                                        metadata: {},
                                        download: null
                                    };
                                    let json = JSON.parse($("#VideoObject").text().trim());
                                    result.metadata.title = json.name;
                                    result.metadata.thumbnail = json.thumbnailUrl[0];
                                    result.metadata.uploaded = new Date(json.uploadDate).toLocaleString();
                                    result.metadata.comment = json.commentCount;
                                    result.metadata.watch = json.interactionStatistic[0].userInteractionCount;
                                    result.metadata.likes = json.interactionStatistic[1].userInteractionCount;
                                    result.metadata.share = json.interactionStatistic[2].userInteractionCount;
                                    result.metadata.author = json.creator.mainEntity.name;
                                    result.download = json.contentUrl;
                                    resolve(result);
                                })
                                .catch((error) => {
                                    reject({
                                        msg: error.message
                                    });
                                });
                        });
                    }

                    async function albumMessage(jid, medias, options) {

                        options = {
                            ...options
                        };
                        if (typeof jid !== "string") throw new TypeError(`jid must be string, received: ${jid} (${jid?.constructor?.name})`);
                        for (const media of medias) {
                            if (!media.type || (media.type !== "image" && media.type !== "video")) throw new TypeError(`medias[i].type must be "image" or "video", received: ${media.type} (${media.type?.constructor?.name})`);
                            if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data))) throw new TypeError(`medias[i].data must be object with url or buffer, received: ${media.data} (${media.data?.constructor?.name})`);
                        }
                        if (medias.length < 2) throw new RangeError("Minimum 2 media");

                        const caption = options.text || options.caption || "";
                        const delay = !isNaN(options.delay) ? options.delay : 500;
                        delete options.text;
                        delete options.caption;
                        delete options.delay;

                        const album = generateWAMessageFromContent(jid, proto.Message.fromObject({
                            messageContextInfo: {
                                messageSecret: new Uint8Array(crypto.randomBytes(32))
                            },
                            albumMessage: {
                                expectedImageCount: medias.filter(media => media.type === "image").length,
                                expectedVideoCount: medias.filter(media => media.type === "video").length,
                                ...(options.quoted ? {
                                    contextInfo: {
                                        remoteJid: options.quoted.key.remoteJid,
                                        fromMe: options.quoted.key.fromMe,
                                        stanzaId: options.quoted.key.id,
                                        participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                                        quotedMessage: options.quoted.message
                                    }
                                } : {})
                            }
                        }), {});

                        await rinn.relayMessage(album.key.remoteJid, album.message, {
                            messageId: album.key.id
                        });

                        for (const i in medias) {
                            const {
                                type,
                                data
                            } = medias[i];
                            const img = await generateWAMessage(album.key.remoteJid, {
                                [type]: data,
                                ...(i === "0" ? {
                                    caption
                                } : {})
                            }, {
                                upload: rinn.waUploadToServer
                            });
                            img.message.messageContextInfo = {
                                messageSecret: new Uint8Array(crypto.randomBytes(32)),
                                messageAssociation: {
                                    associationType: 1,
                                    parentMessageKey: album.key
                                }
                            };
                            await rinn.relayMessage(img.key.remoteJid, img.message, {
                                messageId: img.key.id
                            });
                            await require('@whiskeysockets/baileys').delay(delay);
                        }
                        return album;
                    }

                    try {
                        if (!text) return Nreply(`Masukkan kata kunci yang ingin dicari! Contoh penggunaan: ${prefix + command} <kata kunci>`);

                        const query = text.trim();
                        const result = await search(query);

                        if (result.length === 0) {
                            return Nreply('Tidak ada hasil yang ditemukan.');
                        }

                        const mediaList = await Promise.all(result.map(async item => {
                            const videoDetails = await download(item.url);
                            return {
                                type: "video",
                                data: {
                                    url: videoDetails.download
                                }
                            };
                        }));

                        await albumMessage(m.chat, mediaList, {
                            caption: `Hasil pencarian SnackVideo untuk "${query}":`,
                            quoted: m
                        });
                        setLimit(m, db)

                    } catch (error) {
                        console.error('Error searching SnackVideo:', error);
                        Nreply('Terjadi kesalahan saat mencari konten di SnackVideo.');
                    }
                }
                break;
                case 'spotify': {
                if (!isLimit) return Nreply(mess.limit)
                    if (!args.length) {
                        rinn.sendMessage(m.chat, {
                            text: `Masukan judul/link!\ncontoh:\n\n${prefix + command} 1番輝く星\n${prefix + command} https://open.spotify.com/track/xxxxx`
                        }, {
                            quoted: m
                        });
                        return;
                    }

                    try {
                        const query = args.join(' ');
                        const spotifyRegex = /^https?:\/\/open\.spotify\.com\/(track|album|playlist)\/[\w\-]+/;

                        if (spotifyRegex.test(query)) {} else {
                            try {
                                console.log('Mencari dengan keyword:', query);
                                const searchRes = await axios.get(`https://vapis.my.id/api/spotifys?q=${encodeURIComponent(query)}`);

                                if (!searchRes.data || !searchRes.data.data || !searchRes.data.data.length) {
                                    throw new Error('Lagu tidak ditemukan');
                                }

                                const tracks = searchRes.data.data.slice(0, 10);

                                searchResults.set(m.sender, tracks);
                                setState(m.sender, 'awaiting_selection', {
                                    tracks
                                });

                                let sections = tracks.map((track, index) => ({
                                    title: "Pilih lagu",
                                    rows: [{
                                        title: `${index + 1}. ${track.nama}`,
                                        description: `${track.artis}`,
                                        id: `.${index + 1}`
                                    }]
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
                                    quoted: m
                                });
                                setLimit(m, db)
                            } catch (error) {
                                console.error('Error pencarian:', error);
                                throw error;
                            }
                        }
                    } catch (e) {
                        console.error("Error pada fitur spotify:", e);
                        await Nreply(`Error: ${e.message}`);
                    }
                }
                break;
                case 'igreels': {
                    if (!args.length) {
                        await Nreply(`Masukan kata kunci!\ncontoh:\n\n${prefix + command} Alya`);
                        return;
                    }

                    try {
                        await reactionMessage('🕐');

                        const query = args.join(' ');
                        const response = await axios.get(`https://api.vreden.my.id/api/instagram/reels?query=${encodeURIComponent(query)}`);

                        if (!response.data.result.media || response.data.result.media.length === 0) {
                            await Nreply('Tidak ada reels ditemukan. Silakan coba kata kunci lain.');
                            return;
                        }

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

                        StateManager.setState(m.sender, 'igreels_search', {
                            reels: reels,
                            currentIndex: 0,
                            query: query,
                            itemKey: 'reels'
                        });

                        await rinn.sendMessage(m.chat, {
                            video: {
                                url: reels[0].url
                            },
                            caption: `${reels[0].caption}\n\n*Hasil pencarian untuk:* "${query}"\n*Reels:* 1/${reels.length}\n\nKetik *.next* untuk reels selanjutnya\nKetik *.stop* untuk berhenti`,
                            gifPlayback: false
                        }, {
                            quoted: m
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

                        await Nreply(errorMsg);
                    }
                }
                break;
                case "next": {
                    await handleNext(rinn, m, sender, 'pinterest', 'igreels');
                }
                break;
                case "stop": {
                    await handleStop(rinn, m, sender, 'pinterest', 'igreels');
                }
                break;
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "10": {
                    const userState = getState(m.sender);

                    if (!userState || userState.state !== 'awaiting_selection') {
                        return;
                    }

                    const selectedIndex = parseInt(command) - 1;
                    const tracks = userState.data.tracks;

                    if (selectedIndex < 0 || selectedIndex >= tracks.length) {
                        await Nreply('Nomor tidak valid. Silakan pilih nomor yang benar.');
                        return;
                    }

                    try {
                        const selectedTrack = tracks[selectedIndex];

                        await rinn.sendMessage(m.chat, {
                            text: `⌛ Sedang memproses audio...\n\n*Judul:* ${selectedTrack.nama}\n*Artis:* ${selectedTrack.artis}\n*Url:* ${selectedTrack.link}\n\n_Gunakan spotifydl jika terjadi error_`
                        }, {
                            quoted: m
                        });

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
                            quoted: m
                        });

                        userStates.delete(m.sender);

                    } catch (error) {
                        console.error('Error downloading:', error);
                        await Nreply(`Gagal mengunduh lagu: ${error.message}`);
                    }
                }
                break;
                case "cancel": {
                    const userState = getState(m.sender);
                    if (userState && userState.state === 'awaiting_selection') {
                        userStates.delete(m.sender);
                        await Nreply('Pencarian dibatalkan.');
                    }
                }
                break;
                
                // Sticker Menu
                case 's': case 'sticker': case 'swm': {
				if (!/image|video|sticker/.test(mime)) return Nreply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Image/Video/Gif 1-9 Detik`)
				let media = await quoted.download()
				let teks1 = text.split`|`[0] ? text.split`|`[0] : ''
				let teks2 = text.split`|`[1] ? text.split`|`[1] : ''
					let packname = teks1 || packnames;
                    let author = teks2 || authors;

                        if (/image|webp/.test(mime)) {
            await rinn.sendImageAsSticker(m.chat, media, m, { 
                pack: packname, 
                author: author, 
                quality: 100,
                type: 'full',
                resolution: 512,
                removebg: true,
                cropPosition: 'center'
            });
				} else if (/video/.test(mime)) {
					if ((qmsg).seconds > 11) return Nreply('Maksimal 10 detik!')
					await rinn.sendAsSticker(m.chat, media, m, { pack: packname, author: author })
				} else {
					Nreply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Video/Gif 1-9 Detik`)
				}
			}
			break;
            case 'stikersearch': {
                    if (!args.length) {
                        await m.reply(`Masukan kata kunci!\ncontoh:\n\n${prefix + command} Genshin impact`);
                        return;
                    }

                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                    try {
                        const query = args.join(' ');
                        const result = await restapi.stickerSearch(query);

                        if (!result || !result.result || !result.result.sticker || result.result.sticker.length === 0) {
                            await m.reply('Tidak ada stiker ditemukan. Silakan coba kata kunci lain.');
                            return;
                        }

                        const stickers = result.result.sticker;
                        const stickerSetTitle = result.result.title || 'Sticker Set';
                        const sAuthor = result.result.author;

                        const caption = `*Hasil pencarian stiker:* "${query}"\n*Set Stiker:* ${stickerSetTitle}\n*Total Stiker:* ${stickers.length}`;

                        if (stickers.length > 0) {
                            await rinn.sendImageAsSticker(m.chat, stickers[0], m, {
                                pack: stickerSetTitle,
                                author: sAuthor
                            });
                        }

                        if (stickers.length > 1) {
                            const remainingStickers = stickers.slice(1);

                            for (const stickerUrl of remainingStickers) {
                                await rinn.sendImageAsSticker(m.sender, stickerUrl, m, {
                                    pack: stickerSetTitle,
                                    author: sAuthor
                                });

                                await delay(5000);
                            }

                            await m.reply(`Sisa ${remainingStickers.length} stiker telah dikirim ke chat pribadi Anda.`);
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

                        await m.reply(errorMsg);
                    }
                }
                break;
                case 'smeme': {
                    if (!/webp/.test(mime) && /image|sticker/.test(mime)) {
                        if (!text) return Nreply(`Penggunaan: ${prefix + command} teks atas|teks bawah\nIsi dengan "_" jika ingin salah satu bagian kosong`);

                        atas = text.split('|')[0] ? text.split('|')[0] : '';
                        bawah = text.split('|')[1] ? text.split('|')[1] : '';


                        let mediaPath = await rinn.downloadAndSaveMediaMessage(quoted);

                        let mediaBuffer = fs.readFileSync(mediaPath);

                        let mem;
                        try {
                            mem = await Uploader.catbox(mediaBuffer);

                            fs.unlinkSync(mediaPath);

                            let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`;

                            await rinn.sendImageAsSticker(m.chat, meme, m, {
                                packname: packnames,
                                author: authors
                            });
                        } catch (err) {
                            console.error('Error in smeme:', err);

                            if (fs.existsSync(mediaPath)) {
                                fs.unlinkSync(mediaPath);
                            }

                            try {
                                mem = await Uploader.Uguu(mediaBuffer);

                                let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`;

                                await rinn.sendImageAsSticker(m.chat, meme, m, {
                                    packname: packnames,
                                    author: authors
                                });
                            } catch (altErr) {
                                console.error('All uploaders failed:', altErr);
                                return Nreply('Gagal mengupload gambar. Coba lagi nanti.');
                            }
                        }
                    } else {
                        Nreply(`Kirim atau balas gambar dengan caption ${prefix + command} teks_atas|teks_bawah untuk membuat meme!`);
                    }
                }
                break;
                case 'qc': {
                if (!isLimit) return Nreply(mess.limit)
                    let text, orang;

                    if (m.quoted) {
                        const quotedMsg = m.quoted;
                        text = quotedMsg.text || '';
                        if (!text) {
                            return Nreply('Pesan yang di-reply harus mengandung text!');
                        }
                        orang = quotedMsg.sender || quotedMsg.participant || m.quoted.key.participant;
                    }

                    else {
                        if (!args[0]) {
                            return Nreply('Mana teksnya?');
                        }
                        text = args.join(' ');
                        orang = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.sender;
                    }

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

                    let backgroundColor = '#2E4053';
                    for (const [flag, color] of Object.entries(colorMap)) {
                        if (text.includes(flag)) {
                            backgroundColor = color;
                            text = text.replace(flag, '').trim();
                            break;
                        }
                    }

                    const avatar = await rinn.profilePictureUrl(orang).catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg');
                    const number = await rinn.getName(orang);

		    let res = await scraper.quotedLyo(text, number, avatar, null, backgroundColor);
                    await rinn.sendImageAsSticker(m.chat, Buffer.from(res.result.image, 'base64'), m, { pack: packnames, author: authors })
                    setLimit(m, db)
                }
                break;
                            case 'brat': {
				if (!text && (!m.quoted || !m.quoted.text)) return Nreply(`Kirim/reply pesan *${prefix + command}* Teksnya`)

				try {
					await rinn.sendMessage(m.chat, { text: 'Pilih tipe brat', buttons: [
      { 
        buttonId: '.bratimg ' + (text || m.quoted.text),
        buttonText: { displayText: 'Gambar' }
      },
      { 
        buttonId: '.bratvid ' + (text || m.quoted.text),
        buttonText: { displayText: 'Video' }
      }], contextInfo: {
				externalAdReply: {
					title: 'Sticker Preview',
					body: 'Preview',
					previewType: "PHOTO",
					thumbnail: null,
					sourceUrl: null
				}
            }
				}, { quoted: m })
					} catch (e) {
						console.log(e)
						Nreply('Kesalahan saat mengirim pesan')
					}
			}
			break;
			case 'bratimg': {
				if (!text && (!m.quoted || !m.quoted.text)) return Nreply(`Kirim/reply pesan *${prefix + command}* Teksnya`)
				try {
					await rinn.sendImageAsSticker(m.chat, `https://fgsi1-brat.hf.space/?text=${encodeURIComponent(text || m.quoted.text)}&modeBlur=true`, m, { pack: packnames, author: authors })
				} catch (e) {
					try {
						await rinn.sendImageAsSticker(m.chat, 'https://brat.caliphdev.com/api/brat?text=' + (text || m.quoted.text), m, { pack: packnames, author: authors })
					} catch (e) {
						console.log(e)
						Nreply('Server Brat Sedang Offline!')
					}
				}
			}
			break;
			case 'bratvid': {
				if (!text && (!m.quoted || !m.quoted.text)) return Nreply(`Kirim/reply pesan *${prefix + command}* Teksnya`)
				try {
						const res = await axios.get(`https://fgsi1-brat.hf.space/?text=${encodeURIComponent(text || m.quoted.text)}&modeBlur=true&isVideo=true`, { responseType: 'arraybuffer' });

					rinn.sendAsSticker(m.chat, Buffer.from(res.data), m, { pack: packnames, author: authors })
					
				} catch (e) {
					console.log(e)
					Nreply('Terjadi Kesalahan Saat Memproses Permintaan!')
				}
			}
			break;
                
                // Tool Menu
                case 'ambilsw':
                case 'getsw': {
                    if (m.isGroup) return Nreply("❌ Command ini hanya bisa digunakan di chat pribadi!");

                    const quoted = m.quoted || m;
                    if (!quoted) return Nreply("📌 Balas pesan gambar/video yang ingin diambil!");

                    const mime = (quoted.m || quoted).mimetype || '';

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

                    return Nreply("❌ Hanya bisa mengambil gambar atau video dari pesan yang dikutip!");
                }
                break;
                case 'readerqr':
                case 'bacaqr':
                    if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.quotedMessage) {
                        return rinn.sendMessage(m.chat, {
                            text: "❌ Harap reply gambar QR Code untuk membacanya."
                        }, {
                            quoted: m
                        });
                    }

                    let quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;

                    if (!quotedMessage.imageMessage) {
                        return rinn.sendMessage(m.chat, {
                            text: "❌ Harap reply gambar QR Code, bukan teks atau media lain."
                        }, {
                            quoted: m
                        });
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
                                return rinn.sendMessage(m.chat, {
                                    text: "❌ Gagal membaca gambar QR Code."
                                }, {
                                    quoted: m
                                });
                            }

                            const qr = new qrCodeReader();
                            qr.callback = (error, result) => {
                                if (error || !result) {
                                    return rinn.sendMessage(m.chat, {
                                        text: "❌ QR Code tidak valid atau tidak ditemukan."
                                    }, {
                                        quoted: m
                                    });
                                }

                                rinn.sendMessage(m.chat, {
                                    text: `✅ Hasil QR Code: ${result.result}`
                                }, {
                                    quoted: m
                                });
                            };

                            qr.decode(image.bitmap);
                        });

                    } catch (error) {
                        console.error("Error membaca QR:", error);
                        rinn.sendMessage(m.chat, {
                            text: "❌ Terjadi kesalahan saat membaca QR Code."
                        }, {
                            quoted: m
                        });
                    }

                    break;
                    case 'toimg': {
                    try {
                        if (!m.quoted) {
                            await Nreply('Reply stiker yang ingin diubah menjadi gambar');
                            return;
                        }

                        const mime = (m.quoted.msg || m.quoted).mimetype || '';


                        if (!mime.includes('webp')) {
                            await Nreply('Pesan yang di-reply harus berupa stiker');
                            return;
                        }

                        const buffer = await m.quoted.download();

                        await rinn.sendMessage(m.chat, {
                            image: buffer,
                            caption: 'Nih hasil convert stikernya'
                        }, {
                            quoted: m
                        });

                    } catch (error) {
                        console.error('Error in toimg:', error);
                        await Nreply(`Terjadi kesalahan saat mengkonversi stiker: ${error.message}`);
                    }
                }
                case 'togif': {
                    try {
                        if (!m.quoted) {
                            await Nreply('Reply stiker yang ingin diubah menjadi video gif');
                            return;
                        }

                        const mime = (m.quoted.msg || m.quoted).mimetype || '';

                        if (!mime.includes('webp')) {
                            await Nreply('Pesan yang di-reply harus berupa stiker');
                            return;
                        }

                        const media = await m.quoted.download();

                        const url = await require('./App/function/tovideo').convert(media);

                        await rinn.sendMessage(m.chat, {
                            video: {
                                url: url
                            },
                            caption: 'Ini dia'
                        }, {
                            quoted: m
                        });

                    } catch (error) {
                        console.error('Error in tovideo:', error);
                        await Nreply(`Terjadi kesalahan saat mengkonversi ke video: ${error.message}`);
                    }
                }
                break;
                case 'removebg':
                case 'enhance':
                case 'upscale':
                case 'restore':
                case 'colorize': {
                    await handlePxpic(rinn, m, sender, quoted, mime, command);
                }
                break;
                case 'upload': {
                if (!isLimit) return Nreply(mess.limit)
                    await Mirror(m, rinn, Nreply, args, prefix, command, m);
                    setLimit(m, db)
                }
                break;
case 'tourl': {
    if (!/image/.test(mime) && !/video/.test(mime) && !/audio/.test(mime)) {
        return Nreply("Kirim atau balas dengan gambar, video, atau file audio dong.");
    }

    const args = m.text.trim().split(" ");
    const selectedServiceName = args[1]?.toLowerCase(); 

    const UPLOAD_SERVICES = {
        "pomf": {
            service: Pomf,
            description: "Image, Video, Audio, etc (Exp: never)"
        },
        "quax": {
            service: Quax,
            description: "Image, Video, Audio (Exp: never)"
        },
        "videy": {
            service: Videy,
            description: "Video (Exp: never)"
        },
        "fasturl": {
            service: FastUrl,
            description: "Any (Exp: never)"
        },
        "catbox": {
            service: Catbox,
            description: "Any (Exp: never)"
        },
        "uguu": {
            service: Uploader.Uguu,
            description: "Any (Exp: 3h)"
        },
        "cloudkuimg": {
	    service: async (buffer) => {
                const { response } = await require('cloudku-uploader')(await buffer);
                if (response && response.url) {
                    return response.url; // Return the uploaded file URL
                }
                Nreply("Gagal upload ke CloudkuImg");
            },
            description: "Image, Video, Audio (Exp: Never)"
        }
    };

    const selectedService = UPLOAD_SERVICES[selectedServiceName];
    if (!selectedService) {
        const availableServices = Object.entries(UPLOAD_SERVICES)
            .map(([name, { description }]) => `- ${name}: ${description}`)
            .join("\n");
        return Nreply(`Nama layanan gak valid! Coba pake salah satu ini:\n${availableServices}\n\nCara pakenya: .tourl namaProvider`);
    }

    let media;
    try {
        media = await quoted.download();
        if (!media) {
            throw new Error("Gagal mengunduh media");
        }

        const result = await selectedService.service(media);

        await Nreply(`✨ *Media to URL Uploader*\n> 🌐 *Platform:* ${selectedServiceName.toUpperCase()}!\n> 📂 *Ukuran media:* ${Func.getSizeMedia(media)}\n> 🔗 *Tautan:* ${result}\n\n💡 *Tips:* Gunakan fitur ini untuk berbagi media dengan lebih mudah tanpa perlu mengunggah ulang.`);
        
    } catch (error) {
        Nreply(`Oops, ada yang salah waktu upload: ${error.message}`);
        console.log(error)
    }
}
break;

                // User Menu
                case 'listprem': {
                    let txt = `*🌟 DAFTAR PENGGUNA PREMIUM 🌟*\n\n`;
                    let men = [];
                    if (premium.length === 0) {
                        txt += `Tidak ada pengguna premium saat ini. 🫤`;
                    } else {
                        for (let i of premium) {
                            men.push(i.id);
                            txt += ` · *Nomor*: +${i.id.split('@')[0]}\n`;
                            if (i.expired === 'PERMANENT') {
                                txt += ` · *Kadaluwarsa*: PERMANEN ♾️\n\n`;
                            } else {
                                let anu = ms(i.expired - Date.now());
                                txt += ` · *Kadaluwarsa*: ${anu.days}h, ${anu.hours}j, ${anu.minutes}m\n`;
                                txt += ` · *Limit*: ${db.data.users[i.id].limit}\n`;
                                txt += ` · *Uang*: Rp${db.data.users[i.id].uang.toLocaleString('id-ID')}\n\n`;
                            }
                        }
                    }
                    Nreply(txt);
                }
                break;
                case 'reportbug': {
                    if (!text) return Nreply(`Contoh: ${prefix + command} woi, error nih😡`);
                    textt = `*| REPORTBUG |*`;
                    teks1 = `\n\n*User* : @${m.sender.split("@")[0]}\n*Bug* : ${text}`;
                    teks2 = `\n\n*Hii ${pushname}, laporan sudah dikirim ke owner*`;
                    rinn.sendMessage(owner + "@s.whatsapp.net", {
                        text: textt + teks1,
                        mentions: [m.sender],
                    }, {
                        quoted: m,
                    });
                    rinn.sendMessage(m.chat, {
                        text: textt + teks2 + teks1,
                        mentions: [m.sender],
                    }, {
                        quoted: m,
                    });
                }
                break;
                case 'profile': {
				const user = Object.keys(db.users)
				const infoUser = db.users[m.sender]
				let txt = `*❏ INFORMASI DATA*\n\n`;
                    txt += `▧ *Nama:* ${pushname || 'Guest'}\n`;
                    txt += `▧ *User Bot:* ${user.includes(m.sender) ? 'True' : 'False'}\n`;
                    txt += `▧ *Status:* ${isPremium ? 'PREMIUM' : 'FREE'}\n`
                    txt += `▧ *Sisa Limit:* ${infoUser.limit}\n`;
                    txt += `▧ *Sisa Uang:* ${infoUser ? infoUser.uang.toLocaleString('id-ID') : '0'}\n\n`;
                    txt += `*Gunakan fitur dengan bijak ya!* 🌟`;
				await Nreply(txt)
			}
			break;
            case 'leaderboard': {
				const entries = Object.entries(db.users).sort((a, b) => b[1].uang - a[1].uang).slice(0, 10).map(entry => entry[0]);
				let teksnya = '╭──❍「 *LEADERBOARD* 」❍\n'
				for (let i = 0; i < entries.length; i++) {
					teksnya += `│• ${i + 1}. @${entries[i].split('@')[0]}\n│• Balance : ${db.users[entries[i]].uang.toLocaleString('id-ID')}\n│\n`
				}
				Nreply(teksnya + '╰──────❍');
			}
			break;
            case 'daily': {
                const Nzreply = await Nreply
				daily(m, Nzreply, db)
			}
			break;
			case 'transfer': case 'tf': {
			    const Nzreply = await Nreply
				transfer(m, Nzreply, args, db)
			}
			break;
			case 'buy': {
			    const Nzreply = await Nreply
				buy(m, Nzreply, args, db)
			}
			break;
			case 'jadibot': {
				if (!isPremium) return Nreply(mess.prem)
				if (!isLimit) return Nreply(mess.limit)
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
				const onWa = await rinn.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return Nreply('Nomer Tersebut Tidak Terdaftar Di Whatsapp!')
				await JadiBot(rinn, nmrnya, m)
				Nreply(`Gunakan ${prefix}stopjadibot\nUntuk Berhenti`)
				setLimit(m, db)
			}
			break;
			case 'stopjadibot': case 'deljadibot': {
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
				const onWa = await rinn.onWhatsApp(nmrnya)
				if (!onWa.length > 0) return Nreply('Nomer Tersebut Tidak Terdaftar Di Whatsapp!')
				await StopJadiBot(rinn, nmrnya, m)
			}
			break;
			case 'listjadibot': {
				ListJadiBot(rinn, m)
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
                            return rinn.sendMessage(m.chat, {
                                text: bang
                            }, {
                                quoted: m
                            });
                        }
                        try {
                            Nreply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)));
                        } catch (e) {
                            rinn.sendMessage(m.chat, {
                                text: String(e)
                            }, {
                                quoted: m
                            });
                        }
                    }

                    if (budy.startsWith('<')) {
                        if (!isCreator) return;
                        let kode = budy.trim().split(/ +/)[0];
                        let teks;
                        try {
                            teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
                        } catch (e) {
                            teks = e;
                        } finally {
                            await rinn.sendMessage(m.chat, {
                                text: require('util').format(teks)
                            }, {
                                quoted: m
                            });
                        }
                    }

                    if (budy.startsWith('$')) {
                        if (!isCreator) return;
                        exec(budy.slice(2), (error, stdout) => {
                            if (error) return rinn.sendMessage(m.chat, {
                                text: `${error}`
                            }, {
                                quoted: m
                            });
                            if (stdout) return rinn.sendMessage(m.chat, {
                                text: stdout
                            }, {
                                quoted: m
                            });
                        });
                    }
            }
        }
    const historyFile = './storage/data/autoai.json';
function saveHistory(m, message) {
    let history = {};
    if (fs.existsSync(historyFile)) {
        history = JSON.parse(fs.readFileSync(historyFile));
    }
    history[m.sender] = history[m.sender] || [];
    history[m.sender].push(message);
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
              
              if (data.status !== true) return Nreply('Pencarian gagal! Coba lagi nanti.');
              
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
              return Nreply('Terjadi kesalahan saat mencari musik!');
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
              let data = await Func.fetchJson(`https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`);
              return Nreply(`*🏙 Cuaca Kota ${data.name}*\n\n*🌤️ Cuaca :* ${data.weather[0].main}\n*📝 Deskripsi :* ${data.weather[0].description}\n*🌡️ Suhu Rata-rata :* ${data.main.temp} °C\n*🤔 Terasa Seperti :* ${data.main.feels_like} °C\n*🌬️ Tekanan :* ${data.main.pressure} hPa\n*💧 Kelembapan :* ${data.main.humidity}%\n*🌪️ Kecepatan Angin :* ${data.wind.speed} Km/h\n*📍Lokasi :*\n- *Bujur :* ${data.coord.lat}\n- *Lintang :* ${data.coord.lon}\n*🌏 Negara :* ${data.sys.country}`);
          } catch (e) {
              return Nreply('Kota Tidak Di Temukan!\n\nContoh :\ncuaca bekasi');
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
              Nreply('_Sedang Memproses Gambar..._');
              let apiUrl = `https://api.rynn-archive.biz.id/ai/flux-schnell?text=${encodeURIComponent(text)}`;
              let response = await fetch(apiUrl);
              let buffer = await response.buffer();
              return rinn.sendMessage(m.chat, { 
                  image: buffer, 
                  caption: '*Ini hasil gambarnya kak :v*\n\n> Maaf jika tidak sesuai harapan 😔' 
              }, { quoted: m });
          } catch (error) {
              console.error('Error in flux:', error);
              return Nreply('Terjadi kesalahan saat memproses gambar');
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
              return Nreply('Maaf, terjadi kesalahan saat memproses gambar. Silakan coba lagi nanti atau hubungi pemilik bot jika masalah berlanjut.');
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
  return Nreply("⚠️ *Terjadi kesalahan, coba lagi nanti!*");
}
    } catch (error) {
        console.error(error);
        // await m.reply(`Maaf, terjadi kesalahan: ${error.message}`);
        rinn.sendFromOwner(owner, 'Halo sayang, sepertinya ada yang error nih, jangan lupa diperbaiki ya\n\n*Log error:*\n\n' + util.format(error), m, { contextInfo: { isForwarded: true }})
    }

};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mwas updated!\x1b[0m');
    delete require.cache[file];
    require(file);
});
