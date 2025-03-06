const axios = require('axios');

let handler = async (m, { rinn, text }) => {
    if (!text) {
        return m.reply("Masukkan teks untuk menghasilkan gambar!");
    }

    async function magicStudio(prompt) {
        try {
            const res = await axios.get(`https://velyn.vercel.app/api/ai/magicStudio`, {
                params: { prompt },
                responseType: "arraybuffer"
            });

            const image = Buffer.from(res.data);

            if (!image || image.length <= 10240) {
                throw new Error("Gagal menghasilkan gambar atau gambar terlalu kecil.");
            }

            return { success: true, image };
        } catch (error) {
            console.error("Error in magicStudio:", error.message);
            return { success: false, error: error.message };
        }
    }

    const result = await magicStudio(text);

    if (!result.success) {
        return m.reply(`Terjadi kesalahan: ${result.error}`);
    }

    const messageOptions = {
        image: result.image,
        caption: "DONE",
        mimetype: "image/jpeg"
    };

    await rinn.sendMessage(m.chat, messageOptions, { quoted: m });
}

handler.command = ['magicstudio', 'studiomagic', 'ms'];
handler.category = 'ai';
handler.description = 'AI magicStudio dengan api';

module.exports = handler;
