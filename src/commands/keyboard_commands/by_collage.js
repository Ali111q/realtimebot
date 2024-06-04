const { collageByDegree, unis, getSettings } = require("../../api");
const { getCountryId } = require("../../helper/sqlit_database");
const { rootInlineKeyboard } = require("../start");

exports.byCollage = async (bot, query, collageName, collageId) => {
  const settings = await getSettings();
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;
  const countryId = await getCountryId(chatId);
  console.log("##############" + countryId);
  const uniss = await unis(countryId, collageId);
  console.log(callbackData);

  // Construct message text
  const messageText = `الجامعات المتوفره:\n\n${uniss.data.map(
    (e, index) =>
      `${index + 1}- ${e.universityName}: ${e.price} ${
        e.isValid ? "🟢" : "🔴"
      } \n`
  )}`;

  // Edit the message text
  bot.editMessageText(messageText, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Whatsapp 📞", url: "https://wa.me/9647737503949" }],
        [{ text: "Telegram 💬", url: "https://t.me/sln_99" }],
        [
          {
            text: "الرجوع الى القائمة الرئيسية",
            callback_data: `degree_ssss_${collageName}`,
          },
        ],
      ],
    },
    parse_mode: "Markdown",
  });

  // Always answer the callback query to acknowledge the interaction
  bot.answerCallbackQuery(query.id);
};
