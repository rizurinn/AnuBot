/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Search Youtube Comment 
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
 
  NOTE : MENCARI KOMENTAR MELALUI URL VIDEO DI YT. 
  USING WEB: https://ytcomment.kmcat.uk/
*/
const axios = require ('axios');

let handler = async (m, { text }) => {
    if (!text) return m.reply('[EXAMPLE!]\n\n- .sytc url-video-yt|query')

    let [url, query] = text.split('|').map(v => v.trim())

    if (!url) return m.reply('[EXAMPLE!]\n\n- .sytc url-video-yt|query')
    if (!query) query = ''
    let idVideo = ngambilID(url)
    if (!idVideo) return m.reply('URL YouTube tidak valid.')

    let anunya = 'AIzaSyClGWxJcaOuziRHzV-g_ZTGa8swcA_brOo'
    let anunyaItu = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${idVideo}&maxResults=10&searchTerms=${encodeURIComponent(query)}&textFormat=plainText&key=${anunya}`
    try {
        let res = await axios.get(anunyaItu, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://ytcomment.kmcat.uk/'
            }
        })

        let komen = res.data.items
        if (!komen || komen.length === 0) return m.reply('gada yg cocok.')

        let hasil = komen.map((c, i) => {
            let user = c.snippet.topLevelComment.snippet.authorDisplayName
            let userUrl = c.snippet.topLevelComment.snippet.authorChannelUrl || 'Tidak ada'
            let kteks = c.snippet.topLevelComment.snippet.textDisplay
            let suka = c.snippet.topLevelComment.snippet.likeCount || 0
            let jumlahBalas = c.snippet.totalReplyCount || 0

            return `🔸Nama: ${user}\n- Channel: ${userUrl}\n- Komentar: ${kteks}\n- Suka: ${suka}\n- Jumlah Balasan: ${jumlahBalas}`
        }).join('\n\n')

        await m.reply(`Hasil komentar:\n\n${hasil}`)
    } catch (error) {
        await m.reply('Error saat mengambil komentar.')
    }
}

function ngambilID(url) {
    let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.*v=|(?:v|embed|shorts)\/)|youtu\.be\/)([^?&]+)/)
    return match ? match[1] : null
}

handler.command = ['sytc', 'sytcomment']
handler.category = 'search'
handler.description = 'Mencari komentar dari link yt'

module.exports = handler
