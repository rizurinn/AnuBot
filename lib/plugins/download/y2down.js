const axios = require('axios');
const {
    exec
} = require('child_process');
const {
    promisify
} = require('util');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch')

const execPromise = promisify(exec);

async function converter(inputBuffer, inputFormat, outputFormat) {
    // Validate input types
    if (!Buffer.isBuffer(inputBuffer)) {
        throw new Error('Input must be a Buffer');
    }
    if (typeof inputFormat !== 'string' || typeof outputFormat !== 'string') {
        throw new Error('Input and output formats must be strings');
    }

    const inputFilePath = path.resolve(`./tmp/temp_input.${inputFormat}`);
    const outputFilePath = path.resolve(`./tmp/temp_output.${outputFormat}`);

    try {
        await fs.promises.writeFile(inputFilePath, inputBuffer);
        console.log('Input file written successfully.');

        console.log('Starting conversion...');
        await execPromise(`ffmpeg -i ${inputFilePath} ${outputFilePath}`);
        console.log('Conversion completed successfully.');

        const outputBuffer = await fs.promises.readFile(outputFilePath);
        return outputBuffer;
    } catch (error) {
        console.error('Error while converting file:', error);
        throw error; // Re-throw error for higher-level handling
    } finally {
        // Cleanup temporary files
        try {
            if (fs.existsSync(inputFilePath)) await fs.promises.unlink(inputFilePath);
            if (fs.existsSync(outputFilePath)) await fs.promises.unlink(outputFilePath);
        } catch (cleanupError) {
            console.error('Error while cleaning up temp files:', cleanupError);
        }
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

    isUrl: str => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    },

    youtube: url => {
        if (!url) return null;
        const a = [
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/
        ];
        for (let b of a) {
            if (b.test(url)) return url.match(b)[1];
        }
        return null;
    },

    request: async (endpoint, params = {}) => {
        try {
            const {
                data
            } = await axios.get(`${ytdown.api.base}${endpoint}`, {
                params,
                headers: ytdown.headers,
                withCredentials: true
            });
            return data;
        } catch (error) {
            console.error(error.message, error.response?.data);
            throw error;
        }
    },

    download: async (link, format) => {
        if (!link) return {
            error: "Linknya mana? Yakali download kagak ada linknya 🗿"
        };
        if (!ytdown.isUrl(link)) return {
            error: "Lu masukin link apaan sih 🗿 Link Youtube aja bree, kan lu mau download youtube 👍🏻"
        };
        if (!format || !ytdown.formats.includes(format)) return {
            error: "Formatnya kagak ada bree, pilih yang udah disediain aja yak, jangan nyari yang gak ada 🗿",
            availableFormats: ytdown.formats
        };

        const id = ytdown.youtube(link);
        if (!id) return {
            error: "Kagak bisa ekstrak link youtubenya nih, btw link youtubenya yang bener yak.. biar kagak kejadian begini lagi 😂"
        };

        try {
            const response = await ytdown.request("download.php", {
                format,
                url: `https://www.youtube.com/watch?v=${id}`
            });
            return ytdown.handler(response, format, id);
        } catch (error) {
            return {
                error: `${error.message}`,
                details: error.response?.data
            };
        }
    },

    handler: async (data, format, id) => {
        if (!data.success) return {
            error: data.message || "Error"
        };
        if (!data.id) return {
            error: "ID Downloadnya kagak ada bree, jadi proses downloadnya kagak dilanjutin 😂"
        };

        try {
            const pr = await ytdown.checkProgress(data.id);
            return pr.success ? ytdown.final(data, pr, format, id) : pr;
        } catch (error) {
            return {
                error: `${error.message}`
            };
        }
    },

    downloadv: async (url, format) => {
        try {
            if (!url) return {
                error: "Linknya mana? Yakali download kagak ada linknya 🗿"
            };
            if (!ytdown.isUrl(url)) return {
                error: "Lu masukin link apaan sih 🗿 Link Youtube aja bree, kan lu mau download youtube 👍🏻"
            };
            const fmt = ['720', '1080', '1440', '2160']
            if (!format || !fmt.includes(format)) return {
                error: "Formatnya kagak ada bree, pilih yang udah disediain aja yak, jangan nyari yang gak ada 🗿",
                availableFormats: fmt
            };

            const a = await ytdown.download(url, format)
            const buffer = await fetch(a.download).then(async (y) => Buffer.from(await y.arrayBuffer()))

            const convertert = await converter(buffer, "webm", "mp4");
            const id = ytdown.youtube(url);
            const response = await ytdown.request("download.php", {
                format,
                url: `https://www.youtube.com/watch?v=${id}`
            });
            const metadata = await ytdown.handler(response, format, id);
            return {
                status: metadata.success,
                metadata: {
                    title: metadata.title,
                    format: metadata.formats,
                    thumbnail: metadata.thumbnail,
                    id: metadata.id
                },
                buffer: convertert
            }
        } catch (err) {
            return {
                status: false,
                metadata: {
                    message: 'gagal di get😂'
                },
                buffer: 'gagal get video array buffer😹',
                error: { message: err }
            }
           console.error(err)
        }
    },

    checkProgress: async (id) => {
        let attempts = 0,
            lastProgress = -1;
        process.stdout.write("✨ Progress: [                              ] 0%");

        while (attempts < 100) {
            try {
                const {
                    data
                } = await axios.get(ytdown.api.progress, {
                    params: {
                        id
                    },
                    headers: ytdown.headers,
                    withCredentials: true
                });

                const currentProgress = Math.round(data.progress / 10);
                if (currentProgress !== lastProgress) {
                    ytdown.updateBar(currentProgress);
                    lastProgress = currentProgress;
                }

                if (data.download_url && data.success) {
                    return {
                        success: true,
                        ...data
                    };
                } else if (!data.download_url && data.success) {
                    return {
                        error: data.text
                    };
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            } catch (error) {
                console.error("\n", error);
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return {
            error: "Proses downloadnya kagak bisa di lanjutin bree, Timeout 😂"
        };
    },

    updateBar: (progress) => {
        const barLength = 30;
        const filledLength = Math.round(barLength * progress / 100);
        const bar = '█'.repeat(filledLength) + ' '.repeat(barLength - filledLength);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`✨ Progress: [${bar}] ${progress}%\n\n`);
    },

    final: (init, pro, formats, id) => ({
        success: true,
        title: init.title || "Idk 🤷🏻",
        type: ['360', '480', '720', '1080', '1440', '2160'].includes(formats) ? 'video' : 'audio',
        formats,
        thumbnail: init.info?.image || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        download: pro.download_url || "Idk 🤷🏻",
        id: id
    })
};


let handler = async (m, { rinn, text, args, command }) => {
    if (!text && !m.quoted) {
        return m.reply(`*Penggunaan:*
.ytdown4 [link] [resolusi]
.ytdown3 [link] [format]

*Contoh:*
.ytdown4 https://youtu.be/abc123 720
.ytdown3 https://youtu.be/abc123 mp3

*Resolusi Video:* 360, 480, 720, 1080, 1440, 2160
*Format Audio:* mp3, m4a, wav, aac, flac, opus, ogg

Anda juga bisa membalas pesan yang berisi link YouTube.`);
    }

    let url = text;
    
    // Handle if user is replying to a message containing YouTube URL
    if (m.quoted && !text) {
        const quotedText = m.quoted.text || '';
        // Extract URL from quoted message
        const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/\S+|youtu\.be\/\S+))/i;
        const match = quotedText.match(urlRegex);
        if (match) {
            url = match[1];
        } else {
            return m.reply('❌ Tidak menemukan link YouTube di pesan yang dibalas!');
        }
    }
    
    // Extract URL if multiple arguments
    if (args.length > 1) {
        const possibleUrl = args.find(arg => ytdown.isUrl(arg));
        if (possibleUrl) {
            url = possibleUrl;
        }
    }
    
    if (!ytdown.isUrl(url)) {
        return m.reply('❌ URL tidak valid! Pastikan Anda memasukkan link YouTube yang benar.');
    }
    
    const youtubeId = ytdown.youtube(url);
    if (!youtubeId) {
        return m.reply('❌ Link YouTube tidak valid!');
    }
    
    // Set default formats
    let format = command === 'ytmp3' ? 'mp3' : '720';
    
    // Check if format is specified
    if (args.length > 1) {
        const possibleFormat = args.find(arg => ytdown.formats.includes(arg));
        if (possibleFormat) {
            format = possibleFormat;
        }
    }
    
    // Determine if audio or video
    const isAudio = ['mp3', 'm4a', 'wav', 'aac', 'flac', 'opus', 'ogg'].includes(format);
    
    // Loading message
    const waitMsg = await m.reply(`🔄 *Sedang memproses...*
*Link:* ${url}
*Format:* ${format}
*Tipe:* ${isAudio ? 'Audio' : 'Video'}

⏳ Harap tunggu, proses ini mungkin memakan waktu beberapa saat...`);
    
    try {
        let result;
        let buffer;
        
        // Status reaction
        await rinn.sendMessage(m.chat, {
            react: {
                text: '⏳',
                key: m.key
            }
        });
        
        if (isAudio) {
            // Audio download
            result = await ytdown.download(url, format);
            if (result.error) {
                return m.reply(`❌ *Error:* ${result.error}`);
            }
            
            // Download the file
            const response = await fetch(result.download);
            buffer = Buffer.from(await response.arrayBuffer());
        } else {
            // Video download
            result = await ytdown.downloadv(url, format);
            if (!result.status) {
                return m.reply(`❌ *Error:* ${result.metadata?.message || 'Terjadi kesalahan saat mengunduh video'}`);
            }
            
            buffer = result.buffer;
        }
        
        // Delete waiting message
        await rinn.sendMessage(m.chat, {
            delete: waitMsg.key
        });
        
        // Success reaction
        await rinn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        });
        
        // Create filename
        const title = isAudio ? result.title : result.metadata.title;
        const sanitizedTitle = title.replace(/[^\w\s]/gi, '').substring(0, 30).trim();
        const filename = `${sanitizedTitle}-${youtubeId}.${isAudio ? format : 'mp4'}`;
        
        // Send thumbnail and info first
        const thumbnailUrl = isAudio ? result.thumbnail : result.metadata.thumbnail;
        
        await rinn.sendMessage(m.chat, {
            image: { url: thumbnailUrl },
            caption: `✅ *Berhasil Diunduh!*

🎬 *Judul:* ${title}
🔗 *Link:* ${url}
📦 *Format:* ${format}
📊 *Ukuran:* ${(buffer.length / (1024 * 1024)).toFixed(2)} MB

⏬ *Mengirim file${isAudio ? ' audio' : ' video'}...*`,
            quoted: m
        });
        
        // Send the actual file
        if (isAudio) {
            await rinn.sendMessage(m.chat, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                fileName: filename,
                quoted: m
            });
        } else {
            await rinn.sendMessage(m.chat, {
                video: buffer,
                caption: `🎬 *${title}*\n📊 *Kualitas:* ${format}p`,
                fileName: filename,
                quoted: m
            });
        }
        
    } catch (error) {
        console.error('YTDL ERROR:', error);
        await rinn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        });
        
        return m.reply(`❌ *Terjadi kesalahan!*

*Detail:* ${error.message || String(error)}

Silakan coba lagi dengan format atau link yang berbeda.`);
    }
};

handler.command = ['ytdown4', 'ytdown3'];
handler.category = 'downloader';
handler.description = 'Download youtube dari web y2down';

module.exports = handler;
