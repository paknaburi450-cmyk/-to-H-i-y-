const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const LOCKED_AUTHOR = "SIYAM";
const statusMap = new Map();

module.exports.config = {
  name: "buzz",
  version: "8.0.0",
  hasPermssion: 0,
  credits: LOCKED_AUTHOR,
  description: "Perfect Siyam Boss Love Storm",
  commandCategory: "fun",
  usages: "@mention | on/off",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (module.exports.config.credits !== LOCKED_AUTHOR) {
      return api.sendMessage("⛔ Command locked!", event.threadID);
    }

    const threadID = event.threadID;

    if (args[0] === "off") {
      statusMap.set(threadID, false);
      return api.sendMessage("❌ Buzz OFF করা হয়েছে!", threadID);
    }

    if (args[0] === "on") {
      statusMap.set(threadID, true);
      return api.sendMessage("✅ Buzz ON করা হয়েছে!", threadID);
    }

    if (statusMap.get(threadID) === false) {
      return api.sendMessage("⚠️ Buzz OFF আছে!", threadID);
    }

    const mention = Object.keys(event.mentions || {})[0];

    if (!mention) {
      return api.sendMessage(
        "😅 আগে কাউকে @mention করো!",
        threadID
      );
    }

    const name = event.mentions[mention];

    const arraytag = [
      {
        id: mention,
        tag: name
      }
    ];

    const messages = [
      `হৃদয় হাসান শান্ত তোমাকে ভালোবাসে ${name} ❤️`,
      `হৃদয় হাসান শান্ত সবসময় তোমার পাশে আছে ${name} 🫶`,
      `হৃদয় হাসান শান্ত তোমাকে খুব মিস করে ${name} 😘`,
      `হৃদয় হাসান শান্ত তোমাকে নিয়ে ভাবে ${name} 🌸`,
      `হৃদয় হাসান শান্ত চায় তুমি সবসময় হাসো ${name} 😊`,
      `হৃদয় হাসান শান্ত এর কাছে তুমি অনেক স্পেশাল ${name} 💝`,
      `হৃদয় হাসান শান্ত তোমার জন্য সব করতে রাজি ${name} 💌`,
      `হৃদয় হাসান শান্ত তোমার কথা সবসময় ভাবে ${name} 🥰`,
      `হৃদয় হাসান শান্ত শুধু তোমাকেই চায় ${name} 💖`,
      `হৃদয় হাসান শান্ত তোমাকে সারাজীবন ভালোবাসবে ${name} 💛`,
      `হৃদয় হাসান শান্ত তোমার জন্য অপেক্ষা করছে ${name} 🌹`,
      `হৃদয় হাসান শান্ত তোমার হাসি দেখতে চায় ${name} 😄`,
      `হৃদয় হাসান শান্ত সবসময় তোমার খোঁজ রাখে ${name} ❤️`,
      `হৃদয় হাসান শান্ত তোমাকে নিয়ে স্বপ্ন দেখে ${name} 🌙`,
      `হৃদয় হাসান শান্ত তোমার ভালোবাসা চায় ${name} 💖`,
      `হৃদয় হাসান শান্ত তোমাকে আজও মনে করছে ${name} 💌`,
      `হৃদয় হাসান শান্ত তোমার সঙ্গে সময় কাটাতে চায় ${name} 🌹`,
      `হৃদয় হাসান শান্ত তোমাকে প্রিয় মনে করে ${name} 💝`,
      `হৃদয় হাসান শান্ত তোমার খুশি চায় ${name} ❤️`,

      `হৃদয় হাসান শান্ত তোমাকে শুধু ভালোবাসে না, তোমার জন্য বাঁচে ${name} ❤️`,
      `হৃদয় হাসান শান্ত বলে তুমি না থাকলে সব ফাঁকা লাগে ${name} 🥺`,
      `হৃদয় হাসান শান্ত এর হৃদয়ের প্রতিটা বিটে শুধু তুমি ${name} 💓`,
      `হৃদয় হাসান শান্ত বলে তোমার হাসি তার পৃথিবী আলোকিত করে ${name} ✨`,
      `হৃদয় হাসান শান্ত এর কাছে তুমি শান্তি আবার ঝড় ${name} 🌸`,
      `হৃদয় হাসান শান্ত তোমাকে নিজের জীবনের অংশ বানাতে চায় ${name} 💍`,
      `হৃদয় হাসান শান্ত বলে তুমি তার স্বপ্ন আর বাস্তব ${name} 💫`,
      `হৃদয় হাসান শান্ত তোমাকে হারানোর ভয় পায় ${name} 😢`,
      `হৃদয় হাসান শান্ত এর কাছে তুমি পৃথিবীর সবচেয়ে প্রিয় ${name} 🌍💖`,
      `হৃদয় হাসান শান্ত বলে তোমার কণ্ঠ তার favourite song ${name} 🎶`,
      `হৃদয় হাসান শান্ত বলে তুমি তার heartbeat ${name} 💓`,
      `হৃদয় হাসান শান্ত বলে তুমি তার happiness ${name} 😊`,
      `হৃদয় হাসান শান্ত বলে তুমি তার সবচেয়ে প্রিয় মানুষ ${name} ❤️`
    ];

    api.sendMessage(
      `😈 শুরু হচ্ছে "হৃদয় হাসান শান্ত লাভ স্টর্ম" ${name}-এর জন্য... 💘🔥`,
      threadID
    );

    for (const msg of messages) {
      if (statusMap.get(threadID) === false) {
        api.sendMessage("🛑 Buzz বন্ধ করা হয়েছে!", threadID);
        break;
      }

      await delay(3000);

      api.sendMessage(
        {
          body: msg,
          mentions: arraytag
        },
        threadID
      );
    }

    if (statusMap.get(threadID) !== false) {
      api.sendMessage(
        "💘 শেষ! হৃদয় হাসান শান্ত এর লাভ স্টর্ম শেষ 😎🔥",
        threadID
      );
    }

  } catch (err) {
    console.error("BUZZ ERROR:", err);
    api.sendMessage(
      "❌ Buzz command-এ Error হয়েছে!",
      event.threadID
    );
  }
};
