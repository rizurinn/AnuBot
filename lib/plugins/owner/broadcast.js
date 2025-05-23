async function handler(m, bill) {
    const { rinn, Nreply, msg, text, args } = bill;
    
    if (!text) return Nreply('Masukkan pesan yang ingin disiarkan!');
    
    try {
        // Kode untuk broadcast pesan ke semua chat
        const chats = await rinn.groupFetchAllParticipating();
        Nreply(`Memulai broadcast ke ${Object.keys(chats).length} grup...`);
        
        let broadcastCount = 0;
        for (const key in chats) {
            await rinn.sendMessage(key, { text: ` *BROADCAST MESSAGE*\n\n${text}` });
            broadcastCount++;
        }
        
        Nreply(`✅ Berhasil mengirim broadcast ke ${broadcastCount} grup`);
    } catch (error) {
        console.error('Error in broadcast:', error);
        Nreply('Terjadi kesalahan saat broadcast');
    }
}

handler.command = ['broadcast', 'bc'];
handler.description = 'Mengirim pesan broadcast ke semua grup';
handler.category = 'owner';
handler.restrict = {
    ownerOnly: true
};

module.exports = handler;
