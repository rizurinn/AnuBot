const PDFDocument = require('pdfkit');

async function sendPdf(text, rinn, Nreply, m) {
    const doc = new PDFDocument();
    const buffer = [];
    
    doc.on('data', (chunk) => {
        buffer.push(chunk);
    });
    
    doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffer);
        rinn.sendMessage(m.chat, {
            document: pdfBuffer,
            mimetype: "application/pdf",
            fileName: "txt2pdf-" + (Math.floor(Math.random() * 10000)) + ".pdf",
        }, { quoted: m });
    });
    
    doc.fontSize(15).text(text, 100, 100);
    doc.end();
}

const koboo = async (m, { rinn, text, prefix, command }) => {
    if (!text) return Nreply("masukan teks!");
    sendPdf(text, rinn, m);
}

koboo.command = ['txt2pdf'];
koboo.description = 'Ubah text ke pdf(entah guna gk)';
koboo.category = 'tool';

module.exports = koboo;
