// Import required modules
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Access the bot token from the environment variable
const TOKEN = process.env.TOKEN;

// Create a new Telegram bot instance
const bot = new TelegramBot(TOKEN, { polling: true });

// Import command handlers
const { handleStartCommand } = require("./commands/start");
const { byCountry } = require("./commands/keyboard_commands/by_country");
const { byDegree } = require("./commands/keyboard_commands/by_degree");
const { byCollage } = require("./commands/keyboard_commands/by_collage");
const { ask } = require("./commands/keyboard_commands/ask");
const { answer } = require("./commands/keyboard_commands/answer");
var questions = [];
// Attach command handlers
bot.onText(/\/start/, handleStartCommand(bot));
// Other bot event handlers
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;
  console.log(callbackData);
  switch (callbackData.split("_")[0]) {
    case "country":
      byCountry(
        bot,
        query,
        callbackData.split("_")[1],
        callbackData.split("_")[2]
      );
      break;
    case "degree":
      byDegree(
        bot,
        query,
        callbackData.split("_")[1],
        callbackData.split("_")[2]
      );
      break;
    case "collage":
      byCollage(bot, query, null, callbackData.split("_")[2]);
      break;
    case "start":
      handleStartCommand(bot)(query.message);
      console.log("starting");
      break;
    case "ask":
      console.log("ask");
      ask(bot, query, callbackData.split("_")[1]);
      break;
    case "answer":
      answer(
        bot,
        query,
        callbackData.split("_")[2],
        callbackData.split("_")[1]
      );
      break;
    default:
      break;
  }
  bot.answerCallbackQuery(query.id);
});

module.exports = bot;
