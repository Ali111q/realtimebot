const { asks } = require("../../api");
const { getCountryId } = require("../../helper/sqlit_database");
const { rootInlineKeyboard } = require("../start");

exports.ask = async (bot, query, countryId) => {
  console.log("asks");
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const callbackData = query.data;
  const cID = await getCountryId();
  const askss = await asks(countryId);
  console.log(askss);
  bot.sendMessage(chatId, "test", {
    messageId: messageId,
    reply_markup: {
      inline_keyboard: [
        ...askss.data.map((e) => [
          {
            text: e.questionTitle,
            callback_data: `answer_${countryId}_${e.questionAnswer}`,
          },
        ]),
      ],
    },
    parse_mode: "Markdown",
  });
};
