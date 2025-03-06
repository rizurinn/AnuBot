const fetch = require ('node-fetch');
const FormData = require ('form-data');
const fs = require ('fs');

const Mirror = async (m, { rinn, args, sendMessage, prefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        let wait = await m.reply('⌛ Sedang memproses...');

        if (mime) {
            let media = await q.download();
            if (media.length > 100 * 1024 * 1024) throw 'File size terlalu besar (Max 100MB)';

            let filename = './tmp/' + Date.now() + '.' + mime.split('/')[1];
            fs.writeFileSync(filename, media);

            let formData = new FormData();
            formData.append('file', fs.createReadStream(filename));

            // Menambahkan opsi expiration time
            let expirationTime = 0; // Default value
if (args && Array.isArray(args) && args[0]) {
    expirationTime = parseInt(args[0], 10);
    if (isNaN(expirationTime) || expirationTime <= 0) {
        expirationTime = 0;  // If not valid, set to permanent
    }
}
            formData.append('expirationOption', expirationTime > 0 ? 'custom' : 'permanent');
            formData.append('expiration', expirationTime);

            let res = await fetch('https://Nauval.mycdn.biz.id/upload', {
                method: 'POST',
                body: formData
            });

            let json = await res.json();

            fs.unlinkSync(filename);

            if (json.success) {
                await sendMessage(m.chat, { text: `
📤 *FILE UPLOAD BERHASIL*

📝 *Link:* ${json.fileUrl}
⏳ *Expired:* ${expirationTime > 0 ? expirationTime + ' menit' : 'Permanent'}
📁 *Size:* ${formatSize(media.length)}

_File akan disimpan ${expirationTime > 0 ? 'selama ' + expirationTime + ' menit' : 'permanen'} di server_
                `});
            } else {
                throw 'Upload gagal: ' + json.message;
            }

        } else {
            let text = (q.text || q.contentText || q.message || '').trim();
            if (!text) throw `Reply/Kirim File atau pesan teks dengan caption *${prefix + command}*`;

            let filename = './tmp/' + Date.now() + '.txt';
            fs.writeFileSync(filename, text);

            let formData = new FormData();
            formData.append('file', fs.createReadStream(filename));

            // Menambahkan opsi expiration time
            let expirationTime = 0; // Default value
if (args && Array.isArray(args) && args[0]) {
    expirationTime = parseInt(args[0], 10);
    if (isNaN(expirationTime) || expirationTime <= 0) {
        expirationTime = 0;  // If not valid, set to permanent
    }
}
            formData.append('expirationOption', expirationTime > 0 ? 'custom' : 'permanent');
            formData.append('expiration', expirationTime);

            let res = await fetch('https://Nauval.mycdn.biz.id/upload', {
                method: 'POST',
                body: formData
            });

            let json = await res.json();

            fs.unlinkSync(filename);

            if (json.success) {
                await m.reply( `
📤 *FILE UPLOAD BERHASIL*

📝 *Link:* ${json.fileUrl}
⏳ *Expired:* ${expirationTime > 0 ? expirationTime + ' menit' : 'Permanent'}
📁 *Size:* ${formatSize(Buffer.byteLength(text, 'utf-8'))}

_File akan disimpan ${expirationTime > 0 ? 'selama ' + expirationTime + ' menit' : 'permanen'} di server_
                `);
            } else {
                throw 'Upload gagal: ' + json.message;
            }
        }

    } catch (e) {
        console.error(e);
        await m.reply(`ERROR: ${e.message}`);
    }
};

function formatSize(size) {
    if (size >= 1024 * 1024 * 1024) {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    if (size >= 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
    if (size >= 1024) {
        return (size / 1024).toFixed(2) + ' KB';
    }
    return size + ' B';
}

module.exports = Mirror;
