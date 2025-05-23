async function handler(m, bill) {
    const { rinn, participants, args, Nreply } = bill;
    
    try {
        if (args.length === 0) {
            return Nreply('Berikan pesan');
        }
        
        let members = participants.map(u => u.id);
        let message = args.join(' ');
        message += '\n\n';
        
        for (let i = 0; i < members.length; i++) {
            message += `@${members[i].split('@')[0]}\n`;
        }
        
        await rinn.sendMessage(m.chat, { text: message, mentions: m.metadata.participants.map(a => a.id) }, { quoted: m })
    } catch (error) {
        console.error('Error tagall:', error);
        Nreply('Error😬');
    }
}

handler.command = ['tagall'];
handler.description = 'Tag semua anggota grup dengan pesan';
handler.category = 'grup';
handler.restrict = {
    groupOnly: true,
    adminOnly: true
};

module.exports = handler;
