/*
- [ *PLUGINS GET PASTEBIN* ]
- Description: Get content from pastebin url

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/
const fetch = require('node-fetch');

const handler = async (m, { args, prefix, command, reactionMessage }) => {
  const link = args[0]?.trim();
  if (!link) {
    return m.reply(`Masukkan URL Pastebin\nContoh: *${prefix + command}* https://pastebin.com/hUsie4as`);
  }
  if (!/^https:\/\/pastebin\.com\/[a-zA-Z0-9]+$/.test(link)) {
    return m.reply('Ups, pastikan URL Pastebin yang di masukan valid');
  }
  const pasteId = link.split('/').pop(); 
  try {
    reactionMessage("⌛")

    const response = await fetch(`https://pastebin.com/raw/${pasteId}`);
    if (!response.ok) throw new Error('Gagal mengambil isi dari Pastebin.');
    const content = await response.text();
    if (!content) {
      return m.reply('Tidak ada isi yang ditemukan di Pastebin!');
    }
    m.reply(`${content}`);
  } catch (error) {
    m.reply('Error: ' + error);
  }
};

handler.command = ['pastebin'];
handler.category = ['tools'];
handler.description = 'Download dari pastebin';

module.exports = handler;