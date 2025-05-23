const axios = require ('axios');
const { translate } = require ('@vitalets/google-translate-api');

async function Ai3dGenerator(prompt) {
  try {
    let { data } = await axios.get(`https://api.artvy.ai:444/image_search?query=${encodeURIComponent(prompt + " 3D render, ultra-detailed, cinematic lighting")}`, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "rinnection": "keep-alive"
      }
    });
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
    return null;
  }
}

const handler = async (m, { rinn, Nreply, text }) => {
  const inputText = text.trim();
  if (!inputText) return Nreply("Masukkan prompt!\nContoh: .ai3d Anak kecil Menonton Matahari Terbit");

  try {
    const translatedText = await translate(inputText, { to: 'en' });
    const englishPrompt = translatedText.translation;

    const jsonResponse = await Ai3dGenerator(englishPrompt);
    if (!jsonResponse) throw new Error("Gagal memproses permintaan");

    const parsedData = JSON.parse(jsonResponse);
    if (!Array.isArray(parsedData)) throw new Error("Respons API tidak valid");
    if (parsedData.length === 0) throw new Error("Tidak ada hasil ditemukan");

    const firstImage = parsedData[0]?.image;
    if (!firstImage) throw new Error("URL gambar tidak ditemukan");

    await rinn.sendMessage(m.chat, {
      image: { url: firstImage },
      caption: `🎨 3D Render: ${inputText}`
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    Nreply(`❌ Error: ${error.message}`);
  }
};

handler.command = ['ai3d'];
handler.description = 'AI generate gambar 3d';
handler.category = 'ai';

module.exports = handler;
