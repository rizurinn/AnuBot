/*
 * @Author: Cifumo (plugins ini dibuat oleh)
 * @Web: https://rest.cifumo.biz.id
 */

const axios = require ('axios')
const FormData = require ('form-data')
const jimp = require ('jimp')


async function upscale(buffer, size = 2, anime = false) {
  try {
    return await new Promise((resolve, reject) => {
      if(!buffer) return reject("undefined buffer input!");
      if(!Buffer.isBuffer(buffer)) return reject("invalid buffer input");
      if(!/(2|4|6|8|16)/.test(size.toString())) return reject("invalid upscale size!")
      jimp.read(Buffer.from(buffer)).then(image => {
        const { width, height } = image.bitmap;
        let newWidth = width * size;
        let newHeight = height * size;
        const form = new FormData();
        form.append("name", "upscale-" + Date.now())
        form.append("imageName", "upscale-" + Date.now())
        form.append("desiredHeight", newHeight.toString())
        form.append("desiredWidth", newWidth.toString())
        form.append("outputFormat", "png")
        form.append("compressionLevel", "none")
        form.append("anime", anime.toString())
        form.append("image_file", buffer, {
          filename: "upscale-" + Date.now() + ".png",
          contentType: 'image/png',
        })
        axios.post("https://api.upscalepics.com/upscale-to-size", form, {
          headers: {
            ...form.getHeaders(),
            origin: "https://upscalepics.com",
            referer: "https://upscalepics.com"
          }
        }).then(res => {
          const data = res.data;
          if(data.error) return reject("something error from upscaler api!");
          resolve({
            status: true,
            image: data.bgRemoved
          })
        }).catch(reject)
      }).catch(reject)
    })
  } catch (e) {
    return { status: false, message: e };
  }
}

let handler = async (m, { rinn, Nreply, prefix, command, args }) => {

  const defaultScale = 2;
  const defaultEnhance = false;


  const validScales = [2, 4, 6, 8, 16];
  const scale = args[0] ? parseInt(args[0]) : defaultScale;
  if (!validScales.includes(scale)) {
    return Nreply(`Nilai untuk scale harus salah satu dari: ${validScales.join(", ")}.`);
  }

  const enhance = args[1] ? args[1] === 'true' : defaultEnhance;
  if (args[1] && args[1] !== 'true' && args[1] !== 'false') {
    return Nreply(`Apakah foto kartun atau real jika kartun true jika real false.`);
  }

  let q = m.quoted ? m.quoted : m;
  let mime =
    (q.msg || q).mimetype ||
    q.mediaType ||
    "";

  if (!mime) {
    return Nreply(
      `Fotonya Mana? \nKirim Foto Dengan Caption ${prefix + command}`,
    );
  }

  if (!/image\/(jpe?g|png)/.test(mime)) {
    return Nreply(`Tipe ${mime} tidak didukung!`);
  }

  await Nreply('Mohon tunggu beberapa menit..')

  let img = await q.download();
    

  let response;
  try {
    response = await upscale(img, scale, enhance);
  } catch (error) {
    return Nreply(`Gagal melakukan upscale: ${error.message}`);
  }

  if (!response || !response.status) {
    return Nreply("Gagal melakukan upscale.");
  }

  rinn.sendFile(m.chat, response.image, "upscaled.jpg", "Ini Dia Kak", m);
};

handler.command = ['hdr']
handler.category = 'tool'
handler.description = 'Menaikkan kualitas gambar'

module.exports = handler;
