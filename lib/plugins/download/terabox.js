const { terabox } = require('../../handlers/terabox');
const path = require('path');

function getMimeType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
        '.apk': 'application/vnd.android.package-archive',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.avi': 'video/x-msvideo',
        '.mkv': 'video/x-matroska',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.txt': 'text/plain',
        '.': 'application/octet-stream'
    };
    
    return mimeTypes[ext] || mimeTypes['.'];
}

async function handler(m, bill) {
    const { args, Nreply, rinn, msg } = bill;
    const url = args[0];
    
    if (!url) return Nreply('Tambahkan URL Terabox yang ingin diunduh!');
    
    try {
        Nreply('🔍 Sedang memproses tautan Terabox...');
        
        const response = await terabox.download(url);
        
        if (response.status !== 'success') {
            return Nreply(response.message || 'Gagal mengunduh file');
        }
        
        const fileData = response.result.structure;
        
        if (!fileData.direct_link) {
            return Nreply('Tidak dapat menemukan tautan unduhan.');
        }
        
        const responseData = {
            status: 'success',
            code: 200,
            result: {
                structure: fileData
            }
        };
        
        const mimeType = getMimeType(fileData.file_name);
        
        const responseText = `*✅ Unduhan Terabox Diproses*
📁 Nama File: ${fileData.file_name}
📊 Ukuran: ${fileData.size}
🔗 Direct Link: ${fileData.download_url}
_File akan dikirim melalui chat jika memungkinkan_
`;
        
        Nreply(responseText);
        
        if (fileData.direct_link) {
            await rinn.sendMessage(m.chat, { 
                document: { url: fileData.direct_link },
                fileName: fileData.file_name,
                mimetype: mimeType
            });
        }
        
    } catch (error) {
        console.error('Error in Terabox download:', error);
        Nreply('Terjadi kesalahan saat mengunduh file dari Terabox');
    }
}

handler.command = ['terabox'];
handler.description = 'Unduh file dari Terabox';
handler.category = 'downloader';

module.exports = handler;
