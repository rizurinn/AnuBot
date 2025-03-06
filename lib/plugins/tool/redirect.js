//*<>REDIRECT, UNTUK MENGETAHUI ISI LINK ASLI DARI LINK SHORTLINK<>*
//SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V

const axios = require ('axios');
const cheerio = require ('cheerio');

/**
 * Redirect Detective Scraper Plugin
 * @author Lang https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n/247
 * @package axios, cheerio
 * @function redirectDetective(url)
 * @wm kyah
 */
async function redirectDetective(url) {
  let formData = new URLSearchParams();
  formData.append("w", url);
  formData.append("f", "false");

  let { data } = await axios.post("https://redirectdetective.com/ld.px", formData, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "origin": "https://redirectdetective.com",
      "referer": "https://redirectdetective.com/",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);
  let redirectTo = $(".tooltips").last().text().trim();

  return {
    originalUrl: url,
    redirectTo,
  };
}

let handler = async (m, { bill, text, prefix, command }) => {
  if (!text) return m.reply(`gunakan format:\n${prefix}${command} <url>`);

  try {
    let result = await redirectDetective(text);
    if (!result.redirectTo) return m.reply("tidak ada redirect yang terdeteksi.");
    let message = `🔄 *Redirect Detective*\n\n🔹 *URL Awal:* ${result.originalUrl}\n🔹 *Redirect Ke:* ${result.redirectTo}\n\nFOLLOW: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V`;
    m.reply(message);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat memproses permintaan.");
  }
};

handler.description = 'Untuk mengetahui isi shortlink'
handler.category = 'tools'
handler.command = ["redirect"];

module.exports = handler;
