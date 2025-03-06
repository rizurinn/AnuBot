const axios = require('axios');
const cheerio = require('cheerio');

async function swallpapercraft(query) {
    return new Promise((resolve, reject) => {
        axios.get('https://wallpaperscraft.com/search/?query=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                
                // Get the wallpaper detail links first
                const links = [];
                $('a.wallpapers__link').each(function() {
                    const href = $(this).attr('href');
                    if (href) links.push('https://wallpaperscraft.com' + href);
                });
                
                // Limit to first 20 links for efficiency
                const promises = links.slice(0, 20).map(link => {
                    return axios.get(link)
                        .then(({ data }) => {
                            const $detail = cheerio.load(data);
                            // Get the download button link which has the HD version
                            const hdLink = $detail('a.button.button--block.button--medium.js-show-more').attr('href');
                            if (hdLink) {
                                const fullLink = 'https://wallpaperscraft.com' + hdLink;
                                return fullLink;
                            }
                            return null;
                        })
                        .catch(() => null);
                });
                
                Promise.all(promises)
                    .then(hdLinks => {
                        resolve(hdLinks.filter(link => link !== null));
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}

let handler = async (m, { text, rinn }) => {
    if (!text) return m.reply('Masukkan query, contoh: wallcraft anime | 5');

    let [query, jumlah] = text.split('|').map(v => v.trim());
    jumlah = parseInt(jumlah) || 5; // Default to 5 since HD images are larger

    if (jumlah > 10) return m.reply('Maksimal 10 Gambar HD.');
    
    m.reply('Sedang mencari wallpaper HD, mohon tunggu...');
    
    try {
        let hdLinks = await swallpapercraft(query);
        if (hdLinks.length === 0) return m.reply('Tidak ditemukan wallpaper.');
        
        let count = Math.min(jumlah, hdLinks.length);
        for (let i = 0; i < count; i++) {
            // Use buffer to avoid WhatsApp compression
            const response = await axios.get(hdLinks[i], { responseType: 'arraybuffer' });
            await rinn.sendMessage(m.chat, { 
                image: Buffer.from(response.data, 'binary'),
                caption: `HD Wallpaper (${i+1}/${count})`,
                fileName: `wallpaper-${query}-${i+1}.jpg` 
            }, { quoted: m });
            
            // Add a small delay between sending messages to prevent rate limiting
            if (i < count - 1) await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat mengambil data wallpaper HD.');
    }
};

handler.command = ['wallcraft'];
handler.category = 'search';
handler.description = 'Cari wallpaper HD';

module.exports = handler;
