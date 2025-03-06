const axios = require('axios');
const { format } = require('date-fns');
const { id } = require('date-fns/locale');

async function getJadwalSholat(namaDaerah) {
  try {
    // Check if query contains "kota" or "kab" prefix
    let isKota = false;
    let isKab = false;
    let searchQuery = namaDaerah;
    
    if (namaDaerah.toLowerCase().startsWith('kota ')) {
      isKota = true;
      searchQuery = namaDaerah.substring(5).trim();
    } else if (namaDaerah.toLowerCase().startsWith('kab ')) {
      isKab = true;
      searchQuery = namaDaerah.substring(4).trim();
    }
    
    const response = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${searchQuery}`);
    if (!response.data.status || response.data.status !== true || response.data.data.length === 0) {
      throw new Error('Kota/Kabupaten tidak ditemukan');
    }
    
    // Cari kota dan kabupaten dari hasil pencarian
    const hasilPencarian = response.data.data;
    let idDaerah = null;
    let namaDaerahLengkap = '';
    
    // Pilih daerah berdasarkan parameter kota/kab
    if (isKota) {
      const hasilKota = hasilPencarian.find(item => item.lokasi.toLowerCase().includes('kota'));
      if (hasilKota) {
        idDaerah = hasilKota.id;
        namaDaerahLengkap = hasilKota.lokasi;
      } else {
        throw new Error(`Kota ${searchQuery} tidak ditemukan`);
      }
    } else if (isKab) {
      const hasilKab = hasilPencarian.find(item => item.lokasi.toLowerCase().includes('kab'));
      if (hasilKab) {
        idDaerah = hasilKab.id;
        namaDaerahLengkap = hasilKab.lokasi;
      } else {
        throw new Error(`Kabupaten ${searchQuery} tidak ditemukan`);
      }
    } else {
      // Jika tidak ada parameter khusus, gunakan hasil pertama
      idDaerah = hasilPencarian[0].id;
      namaDaerahLengkap = hasilPencarian[0].lokasi;
    }
    
    const todayForHijri = format(new Date(), 'yyyy-MM-dd');
    const todayForJadwal = format(new Date(), 'yyyy/MM/dd');
    
    const hijrResponse = await axios.get(`https://api.myquran.com/v2/cal/hijr/${todayForHijri}/-1`);
    const jadwalResponse = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${idDaerah}/${todayForJadwal}`);
    
    if (!jadwalResponse.data.status || jadwalResponse.data.status !== true) {
      throw new Error('Gagal mendapatkan jadwal sholat');
    }

    // Ekstrak tanggal hijriah dan masehi dari respons
    let tanggalHijriah = '';
    let tanggalMasehi = '';
    
    if (hijrResponse.data && hijrResponse.data.data && Array.isArray(hijrResponse.data.data.date)) {
      // Format: [0] = hari, [1] = tanggal hijriah, [2] = tanggal masehi
      tanggalHijriah = hijrResponse.data.data.date[0] + ', ' + hijrResponse.data.data.date[1];
      tanggalMasehi = hijrResponse.data.data.date[2];
    } else {
      // Fallback jika format respons berbeda
      tanggalHijriah = format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id });
      tanggalMasehi = format(new Date(), 'dd-MM-yyyy');
    }
    
    return {
      kota: namaDaerahLengkap,
      tanggalHijriah: tanggalHijriah,
      tanggalMasehi: tanggalMasehi,
      imsak: jadwalResponse.data.data.jadwal.imsak,
      subuh: jadwalResponse.data.data.jadwal.subuh,
      terbit: jadwalResponse.data.data.jadwal.terbit,
      dzuhur: jadwalResponse.data.data.jadwal.dzuhur,
      ashar: jadwalResponse.data.data.jadwal.ashar,
      maghrib: jadwalResponse.data.data.jadwal.maghrib,
      isya: jadwalResponse.data.data.jadwal.isya,
      dhuha: jadwalResponse.data.data.jadwal.dhuha
    };
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error(error.message || 'Terjadi kesalahan saat mengambil data jadwal sholat');
  }
}

async function handler(m, { rinn, args, text, reactionMessage }) {
  try {
    await reactionMessage('⌛');
    
    if (!text && !args[0]) {
      throw new Error('Silakan masukkan nama kota, contoh: .jadwalsholat Jakarta');
    }
    
    const namaDaerah = text || args.join(' ');
    const jadwal = await getJadwalSholat(namaDaerah);
    
    const jadwalText = `*JADWAL SHOLAT*
${jadwal.tanggalHijriah} | ${jadwal.tanggalMasehi}
*Daerah:* ${jadwal.kota}

*Imsak:* ${jadwal.imsak}
*Subuh:* ${jadwal.subuh}
*Terbit:* ${jadwal.terbit}
*Dhuha:* ${jadwal.dhuha}
*Dzuhur:* ${jadwal.dzuhur}
*Ashar:* ${jadwal.ashar}
*Maghrib:* ${jadwal.maghrib}
*Isya:* ${jadwal.isya}

_Sumber: https://bimasislam.kemenag.go.id/jadwalshalat_`;
    
    await reactionMessage('✅');
    await m.reply(jadwalText);
    
  } catch (error) {
    await reactionMessage('❌');
    await m.reply(`❌ *Error:* ${error.message || 'Terjadi kesalahan pada server'}`);
  }
}

handler.command = ['jadwalsholat'];
handler.help = ['jadwalsholat <kota/kabupaten>', 'jadwalsholat kota <nama_kota>', 'jadwalsholat kab <nama_kabupaten>'];
handler.tags = ['muslim', 'tools'];
handler.description = 'Menampilkan jadwal sholat';
handler.category = 'tools', 'muslim';

module.exports = handler;
