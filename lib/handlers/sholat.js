const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');

const configPath = './storage/sholat.json';

// Fungsi untuk me-load konfigurasi dari file
function loadConfig() {
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, "{}");
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

// Fungsi untuk menyimpan konfigurasi ke file
function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// Memastikan konfigurasi grup ada
function ensureGroupConfig(groupId) {
    let config = loadConfig();
    if (!config[groupId]) {
        config[groupId] = {
            jadwalSholat: { aktif: false, cityId: "" },
            jadwalPuasa: { aktif: false }
        };
        saveConfig(config);
    }
    return config;
}

async function getJadwalSholat(cityId) {
    try {
        let date = moment().format("YYYY-MM-DD");
        let { data } = await axios.get(`https://rest.cloudkuimages.xyz/api/muslim/jadwalsholat?cityId=${cityId}&date=${date}`);

        if (data.status !== 200 || !data.result) return null;
        
        return {
            lokasi: data.result.lokasi,
            daerah: data.result.daerah,
            jadwal: data.result.jadwal
        };
    } catch (err) {
        console.error("❌ Error mengambil jadwal sholat:", err);
        return null;
    }
}

const zoneMapping = {
    "jakarta": "Asia/Jakarta",
    "bandung": "Asia/Jakarta",
    "surabaya": "Asia/Jakarta",
    "yogyakarta": "Asia/Jakarta",
    "makassar": "Asia/Makassar",
    "denpasar": "Asia/Makassar",
    "manado": "Asia/Makassar",
    "papua": "Asia/Jayapura",
    "ambon": "Asia/Jayapura",
    "jayapura": "Asia/Jayapura",
};

function initSholat(rinn) {
    let lastSentTime = {};
    
    setInterval(async () => {
    let config = loadConfig();
    let nowUTC = moment().utc();

    for (let groupId in config) {
        let grup = config[groupId];

        if (grup.jadwalSholat?.aktif) {
            let cityId = grup.jadwalSholat?.cityId.toLowerCase();
            let hasilJadwal = await getJadwalSholat(cityId);
            if (!hasilJadwal) continue;

            let { lokasi, daerah, jadwal } = hasilJadwal;
            let timezone = zoneMapping[cityId] || "Asia/Jakarta";
            let now = moment().tz(timezone);
            let jamSekarang = now.format("HH:mm");

            let isPuasa = grup.jadwalPuasa?.aktif;

            let pesanSholat = {
                imsak: isPuasa
                    ? "⏱️ *Waktu Imsak Telah Tiba!* ⏱️\nJangan lupa sahur dan baca niat puasanya ya! 😊"
                    : "⏱️ *Waktu Imsak Telah Tiba!* ⏱️\nBuat yang gak puasa, boleh lanjut tidur. 😴",

                subuh: isPuasa
                    ? "🌙 *Waktu Subuh Telah Tiba!* 🌙\nSahur telah selesai! Jangan lupa niat puasa dan sholat subuh ya. 😊"
                    : "🌙 *Waktu Subuh Telah Tiba!* 🌙\nBangunlah dan mulai harimu dengan sholat subuh yang berkah! Jangan lupa dzikir pagi ya! 😊",

                dzuhur: isPuasa
                    ? "☀️ *Waktu Dzuhur Telah Tiba!* ☀️\nTetap semangat berpuasa! Jangan lupa sholat dzuhur untuk menambah keberkahan. 🤲"
                    : "☀️ *Waktu Dzuhur Telah Tiba!* ☀️\nSaatnya istirahat sejenak dan mendekatkan diri kepada Allah dengan sholat dzuhur.",

                ashar: isPuasa
                    ? "🌤️ *Waktu Ashar Telah Tiba!* 🌤️\nHampir maghrib! Tetap semangat dan jangan lupa sholat ashar. 😊"
                    : "🌤️ *Waktu Ashar Telah Tiba!* 🌤️\nJangan lupa untuk sholat ashar! Semoga harimu penuh keberkahan. 😊",

                maghrib: isPuasa
                    ? "🌆 *Waktu Maghrib Telah Tiba!* 🌆\nAlhamdulillah! Saatnya berbuka puasa, jangan lupa doa sebelum makan. 🍽️"
                    : "🌆 *Waktu Maghrib Telah Tiba!* 🌆\nSaatnya sholat maghrib! Jangan lupa berdoa sebelum makan. 🍽️",

                isya: isPuasa
                    ? "🌌 *Waktu Isya & Tarawih Telah Tiba!* 🌌\nJangan lupa sholat isya dan lanjutkan dengan tarawih ya! Semoga Allah memberkahi kita semua. 🤲"
                    : "🌌 *Waktu Isya Telah Tiba!* 🌌\nJangan lupa sholat isya dan istirahat yang cukup! 😊"
            };

            for (let waktu in pesanSholat) {
                if (jadwal[waktu] && jamSekarang === jadwal[waktu] && lastSentTime[groupId] !== jamSekarang) {
                    lastSentTime[groupId] = jamSekarang; // Cegah spam
                    let pesan = pesanSholat[waktu];
                    let imageUrl = "https://img5.pixhost.to/images/3023/569226926_flowfalcon-media.jpg";

                    console.log(`✅ Mengirim pengingat ${waktu} ke grup: ${groupId}`);

                    await rinn.sendMessage(groupId, {
                        text: `${pesan}\n\n📍 Lokasi: *${lokasi}, ${daerah}*`,
                        contextInfo: {
                            externalAdReply: {
                                title: `🕌 ${waktu.charAt(0).toUpperCase() + waktu.slice(1)} Telah Tiba!`,
                                body: `UNTUK WILAYAH ${lokasi} DAN SEKITARNYA`,
                                mediaType: 1,
                                thumbnailUrl: imageUrl,
                                renderLargerThumbnail: true,
                                sourceUrl: ""
                            }
                        }
                    });
                    
                }
            }
        }
    }
}, 60000);
}

module.exports.initSholat = initSholat;
