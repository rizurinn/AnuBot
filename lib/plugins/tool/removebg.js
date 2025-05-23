/*
 * Neura — Spehere by Ryzxell ✦
 * WhatsApp Channel: https://whatsapp.com/channel/0029VayjbFK4inonCYjGj42l
 * GitHub Repository: https://github.com/Shouya28
 * WhatsApp Contact: https://wa.me/6283138902543
 * 
 * Greetings! This is my watermark. Please refrain from removing it.
 * Thank you for your understanding and cooperation.
 */
 
const axios = require('axios')
const FormData = require('form-data')

const api = axios.create({ baseURL: 'https://api4g.iloveimg.com' });

const getTaskId = async () => {
    const { data: html } = await axios.get('https://www.iloveimg.com/id/hapus-latar-belakang');
    api.defaults.headers.post['authorization'] = `Bearer ${html.match(/ey[a-zA-Z0-9?%-_/]+/g)[1]}`;
    return html.match(/taskId = '(\w+)/)[1];
};

const uploadImageToServer = async (imageBuffer) => {
    const taskId = await getTaskId();
    
    const fileName = Math.random().toString(36).slice(2) + '.jpg';
    const form = new FormData();
    form.append('name', fileName);
    form.append('chunk', '0');
    form.append('chunks', '1');
    form.append('task', taskId);
    form.append('preview', '1');
    form.append('pdfinfo', '0');
    form.append('pdfforms', '0');
    form.append('pdfresetforms', '0');
    form.append('v', 'web.0');
    form.append('file', imageBuffer, fileName);
    
    const reqUpload = await api.post('/v1/upload', form, { headers: form.getHeaders() })
        .catch(e => e.response);
    if (reqUpload.status !== 200) throw reqUpload.data || reqUpload.statusText;
    
    return { serverFilename: reqUpload.data.server_filename, taskId };
};

const removeBg = async (imageBuffer, responseType = 'arraybuffer') => {
    const { serverFilename, taskId } = await uploadImageToServer(imageBuffer);
    
    const form = new FormData();
    form.append('task', taskId);
    form.append('server_filename', serverFilename);
    
    const reqRmbg = await api.post('/v1/removebackground', form, {
        headers: form.getHeaders(), responseType
    }).catch(e => e.response);
    const type = reqRmbg.headers['content-type'];
    if (reqRmbg.status !== 200 || !/image/.test(type))
        throw JSON.parse(reqRmbg.data?.toString() || '{"error":{"message":"An error occurred"}}');
    
    return reqRmbg.data;
};

let neura = async (m, { rinn, Nreply, text, args, prefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return Nreply('Kirim/Reply Gambar Dengan Caption ' + prefix + command);
  let caption = `*NeuraSpehere* gen1`;
  const media = await q.download();
  const a = await removeBg(media);
  const buffer = Buffer.from(a, "base64");
  await rinn.sendFile(m.chat, buffer, "", caption, m);
}

neura.category = ['tool'];
neura.command = ["rmbg"];

module.exports = neura;
