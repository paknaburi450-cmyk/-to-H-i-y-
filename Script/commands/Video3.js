const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "video3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Farhan-Khan (Converted for Mirai)",
  description: "Auto Video Reply",
  commandCategory: "system",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const input = event.body.trim().toLowerCase();

  const videoMap = {
    "ডাইনি": "https://files.catbox.moe/tfaki1.mp4",
    "হাসি": "https://files.catbox.moe/ovinjk.mp4",
    "খানকি": "https://files.catbox.moe/4iy7zf.mp4",
    "কট": "https://files.catbox.moe/wgyhso.mp4",
    "উম্ম": "https://files.catbox.moe/l5xxyj.mp4",
    "সত্যি না ": "https://files.catbox.moe/n9iqgv.mp4",
    "🍆": "https://files.catbox.moe/2p05xj.mp4",
    "🫣": "https://files.catbox.moe/qetiv0.mp4",
    "দেখা করবে": "https://files.catbox.moe/lmauvs.mp4",
    "😙": "https://files.catbox.moe/quap15.mp4",
    "মাগি": "https://files.catbox.moe/2dqgxd.mp4",
    "😆🤸": "https://files.catbox.moe/hies6o.mp4",
    "কল": "https://files.catbox.moe/785z5x.mp4",
    "🏍️": "https://files.catbox.moe/ph8b0y.mp4",
    "চিপায়": "https://files.catbox.moe/iph1ib.mp4",
    "🥹": "https://files.catbox.moe/57fdts.mp4",
    "🫶": "https://files.catbox.moe/pys7u5.mp4",
    "লাভ": "https://files.catbox.moe/w48i3n.mp4",
    "লাভ২": "https://files.catbox.moe/0hqphz.mp4",
    "Love12": "https://files.catbox.moe/1f6wdu.mp4",
    "🫤": "https://files.catbox.moe/6w7oa7.mp4"
  };

  for (const key in videoMap) {
    if (input.includes(key.toLowerCase())) {
      try {
        const cache = path.join(__dirname, "cache");
        fs.ensureDirSync(cache);

        const file = path.join(
          cache,
          `${Buffer.from(key).toString("hex")}.mp4`
        );

        if (!fs.existsSync(file)) {
          const res = await axios.get(videoMap[key], {
            responseType: "arraybuffer",
            timeout: 30000
          });

          fs.writeFileSync(file, Buffer.from(res.data));
        }

        return api.sendMessage(
          {
            attachment: fs.createReadStream(file)
          },
          event.threadID,
          event.messageID
        );

      } catch (error) {
        console.log("❌ Video Download Error:", error.message);
      }
    }
  }
};

module.exports.run = function () {};
