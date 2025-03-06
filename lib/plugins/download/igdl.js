const { Download } = require('../../handlers/dlIgram');
const util = require('util');

const getJakartaTime = () =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

let handler = async (m, { rinn, args, prefix, command }) => {
  const contextInfo = {
    quotedMessage: { conversation: botName },
    mentionedJid: [m.sender],
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "6281391620354@g.us",
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "Instagram",
      body: `- ${getJakartaTime()}`,
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_1280.jpg",
      sourceUrl: "https://www.instagram.com/",
      showAdAttribution: false,
      mediaType: 1,
      renderLargerThumbnail: false,
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: idSaluran,
      newsletterName: namaSaluran,
    },
  };

  if (!args[0])
    return rinn.sendMessage(m.chat, {
      text: `Gunakan contoh:\n${prefix}${command} https://www.instagram.com/p/xxxxxxx/`,
      contextInfo,
    });

  const url = args[0];

  rinn.sendMessage(m.chat, {
    text: "Tunggu sebentar, sedang memproses...",
    contextInfo,
  });

  try {
    const result = await Download(url);

    if (!result || !result.url) {
      throw new Error("Konten tidak ditemukan atau tidak dapat diunduh.");
    }

    // Prepare caption with metadata
    const caption = 
      "`DOWNLOADER   INSTAGRAM`\n\n" +
      `- URL: ${url}\n` +
      `- Judul: ${result.meta?.title || 'Tidak ada judul'}\n` +
      `- Username: ${result.meta?.username || 'Tidak diketahui'}\n` +
      `- Komentar: ${result.meta?.comment_count || 0}\n` +
      `- Sumber: ${result.meta?.source || 'Instagram'}`;

    // Send thumbnail first if available
    if (result.thumb) {
      await rinn.sendMessage(m.chat, {
        image: { url: result.thumb },
        mimetype: "image/jpeg",
        fileName: "instagram_thumbnail.jpg",
        caption: "🖼️ Gambar",
        contextInfo,
      });
    }

    // Send media
    if (result.url && result.url.length > 0) {
      for (const [index, mediaItem] of result.url.entries()) {
        if (mediaItem.type === 'mp4') {
          await rinn.sendMessage(m.chat, {
            video: { url: mediaItem.url },
            mimetype: "video/mp4",
            fileName: `instagram_${index + 1}.mp4`,
            caption: caption,
            contextInfo,
          });
        }
      }
    }
  } catch (err) {
    return rinn.sendMessage(m.chat, {
      text: `Terjadi kesalahan:\n\n${util.format(err)}`,
      contextInfo,
    });
  }
};

handler.description = 'Download link Instagram';
handler.category = ["downloader"];
handler.command = ['instagram', 'ig', 'igdl'];

module.exports = handler;