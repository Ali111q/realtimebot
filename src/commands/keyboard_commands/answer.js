exports.answer = (bot, query, answer, countryId) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  bot.sendMessage(chatId, answer);
};
