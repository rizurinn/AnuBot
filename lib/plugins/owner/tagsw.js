const {
    downloadContentFromMessage,
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const GROUPS_FILE = path.join(__dirname, '../../../storage/group.json');

function readGroupsData() {
    try {
        if (!fs.existsSync(GROUPS_FILE)) {
            fs.writeFileSync(GROUPS_FILE, JSON.stringify({ groups: [] }));
        }
        return JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
    } catch (error) {
        console.error('Error reading groups file:', error);
        return { groups: [] };
    }
}

function writeGroupsData(data) {
    try {
        fs.writeFileSync(GROUPS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing groups file:', error);
    }
}

let handler = async (m, {
    rinn,
    reply,
    text,
    args,
    command, 
    reactionMessage
}) => {
    await reactionMessage('⏱️')
    let NbillDB = readGroupsData();
    
    if (args[0] === 'add') {
        if (!args[1]) return m.reply('Masukkan ID grup yang ingin ditambahkan!');
        if (!NbillDB.groups.includes(args[1])) {
            NbillDB.groups.push(args[1]);
            writeGroupsData(NbillDB);
        }
        return m.reply(`Grup ${args[1]} berhasil ditambahkan!`);
    }

    if (args[0] === 'del') {
        if (!args[1]) return m.reply('Masukkan ID grup yang ingin dihapus!');
        NbillDB.groups = NbillDB.groups.filter(g => g !== args[1]);
        writeGroupsData(NbillDB);
        return m.reply(`Grup ${args[1]} berhasil dihapus!`);
    }

    if (args[0] === 'list') {
        return m.reply(`📌 *Daftar Grup Terdaftar untuk TagSW:*\n\n${NbillDB.groups.length ? NbillDB.groups.join('\n') : 'Kosong'}`);
    }

    const isBroadcast = args.includes('--bc');
    if (isBroadcast) {
        const bcIndex = args.indexOf('--bc');
        args.splice(bcIndex, 1);
    }

    const isAll = args.includes('--all');
    if (isAll) {
        const allIndex = args.indexOf('--all');
        args.splice(allIndex, 1);
    }

    let targetGroups = [];
    const groupIdRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})|(\d{18,}@g\.us)/;
    
    // Cek apakah ada ID grup yang diberikan sebagai argumen
    for (let i = 0; i < args.length; i++) {
        if (groupIdRegex.test(args[i])) {
            targetGroups.push(args[i]);
            args.splice(i, 1);
            i--;
        }
    }

    async function fetchParticipants(...jids) {
        let results = [];
        for (const jid of jids) {
            try {
                let jidToUse = jid;
                if (jid.includes('chat.whatsapp.com/')) {
                    const code = jid.split('chat.whatsapp.com/')[1];
                    const groupInfo = await rinn.groupGetInviteInfo(code);
                    jidToUse = groupInfo.id;
                }

                let { participants } = await rinn.groupMetadata(jidToUse);
                participants = participants.map(({ id }) => id);
                results = results.concat(participants);
            } catch (error) {
                console.error(`Error fetching participants from ${jid}:`, error);
                m.reply(`Gagal mengambil anggota dari grup ${jid}: ${error.message}`);
            }
        }
        return [...new Set(results)];
    }

    async function mentionStatus(jids, content) {
        const cleanContent = { ...content };
        if (cleanContent.caption) {
            cleanContent.caption = cleanContent.caption.replace(/^\.(?:upsw|tagsw)\s+/i, '');
        }
        if (cleanContent.text) {
            cleanContent.text = cleanContent.text.replace(/^\.(?:upsw|tagsw)\s+/i, '');
        }

        const msg = await generateWAMessage("status@broadcast", cleanContent, {
            upload: rinn.waUploadToServer
        });

        let statusJidList = [];
        
        try {
            // Menangani berbagai kasus untuk mendapatkan target grup
            if (isAll) {
                // Mengirim ke semua grup yang terdaftar di database
                if (NbillDB.groups.length === 0) {
                    return m.reply('Tidak ada grup yang terdaftar. Gunakan .tagsw add <idgrup> untuk menambahkan grup.');
                }
                
                for (const groupId of NbillDB.groups) {
                    try {
                        const participants = await fetchParticipants(groupId);
                        statusJidList = statusJidList.concat(participants);
                    } catch (error) {
                        console.error(`Error fetching participants from ${groupId}:`, error);
                    }
                }
            } 
            else if (isBroadcast) {
                // Mengirim ke semua anggota grup saat ini
                if (m.isGroup) {
                    const participants = await fetchParticipants(m.chat);
                    statusJidList = statusJidList.concat(participants);
                } else {
                    return m.reply('Fitur broadcast hanya bisa digunakan di grup.');
                }
            }
            else if (targetGroups.length > 0) {
                // Mengirim ke grup yang ditentukan dalam perintah
                for (const groupId of targetGroups) {
                    try {
                        const participants = await fetchParticipants(groupId);
                        statusJidList = statusJidList.concat(participants);
                    } catch (error) {
                        console.error(`Error fetching participants from ${groupId}:`, error);
                    }
                }
            }
            else if (NbillDB.groups.includes(args[0])) {
                // Jika argumen pertama adalah ID grup yang ada di database
                try {
                    const participants = await fetchParticipants(args[0]);
                    statusJidList = statusJidList.concat(participants);
                    // Hapus ID grup dari args agar tidak dianggap sebagai caption
                    args.shift();
                    if (cleanContent.text) {
                        cleanContent.text = args.join(" ");
                    }
                } catch (error) {
                    console.error(`Error fetching participants from ${args[0]}:`, error);
                }
            }
            else {
                // Default: mengirim ke grup saat ini jika di dalam grup
                if (m.isGroup) {
                    for (const jid of jids) {
                        if (jid.endsWith("@g.us")) {
                            statusJidList = statusJidList.concat(await fetchParticipants(jid));
                        } else {
                            statusJidList.push(jid);
                        }
                    }
                } else {
                    statusJidList.push(m.chat);
                }
            }
            
            // Menghapus duplikat
            statusJidList = [...new Set(statusJidList)];
            
            console.log(`Mengirim status ke ${statusJidList.length} pengguna`);
            await m.reply(`Mengirim status ke ${statusJidList.length} pengguna...`);

            if (statusJidList.length === 0) {
                return m.reply('Tidak ada pengguna yang ditemukan untuk mengirim status.');
            }

            // Mengirim status dengan mention
            await rinn.relayMessage(msg.key.remoteJid, msg.message, {
                messageId: msg.key.id,
                statusJidList,
                additionalNodes: [{
                    tag: "meta",
                    attrs: {},
                    content: [{
                        tag: "mentioned_users",
                        attrs: {},
                        content: statusJidList.map((jid) => ({
                            tag: "to",
                            attrs: {
                                jid
                            },
                            content: undefined
                        }))
                    }]
                }]
            });

            // Mengirim notifikasi ke grup (jika perlu)
            if (!isBroadcast && !isAll && targetGroups.length === 0) {
                for (const jid of jids) {
                    if (jid && (jid.endsWith("@g.us") || jid.endsWith("@s.whatsapp.net"))) {
                        let type = jid.endsWith("@g.us") ? "groupStatusMentionMessage" : "statusMentionMessage";
                        await rinn.relayMessage(jid, {
                            [type]: {
                                message: {
                                    protocolMessage: {
                                        key: msg.key,
                                        type: 25
                                    }
                                }
                            }
                        }, {
                            additionalNodes: [{
                                tag: "meta",
                                attrs: {
                                    is_status_mention: "true"
                                },
                                content: undefined
                            }]
                        });
                    }
                }
            }
            
            m.reply(`Status berhasil dikirim ke ${statusJidList.length} pengguna.`);
        } catch (error) {
            console.error('Error saat mengirim status:', error);
            m.reply(`Error saat mengirim status: ${error.message}`);
        }

        return msg;
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let content = {};

    if (mime) {
        let media = await q.download();

        if (/image/.test(mime)) {
            content.image = media;
        } else if (/video/.test(mime)) {
            content.video = media;
        } else if (/audio/.test(mime)) {
            content.audio = media;
        } else {
            return m.reply("Jenis file tidak di dukung!");
        }

        if (q.text) content.caption = q.text;
    } else if (args[0]) {
        let url = args[0];
        
        if (url.startsWith('http')) {
            let type = args[1] || 'text';

            if (type === 'image') {
                content.image = { url };
                if (args.length > 2) {
                    content.caption = args.slice(2).join(" ");
                }
            } else if (type === 'video') {
                content.video = { url };
                if (args.length > 2) {
                    content.caption = args.slice(2).join(" ");
                }
            } else if (type === 'audio') {
                content.audio = { url };
            } else {
                content.text = args.join(" ");
            }
        } else {
            content.text = args.join(" ");
        }
    } else {
        return m.reply(`Reply media atau berikan teks/URL.
Contoh:
- .tagsw Pesan status
- .tagsw https://example.com/gambar.jpg image
- .tagsw --bc (untuk broadcast ke semua anggota grup ini)
- .tagsw --all (untuk mengirim ke semua grup terdaftar)
- .tagsw add 123456789@g.us (untuk menambahkan grup ke daftar)
- .tagsw del 123456789@g.us (untuk menghapus grup dari daftar)
- .tagsw list (untuk melihat daftar grup)
- .tagsw 123456789@g.us (untuk mengirim ke ID grup tertentu)`);
    }
    
    let targets = [];
    if (targetGroups.length > 0) {
        targets = targetGroups;
    } else if (m.isGroup) {
        targets = [m.chat];
    } else if (isBroadcast) {
        return m.reply('Fitur broadcast hanya bisa digunakan di grup. Gunakan ID grup untuk broadcast dari private chat.');
    } else {
        targets = [m.chat];
    }
    
    mentionStatus(targets, content).catch(error => {
        console.error('Error:', error);
        m.reply(`Terjadi kesalahan: ${error.message}`);
    });
}

handler.command = ['tagsw', 'upsw']
handler.category = ['owner']
handler.description = 'Upload status dengan tag grup'
handler.restrict = {
    ownerOnly: true
    }

module.exports = handler;