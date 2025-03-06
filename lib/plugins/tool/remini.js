const axios = require ('axios');

function randomNumber() {
  let randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, '0');
}

async function upscale(buffer) {
  const blob = new Blob([buffer], { type: 'image/png' });
  let filename = randomNumber() + '.png';
  let formData = new FormData();
  formData.append('image', {});
  formData.append('image', blob, filename);

  let { data } = await axios.post('https://api.imggen.ai/guest-upload', formData, {
    headers: {
      "content-type": "multipart/form-data",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0"
    }
  });

  let result = await axios.post('https://api.imggen.ai/guest-upscale-image', {
    image: {
      "url": "https://api.imggen.ai" + data.image.url,
      "name": data.image.name,
      "original_name": data.image.original_name,
      "folder_name": data.image.folder_name,
      "extname": data.image.extname
    }
  }, {
    headers: {
      "content-type": "application/json",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0"
    }
  });

  return `https://api.imggen.ai${result.data.upscaled_image}`;
}

let handler = async (m, { rinn, reactionMessage }) => {
  try {
    await reactionMessage('⌛');

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.startsWith('image/')) {
      throw 'Silakan kirim gambar dengan caption *hd/remini* atau reply gambar!';
    }

    let media = await q.download();
    if (!media) throw 'Gagal mengunduh gambar.';

    let upscaledUrl = await upscale(media);
    if (!upscaledUrl) throw 'Gagal melakukan Upscale gambar.';

    await reactionMessage('✅');

    await rinn.sendMessage(m.chat, {
      image: { url: upscaledUrl },
      caption: `*Done*`
    }, { quoted: m });

  } catch (error) {
    await reactionMessage('❌');
    await m.reply(`❌ *Error:* ${error.message || error}`);
  }
};

handler.command = ['hd', 'remini']
handler.description = 'Menjernihkan gambar anda';
handler.category = 'tools';

module.exports = handler;
