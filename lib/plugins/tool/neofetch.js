/**
@credit Tio
@Tixo MD
@Whatsapp Bot
@Support dengan Donasi ✨
wa.me/6282285357346
**/

const os = require('os');
const speed = require('performance-now');
const { exec } = require('child_process');
const fetch = require('node-fetch');

var spek = async (m, bill) => {
    const { rinn, reply, quoted } = bill;
    let timestamp = speed();
    let latensi = speed() - timestamp;
    let { key } = await rinn.sendMessage(m.chat, { text: '💤' }, { quoted: m });

    try {
        // Mendapatkan informasi sistem dengan neofetch
        let sysInfo = await new Promise((resolve) => {
            exec(`neofetch --stdout`, (error, stdout) => {
                resolve(stdout.toString("utf-8"));
            });
        });

        // Mengambil data IP, negara, dan ISP
        let ipInfo = await fetch("https://ipinfo.io/json").then(res => res.json());
        let ipMasked = ipInfo.ip.replace(/\.\d+$/, ".***"); // Sensor sebagian IP

        // Ping ke Google
        let pingGoogle = await new Promise((resolve) => {
            exec("ping -c 1 google.com", (error, stdout) => {
                let match = stdout.match(/time=([\d.]+) ms/);
                resolve(match ? match[1] + " ms" : "N/A");
            });
        });

        // Penggunaan Disk (format: "10/30 GB")
        let diskUsage = await new Promise((resolve) => {
            exec("df -BG --total | grep 'total' | awk '{print $3\"/\"$2\" GB\"}'", (error, stdout) => {
                resolve(stdout.toString().trim());
            });
        });

        // Penggunaan Swap
        let swapUsage = await new Promise((resolve) => {
            exec("free -m | awk 'NR==3{print $3\"MB / \"$2\"MB\"}'", (error, stdout) => {
                resolve(stdout.toString().trim());
            });
        });

        // Informasi CPU
        let cpuModel = os.cpus()[0].model;
        let cpuCores = os.cpus().length;
        let totalMem = Math.round(os.totalmem() / 1024 / 1024);

        // Menjalankan Speedtest (dengan pengecekan error 403)
        let speedTestResult = "";
        try {
            speedTestResult = await new Promise((resolve, reject) => {
                exec("speedtest --simple", (error, stdout, stderr) => {
                    if (stderr && stderr.includes("403") || stdout && stdout.includes("403")) {
                        reject("Speedtest diblokir (403 Forbidden)");
                    } else {
                        resolve(stdout ? stdout.toString().trim() : "");
                    }
                });
            });
        } catch (err) {
            speedTestResult = ""; // Jika error 403, kosongkan hasil speedtest
        }

        // Format pesan
        let message = `${sysInfo}\n` +
                      `• *CPU:* ${cpuModel} (${cpuCores} Cores)\n` +
                      `• *Ping Google:* ${pingGoogle}\n` +
                      `• *IP Publik:* ${ipMasked}\n` +
                      `• *Negara:* ${ipInfo.country}\n` +
                      `• *ISP:* ${ipInfo.org}\n` +
                      `• *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${totalMem}MB\n` +
                      `• *Swap Usage:* ${swapUsage}\n` +
                      `• *Disk Usage:* ${diskUsage}\n` +
                      `• *Kecepatan:* ${latensi.toFixed(4)} ms\n`;

        // Tambahkan Speedtest jika tidak error 403
        if (speedTestResult) {
            message += `\n*Speedtest Result:*\n${speedTestResult}`;
        }

        // Kirim pesan ke chat
        rinn.sendMessage(m.chat, { text: message, edit: key }, { quoted: m });

    } catch (error) {
        rinn.sendMessage(m.chat, { text: `Terjadi kesalahan: ${error.message}` }, { quoted: m });
    }
};

spek.command = ['neofetch'];
spek.description = 'Mengambil data dari server';
spek.category = 'tools';

module.exports = spek;
