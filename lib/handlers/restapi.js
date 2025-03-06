const axios = require('axios');

const stickerSearch = async (query) => {
    try {
        const response = await axios.get(`https://archive-ui.tanakadomp.biz.id/search/sticker?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error searching stickers:', error);
        return null;
    }
};

const downloadPinterest = async (url) => {
    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (error) {
        console.error('Error downloading Pinterest content:', error);
        return null;
    }
};

module.exports = { stickerSearch, downloadPinterest }
