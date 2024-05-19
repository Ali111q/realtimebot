const { degreesByCountry } = require("../../api");
const { storeCountryId } = require("../../helper/sqlit_database");
const { rootInlineKeyboard } = require("../start");

exports.byCountry = async (bot, query, countryName, countryId) => {
  const degrees = await degreesByCountry(countryId);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;
  await storeCountryId(chatId, countryId);
  // Handle different options
  // (code to handle callback queries remains as provided)
  // Edit the message with the query
  bot.sendMessage(chatId, "select degree", {
    caption: "Choose an option:",
    reply_markup: rootInlineKeyboard(
      degrees.data,
      "degree",
      {
        name: countryName,
        id: countryId,
      },
      false
    ),
    parse_mode: "Markdown",
  });
  // Always answer the callback query to acknowledge the interaction
  bot.answerCallbackQuery(query.id);
};
