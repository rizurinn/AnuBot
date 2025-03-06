/* plugin google image search by udin type cjs
Scraper by selxyz
*/
const axios = require('axios');
const cheerio = require('cheerio');

async function googleImg(query) {
  try {
    const { data: html } = await axios.get(`https://www.google.com/search?q=${query}&sclient=mobile-gws-wiz-img&udm=2`);
    const $ = cheerio.load(html);
    
    const imageUrls = [];
    $('img.DS1iW').each((i, el) => {
      const imgUrl = $(el).attr('src');
      if (imgUrl) imageUrls.push(imgUrl);
    });
 
    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

let handler = async (m, { rinn, args, prefix, command }) => {
    if (!args[0]) await m.reply(`*Contoh:* ${prefix}${command} kucing`);

    try {
        const query = args.join(" ");
        const imageUrls = await googleImg(query);

        if (imageUrls.length === 0) {
            throw '*No images found!*';
        }

        let message = `*Google Image Search Results for: ${query}*\n\n`;

        for (let i = 0; i < Math.min(3, imageUrls.length); i++) {
            await rinn.sendFile(m.chat, imageUrls[i], null, message + `Image ${i + 1}`, m);
        }
    } catch (e) {
        console.error(e);
        m.reply('*Error fetching images!*');
    }
};

handler.description = 'Mencari gambar dari google'
handler.category = 'search'
handler.command = ['googleimg', 'gimg']

module.exports = handler;