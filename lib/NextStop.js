const StateManager = require('../App/stateManager');

// Konfigurasi untuk setiap tipe konten tetap sama
const ContentTypes = {
    PINTEREST: 'pinterest',
    INSTAGRAM_REELS: 'igreels',
};

const contentConfig = {
    [ContentTypes.PINTEREST]: {
        stateKey: 'pinterest_search',
        itemName: 'gambar',
        command: 'pinterest',
        itemKey: 'images',
        messageFormat: (item, data, currentIndex) => ({
            type: 'image',
            content: { url: item.url },
            caption: `${item.caption}\n\n*Hasil pencarian untuk:* "${data.query}"\n*Image:* ${currentIndex + 1}/${data.images.length}`
        })
    },
    [ContentTypes.INSTAGRAM_REELS]: {
        stateKey: 'igreels_search',
        itemName: 'reels',
        command: 'igreels',
        itemKey: 'reels',
        messageFormat: (item, data, currentIndex) => ({
            type: 'video',
            content: { url: item.url },
            caption: `${item.caption}\n\n*Hasil pencarian untuk:* "${data.query}"\n*Reels:* ${currentIndex + 1}/${data.reels.length}`,
            options: { gifPlayback: false }
        })
    }
};

const handleNext = async (nvdia, m, sender, ...contentTypes) => {
    try {
        let foundActiveSearch = false;
        let noMoreContent = false;

        for (const contentType of contentTypes) {
            const config = contentConfig[contentType];
            if (!config) continue;

            const data = StateManager.getState(sender, config.stateKey);
            //console.log(`Checking ${contentType} data:`, data); // Debug log

            if (!data || !data[config.itemKey] || !Array.isArray(data[config.itemKey])) {
                continue;
            }

            foundActiveSearch = true;
            const nextIndex = data.currentIndex + 1;

            // Cek apakah masih ada konten berikutnya
            if (nextIndex >= data[config.itemKey].length) {
                noMoreContent = true;
                continue;
            }

            // Ada konten berikutnya, kirim ke user
            const currentItem = data[config.itemKey][nextIndex];
            const messageData = config.messageFormat(currentItem, data, nextIndex);

            await nvdia.sendMessage(m.chat, {
                [messageData.type]: messageData.content,
                caption: messageData.caption,
                ...messageData.options,
            headerType: 6,
            buttons: [{
                    buttonId: `.next`,
                    buttonText: {
                        displayText: 'Next'
                    },
                    type: 1,
                },
                {
                    buttonId: `.stop`,
                    buttonText: {
                        displayText: 'Stop'
                    },
                    type: 1,
                },
            ],
            headerType: 1,
            viewOnce: true
            }, { quoted: m });

            // Update state dengan index baru
            StateManager.setState(sender, config.stateKey, {
                ...data,
                currentIndex: nextIndex
            });

            return; // Keluar setelah mengirim konten
        }

        // Kirim pesan yang sesuai berdasarkan kondisi
        if (!foundActiveSearch) {
            await nvdia.sendMessage(m.chat, {
                text: 'Tidak ada pencarian yang aktif. Silakan lakukan pencarian terlebih dahulu menggunakan *.pinterest* atau *.igreels*'
            }, { quoted: m });
        } else if (noMoreContent) {
            await nvdia.sendMessage(m.chat, {
                text: 'Semua konten sudah ditampilkan. Silakan lakukan pencarian baru.'
            }, { quoted: m });
        }

    } catch (error) {
        console.error('Error in handleNext:', error);
        await nvdia.sendMessage(m.chat, {
            text: 'Terjadi kesalahan saat mengambil konten selanjutnya. Silakan coba lagi.'
        }, { quoted: m });
    }
};

const handleStop = async (nvdia, m, sender, ...contentTypes) => {
    try {
        let foundActiveSearch = false;

        for (const contentType of contentTypes) {
            const config = contentConfig[contentType];
            if (!config) continue;

            const data = StateManager.getState(sender, config.stateKey);
            if (!data) continue;

            foundActiveSearch = true;
            StateManager.clearState(sender, config.stateKey);
            await nvdia.sendMessage(m.chat, {
                text: `Pencarian ${config.itemName} telah dihentikan. Silakan lakukan pencarian baru.`
            }, { quoted: m });
            return;
        }

        if (!foundActiveSearch) {
            await nvdia.sendMessage(m.chat, {
                text: 'Tidak ada pencarian yang aktif untuk dihentikan.'
            }, { quoted: m });
        }

    } catch (error) {
        console.error('Error in handleStop:', error);
        await nvdia.sendMessage(m.chat, {
            text: 'Terjadi kesalahan saat menghentikan pencarian. Silakan coba lagi.'
        }, { quoted: m });
    }
};

module.exports = {
    handleNext,
    handleStop,
    contentConfig
};
