const { getCountries, getSettings } = require("../api");

// Define the root inline keyboard
const rootInlineKeyboard = (countries, keyWord, selectedCountry, isStart) => {
  console.log(countries);
  return {
    inline_keyboard: [
      selectedCountry != null
        ? [
            {
              text: "questions about " + selectedCountry?.name,
              callback_data: `ask_${selectedCountry.id}`,
            },
          ]
        : [],
      ...countries.map((e) => [
        {
          text: e.name,
          callback_data: `${keyWord}_${e.name.includes(" ") ? "-" : e.name}_${
            e.id
          }`,
        },
      ]),
      isStart === false
        ? [
            {
              text: "الرجوع الى القائمة الرئيسية",
              callback_data: "start_start",
            },
          ]
        : [],
    ],
  };
};
// Function to handle the /start command
const handleStartCommand = (bot) => async (msg) => {
  const countries = await getCountries();
  const settings = await getSettings();
  const chatId = msg.chat.id;
  console.log(settings);
  bot.sendVideo(
    chatId,
    "https://study-backend.app-seen.com/" + settings.data[0].welcomeVideoUrl,
    {
      caption: settings.data[0].welcomeMessage,
      reply_markup: rootInlineKeyboard(
        countries.data,
        "country",
        null,
        null,
        true
      ),
      parse_mode: "Markdown",
    }
  );
};

// Export the function
module.exports = {
  handleStartCommand,
  rootInlineKeyboard,
};
