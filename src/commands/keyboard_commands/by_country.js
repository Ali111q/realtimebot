const { degreesByCountry } = require("../../api");
const { storeCountryId } = require("../../helper/sqlit_database");
const { rootInlineKeyboard } = require("../start");

exports.byCountry = async (bot, query, countryName, countryId, page) => {
  const degrees = await degreesByCountry(countryId, page);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;
  await storeCountryId(chatId, countryId);
  // Handle different options
  // (code to handle callback queries remains as provided)
  // Edit the message with the query
  bot.sendMessage(chatId, "select degree", {
    caption: "Choose an option:",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "اهم الاسئلة بخصوص " + countryName,
            callback_data: `ask_${countryId}`,
          },
        ],
        ...degrees.data.map(e => [{ text: e.name, callback_data: `degree_${countryName}_${e.id}` }]),
        (degrees.currentPage != degrees.pagesCount && degrees.currentPage != 1) ? [
             { text: "<<", callback_data: `country_${countryName}_${countryId}_${degrees.currentPage-1}` },
            { text: ">>", callback_data: `country_${countryName}_${countryId}_${degrees.currentPage+1}` }
        ] :degrees.currentPage != degrees.pagesCount? [{ text: ">>", callback_data: `country_${countryName}_${countryId}_${degrees.currentPage+1}` }]: degrees.currentPage != 1? [{ text: "<<", callback_data: `country_${countryName}_${countryId}_${degrees.currentPage-
          1}` }]:[]
    ]
    },
    parse_mode: "Markdown",
  });
  // Always answer the callback query to acknowledge the interaction
  bot.answerCallbackQuery(query.id);
};
