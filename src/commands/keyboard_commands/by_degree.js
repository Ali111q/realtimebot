const { collageByDegree } = require("../../api");
const { rootInlineKeyboard } = require("../start");

exports.byDegree = async (bot, query, degreeName, degreeId) => {
  const collages = await collageByDegree(degreeId);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;

  // Construct caption

  // Edit the message caption
  bot.editMessageText("chose a collage", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: rootInlineKeyboard(collages.data, "collage", null, false),
    parse_mode: "Markdown",
  });

  // Always answer the callback query to acknowledge the interaction
  bot.answerCallbackQuery(query.id);
};
