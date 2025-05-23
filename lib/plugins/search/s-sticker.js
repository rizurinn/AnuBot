/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Sticker Search & auto kirim
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const axios = require ('axios');
const cheerio = require ('cheerio');

const handler = async (m, {
    rinn,
    Nreply,
    args
}) => {
    if (!args[0]) {
        return Nreply('`Gini cara pakenya`\n\n- *.sticker-s (nama) (halaman) (jumlah)*\n\n- nama = Query\n- halaman = nomor halaman\n- jumlah = jumlah sticker yang diinginkan');
    }
    const query = args[0];
    const page = args[1] ? parseInt(args[1]) : 1;
    const count = args[2] ? parseInt(args[2]) : 5;
    if (isNaN(page) || page < 1) {
        return Nreply('Halaman harus berupa angka yang valid (>= 1).\n\n- Contoh: sticker-s anime 1 5');
    }
    if (isNaN(count) || count < 1) {
        return Nreply('Jumlah sticker harus berupa angka yang valid (>= 1).\n\n- Contoh: sticker-s anime 1 5');
    }
    const surl = `https://getstickerpack.com/stickers?query=${encodeURIComponent(query)}&page=${page}`;

    try {
        const respon = await axios.get(surl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
            }
        });
        const $ = cheerio.load(respon.data);
        const stickerPacks = [];
        $('div.col-md-6.col-lg-4.col-12.col-sm-6.sticker-pack-cols a').each((i, el) => {
            const href = $(el).attr('href');
            if (href) {
                stickerPacks.push(href);
            }
        });

        if (stickerPacks.length === 0) {
            return Nreply('Tidak ditemukan sticker packs untuk pencarian ini.');
        }

        const nzand = stickerPacks[Math.floor(Math.random() * stickerPacks.length)];
        const packRespon = await axios.get(nzand, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
            }
        });

        const nzand2 = cheerio.load(packRespon.data);
        const stickers = [];

        nzand2('img.img-thumbnail.sticker-image').each((i, el) => {
            const stickerUrl = nzand2(el).attr('data-src-large') || nzand2(el).attr('src');
            if (stickerUrl && stickerUrl.startsWith('https://s3.getstickerpack.com/storage/uploads/')) {
                stickers.push(stickerUrl);
            }
        });

        if (stickers.length === 0) {
            return Nreply('Tidak ada sticker yang ditemukan pada pack ini.');
        }

        const jumlah = stickers.length;
        const jmlah = Math.min(count, jumlah);

        Nreply(`Ditemukan ${jumlah} sticker. Mengirimkan ${jmlah} sticker...`);

        for (let i = 0; i < jmlah; i++) {
            const stickerUrl = stickers[i];
            const sp = await axios.get(stickerUrl, {
                responseType: 'arraybuffer'
            });

            await rinn.sendMessage(
                m.chat, {
                    sticker: Buffer.from(sp.data)
                }, {
                    quoted: m
                }
            );
        }
    } catch (error) {
        Nreply(`${error.message}`);
    }
};

handler.command = ['sticker-s'];
handler.category = 'search';
handler.description = 'Search paket stiker wangsap';

module.exports = handler;
