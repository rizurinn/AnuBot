/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • sendht dengan id group
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l

Note : --all untuk semua group

Biar lebih simple aja dari private chat
*/

let fs = require('fs');
let path = require('path');


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
    text,
    args,
    command
}) => {
    if (!rinn || !rinn.user) {
        return await m.reply('Bot tidak terkoneksi. Silakan periksa koneksi.');
    }

    let xyzanDB = readGroupsData();

    if (!args[0]) {
        await m.reply("Gunakan: sendht idgc pesan\nAtau: sendht add idgc\nAtau: sendht del idgc\nAtau: sendht list\nAtau: sendht --all pesan");
        return;
    }

    if (args[0] === 'add') {
        if (!args[1]) return await m.reply('Masukkan ID grup yang ingin ditambahkan!');
        if (!xyzanDB.groups.includes(args[1])) {
            xyzanDB.groups.push(args[1]);
            writeGroupsData(xyzanDB);
        }
        return await m.reply(`Grup ${args[1]} berhasil ditambahkan!`);
    }

    if (args[0] === 'del') {
        if (!args[1]) return await m.reply('Masukkan ID grup yang ingin dihapus!');
        xyzanDB.groups = xyzanDB.groups.filter(g => g !== args[1]);
        writeGroupsData(xyzanDB);
        return await m.reply(`Grup ${args[1]} berhasil dihapus!`);
    }

    if (args[0] === 'list') {
        return await m.reply(`📌 *Daftar Grup Terdaftar:*\n\n${xyzanDB.groups.length ? xyzanDB.groups.join('\n') : 'Kosong'}`);
    }

    let messageText = args.slice(1).join(' ');
    if (!messageText) return await m.reply('Masukkan pesan yang ingin dikirim!');

    try {
        if (args[0] === '--all') {
            let allGroups = await rinn.groupFetchAllParticipating();
            for (let idgc of Object.keys(allGroups)) {
                try {
                    let metadata = await rinn.groupMetadata(idgc);
                    let participants = metadata.participants.map(p => p.id);
                    await rinn.sendMessage(idgc, {
                        text: messageText,
                        mentions: participants
                    });
                } catch (groupError) {
                    console.error(`Error mengirim pesan ke grup ${idgc}:`, groupError);
                }
            }
            return await m.reply('Pesan terkirim ke semua grup.');
        }

        if (!xyzanDB.groups.includes(args[0])) return await m.reply('Grup tidak ditemukan dalam daftar!');
        let metadata = await rinn.groupMetadata(args[0]);
        let participants = metadata.participants.map(p => p.id);
        await rinn.sendMessage(args[0], {
            text: messageText,
            mentions: participants
        });
        return await m.reply(`Pesan terkirim ke ${args[0]}.`);
    } catch (error) {
        console.error('Error dalam proses pengiriman:', error);
        return await m.reply('Terjadi kesalahan saat mengirim pesan. Periksa koneksi bot.');
    }
};

handler.command = ['sendht'];
handler.category = 'group';
handler.description = 'Sendht dengan id grup';
handler.restrict = {
    ownerOnly: true,
    adminOnly: true
};

module.exports = handler;