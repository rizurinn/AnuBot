const axios = require('axios');

async function Screenshot(url) {
    try {
        const response = await axios.get(`https://image.thum.io/get/png/fullpage/viewportWidth/2400/${url}`, {
            responseType: 'arraybuffer'
        })

        return {
            status: 200,
            type: 'image/png',
            buffer: response.data
        }
    } catch (err) {
        throw Error(err.message)
    }
}

let handler = async (m, { rinn, Nreply, text }) => {   
    if (!text) return Nreply('Masukkan URL yang ingin di-screenshot!\n\nContoh: *.ssweb https://google.com*');

    try {
        let result = await Screenshot(text)
        
        rinn.sendMessage(m.chat, {image: result.buffer, mimetype: result.type, caption: `${text}` }, {quoted: m})
    } catch (err) {
        Nreply(err.message)
    }
};

handler.command = ['ssweb'];
handler.category = 'tool';
handler.description = 'Skrinsut web dengan link';

module.exports = handler;
