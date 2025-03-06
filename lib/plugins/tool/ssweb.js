const fetch = require('node-fetch');

let handler = async (m, { rinn, text }) => {   
    if (!text) return m.reply('❌ Masukkan URL yang ingin di-screenshot!\n\nContoh: *.ssweb https://example.com*');

    try {
        let ssweb = `https://velyn.vercel.app/api/tools/ssweb?url=${encodeURIComponent(text)}`;
        let res = await fetch(ssweb);
        
        if (!res.ok) throw new Error(`❌ Gagal mengambil screenshot!`);

        const contentType = res.headers.get('content-type');
        
        if (contentType && contentType.includes('image')) {
            const buffer = await res.buffer();
            await rinn.sendFile(m.chat, buffer, 'screenshot.jpg', `✅ Screenshot berhasil diambil:\n${text}`, m);
        } else {
            try {
                let json = await res.json();
                if (!json.status || !json.result) throw new Error(`❌ API tidak mengembalikan data yang valid!`);
                let imageUrl = json.result;
                await rinn.sendFile(m.chat, imageUrl, 'screenshot.jpg', `✅ Screenshot berhasil diambil:\n${url}`, m);
            } catch (jsonError) {
                throw new Error(`❌ Format respons tidak valid: ${jsonError.message}`);
            }
        }
    } catch (e) {
        console.error(e);
        m.reply(`❌ Error: ${e.message}`);
    }
};

handler.command = ['ssweb'];
handler.category = 'tools';
handler.description = 'Skrinsut web dengan link';

module.exports = handler;
