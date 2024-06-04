exports.answer = (bot, query, answer, countryId) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  bot.sendMessage(chatId, answer);
};
exports.answerVideo = (bot, query, answer, countryId) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  bot.sendVideo(chatId,"https://study-backend.app-seen.com/"+ answer);
};
