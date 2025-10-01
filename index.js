const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const token = "1251223589:AAGeAG4Bdh3PMrFNipcfmClOIE71k2seKzA";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (text && (text.includes("youtube.com/shorts") || text.includes("youtu.be"))) {
    try {
      await bot.sendMessage(chatId, "⏳ Downloading with yt-dlp...");

      const output = path.resolve(__dirname, "video.mp4");

      exec(`yt-dlp -f mp4 -o "${output}" "${text}"`, async (err) => {
        if (err) {
          console.error(err);
          return bot.sendMessage(chatId, "❌ Failed to download.");
        }

        await bot.sendVideo(chatId, output);
        fs.unlinkSync(output);
      });
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Error occurred.");
    }
  } else {
    bot.sendMessage(chatId, "👉 Send me a YouTube Shorts link.");
  }
});
