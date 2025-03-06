const chalk = require('chalk');
const fs = require('fs');
const readmore = String.fromCharCode(8206).repeat(4001);

global.allMenu = (prefix, bill) => {
return`
╭─❒ 「 AI MENU 」
│ ○ ${prefix}ai
│ ○ ${prefix}autoai
│ ○ ${prefix}blackbox || bb
│ ○ ${prefix}ai3d
│ ○ ${prefix}magicstudio || ms
│ ○ ${prefix}texttoimg || txt2img
╰❒
${readmore}
╭─❒ 「 ANIME MENU 」
│ ○ ${prefix}anilist
│ ○ ${prefix}anilistinfo
│ ○ ${prefix}anilisttop
│ ○ ${prefix}komikindo
│ ○ ${prefix}komikdetail
│ ○ ${prefix}komiksearch
│ ○ ${prefix}waifu
╰❒
${readmore}
╭─❒ 「 DOWNLOAD MENU 」
│ ○ ${prefix}amdl
│ ○ ${prefix}play
│ ○ ${prefix}playvid
│ ○ ${prefix}ytdlmp4 || ytdlmp3
│ ○ ${prefix}ytmp4 || ytmp3
│ ○ ${prefix}ytdown4 || ytdown3
│ ○ ${prefix}tiktok || ttnowm || tiktokmp4
│ ○ ${prefix}tiktokslide || tiktokfoto
│ ○ ${prefix}tiktokaudio || ttaudio || ttmp3
│ ○ ${prefix}instagram || ig
│ ○ ${prefix}pindl || pinterstdl
│ ○ ${prefix}fb || fesnuk || fbdl
│ ○ ${prefix}twitter || tw || twdl
│ ○ ${prefix}spotify
│ ○ ${prefix}pixeldrain
│ ○ ${prefix}mediafire || mfdl
│ ○ ${prefix}sfile || sfdl
╰❒
${readmore}
╭─❒ 「 GROUP MENU 」
│ ○ ${prefix}delete || del
│ ○ ${prefix}setppgroup || setppgc
│ ○ ${prefix}deleteppgc || delppgc
│ ○ ${prefix}listgrup || listgc
│ ○ ${prefix}readviewonce || rvo
│ ○ ${prefix}tagall
│ ○ ${prefix}sholat
╰❒
${readmore}
╭─❒ 「 SEARCH MENU 
│ ○ ${prefix}apksum
│ ○ ${prefix}yts
│ ○ ${prefix}tiktoksearch || ttsearch
│ ○ ${prefix}ttsearchalbum || ttsalbum
│ ○ ${prefix}igreels || reels
│ ○ ${prefix}pinterest || pin
│ ○ ${prefix}8font || dafont
│ ○ ${prefix}searchimage || simg
│ ○ ${prefix}servermc || mc
│ ○ ${prefix}lirik
│ ○ ${prefix}sytcomment || sytc
│ ○ ${prefix}jadwalsholat
╰❒
${readmore}
╭─❒ 「 STICKER MENU 」
│ ○ ${prefix}stiker || s || tikel
│ ○ ${prefix}smeme || stickmeme
│ ○ ${prefix}qc
│ ○ ${prefix}brat
│ ○ ${prefix}bratvideo
│ ○ ${prefix}toimg
│ ○ ${prefix}togif
│ ○ ${prefix}sticker-s
│ ○ ${prefix}stickersearch || stikersearch
╰❒
${readmore}
╭─❒ 「 TOOLS MENU 」
│ ○ ${prefix}get || fetch
│ ○ ${prefix}getppwa || getpp
│ ○ ${prefix}getsw || ambilsw
│ ○ ${prefix}tourl
│ ○ ${prefix}upload
│ ○ ${prefix}removebg || rbg
│ ○ ${prefix}enhance
│ ○ ${prefix}upscale
│ ○ ${prefix}restore
│ ○ ${prefix}colorize
│ ○ ${prefix}hd || remini
│ ○ ${prefix}hdr
│ ○ ${prefix}hdvid || reminivid
│ ○ ${prefix}readerqr || bacaqr
│ ○ ${prefix}imgtocode || s2code
│ ○ ${prefix}txt2pdf
│ ○ ${prefix}ssweb
│ ○ ${prefix}transcribe || transkripsi
╰❒
${readmore}
╭─❒ 「 OTHER MENU 」
│ ○ ${prefix}ping
│ ○ ${prefix}neofetch
│ ○ ${prefix}owner
│ ○ ${prefix}afk
│ ○ ${prefix}redirect
│ ○ ${prefix}request
│ ○ ${prefix}reportbug
│ ○ ${prefix}totalcase
│ ○ ${prefix}cekidch || idch
╰❒
${readmore}
╭─❒ 「 OWNER MENU 」
│ ○ ${prefix}broadcast || bc
│ ○ ${prefix}setppbot || setpp
│ ○ ${prefix}autoread
│ ○ ${prefix}unavailable
│ ○ ${prefix}autorecordtype
│ ○ ${prefix}autorecord
│ ○ ${prefix}autotype
│ ○ ${prefix}autobio
│ ○ ${prefix}shutdown
│ ○ ${prefix}addcase || addcaseatas
│ ○ ${prefix}delcase
│ ○ ${prefix}getcase
│ ○ ${prefix}totalcase
│ ○ ${prefix}upsaluran
│ ○ ${prefix}tagsw || upsw
│ ○ ${prefix}joingrup || joingc || join
│ ○ ${prefix}outgrup || outgc || out
│ ○ ${prefix}sendht
│ ○ ${prefix}plugin
╰❒
`}

