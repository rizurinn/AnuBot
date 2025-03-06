/*
Jangan Hapus Wm Bang 

*Yta & Ytv  Plugins Esm*

Maaf Lama Aish

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

Daffa
*/

const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execPromise = promisify(exec);

async function converter(inputBuffer, inputFormat, outputFormat, options = '') {
    if (!Buffer.isBuffer(inputBuffer)) throw new Error('Input harus berupa Buffer');
    if (typeof inputFormat !== 'string' || typeof outputFormat !== 'string') throw new Error('Format input dan output harus berupa string');

    const inputFilePath = path.resolve(`./tmp/temp_input.${inputFormat}`);
    const outputFilePath = path.resolve(`./tmp/temp_output.${outputFormat}`);

    try {
        await fs.promises.writeFile(inputFilePath, inputBuffer);
        await execPromise(`ffmpeg -i ${inputFilePath} ${options} ${outputFilePath}`);
        const outputBuffer = await fs.promises.readFile(outputFilePath);
        return outputBuffer;
    } finally {
        try {
            if (fs.existsSync(inputFilePath)) await fs.promises.unlink(inputFilePath);
            if (fs.existsSync(outputFilePath)) await fs.promises.unlink(outputFilePath);
        } catch {}
    }
}

const ytdown = {
    api: {
        base: "https://p.oceansaver.in/ajax/",
        progress: "https://p.oceansaver.in/ajax/progress.php"
    },
    headers: {
        'authority': 'p.oceansaver.in',
        'origin': 'https://y2down.cc',
        'referer': 'https://y2down.cc/',
        'user-agent': 'Postify/1.0.0'
    },
    formats: ['360', '480', '720', '1080', '1440', '2160', 'mp3', 'm4a', 'wav', 'aac', 'flac', 'opus', 'ogg'],
    audioBitrates: ['64', '128', '192', '256', '320'],

    isUrl: (str) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    },

    youtube: (url) => {
        if (!url) return null;
        const patterns = [
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/
        ];
        for (let pattern of patterns) {
            if (pattern.test(url)) return url.match(pattern)[1];
        }
        return null;
    },

    request: async (endpoint, params = {}) => {
        try {
            const { data } = await axios.get(`${ytdown.api.base}${endpoint}`, { params, headers: ytdown.headers });
            return data;
        } catch (error) {
            throw error;
        }
    },

    downloadv: async (url, format = '1080') => {
        if (!url) return { error: "Masukkan link YouTube yang benar!" };
        if (!ytdown.isUrl(url)) return { error: "URL tidak valid!" };
        
        const id = ytdown.youtube(url);
        if (!id) return { error: "Gagal mengambil ID video!" };

        try {
            const response = await ytdown.request("download.php", { format, url: `https://www.youtube.com/watch?v=${id}` });
            const metadata = await ytdown.handler(response, format, id);
            if (!metadata.success) return metadata;

            const buffer = await axios.get(metadata.download, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data));
            const convertedBuffer = await converter(buffer, "webm", "mp4");

            return {
                success: true,
                title: metadata.title,
                format,
                thumbnail: metadata.thumbnail,
                buffer: convertedBuffer,
                type: 'video'
            };
        } catch (err) {
            return { error: `Gagal mengunduh video!`, details: err.message };
        }
    },

    downloada: async (url, format = 'mp3', bitrate = '128') => {
        if (!url) return { error: "Masukkan link YouTube yang benar!" };
        if (!ytdown.isUrl(url)) return { error: "URL tidak valid!" };

        const id = ytdown.youtube(url);
        if (!id) return { error: "Gagal mengambil ID video!" };

        try {
            const response = await ytdown.request("download.php", { format: 'mp3', url: `https://www.youtube.com/watch?v=${id}` });
            const metadata = await ytdown.handler(response, format, id);
            if (!metadata.success) return metadata;

            const buffer = await axios.get(metadata.download, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data));
            const bitrateOption = `-b:a ${bitrate}k`;
            const convertedBuffer = await converter(buffer, "mp3", format, bitrateOption);

            return {
                success: true,
                title: metadata.title,
                format,
                bitrate: `${bitrate}k`,
                thumbnail: metadata.thumbnail,
                buffer: convertedBuffer,
                type: 'audio'
            };
        } catch (err) {
            return { error: "Gagal mengunduh audio!", details: err.message };
        }
    },

    handler: async (data, format, id) => {
        if (!data.success) return { error: data.message || "Error" };
        const progress = await ytdown.checkProgress(data.id);
        return progress.success ? ytdown.final(data, progress, format, id) : progress;
    },

    checkProgress: async (id) => {
        let attempts = 0;
        while (attempts < 100) {
            try {
                const { data } = await axios.get(ytdown.api.progress, { params: { id }, headers: ytdown.headers });
                if (data.download_url && data.success) return { success: true, ...data };
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            } catch {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return { error: "Proses download gagal, timeout!" };
    },

    final: (init, pro, format, id) => ({
        success: true,
        title: init.title || "Tidak diketahui",
        type: ['360', '480', '720', '1080', '1440', '2160'].includes(format) ? 'video' : 'audio',
        formats: format,
        thumbnail: init.info?.image || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        download: pro.download_url,
        id
    })
};

async function handler(m, { rinn, args }) {
    if (!args[0]) return m.reply("Penggunaan:\n.ytv <link> [format]\n.yta <link> [format] [bitrate]");
    
    const command = m.text.split(" ")[0].slice(1);
    const format = args[1] || (command === "ytv" ? "1080" : "mp3"); // Default format
    const bitrate = args[2] || "128"; 

    const validVideoFormats = ['360', '480', '720', '1080', '1440', '2160'];
    const validAudioFormats = ['mp3', 'm4a', 'wav', 'aac', 'flac', 'opus', 'ogg'];

    const isVideo = validVideoFormats.includes(format);
    const isAudio = validAudioFormats.includes(format);

    if (!isVideo && !isAudio) {
        return m.reply(`Format tidak didukung!\n\nFormat video: ${validVideoFormats.join(', ')}\nFormat audio: ${validAudioFormats.join(', ')}`);
    }

    let result;
    if (isVideo) {
        result = await ytdown.downloadv(args[0], format);
    } else {
        result = await ytdown.downloada(args[0], format, bitrate);
    }

    if (result.error) return m.reply(result.error);

    if (isVideo) {
        await rinn.sendMessage(m.chat, {
            video: result.buffer,
            mimetype: 'video/mp4',
            fileName: `${result.title}.mp4`
        }, { quoted: m });
    } else {
        const mimeTypes = {
            'mp3': 'audio/mpeg',
            'm4a': 'audio/mp4',
            'wav': 'audio/wav',
            'aac': 'audio/aac',
            'flac': 'audio/flac',
            'opus': 'audio/opus',
            'ogg': 'audio/ogg'
        };

        await rinn.sendMessage(m.chat, {
            audio: result.buffer,
            mimetype: mimeTypes[format] || 'audio/mpeg',
            fileName: `${result.title}.${format}`
        }, { quoted: m });
    }
}

handler.description = 'Mendownload video youtube menggunakan web y2down.cc';
handler.command = ['ytv', 'yta'];
handler.category = ['downloader']

module.exports = handler;