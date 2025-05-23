/*
Jangan Hapus Wm Bang 

*text to speech  Plugins Esm*

Hmmmph

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Vb3ejRu2v1IvxWSPml0q/188
*/

const axios = require ('axios');
const fs = require ('fs');
const { join } = require ('path');
const { fileURLToPath } = require ('url');
const { dirname } = require ('path');

const voices = {
  male: [
    { name: "Bradley Marshall", id: "waveltts_3786e470-7129-4f01-a263-0801b302acf1" },
    { name: "Rowan Flynn", id: "waveltts_7a16488d-eba0-4fa3-876a-97fbd57551ca" },
    { name: "Atlas", id: "waveltts_f5066419-beae-43c6-bf67-d8ad0cec52a5" }
  ],
  female: [
    { name: "Calista", id: "waveltts_aaf98444-e4e9-4bd6-9921-b307bbd2689e" },
    { name: "Serene Loh", id: "waveltts_297d3749-2394-4396-8324-e6fdb26846f0" },
    { name: "Sofía Mariposa", id: "waveltts_e51e20fb-4e89-41a0-9fbe-0f22f73c9557" }
  ]
};

const languages = ["ml-IN", "en-US", "es-ES", "ja-JP", "id-ID", "ko-KR", "ru-RU"];

async function wavel_ai(prompt, lang, voiceName) {
  try {
    if (prompt.length > 500) throw new Error("Teks terlalu panjang. Maksimal 500 karakter.");
    if (!languages.includes(lang)) throw new Error(`Bahasa tidak valid. Pilih dari : ${languages.join(", ")}`);

    const allVoices = [...voices.male, ...voices.female];
    const voice = allVoices.find(v => v.name.toLowerCase() === voiceName.toLowerCase());
    if (!voice) throw new Error(`Suara tidak ditemukan. Pilih dari : ${allVoices.map(v => v.name).join(", ")}`);

    const url = 'https://wavel.ai/wp-json/custom/v1/synthesize-audio';
    const headers = {
      'accept': '*/*',
      'accept-language': 'id;q=0.5',
      'content-type': 'application/x-www-form-urlencoded',
      'origin': 'https://wavel.ai',
      'referer': 'https://wavel.ai/solutions/text-to-speech/anime-text-to-speech',
      'user-agent': 'Mozilla/5.0'
    };

    const data = new URLSearchParams({ lang, text: prompt, voiceId: voice.id }).toString();
    const response = await axios.post(url, data, { headers, responseType: 'json' });

    const base64 = response.data.base64Audio.split(';base64,')[1];
    return { status: response.status, output: Buffer.from(base64, 'base64') };
  } catch (error) {
    return { status: error.response?.status || 500, error: error.message };
  }
}

const handler = async (m, { rinn, text, args, prefix, command, Nreply, reactionMessage }) => {
  if (!text) return Nreply(`*Wavel AI Text To Speech*\n\nCara Penggunaan :\n${prefix + command} [bahasa] [suara] [teks]\n\nContoh :\n${prefix + command} id-ID "Julian Stiles" Halo, apa kabar?\n\nBahasa yang tersedia :\n${languages.join(", ")}\n\nSuara Pria :\n${voices.male.map(v => v.name).join(", ")}\n\nSuara Wanita :\n${voices.female.map(v => v.name).join(", ")}\n\nBatas teks : 500 karakter.`);

  let [lang, voice, ...message] = args;
  
  if (!lang || !voice || !message || message.length === 0) {
    return Nreply(`Format salah! Gunakan : ${prefix + command} [bahasa] [suara] [teks]`);
  }
  
  if (!languages.includes(lang)) {
    return Nreply(`Bahasa tidak valid! Pilih dari : ${languages.join(", ")}`);
  }
  
  if (voice.startsWith('"') && voice.endsWith('"')) {
    voice = voice.slice(1, -1);
  }
  
  const allVoices = [...voices.male, ...voices.female];
  const voiceExists = allVoices.find(v => v.name.toLowerCase() === voice.toLowerCase());
  
  if (!voiceExists) {
    return Nreply(`Suara "${voice}" tidak ditemukan! Pilih dari :\n\nSuara Pria : ${voices.male.map(v => v.name).join(", ")}\n\nSuara Wanita : ${voices.female.map(v => v.name).join(", ")}`);
  }
  
  const promptText = message.join(' ');
  
  if (promptText.length > 500) {
    return Nreply('Teks terlalu panjang! Maksimal 500 karakter.');
  }
  
  reactionMessage('⌛');

  try {
    const result = await wavel_ai(promptText, lang, voice);
    
    if (result.status !== 200) {
      return Nreply(`Gagal memproses audio : ${result.error || "Terjadi kesalahan."}`);
    }
    
    const audioPath = join(__dirname, '../../../tmp', `wavel_${Date.now()}.mp3`);
    fs.writeFileSync(audioPath, result.output);
    
    await rinn.sendMessage(m.chat, {
      audio: { url: audioPath },
      mimetype: 'audio/mp4',
      ptt: true,
      fileName: 'wavel_tts.mp3'
    }, { quoted: m });

    reactionMessage('✅');

    try {
      fs.unlinkSync(audioPath);
    } catch {}
    
  } catch (error) {
    console.error(error);
    Nreply(`Terjadi kesalahan : ${error.message || "Gagal memproses audio."}`);
  }
};

handler.category = ['tool'];
handler.command = ['texttospeech', 'tts'];
handler.description = 'Mengubah teks menjadi audio'

module.exports = handler;
