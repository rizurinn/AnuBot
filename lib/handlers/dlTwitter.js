const axios = require("axios");
const cheerio = require("cheerio");

async function fetchTwitterMedia(url) {
    try {
        if (!/x.com\/.*?\/status/gi.test(url))
            throw new Error("URL tidak valid!");

        const base_url = "https://x2twitter.com";
        const headers = {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            Referer: "https://x2twitter.com/en",
        };

        const tokenRes = await axios.post(`${base_url}/api/userverify`, { url }, { headers });
        const token = tokenRes.data?.token;
        if (!token) throw new Error("Gagal mendapatkan token.");

        const searchRes = await axios.post(
            `${base_url}/api/ajaxSearch`,
            new URLSearchParams({ q: url, lang: "id", cftoken: token }).toString(),
            { headers }
        );
        if (searchRes.data.status !== "ok") throw new Error("Gagal mendapatkan data Twitter.");

        const $ = cheerio.load(searchRes.data.data);
        let type = $("div").eq(0).attr("class");

        type = type.includes("tw-video")
            ? "video"
            : type.includes("video-data") && $(".photo-list").length
            ? "image"
            : "hybrid";

        let mediaData = {
            title: $(".content").find("h3").text().trim() || "Tweet tanpa judul",
            duration: $(".content").find("p").text().trim() || "Durasi tidak tersedia",
            thumbnail: $(".thumbnail").find("img").attr("src") || null,
            type,
            download: [],
        };

        if (type === "video") {
            $(".dl-action").each((_, el) => {
                let quality = $(el).find("p").text().trim();
                let downloadUrl = $(el).find("a").attr("href");
                if (downloadUrl) {
                    mediaData.download.push({
                        quality,
                        type: "video",
                        url: downloadUrl,
                    });
                }
            });
        } else {
            $("ul.download-box li").each((i, el) => {
                let imageUrl = $(el).find("a").attr("href");
                if (imageUrl) {
                    mediaData.download.push({
                        name: `Image ${i + 1}`,
                        type: "image",
                        url: imageUrl,
                    });
                }
            });
        }

        return mediaData;
    } catch (error) {
        console.error("Error fetching media:", error.message);
        return null;
    }
}


module.exports = fetchTwitterMedia;
