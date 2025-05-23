process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

require('./settings')
const {
    default: makeWASocket,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState,
    DisconnectReason,
    PHONENUMBER_MCC,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode,
    proto,
    delay,
    Browsers,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateForwardMessageContent,
    getContentType,
    downloadContentFromMessage,
    fetchLatestWaWebVersion
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const { readdirSync, statSync, unlinkSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");
const pino = require("pino");
const path = require('path')
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const FileType = require('file-type')
const _ = require('lodash')
const chalk = require('chalk')
const PhoneNumber = require("awesome-phonenumber");
const readline = require("readline");

const {
    formatSize,
    runtime,
    sleep,
    color,
    getBuffer
} = require("./App/function/funcc")
const {
    toAudio,
    toPTT,
    toVideo,
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} = require('./App/function/exif')
const { MessagesUpsert, GroupUpdate, GroupParticipantsUpdate, Solving } = require('./App/function/message');
const { initSholat } = require('./lib/handlers/sholat')

const DataBase = require('./App/function/database');
const database = new DataBase(global.tempatDB);

(async () => {
	const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			set: {},
			users: {},
			game: {},
			groups: {},
			database: {},
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}
	
	setInterval(async () => {
		if (global.db) await database.write(global.db)
	}, 30000)
})();

const groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false})

function clearSessions(folder = './storage/session') {
	let filename = []
	readdirSync(folder).forEach(file => filename.push(join(folder, file)))
	return filename.map(file => {
		let stats = statSync(file)
		if (stats.isFile() &&
			(Date.now() - stats.mtimeMs >= 1000 * 60 * 120) &&
			!file.includes('creds.json')) {
			console.log('Deleted old session:', file)
			return unlinkSync(file)
		}
		return false
	})
}

async function connectionUpdate(update) {
	const {
		receivedPendingNotifications,
		connection,
		lastDisconnect,
		isOnline,
		isNewLogin
	} = update

	if (isNewLogin) {
		conn.isInit = true
		console.log(chalk.green('Login Baru Terdeteksi'))
	}

	switch (connection) {
		case 'connecting':
			console.log(chalk.redBright('Mengaktifkan Bot, Mohon tunggu sebentar...'))
			break
		case 'open':
			console.log(chalk.green('Berhasil Tersambung'))
			break
		case 'close':
			console.log(chalk.red('⏱️ Koneksi Terputus'))

			if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
				console.log(chalk.yellow('Mencoba menghubungkan kembali...'))
				await global.reloadHandler(true)
			} else {
				console.log(chalk.red('Koneksi gagal - Logged Out'))
			}
			break
	}

	if (isOnline === true) console.log(chalk.green('Status Aktif'))
	if (isOnline === false) console.log(chalk.red('Status Mati'))

	if (receivedPendingNotifications) {
		console.log(chalk.yellow('Menunggu Pesan Baru'))
	}

	global.timestamp.connect = new Date

	if (global.db.data == null) await global.loadDatabase()
}

async function initConnection() {
	if (!existsSync(global.authFile)) {
		mkdirSync(global.authFile, {
			recursive: true
		})
	}

	try {
		await conn.connect()
	} catch (error) {
		console.error('Kesalahan saat koneksi:', error)
		setTimeout(initConnection, 5000)
	}
}

