const { generateMessageIDV2 } = require('@whiskeysockets/baileys');
const { randomBytes } = require('crypto');
const axios = require('axios');
const { translate } = require('bing-translate-api');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");


const apiKey = "AIzaSyBgmm-AWt3DxguMof6TeLDA27bI64GUNcU";
const genAI = new GoogleGenerativeAI(apiKey);

// Image generation function
async function text2img(prompt, size = 512) {
    let { data } = await axios.post('https://ftvwohriusaknrzfogjh.supabase.co/functions/v1/generate-image', {
        "prompt": prompt + ", professional photograph, raw photo, unedited photography, photorealistic, 8k uhd, high quality dslr photo, sharp focus, detailed, crystal clear, natural lighting",
        "width": size,
        "height": size
    }, {
        headers: {
            "authority": "ftvwohriusaknrzfogjh.supabase.co",
            "Content-Type": "application/json",
            "Origin": "https://aiimagegenerator.site",
            "Referer": "https://aiimagegenerator.site/",
            "priority": "u=0, i",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dndvaHJpdXNha25yemZvZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDc1NDMsImV4cCI6MjA0OTkyMzU0M30.JXPW9daK9AEov4sOt83qOgvx43-hE6QYfdO0h-nUHSs",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dndvaHJpdXNha25yemZvZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDc1NDMsImV4cCI6MjA0OTkyMzU0M30.JXPW9daK9AEov4sOt83qOgvx43-hE6QYfdO0h-nUHSs"
        }
    });

    let base64 = data.image.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    if (data.status == 500) return { success: false };
    return { success: true, image: base64 };
}

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

        // Initialize AI Private data structure
        rinn.aiPrivate = rinn.aiPrivate || {};
        if (!rinn.aiPrivate[userId]) {
            rinn.aiPrivate[userId] = {
                lastReset: now,
            };
        }

        const userSession = rinn.aiPrivate[userId];
        
        // Check if the message is an image generation request
        const imageGenerationPhrases = ['buatkan gambar', 'buat gambar', 'bikin gambar', 'generate gambar', 'generate image'];
        const isImageRequest = imageGenerationPhrases.some(phrase => 
            messageContent.toLowerCase().includes(phrase.toLowerCase())
        );

        if (isImageRequest) {
            // Extract the image prompt by removing the triggering phrase
            let imagePrompt = messageContent;
            for (const phrase of imageGenerationPhrases) {
                if (messageContent.toLowerCase().includes(phrase.toLowerCase())) {
                    // Remove the phrase and trim spaces
                    imagePrompt = messageContent.replace(new RegExp(phrase, 'i'), '').trim();
                    break;
                }
            }

            // Check for size parameter (optional)
            const sizes = [512, 768, 1024, 1200];
            let selectedSize = 512;
            const words = imagePrompt.split(' ');
            const lastWord = words[words.length - 1];
            
            if (!isNaN(lastWord) && sizes.includes(parseInt(lastWord))) {
                selectedSize = parseInt(lastWord);
                imagePrompt = words.slice(0, -1).join(' ');
            }

            await replyAI(
                rinn,
                userId,
                "Sedang membuat gambar, mohon tunggu sebentar...",
                msg
            );

            try {
                // Translate the prompt to English for better results
                const translated = await translate(imagePrompt, null, 'en');
                const result = await text2img(translated.translation, selectedSize);
                
                if (!result.success) {
                    await replyAI(
                        rinn,
                        userId,
                        "Maaf, gagal membuat gambar. Silakan coba lagi dengan prompt yang berbeda.",
                        msg
                    );
                    return;
                }
                
                // Convert base64 to buffer and send image
                const buffer = Buffer.from(result.image, 'base64');
                await rinn.sendMessage(userId, { 
                    image: buffer,
                    caption: 'Gambar berhasil dibuat.'
                }, { quoted: msg });

            } catch (error) {
                console.error('Error generating image:', error);
                await replyAI(
                    rinn,
                    userId,
                    "Maaf, terjadi kesalahan saat membuat gambar. Silakan coba lagi nanti.",
                    msg
                );
            }
        } else {
            // Handle normal AI chat
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
                
                // Send AI response using bubble chat
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
    const stanza = [
        {
            attrs: {
                biz_bot: '1'
            },
            tag: "bot"
        },
        {
            attrs: {},
            tag: "biz"
        }
    ];

    const gen = {
        conversation: teks,
        messageContextInfo: {
            messageSecret: randomBytes(32),
            supportPayload: "{\"version\": 1, \"is_ai_message\": true, \"should_show_system_message\": true, \"ticket_id\": \"1669945700536053\"}"
        }
    };

    await rinn.relayMessage(jid, gen, {
        messageId: generateMessageIDV2(rinn.user?.id),
        additionalNodes: stanza,
        quoted: quotedMsg
    });
}

module.exports = {
    handleAIPrivate,
    replyAI
};
