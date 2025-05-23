const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment-timezone')
const hariini = moment.tz('Asia/Jakarta').locale('id').format('dddd, DD MMMM YYYY')	
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
/*
global.ftreply = [
"https://fastrestapis.fasturl.cloud/file/v2/GeSkIlx.jpg",
"https://fastrestapis.fasturl.cloud/file/v2/XFbFlr2.png",
"https://fastrestapis.fasturl.cloud/file/v2/Bqs2LWt.jpg",
"https://fastrestapis.fasturl.cloud/file/v2/rjgTqQ1.jpg",
"https://fastrestapis.fasturl.cloud/file/v2/r1EB9B2.jpg",
"https://fastrestapis.fasturl.cloud/file/v2/n4oGnFw.jpg",
"https://fastrestapis.fasturl.cloud/file/v2/bHDxPUD.jpg"
]*/

global.owner = '6281391620354'
global.ownerName = '...'
global.nomorbot = '6288228768785'
global.botName = 'X'
global.idSaluran = "120363410273746262@newsletter"
global.namaSaluran = "Saluran ini tidak tersedia lagi"
global.bill = 0
global.prefa = ['.', '!', '#', '/', '$', '<', '=>']; // Prefix
global.tempatDB = 'database.json';
global.thumbUrl = 'https://archive.lick.eu.org/api/random/loli'
global.thumb = [
'./src/image/1.jpg',
'./src/image/2.jpg',
'./src/image/3.jpg',
'./src/image/4.jpg',
'./src/image/5.jpg',
'./src/image/6.jpg'
]

global.packnames = null //'Bukan pembuat stiker WhatsApp'
global.authors = null //`\nDibuat pada ${hariini} ${time}`

global.mess = {
	admin: "> 👮 *Fitur ini hanya untuk Admin Grup*... Pastikan Anda adalah admin untuk menggunakannya.",
        badwords: "> ❎ *Mohon maaf*... Anda tidak diperbolehkan berkata kasar disini.",
	botAdmin: "> ⚠️ *Bot harus menjadi admin grup*... Berikan hak admin kepada bot untuk menggunakan fitur ini.",
	done: "> 🎉 *Selesai!*... Terima kasih sudah menggunakan fitur ini!",
	error: "> ❌ *Terjadi kesalahan*... Silakan laporkan kepada pemilik bot untuk diperbaiki.",
	group: "> 👥 *Fitur ini hanya tersedia di grup*... Pastikan Anda berada di grup WhatsApp untuk mengakses fitur ini.",
	limit: "> ❌ *Maaf!* Limit kamu sudah habis dan tidak bisa menggunakan fitur ini.",
	noCmd: "> *❎ Tidak ada yang ditemukan!* Coba lagi nanti.",
	nsfw: "> ❎ *Media yang Anda kirimkan mengandung unsur pornografi,* pesan dihapus.",
	owner: "> 🧑‍💻 *Fitur ini hanya untuk pemilik bot*... Maaf, Anda tidak memiliki akses ke fitur ini.",
	premium: "> 🥇 *Upgrade ke Premium* untuk mendapatkan akses ke fitur eksklusif, murah dan cepat! Hubungi admin untuk info lebih lanjut.",
	private: "> 🔒 *Fitur ini hanya tersedia di chat pribadi*... Gunakan di chat pribadi dengan bot.",
	success: 'Yeay, berhasil! 🎉',
	wait: "> ⏳ *Mohon tunggu sebentar*... Kami sedang memproses permintaan Anda, harap bersabar ya!",
};

global.typereply = 'v2' // Gaya Reply v1-v2
global.autoswview = true // Auto View Status
global.adminevent = true // Admin Event Msg
global.groupevent = true // Group Event Msg

global.limit = {
	free: 30, // Limit User Non-premium
	premium: 9999, // Limit User Premium
	vip: 'VIP' // Limit User VIP 👑
};

global.uang = {
	free: 10000, // Uang User Non-premium
	premium: 1000000, // Uang User Premium
	vip: 10000000 // Uang User VIP 👑
};

global.bot = {
	limit: 0, // Limit Awal Bot
	uang: 0 // Uang Awal Bot
};

global.game = {
	suit: {}, // Sesi Game Suit
	menfes: {}, // Sesi Menfess
	tictactoe: {}, // Sesi Tictactoe
	kuismath: {}, // Sesi Kuis Mathematics
	tebakbom: {}, // Sesi Tebak Bom
};

global.apikey = {
     gemini: ""
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