global.aiMenu = (prefix, bill) => {
return`
╭─❒ 「 AI MENU 」
│ ○ ${prefix}ai
│ ○ ${prefix}autoai
│ ○ ${prefix}blackbox || bb
│ ○ ${prefix}ai3d
│ ○ ${prefix}magicstudio || ms
│ ○ ${prefix}texttoimg || txt2img
╰❒
`}

global.animeMenu = (prefix, bill) => {
return`
╭─❒ 「 ANIME MENU 」
│ ○ ${prefix}anilist
│ ○ ${prefix}anilistinfo
│ ○ ${prefix}anilisttop
│ ○ ${prefix}komikindo
│ ○ ${prefix}komikdetail
│ ○ ${prefix}komiksearch
│ ○ ${prefix}waifu
╰❒
`}

global.stickerMenu = (prefix, bill) => {
return`
╭─❒ 「 STICKER MENU 」
│ ○ ${prefix}stiker || s || tikel
│ ○ ${prefix}smeme || stickmeme
│ ○ ${prefix}qc
│ ○ ${prefix}brat
│ ○ ${prefix}bratvideo
│ ○ ${prefix}toimg
│ ○ ${prefix}togif
│ ○ ${prefix}sticker-s
│ ○ ${prefix}stickersearch || stikersearch
╰❒
`}

global.downloadMenu = (prefix, bill) => {
return`
╭─❒ 「 DOWNLOAD MENU 」
│ ○ ${prefix}amdl
│ ○ ${prefix}play
│ ○ ${prefix}playvid
│ ○ ${prefix}ytdlmp4 || ytdlmp3
│ ○ ${prefix}ytmp4 || ytmp3
│ ○ ${prefix}ytdown4 || ytdown3
│ ○ ${prefix}tiktok || ttnowm || tiktokmp4
│ ○ ${prefix}tiktokslide || tiktokfoto
│ ○ ${prefix}tiktokaudio || ttaudio || ttmp3
│ ○ ${prefix}instagram || ig
│ ○ ${prefix}pindl || pinterstdl
│ ○ ${prefix}fb || fesnuk || fbdl
│ ○ ${prefix}twitter || tw || twdl
│ ○ ${prefix}spotify
│ ○ ${prefix}pixeldrain
│ ○ ${prefix}mediafire || mfdl
│ ○ ${prefix}sfile || sfdl
╰❒
`}

