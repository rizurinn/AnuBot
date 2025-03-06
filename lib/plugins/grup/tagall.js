async function handler(m, bill) {
    const { participants, args, reply, sendMessageWithMentions } = bill;
    
    try {
        if (args.length === 0) {
            return reply('Berikan pesan');
        }
        
        let members = participants.map(u => u.id);
        let message = args.join(' ');
        message += '\n\n';
        
        for (let i = 0; i < members.length; i++) {
            message += `@${members[i].split('@')[0]}\n`;
        }
        
        await sendMessageWithMentions(message, members);
    } catch (error) {
        console.error('Error tagall:', error);
        reply('Error😬');
    }
}

handler.command = ['tagall'];
handler.description = 'Tag semua anggota grup dengan pesan';
handler.category = 'group';
handler.restrict = {
    groupOnly: true,
    adminOnly: true
};

module.exports = handler;
