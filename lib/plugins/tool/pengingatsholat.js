const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');

const configPath = './storage/sholat.json';
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

// Fungsi untuk mendapatkan daftar kota
async function getListKota() {
    try {
        let { data } = await axios.get("https://rest.cloudkuimages.xyz/api/muslim/listkota");
        if (!data || !data.result) return null;
        return data.result; // Return array daftar kota
    } catch (error) {
        console.error("Error mengambil daftar kota:", error);
        return null;
    }
}

// Fungsi untuk mendapatkan jadwal sholat
async function getJadwalSholat(cityId) {
    let date = new Date().toISOString().split('T')[0]; // Ambil tanggal hari ini

    try {
        let { data } = await axios.get(`https://rest.cloudkuimages.xyz/api/muslim/jadwalsholat?cityId=${cityId}&date=${date}`);
        if (!data || !data.result) return null;

        return {
            lokasi: data.result.lokasi,
            daerah: data.result.daerah,
            timezone: "Asia/Jakarta", 
            imsak: data.result.jadwal.imsak,
            subuh: data.result.jadwal.subuh,
            dzuhur: data.result.jadwal.dzuhur,
            ashar: data.result.jadwal.ashar,
            maghrib: data.result.jadwal.maghrib,
            isya: data.result.jadwal.isya
        };
    } catch (error) {
        console.error("Error mengambil jadwal sholat:", error);
        return null;
    }
}

