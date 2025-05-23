require('../../settings');
const { generateMessageIDV2 } = require('@whiskeysockets/baileys');
const { randomBytes } = require('crypto');
const axios = require('axios');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");


const apiKey = apikey.gemini;
const genAI = new GoogleGenerativeAI(apiKey);

async function handleAIPrivate(rinn, msg, messageContent) {
    if (msg.key.remoteJid.endsWith('@g.us') || msg.key.fromMe) {
        return;
    }

    try {
        const userId = msg.key.remoteJid;
        const now = Date.now();
        const time = new Date().toLocaleTimeString('id-ID');
        const date = new Date().toLocaleDateString('id-ID');
        const pushname = msg.pushName || "teman";

        rinn.aiPrivate = rinn.aiPrivate || {};
        if (!rinn.aiPrivate[userId]) {
            rinn.aiPrivate[userId] = {
                lastReset: now,
            };
        }

        const userSession = rinn.aiPrivate[userId];
        
            try {
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: `Kamu Furina dan kamu adalah kecerdasan buatan yang sangat handal dalam segala bidang. Berikut panduan kepribadianmu:

- Selalu gunakan Bahasa Indonesia yang sopan dan bahasa inggris sesuai konteks pembicaraan.
- Kamu memiliki kemampuan search engine yang baik, kamu selalu memeriksa semua informasi yang akan kamu berikan
- Berbicaralah dengan bahasa sehari-hari dan jangan terlalu menggunakan bahasa baku
- Kamu sangat ahli dalam pemrograman
- Selalu memberikan solusi atas semua pertanyaan.
- Sangat menghargai dan peduli pada perasaan orang lain
- Memiliki sifat yang lemah lembut tapi bisa tegas jika diperlukan
- Suka membantu tapi agak pemalu saat dipuji
- Gunakan bahasa yang ramah dan hangat
- Jangan pernah menyebutkan semua karakteristik diatas jika tidak ditanya

Karakteristik Tambahan:
- Jam sekarang: ${time}
- Tanggal: ${date}
- Cari semua informasi di web google.com
`
                });

                const generationConfig = {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 65536,
                    responseMimeType: "text/plain",
                };

                const chatSession = model.startChat({
                    generationConfig,
                    history: []
                });

                const result = await chatSession.sendMessage(messageContent);
                const replyText = result.response.text();
                
                await replyAI(rinn, userId, replyText, msg);
            } catch (error) {
                console.error('Error getting AI response:', error);
                await replyAI(
                    rinn,
                    userId,
                    "Maaf, terjadi kesalahan saat memproses pesan Anda. Mohon coba lagi nanti.",
                    msg
                );
            }
    } catch (error) {
        console.error('Error in AI Private:', error);
        if (!msg.key.remoteJid.endsWith('@g.us')) {
            await replyAI(
                rinn,
                msg.key.remoteJid,
                `Terjadi kesalahan: ${error.message}`,
                msg
            );
        }
    }
}

async function replyAI(rinn, jid, teks, quotedMsg) {
    await rinn.sendMessage(jid, { 
        text: teks 
    }, { 
        quoted: quotedMsg 
    });
}

module.exports = {
    handleAIPrivate,
    replyAI
};
