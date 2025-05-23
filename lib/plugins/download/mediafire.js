const axios = require('axios');

let handler = async (m, { text, rinn, Nreply, Func }) => {
  if (!text) return Nreply('Masukkan URL MediaFire-nya.');
  try {
    let { data } = await axios.get('https://fgsi1-restapi.hf.space/api/downloader/mediafire?url=' + encodeURIComponent(text));
    if (!data.status) throw 'Gagal mengambil data';
    let { downloadUrl, filename, size } = data.data;
    let Nsize = Func.bytesToSize(size)
    let mediaFireInfo = `
*MediaFire Downloader*
━━━━━━━━━━━━━━━━━

*📁 File Name:* ${filename || 'Unknown'}
*📊 File Size:* ${Nsize || 'Unknown'}
*🔗 Url:* ${downloadUrl}`;
    Nreply(mediaFireInfo)
    await rinn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      fileName: filename,
      mimetype: 'application/zip'
    }, { quoted: m });
  } catch (e) {
    Nreply('Gagal mengambil file : ' + e);
  }
};

handler.command = ['mediafire', 'mfdl'];
handler.category = ['downloader'];

module.exports = handler;