async function handler(m, ctx) {
    const { command, args, isGroup, isAdmins } = ctx;
    
    switch (command) {
        case 'sholat': {
            let pesan = `🕌 *Pengaturan Jadwal Sholat*  
Gunakan perintah ini:  
- \`.setjadwal [nama kota]\` ➝ Aktifkan pengingat sholat  
  🔹 *Contoh:* \`.setjadwal Bogor\`  
- \`.matikanjadwal\` ➝ Matikan pengingat sholat  
- \`.listkota\` ➝ Lihat daftar kota yang tersedia  
- \`.cekjadwal\` ➝ Lihat Jadwal Sholat Di Kota yang tersedia

⚡ *Format Notifikasi Sholat:*  
📢 *Saat Waktu Sholat Tiba:*  
🌆 *Maghrib Telah Tiba*  
Pergi dan ambil air wudhu lalu sholatlah
📍 *Lokasi:* KAB. BOGOR, JAWA BARAT  

🌙 *Pengaturan Pengingat Puasa*  
Gunakan perintah ini:  
- \`.setpuasa [on/off]\` ➝ Aktifkan/matikan pengingat sahur & buka puasa  
  🔹 *Contoh:* \`.setpuasa on\`  
- \`.matikanpuasa\` ➝ Matikan pengingat puasa`;

            return ctx.reply(pesan);
        }
        
        case 'matikanjadwal': {
            let config = loadConfig();
            if (!config[m.chat]) ensureGroupConfig(m.chat);

            if (!config[m.chat].jadwalSholat?.aktif) return ctx.reply("Jadwal sholat sudah nonaktif!");

            config[m.chat].jadwalSholat.aktif = false;
            saveConfig(config);

            return ctx.reply("Jadwal sholat telah dimatikan untuk grup ini!");
        }
        
        case 'matikanpuasa': {
            let config = loadConfig();
            if (!config[m.chat]) ensureGroupConfig(m.chat);

            if (!config[m.chat].jadwalPuasa?.aktif) return ctx.reply("Jadwal puasa sudah nonaktif!");

            config[m.chat].jadwalPuasa.aktif = false;
            saveConfig(config);

            return ctx.reply("Jadwal puasa telah dimatikan untuk grup ini!");
        }
        
        case 'setjadwal': {
            if (!args[0]) return ctx.reply("*Masukkan nama kota!*\n\nContoh: `.setjadwal Bogor`");

            let daftarKota = await getListKota();
            if (!daftarKota) return ctx.reply("*Gagal mengambil daftar kota!*");

            let kota = daftarKota.find(k => k.lokasi.toLowerCase().includes(args.join(" ").toLowerCase()));
            if (!kota) return ctx.reply("*Kota tidak ditemukan!* Cek daftar kota dengan `.listkota`");

            let config = loadConfig();
            if (!config[m.chat]) ensureGroupConfig(m.chat);

            config[m.chat].jadwalSholat = { lokasi: kota.lokasi, cityId: kota.id, aktif: true };
            saveConfig(config);

            return ctx.reply(`*Jadwal sholat grup diatur ke:* ${kota.lokasi}`);
        }
        
        case 'setpuasa': {
            if (!["on", "off"].includes(args[0])) return ctx.reply("*Gunakan:*\n- `.setpuasa on` ➝ Aktifkan mode puasa\n- `.setpuasa off` ➝ Nonaktifkan mode puasa");

            let config = loadConfig();
            if (!config[m.chat]) ensureGroupConfig(m.chat);

            let status = args[0] === "on";
            config[m.chat].jadwalPuasa = { ...config[m.chat].jadwalPuasa || {}, aktif: status };
            saveConfig(config);

            return ctx.reply(`*Mode puasa telah ${status ? "diaktifkan" : "dimatikan"}!*`);
        }
        
        case 'listkota': {
            let daftarKota = await getListKota();
            if (!daftarKota) return ctx.reply("Gagal mengambil daftar kota!");

            let page = parseInt(args[0]) || 1;
            let perPage = 20; 
            let totalPage = Math.ceil(daftarKota.length / perPage);

            if (page > totalPage || page < 1) return ctx.reply(`Halaman tidak ditemukan! Total halaman: ${totalPage}`);

            let start = (page - 1) * perPage;
            let end = start + perPage;
            let data = daftarKota.slice(start, end);

            let pesan = `*Daftar Kota (Halaman ${page}/${totalPage})*\n\n`;
            data.forEach(k => {
                pesan += `• ${k.lokasi} (ID: ${k.id})\n`;
            });

            pesan += `\nGunakan: \`.listkota [halaman]\` untuk melihat kota lainnya!\nContoh: \`.listkota 2\``;

            return ctx.reply(pesan);
        }
        
        case 'cekjadwal': {
            if (!args[0]) return ctx.reply("*Masukkan nama kota!*\n\n*Contoh:* `.cekjadwal Jakarta`");

            let daftarKota = await getListKota();
            if (!daftarKota) return ctx.reply("*Gagal mengambil daftar kota!*");

            let kota = daftarKota.find(k => k.lokasi.toLowerCase().includes(args.join(" ").toLowerCase()));
            if (!kota) return ctx.reply("*Kota tidak ditemukan!* Cek daftar kota dengan `.listkota`");

            let jadwal = await getJadwalSholat(kota.id);
            if (!jadwal) return ctx.reply("*Gagal mengambil jadwal sholat untuk kota ini!*");

            let pesan = `*Jadwal Sholat untuk ${jadwal.lokasi}, ${jadwal.daerah}*\n`;
            pesan += `*Subuh:* \`${jadwal.subuh}\`\n`;
            pesan += `*Dzuhur:* \`${jadwal.dzuhur}\`\n`;
            pesan += `*Ashar:* \`${jadwal.ashar}\`\n`;
            pesan += `*Maghrib:* \`${jadwal.maghrib}\`\n`;
            pesan += `*Isya:* \`${jadwal.isya}\`\n`;

            return ctx.reply(pesan);
        }
        
        default:
            return null;
    }
}

// Definisi command dan deskripsi plugin
handler.command = ['sholat', 'matikanjadwal', 'matikanpuasa', 'setjadwal', 'setpuasa', 'listkota', 'cekjadwal'];
handler.description = 'Pengaturan jadwal sholat dan pengingat puasa';
handler.category = 'tools';
handler.restrict = {
    adminOnly: true,
    groupOnly: true
};

module.exports = handler;
