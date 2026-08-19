const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "video4",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Farhan-Khan (Converted for Mirai)",
  description: "4 Video Auto Reply",
  commandCategory: "media",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const input = event.body.trim().toLowerCase();

  const videoMap = {
    "খাদিজা": "https://files.catbox.moe/j03fk3.mp4",
    "খাদিজা২": "https://files.catbox.moe/5jt9vu.mp4",

    // এখানে নিজের ২টি .mp4 লিংক বসাও
    "খাদিজা3": "https://files.catbox.moe/941j0f.mp4",
    "কষ্ট৪": "https://files.catbox.moe/57hycf.mp4"
  };

  for (const key in videoMap) {
    if (!input.includes(key.toLowerCase())) continue;

    try {
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const file = path.join(
        cacheDir,
        Buffer.from(key).toString("hex") + ".mp4"
      );

      if (!fs.existsSync(file)) {
        const response = await axios.get(videoMap[key], {
          responseType: "arraybuffer",
          timeout: 30000
        });

        await fs.writeFile(file, Buffer.from(response.data));
      }

      return api.sendMessage(
        {
          attachment: fs.createReadStream(file)
        },
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error("[video4]", error.message);
    }

    break;
  }
};

module.exports.run = function () {};
