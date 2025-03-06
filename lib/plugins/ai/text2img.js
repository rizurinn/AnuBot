const axios = require('axios');
const generateImage = require('../../handlers/genImg');

// Penguna Esm
// import axios from 'axios';

/*
 * Generates an image based on the given prompt
 * By Nyxz: https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J
 *
 * @async
 * @function generateImage
 * @param {Object} options - Configuration options for generating the image.
 * @param {string} options.prompt - Description or prompt for the image generation.
 * @returns {Promise<Object>} A promise that resolves to an object:
 *  - On success: { status: true, data: Buffer } where data is the JPEG image buffer.
 *  - On failure: { status: false, msg: string } where msg is the error message.
 */

let yukio = async (m, {
    rinn,
    text,
    sender
}) => {
    if (!text) m.reply('⚠️ Masukan Kata Kata Teks');

    try {
        // Scrape
        const texttoimg = await generateImage({
            prompt: text
        })
        // Gagal Dapat Metadata
        if (!texttoimg.data) return m.reply('gagal dapat image, nya😂')

        // Kirim File Foto Nya
        await rinn.sendMessage(sender, {
            image: texttoimg.data,
            caption: 'nih😄'
        }, {
            quoted: m
        })
    } catch (err) {
        m.reply('gomenazai error: ' + err)
        console.log('Error text2img: ' + err)
    }
}

yukio.command = ['texttoimg', 'txt2img']
yukio.description = 'Generate text ke gambar';
yukio.category = 'ai';

module.exports = yukio;
