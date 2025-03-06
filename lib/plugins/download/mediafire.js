/*
Jangan Hapus Wm Bang 

*MediaFire Download Plugins Esm*

Ada Yang Kurang Bilang/Add Sendiri aja

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

ZErvida 
*/

const { format } = require ('util');

async function mediaFire(url) {
  try {
    const response = await fetch('https://r.jina.ai/' + url);
    const text = await response.text();

    const result = {
      title: (text.match(/Title: (.+)/) || [])[1]?.trim() || '',
      link: (text.match(/URL Source: (.+)/) || [])[1]?.trim() || '',
      filename: '',
      url: '',
      size: '',
      repair: ''
    };

    if (result.link) {
      const fileMatch = result.link.match(/\/([^\/]+\.zip)/);
      if (fileMatch) result.filename = fileMatch[1];
    }

    const matches = [...text.matchAll(/\[(.*?)\]\((https:\/\/[^\s]+)\)/g)];
    for (const match of matches) {
      const desc = match[1].trim();
      const link = match[2].trim();
      
      if (desc.toLowerCase().includes('download') && desc.match(/\((\d+(\.\d+)?[KMGT]B)\)/)) {
        result.url = link;
        result.size = (desc.match(/\((\d+(\.\d+)?[MG]B)\)/) || [])[1] || '';
      }
      if (desc.toLowerCase().includes('repair')) {
        result.repair = link;
      }
    }

    return result;
  } catch (error) {
    return { error: error.message };
  }
}

let handler = async (m, { rinn, args, prefix, reactionMessage, command }) => {
  if (!args[0]) {
    return m.reply(`*Format:* ${prefix}${command} <url mediafire>\n*Example:* ${prefix}${command} https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`);
  }
  
  if (!args[0].match(/mediafire/gi)) {
    return m.reply('Please provide a valid MediaFire URL');
  }
  
  try {
    await reactionMessage('⏳');
    
    const result = await mediaFire(args[0]);
    
    if (result.error) {
      return m.reply(`Error: ${result.error}`);
    }
    
    if (!result.url) {
      return m.reply('Failed to extract download link');
    }
    
    let mediaFireInfo = `
*MediaFire Downloader*
━━━━━━━━━━━━━━━━━

*📁 File Name:* ${result.title || result.filename || 'Unknown'}
*📊 File Size:* ${result.size || 'Unknown'}
*🔗 Source:* ${result.link || args[0]}`;
    
    await rinn.sendMessage(m.chat, { 
      document: { url: result.url }, 
      mimetype: 'application/zip',
      fileName: result.filename || result.title || 'mediafire_download.zip',
      caption: mediaFireInfo
    }, { quoted: m });
    
    if (result.repair) {
      m.reply(`*Repair Link (Kalau Download Error):*\n${result.repair}`);
    }
    
    await reactionMessage('✅');
   
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.command = ['mediafire', 'mfdl'];
handler.description = 'Download link mediafire';
handler.category = 'downloader';

module.exports = handler;
