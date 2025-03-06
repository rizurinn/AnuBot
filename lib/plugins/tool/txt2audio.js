/*
•wa.me/6281378037412
• `by Fredyyzxy`
• `Sumber :` https://whatsapp.com/channel/0029VaeswcCFy72FqWxb7544
• `Github :` https://github.com/Fredyzxy
• https://whatsapp.com/channel/0029VaFzWbMFy728xPwFBG00
*/
const fetch = require("node-fetch");

const voiceModels = [
  "Filiz", "Astrid", "Tatyana", "Maxim", "Carmen", "Ines", "Cristiano", "Vitoria", "Ricardo",
  "Maja", "Jan", "Jacek", "Ewa", "Ruben", "Lotte", "Liv", "Seoyeon", "Takumi", "Mizuki",
  "Giorgio", "Carla", "Bianca", "Karl", "Dora", "Mathieu", "Celine", "Chantal", "Penelope",
  "Miguel", "Mia", "Enrique", "Conchita", "Geraint", "Salli", "Matthew", "Kimberly", "Kendra",
  "Justin", "Joey", "Joanna", "Ivy", "Raveena", "Aditi", "Emma", "Brian", "Amy", "Russell",
  "Nicole", "Vicki", "Marlene", "Hans", "Naja", "Mads", "Gwyneth", "Zhiyu", "en-US-Wavenet-A",
  "en-US-Wavenet-B", "en-US-Wavenet-C", "en-US-Wavenet-D", "en-US-Wavenet-E", "en-US-Wavenet-F",
  "en-GB-Wavenet-A", "en-GB-Wavenet-B", "en-GB-Wavenet-C", "en-GB-Wavenet-D"
];

let handler = async (m, { args, rinn }) => {
  if (args.length < 1) {
    return m.reply("⚠️ *Format Salah!*\nGunakan: `.tts <model_suara> <teks>`\n\n📌 *Contoh:*\n.tts en-US-Wavenet-D Halo dunia!\n\n📝 *Gunakan:* `.tts list` untuk melihat daftar model suara.");
  }

  if (args[0].toLowerCase() === "list") {
    let message = `📜 *Daftar Model Suara Tersedia:*\n\n${voiceModels.join(", ")}`;
    return m.reply(message);
  }

  let model = args[0];
  let text = args.slice(1).join(" ");

  if (!voiceModels.includes(model)) {
    text = args.join(" "); 

    model = "en-US-Wavenet-D";
  }

  let apiUrl = `https://fastrestapis.fasturl.cloud/tts/voice?text=${encodeURIComponent(text)}&model=${model}`;

  try {
    let loadingMsg = await m.reply("⏳ *Mengubah teks ke suara...* Mohon tunggu.");

    let res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`❌ *Gagal! Server tidak merespons (${res.status})*`);

    let buffer = await res.buffer();
    
    await rinn.sendMessage(m.chat, { 
      audio: buffer, 
      mimetype: 'audio/mpeg', 
      ptt: true 
    }, { quoted: m });

    await rinn.sendMessage(m.chat, { delete: loadingMsg.key }); 
  } catch (err) {
    console.error(err);
    m.reply(`❌ *Gagal melakukan TTS!*\n\n🚨 *Error:* ${err.message}\n⚠️ Pastikan model suara dan teks valid.`);
  }
};

handler.command = ["texttoaudio", "tts"];
handler.category = ["tools"];
handler.description = "Mengubah teks menjdi audio berbagai model suara";

module.exports = handler;