require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const token = "1251223589:AAFt2wVMEnkN2um7hiE-VXW6G288Pm3w8UU";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (text && (text.includes("youtube.com/shorts") || text.includes("youtu.be"))) {
    try {
      await bot.sendMessage(chatId, "⏳ Downloading with yt-dlp...");

      // Unique filename (to avoid conflicts)
      const output = path.resolve(__dirname, `video_${Date.now()}.mp4`);

      exec(`yt-dlp.exe -f mp4 -o "${output}" "${text}"`, async (err) => {
        if (err) {
          console.error(err);
          return bot.sendMessage(chatId, "❌ Failed to download.");
        }

        try {
          // Send video to Telegram
          await bot.sendVideo(chatId, output, {
            caption: `Link: ${text}\n🎥 From YouTube Shorts by @new_rxz_bot`,
          });

          // Delete file after sending
          fs.unlink(output, (delErr) => {
            if (delErr) console.error("⚠️ Error deleting file:", delErr);
            else console.log("🗑️ Deleted:", output);
          });
        } catch (sendErr) {
          console.error(sendErr);
          bot.sendMessage(chatId, "❌ Failed to send video.");
        }
      });
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Error occurred.");
    }
  } else {
    bot.sendMessage(chatId, "👉 Send me a YouTube Shorts link.");
  }
});
