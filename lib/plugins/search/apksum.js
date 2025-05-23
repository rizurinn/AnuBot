/*
 • Fitur By Anomaki Team
 • Created : Nazand Code
 • Apk Sum Search & Get download Link
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const axios = require ('axios');
const cheerio = require ('cheerio');

const handler = async (m, {
    rinn,
    Nreply,
    args,
    command
}) => {
    if (!args[0]) {
        return Nreply('Metode yang tersedia\n\n- Search <Query>\n- Download <url halamam>');
    }
    if (args[0] === 'search') {
        const query = args.slice(1).join(" ");
        if (!query) {
            return Nreply('Masukkan kata kunci pencarian.\n\n- Contoh: apksum search minecraft');
        }
        const baseUrl = "https://m.apksum.com/search?q=";
        const searchUrl = baseUrl + encodeURIComponent(query);

        const cookies = {
            PHPSESSID: "tho2f92d6gqf2bq8j2tqojf5d9",
            _ga: "GA1.1.867180231.1736720071",
            __ppIdCC: "wpjaun_xon21730769976581",
            fpestid: "GZhKMVyVeoQgF_4KDbVyRbKez0hqow4qcGwkMkdgVxp0qVdFtUtk0E7khhDCJfCg2Q2yYA",
            sharedid: "b323af35-e1df-4383-8d41-6dbdb09eb10e",
            sharedid_cst: "zix7LPQsHA==",
            __viCookieActive: "true",
            cto_bundle: "sO0TsF96ZVJ5enFKUmRHZ01DeFQ0R0dHV0xTZ2NaYmpUS2xCc21iRU5kd0RpekdtTklNTmtuNXkxSCUyQjhIajk2ZjBQQVJZNU9qdXBTRzYwbEYlMkZKJTJGUFBSbWJzeXJ3OFF5Q09kb28zdFh1MzZoNEEwYmMyV1BEWTFpR1R0eWYlMkZMJTJCYm9uQldHWmZtSGtNYk9KY3Q2OGJrNEVkbmtRJTNEJTNE",
            cto_bidid: "sqBfM19HbFdPOHVRQ1NPcXBlaUowREFmaFdBa3FJa0c3blprSVFOSk1JV3lNS3Y0UjFUOFh1dDFPUGJ3TldRYmpReDQzRGRyc1NwSlFucGNDU1dBZFZySmdkU0RNSFhmJTJCMWJsYmdKYkVHS21uJTJGMHMlM0Q",
            __gads: "ID=3106d8283740c066:T=1736720076:RT=1736720433:S=ALNI_MZbyVQGOfiYpAuoq78FicbCHPuRKA",
            __gpi: "UID=00000fe6b9fbf918:T=1736720076:RT=1736720433:S=ALNI_MZ6KkHrO9fdq5Tt8ATtdq73ToXPFA",
            __eoi: "ID=4eebfe5c3a6a0d77:T=1736720076:RT=1736720433:S=AA-AfjZlT3ffkjGJvvgHgaD_MdWQ",
            _ga_8JFH2XCMDR: "GS1.1.1736720071.1.1.1736720529.0.0.0"
        };

        const cookieString = Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; ");

        try {
            const zan = await axios.get(searchUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
                    "Cookie": cookieString
                }
            });

            const $ = cheerio.load(zan.data);
            const results = [];

            $('div.box ul#pagedata li a').each((index, element) => {
                const href = $(element).attr('href');
                const title = $(element).attr('title');

                if (href && title) {
                    results.push({
                        name: title.trim(),
                        url: `https://m.apksum.com${href.trim()}`,
                    });
                }
            });

            if (results.length === 0) {
                return Nreply("Tidak ada hasil yang ditemukan untuk pencarian tersebut.");
            }

            let responseText = "Hasil pencarian:\n\n";
            results.forEach((result, index) => {
                responseText += `${index + 1}. ${result.name}\n${result.url}\n\n`;
            });

            Nreply(responseText);
        } catch (error) {
            Nreply(`${error.message}`);
        }
    }

    if (args[0] === 'download') {
        const url = args[1];
        if (!url) {
            return Nreply('Masukkan URL aplikasi yang ingin diambil downloadnya. Contoh penggunaan: apksum download https://m.apksum.com/download/com.mojang.minecraftpe_1.21.60.25_free');
        }

        try {
            const zan = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
                }
            });

            const $ = cheerio.load(zan.data);

            const downloadLinks = [];
            $('div.down-warp .down a').each((i, elem) => {
                const downloadUrl = $(elem).attr('href');
                const downloadTitle = $(elem).attr('title');
                if (downloadUrl && downloadTitle) {
                    downloadLinks.push({
                        name: downloadTitle,
                        url: `https://m.apksum.com${downloadUrl}`
                    });
                }
            });

            if (downloadLinks.length === 0) {
                return Nreply("Tidak ditemukan link download untuk aplikasi ini.");
            }

            let responseText = "Link download ditemukan:\n\n";
            downloadLinks.forEach((link, index) => {
                responseText += `${index + 1}. ${link.name}\n${link.url}\n\n`;
            });

            Nreply(responseText);
        } catch (error) {
            Nreply(`${error.message}`);
        }
    }
};

handler.command = ['apksum'];
handler.category = ['search'];
handler.description = 'Cari dan download dari web Apksum';

module.exports = handler;
