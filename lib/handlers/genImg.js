const axios = require('axios');

async function generateImage(options = {
    prompt: "concept art forest, enchanted, portrait, digital artwork, illustrative, painterly, matte painting, highly detailed."
}) {
    try {
        const res = await axios({
            url: 'https://s9.piclumen.art/comfy/api/generate-image',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Response-Type': 'image/jpeg',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36',
            },
            data: {
                prompt: options.prompt
            },
            responseType: 'arraybuffer'
        });
        return {
            status: true,
            data: res.data
        };
    } catch (e) {
        return {
            status: false,
            msg: `An error occurred: ${e.message}`
        };
    }
}

module.exports = generateImage;
