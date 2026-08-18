const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const ORIGINAL_AUTHOR = "Farhan-Khan";

function verifyAuthor(author) {
  return author === ORIGINAL_AUTHOR;
}

module.exports = {
  config: {
    name: "fokir",
    aliases: ["ফকির"],
    version: "2.3.0",
    author: ORIGINAL_AUTHOR,
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: "Fokir street meme edit 😂",
    longDescription: "Mention বা reply করা ব্যক্তির ছবি দিয়ে ফকির meme তৈরি করে।",
    guide: "{pn} @mention অথবা reply"
  },

  onStart: async function ({ api, event, message }) {

    // 🔒 AUTHOR CHECK
    if (!verifyAuthor(this.config.author)) {
      return message.reply(
        "❌ This file has been modified illegally. Author mismatch detected!"
      );
    }

    const { threadID, messageID, mentions, messageReply } = event;

    const cacheDir = path.join(process.cwd(), "cache");

    if (!fs.existsSync(cacheDir)) {
      fs.ensureDirSync(cacheDir);
    }

    let targetID = null;

    // Mention থাকলে
    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    }

    // Reply থাকলে
    else if (messageReply && messageReply.senderID) {
      targetID = messageReply.senderID;
    }

    if (!targetID) {
      return message.reply(
        "আরে মামা, কাউরে মেনশন দে বা রিপ্লাই দে! 🪙😂"
      );
    }

    let filePath = null;

    try {
      // User info
      const userInfo = await api.getUserInfo(targetID);
      const userName =
        userInfo?.[targetID]?.name || "User";

      // Base meme image
      const imgLink =
        "https://i.imgur.com/ooMx1By.jpeg";

      filePath = path.join(
        cacheDir,
        `fokir_${Date.now()}.png`
      );

      await message.reply(
        "দাঁড়া মামা, রাস্তায় নামাইতেছি... 🪙⏳"
      );

      /*
       * Facebook profile picture
       *
       * চাইলে নিজের valid access token
       * process.env.FB_ACCESS_TOKEN এ রাখতে পারো।
       */
      const accessToken =
        process.env.FB_ACCESS_TOKEN;

      if (!accessToken) {
        return message.reply(
          "❌ FB_ACCESS_TOKEN পাওয়া যায়নি। Bot environment-এ token সেট করো।"
        );
      }

      const targetPfpUrl =
        `https://graph.facebook.com/${targetID}/picture` +
        `?width=512&height=512&access_token=${accessToken}`;

      // Images load
      const [baseImage, targetPfp] =
        await Promise.all([
          loadImage(imgLink),
          loadImage(targetPfpUrl)
        ]);

      // Canvas
      const canvas = createCanvas(
        baseImage.width,
        baseImage.height
      );

      const ctx = canvas.getContext("2d");

      // Base image
      ctx.drawImage(
        baseImage,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Profile picture settings
      const pfpSize = 95;
      const x = 245;
      const y = 25;

      // Circle clipping
      ctx.save();

      ctx.shadowColor =
        "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.arc(
        x + pfpSize / 2,
        y + pfpSize / 2,
        pfpSize / 2,
        0,
        Math.PI * 2
      );

      ctx.closePath();
      ctx.clip();

      ctx.drawImage(
        targetPfp,
        x,
        y,
        pfpSize,
        pfpSize
      );

      ctx.restore();

      // White border
      ctx.beginPath();

      ctx.arc(
        x + pfpSize / 2,
        y + pfpSize / 2,
        pfpSize / 2,
        0,
        Math.PI * 2
      );

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      // Save image
      const buffer =
        canvas.toBuffer("image/png");

      fs.writeFileSync(
        filePath,
        buffer
      );

      // Caption
      const finalCaption =
`🪙 রাস্তার নতুন ফকির হাজির!

নাম: ${userName}
আজকের আয়: ০ টাকা 😂
সবাই একটু সাহায্য করো ভাই! 🤲`;

      // Send
      return api.sendMessage(
        {
          body: finalCaption,

          mentions: [
            {
              tag: userName,
              id: targetID
            }
          ],

          attachment:
            fs.createReadStream(filePath)
        },

        threadID,

        () => {
          try {
            if (
              filePath &&
              fs.existsSync(filePath)
            ) {
              fs.unlinkSync(filePath);
            }
          } catch (err) {
            console.error(
              "FOKIR CLEANUP ERROR:",
              err
            );
          }
        },

        messageID
      );

    } catch (error) {

      console.error(
        "FOKIR ERROR:",
        error
      );

      // Cache cleanup
      try {
        if (
          filePath &&
          fs.existsSync(filePath)
        ) {
          fs.unlinkSync(filePath);
        }
      } catch {}

      return message.reply(
        "মামা ফকিরটা পালাইছে! আবার ট্রাই কর ❌"
      );
    }
  }
};
