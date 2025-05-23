async function handler(m, bill) {
    const { rinn, msg, Nreply, sender } = bill;
    
    try {
        let q = m.quoted ? m.quoted : m;
        
        if (!q.viewOnce) {
            return Nreply('Ini bukan pesan viewonce!!');
        }
        
        let mmk = await q.download?.();
        
        // Cek tipe media (gambar atau video)
        if (q.mtype.includes('image')) {
            await rinn.sendMessage(sender, { image: mmk, caption: 'Ini viewonce yang dibuka' }, { quoted: m });
        } else if (q.mtype.includes('video')) {
            await rinn.sendMessage(sender, { video: mmk, caption: 'Ini viewonce yang dibuka' }, { quoted: m });
        } else if (q.mtype.includes('audio')) {
        await rinn.sendMessage(m.chat, {audio: mmk, mimetype: "audio/mpeg", ptt: true}, {quoted: m});
        } else {
            return Nreply('Format viewonce tidak didukung');
        }
    } catch (error) {
        console.error('Error rvo:', error);
        Nreply('Error saat mengunduh pesan viewonce😬');
    }
}

handler.command = ['rvo', 'readviewonce'];
handler.description = 'Download pesan sekali lihat';
handler.category = 'tool';
handler.restrict = {
    groupOnly: true,
    adminOnly: true
};

module.exports = handler;