global.searchMenu = (prefix, bill) => {
return`
╭─❒ 「 SEARCH MENU 
│ ○ ${prefix}apksum
│ ○ ${prefix}yts
│ ○ ${prefix}tiktoksearch || ttsearch
│ ○ ${prefix}ttsearchalbum || ttsalbum
│ ○ ${prefix}igreels || reels
│ ○ ${prefix}pinterest || pin
│ ○ ${prefix}8font || dafont
│ ○ ${prefix}searchimage || simg
│ ○ ${prefix}servermc || mc
│ ○ ${prefix}lirik
│ ○ ${prefix}sytcomment || sytc
│ ○ ${prefix}jadwalsholat
╰❒
`}

global.toolsMenu = (prefix, bill) => {
return`
╭─❒ 「 TOOLS MENU 」
│ ○ ${prefix}get || fetch
│ ○ ${prefix}getppwa || getpp
│ ○ ${prefix}getsw || ambilsw
│ ○ ${prefix}tourl
│ ○ ${prefix}upload
│ ○ ${prefix}removebg || rbg
│ ○ ${prefix}enhance
│ ○ ${prefix}upscale
│ ○ ${prefix}restore
│ ○ ${prefix}colorize
│ ○ ${prefix}hd || remini
│ ○ ${prefix}hdr
│ ○ ${prefix}hdvid || reminivid
│ ○ ${prefix}readerqr || bacaqr
│ ○ ${prefix}imgtocode || s2code
│ ○ ${prefix}txt2pdf
│ ○ ${prefix}ssweb
│ ○ ${prefix}transcribe || transkripsi
╰❒
`}

global.gameMenu = (prefix, bill) => {
return`
╭─❒ 「 GAME MENU 」
│ ○ ${prefix}no entry
│ ○ ${prefix}no
│ ○ ${prefix}no
│ ○ ${prefix}no
│ ○ ${prefix}no
│ ○ ${prefix}no
│ ○ ${prefix}no
│ ○ ${prefix}no
│ ○ ${prefix}tebakhero
│ ○ ${prefix}tebakgame
│ ○ ${prefix}tebakgambar
│ ○ ${prefix}tebakbendera
│ ○ ${prefix}lengkapikalimat
│ ○ ${prefix}asahotak
│ ○ ${prefix}tebakkata
│ ○ ${prefix}tebaktebakan
│ ○ ${prefix}tebaklirik
│ ○ ${prefix}tebakkimia
│ ○ ${prefix}tebaksiapa
│ ○ ${prefix}tebakkalimat
╰❒
`}

global.groupMenu = (prefix, bill) => {
return`
╭─❒ 「 GROUP MENU 」
│ ○ ${prefix}delete || del
│ ○ ${prefix}setppgroup || setppgc
│ ○ ${prefix}deleteppgc || delppgc
│ ○ ${prefix}listgrup || listgc
│ ○ ${prefix}readviewonce || rvo
│ ○ ${prefix}tagall
│ ○ ${prefix}sholat
╰❒
`}

global.ownerMenu = (prefix, bill) => {
return`
╭─❒ 「 OWNER MENU 」
│ ○ ${prefix}broadcast || bc
│ ○ ${prefix}setppbot || setpp
│ ○ ${prefix}autoread
│ ○ ${prefix}unavailable
│ ○ ${prefix}autorecordtype
│ ○ ${prefix}autorecord
│ ○ ${prefix}autotype
│ ○ ${prefix}autobio
│ ○ ${prefix}shutdown
│ ○ ${prefix}addcase || addcaseatas
│ ○ ${prefix}delcase
│ ○ ${prefix}getcase
│ ○ ${prefix}totalcase
│ ○ ${prefix}upsaluran
│ ○ ${prefix}tagsw || upsw
│ ○ ${prefix}joingrup || joingc || join
│ ○ ${prefix}outgrup || outgc || out
│ ○ ${prefix}sendht
│ ○ ${prefix}plugin
╰❒
`}

global.otherMenu = (prefix, bill) => {
return`
╭─❒ 「 OTHER MENU 」
│ ○ ${prefix}ping
│ ○ ${prefix}neofetch
│ ○ ${prefix}owner
│ ○ ${prefix}afk
│ ○ ${prefix}redirect
│ ○ ${prefix}request
│ ○ ${prefix}reportbug
│ ○ ${prefix}totalcase
│ ○ ${prefix}cekidch || idch
╰❒
`}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
