const TelegramBot = require('node-telegram-bot-api');
const ytDlp = require('yt-dlp-exec');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Replace with your actual bot token from @BotFather
const token = '8601351068:AAFKDOQZjAjOaplSA91gXfxMkfgvadvk6Hg'; 

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

console.log('Music Bot started. Waiting for messages...');

bot.onText(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be|music\.youtube\.com|spotify\.com)\S+/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[0];
  const messageId = msg.message_id;

  console.log(`Received URL: ${url} from chat: ${chatId}`);

  try {
    const statusMsg = await bot.sendMessage(chatId, '🎵 Found your link! Downloading audio... This might take a minute.', {
      reply_to_message_id: messageId
    });

    // Ensure downloads folder exists
    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const outputFilename = `${uuidv4()}.mp3`;
    const outputPath = path.join(downloadsDir, outputFilename);

    console.log(`Downloading to ${outputPath}...`);

    // yt-dlp configuration to extract audio as mp3
    await ytDlp(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: outputPath,
      noPlaylist: true, // Only download the single song
    });

    console.log('Download complete. Sending to Telegram...');
    await bot.editMessageText('✅ Download complete! Uploading to Telegram...', {
      chat_id: chatId,
      message_id: statusMsg.message_id
    });

    // Send the audio file
    await bot.sendAudio(chatId, outputPath, {
      caption: 'Downloaded via Classgrid Bot'
    });

    // Cleanup: Delete the file after sending
    fs.unlinkSync(outputPath);
    console.log(`Cleaned up ${outputPath}`);

  } catch (error) {
    console.error('Error processing download:', error);
    bot.sendMessage(chatId, '❌ Sorry, I encountered an error downloading that song. Make sure the link is valid and public.', {
      reply_to_message_id: messageId
    });
  }
});

// Help command
bot.onText(/\/start|\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '👋 Welcome to the Music Bot!\n\nJust send me a link from **YouTube**, **YouTube Music**, or **Spotify** and I will download the MP3 for you.');
});
