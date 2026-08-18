const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "chipay",
    aliases: ["corner", "muri"],
    version: "3.0.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Chipay fun image",
    longDescription: "Mention or reply করে chipay image তৈরি করে",
    category: "fun",
    guide: {
      en: "{pn} @mention or reply"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    let targetID;

    // Mention থাকলে
    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    // Reply করলে
    else if (messageReply && messageReply.senderID) {
      targetID = messageReply.senderID;
    }

    // কিছু না থাকলে
    else {
      return api.sendMessage(
        "🤦‍♂️ | আরে ভাই, কাকে চিপায় নিবেন? আগে মেনশন দেন বা কারো মেসেজে রিপ্লাই দেন! 😹",
        threadID,
        messageID
      );
    }

    const imgPath = path.join(
      cacheDir,
      `chipay_${Date.now()}.png`
    );

    try {
      // Target user information
      const info = await api.getUserInfo(targetID);
      const targetName =
        info?.[targetID]?.name || "User";

      // Processing message
      await api.sendMessage(
        "⏳ | একটু দাঁড়ান... চিপায় ঝালমুড়ি বানানো হচ্ছে! 😋🌶️",
        threadID,
        messageID
      );

      /*
       * Avatar URL
       * Mirai/FCA API সাধারণত এই URL থেকে profile picture নিতে পারে।
       */
      const targetAvatar =
        `https://graph.facebook.com/${targetID}/picture?width=720&height=720`;

      const senderAvatar =
        `https://graph.facebook.com/${senderID}/picture?width=720&height=720`;

      /*
       * Background
       * নিজের background URL চাইলে এখানে পরিবর্তন করতে পারো।
       */
      const backgroundUrl =
        "https://i.imgur.com/PlmZXfJ.jpeg";

      const [bgImg, targetImg, senderImg] =
        await Promise.all([
          loadImage(backgroundUrl),
          loadImage(targetAvatar),
          loadImage(senderAvatar)
        ]);

      const width = bgImg.width;
      const height = bgImg.height;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.drawImage(
        bgImg,
        0,
        0,
        width,
        height
      );

      /*
       * =========================
       * Target Avatar
       * =========================
       */

      const targetSize = 110;
      const targetX = 85;
      const targetY = 85;

      ctx.save();

      ctx.beginPath();
      ctx.arc(
        targetX + targetSize / 2,
        targetY + targetSize / 2,
        targetSize / 2,
        0,
        Math.PI * 2
      );

      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        targetImg,
        targetX,
        targetY,
        targetSize,
        targetSize
      );

      ctx.restore();

      /*
       * =========================
       * Sender Avatar
       * =========================
       */

      const senderSize = 95;
      const senderX = 350;
      const senderY = 100;

      ctx.save();

      ctx.beginPath();
      ctx.arc(
        senderX + senderSize / 2,
        senderY + senderSize / 2,
        senderSize / 2,
        0,
        Math.PI * 2
      );

      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        senderImg,
        senderX,
        senderY,
        senderSize,
        senderSize
      );

      ctx.restore();

      /*
       * =========================
       * Target Name Box
       * =========================
       */

      ctx.font = "bold 18px Arial";

      const padding = 10;
      const textWidth =
        ctx.measureText(targetName).width;

      const boxWidth =
        textWidth + padding * 2;

      const boxHeight = 30;

      const textX = width - 100;
      const textY = height - 103;

      const boxX =
        textX - boxWidth;

      const boxY =
        textY - 22;

      // Box
      ctx.fillStyle =
        "rgba(0,0,0,0.60)";

      ctx.fillRect(
        boxX,
        boxY,
        boxWidth,
        boxHeight
      );

      // Border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;

      ctx.strokeRect(
        boxX,
        boxY,
        boxWidth,
        boxHeight
      );

      // Name
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "right";

      ctx.fillText(
        targetName,
        textX - padding,
        textY
      );

      /*
       * Save image
       */

      const buffer =
        canvas.toBuffer("image/png");

      await fs.writeFile(
        imgPath,
        buffer
      );

      /*
       * Final message
       */

      const caption =
`😾⎯͢⎯⃝⋆⃝ চিঁপাঁয়ঁ ঝাঁলঁমুঁড়িঁ বাঁনাঁয়ঁছিঁ 🙈 ⋆⃝⋆⃝😹😒🐰🍒

${targetName} এদিকে আসো 💋💋`;

      return api.sendMessage(
        {
          body: caption,

          mentions: [
            {
              tag: targetName,
              id: targetID
            }
          ],

          attachment:
            fs.createReadStream(imgPath)
        },

        threadID,

        () => {
          // Auto delete cache
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        },

        messageID
      );

    } catch (error) {

      console.error(
        "CHIPAY ERROR:",
        error
      );

      // Delete broken cache
      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
        } catch (_) {}
      }

      return api.sendMessage(
        "❌ | ছবি তৈরি করতে সমস্যা হয়েছে!\n\n" +
        "⚠️ Avatar/Background URL অথবা canvas package চেক করুন।",
        threadID,
        messageID
      );
    }
  }
};
