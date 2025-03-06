const fs = require('fs');
const chalk = require('chalk');

global.ftreply = [
"https://img86.pixhost.to/images/588/564679523_media.jpg",
"https://img86.pixhost.to/images/588/564679589_media.jpg",
"https://img86.pixhost.to/images/588/564679622_media.jpg",
"https://img86.pixhost.to/images/588/564679679_media.jpg",
"https://img86.pixhost.to/images/588/564679710_media.jpg",
"https://img86.pixhost.to/images/588/564679716_media.jpg"
]
global.pairing = '6287726985759'
global.owner = '6281391620354'
global.ownerName = '...'
global.nomorbot = '6288228768785@s.whatsapp.net'
global.botName = 'Jadilah Budak Baik'
global.idSaluran = "120363410273746262@newsletter"
global.namaSaluran = "Sumber Ketololan"
global.anticall = false
global.antispam = true
global.bill = 0
global.prefa = ['.', '!', '#', '/', '$', '>', '=>']; // Prefix
global.tempatDB = 'database.json';

global.mess = {
	admin: 'Fitur khusus admin',
	botAdmin: 'Bot harus jadi admin dulu',
	done: 'Done ga bang? Done.. ✨',
	error: 'Ada yang error, hmmm...',
	group: 'Fitur cuma bisa dipakai di grup',
	limit: 'Limit habis',
	noCmd: 'Mau cari apa?',
	nsfw: 'Astagfirullah',
	owner: 'Kamu bukan owner!',
	premium: 'Pay2Win dulu lah',
	private: 'Pakai fitur ini di private chat',
	success: 'Yeay, berhasil! 🎉',
	wait: 'wait....'
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
