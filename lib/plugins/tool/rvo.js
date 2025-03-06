async function handler(m, bill) {
    const { rinn, msg, reply, sender } = bill;
    
    try {
        let q = m.quoted ? m.quoted : m;
        
        if (!q.viewOnce) {
            return m.reply('Ini bukan pesan viewonce!!');
        }
        
        let mmk = await q.download?.();
        
        // Cek tipe media (gambar atau video)
        if (q.mtype.includes('image')) {
            await rinn.sendMessage(sender, { image: mmk, caption: 'Ini viewonce yang dibuka' }, { quoted: m });
        } else if (q.mtype.includes('video')) {
            await rinn.sendMessage(sender, { video: mmk, caption: 'Ini viewonce yang dibuka' }, { quoted: m });
        } else {
            return m.reply('Format viewonce tidak didukung');
        }
    } catch (error) {
        console.error('Error rvo:', error);
        m.reply('Error saat mengunduh pesan viewonce😬');
    }
}

handler.command = ['rvo', 'readviewonce'];
handler.description = 'Download pesan sekali lihat';
handler.category = 'tools';
handler.restrict = {
    groupOnly: true,
    adminOnly: true
};

module.exports = handler;