function createTmpFolder() {
    const folderName = "tmp";
    const folderPath = path.join(__dirname, folderName);
    
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder '${folderName}' berhasil dibuat di ${folderPath}`);
    }
}

createTmpFolder();

let usePairingCode = false;
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(text, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

async function pilihMetodeKoneksi() {
  const sessionExists = fs.existsSync('./storage/session/creds.json');
  if (sessionExists) return;

  console.clear();
  console.log(chalk.blueBright('╭────────────────────────────────────────────╮'));
  console.log(chalk.blueBright('│ ') + chalk.whiteBright.bold('  Pilih Metode Koneksi WhatsApp') + '           ' + chalk.blueBright('│'));
  console.log(chalk.blueBright('╰────────────────────────────────────────────╯'));
  console.log(chalk.green('\n1.') + ' Pairing Code');
  console.log(chalk.green('2.') + ' QR Code\n');

  const jawaban = await question('Pilih nomor (1/2): ');
  if (jawaban.trim() === '1') {
    usePairingCode = true;
  } else if (jawaban.trim() === '2') {
    usePairingCode = false;
  } else {
    console.log(chalk.red('Pilihan tidak valid, default ke QR Code.'));
    usePairingCode = false;
  }
}

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./storage/session');
const sock = makeWASocket({
  logger: pino({ level: "silent" }),
  printQRInTerminal: !usePairingCode,
  auth: state,
  browser: Browsers.iOS('Safari'),
  msgRetryCounterMap: {},
  retryRequestDelayMs: 250,
  markOnlineOnConnect: false,
  emitOwnEvents: true,
  syncFullHistory: true,
  getMessage: async (key) => {
    return { conversation: 'Pesan tidak tersedia.' };
  },
  patchMessageBeforeSending: (msg) => {
    if (msg.contextInfo) delete msg.contextInfo.mentionedJid;
    return msg;
  }
});
if (usePairingCode && !sock.authState.creds.registered) {
console.log(chalk.gray(`⣿⣿⣷⡁⢆⠈⠕⢕⢂⢕⢂⢕⢂⢔⢂⢕⢄⠂⣂⠂⠆⢂⢕⢂⢕⢂⢕⢂⢕⢂
⣿⣿⣿⡷⠊⡢⡹⣦⡑⢂⢕⢂⢕⢂⢕⢂⠕⠔⠌⠝⠛⠶⠶⢶⣦⣄⢂⢕⢂⢕
⣿⣿⠏⣠⣾⣦⡐⢌⢿⣷⣦⣅⡑⠕⠡⠐⢿⠿⣛⠟⠛⠛⠛⠛⠡⢷⡈⢂⢕⢂
⠟⣡⣾⣿⣿⣿⣿⣦⣑⠝⢿⣿⣿⣿⣿⣿⡵⢁⣤⣶⣶⣿⢿⢿⢿⡟⢻⣤⢑⢂
⣾⣿⣿⡿⢟⣛⣻⣿⣿⣿⣦⣬⣙⣻⣿⣿⣷⣿⣿⢟⢝⢕⢕⢕⢕⢽⣿⣿⣷⣔
⣿⣿⠵⠚⠉⢀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⢕⢕⢕⢕⢕⢕⣽⣿⣿⣿⣿
⢷⣂⣠⣴⣾⡿⡿⡻⡻⣿⣿⣴⣿⣿⣿⣿⣿⣿⣷⣵⣵⣵⣷⣿⣿⣿⣿⣿⣿⡿
⢌⠻⣿⡿⡫⡪⡪⡪⡪⣺⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃
⠣⡁⠹⡪⡪⡪⡪⣪⣾⣿⣿⣿⣿⠋⠐⢉⢍⢄⢌⠻⣿⣿⣿⣿⣿⣿⣿⣿⠏⠈
⡣⡘⢄⠙⣾⣾⣾⣿⣿⣿⣿⣿⣿⡀⢐⢕⢕⢕⢕⢕⡘⣿⣿⣿⣿⣿⣿⠏⠠⠈
⠌⢊⢂⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢐⢕⢕⢕⢕⢕⢅⣿⣿⣿⣿⡿⢋⢜⠠⠈
⠄⠁⠕⢝⡢⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣕⣑⣑⣑⣵⣿⣿⣿⡿⢋⢔⢕⣿⠠⠈
⠨⡂⡀⢑⢕⡅⠂⠄⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⢔⢕⢕⣿⣿⠠⠈
⠄⠪⣂⠁⢕⠆⠄⠂⠄⠁⡀⠂⡀⠄⢈⠉⢍⢛⢛⢛⢋⢔⢕⢕⢕⣽⣿⣿⠠⠈`));
    console.log(chalk.blueBright('│') + chalk.whiteBright('  Masukkan Nomor WhatsApp ') + chalk.yellow('(awali dengan 62)'));
    console.log(chalk.blueBright('└─> ') + chalk.cyanBright(''));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const phoneNumber = await new Promise((resolve) => {
      rl.question('', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });

    const code = await sock.requestPairingCode(phoneNumber, 'SUKISUKI');
    console.log(chalk.greenBright(`\nKode Pairing kamu: `) + chalk.yellowBright(code));
    console.log(chalk.white(`Silakan buka WhatsApp > Perangkat Tertaut > Tautkan perangkat menggunakan kode.`));
  }

  store.bind(sock.ev);
  await Solving(sock, store)

  sock.ev.on("creds.update", saveCreds);
  await initSholat(sock);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      console.log('Koneksi terputus, mencoba menyambung ulang...', shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      console.log(chalk.greenBright('▣──────────────────────────────···\n│\n│❧ Suksess Terhubung Ke WhatsApp  ✅\n│\n▣──────────────────────────────···'));
      console.log(chalk.yellow.bold("📁     Inisialisasi modul..."));
        console.log(chalk.cyan.bold("- Whatsapp Bot Siap Di Gunakan"));
    console.log(chalk.cyan.bold("- Database Telah Diinisialisasi"));
    
    console.log(chalk.blue.bold("\n🤖     Info Bot:"));
    console.log(chalk.white.bold("- Status Server: ") + chalk.green.bold("Online"));
    }
  });

  sock.ev.on('groups.update', async (update) => {
                await GroupUpdate(sock, update, store);
                const metadata = await sock.groupMetadata(update.id)
                groupCache.set(update.id, metadata)
  });

  sock.ev.on('group-participants.update', async (groupUpdate) => {
                await GroupParticipantsUpdate(sock, groupUpdate, store);
                const metadata = await sock.groupMetadata(groupUpdate.id)
                groupCache.set(groupUpdate.id, metadata)
  });

  sock.ev.on('messages.upsert', async (chatUpdate) => {
                await MessagesUpsert(sock, chatUpdate, store);
  });

    sock.ev.on("contacts.update", (update) => {
        for (let contact of update) {
            let id = sock.decodeJid(contact.id);
            if (store && store.contacts) {
                store.contacts[id] = {
                    id,
                    name: contact.notify
                };
            }
        }
    });

    sock.ev.on('call', async (call) => {
		let botNumber = await sock.decodeJid(sock.user.id);
		if (db.set[botNumber].anticall) {
			for (let id of call) {
				if (id.status === 'offer') {
					let msg = await sock.sendMessage(id.from, { text: `Saat Ini, Kami Tidak Dapat Menerima Panggilan ${id.isVideo ? 'Video' : 'Suara'}.\nJika @${id.from.split('@')[0]} Memerlukan Bantuan, Silakan Hubungi Owner :)`, mentions: [id.from]});
					await sock.sendContact(id.from, global.owner, msg);
					await sock.rejectCall(id.id, id.from)
				}
			}
		}
	});
      // Jalankan fungsi clearSessions setiap 3 jam
    clearSessions('storage/session');
    setInterval(() => {
        console.log('Menjalankan pembersihan session...');
        clearSessions('storage/session');
    }, 1000 * 60 * 180);
}

const main = async () => {
  try {
    await pilihMetodeKoneksi();
    await connectToWhatsApp();
  } catch (error) {
    console.error('Error starting application:', error);
  }
};

main();

process.on('uncaughtException', console.error)
//batas
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Update ${__filename}`)
    delete require.cache[file]
    require(file)
})
