const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { getCountries, getSettings, degreesByCountry, collageByDegree, unis, asks, getCountryById, getFieldById, getMedicalFields } = require("./src/api");
const { storeCountryId, getCountryId, storeDegreeId, getDegreeId } = require("./src/helper/sqlit_database");

// Load environment variables from .env file
dotenv.config();

var qustionss = [];
// Access the bot token from the environment variable
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const countries = await getCountries();
  const settings = await getSettings();
  const chatId = msg.chat.id;
  try {


    bot.sendMessage(
      chatId,
      settings.data[0].welcomeMessage,


      {
        reply_markup: {
          inline_keyboard: [
            ...countries.data.map((e) => [
              {
                text: e.name,
                callback_data: `country_${e.name.split(" ")[0]}_${e.id
                  }`,
              },
            ]),
            [{ text: "التخصصات الطبية", callback_data: "medical" }],
          ],
        },
        parse_mode: "Markdown",
      }
    );

  } catch (error) {

  }

});

bot.on("callback_query", async (query) => {
  try {


    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const callbackData = query.data;
    console.log(callbackData);
    switch (callbackData.split("_")[0]) {
      case "start":
        const countries = await getCountries();
        const settings = await getSettings();
        bot.editMessageText(settings.data[0].welcomeMessage, {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: {
            inline_keyboard: [
              ...countries.data.map((e) => [
                {
                  text: e.name,
                  callback_data: `country_${e.name.split(" ")[0]}_${e.id
                    }`,
                },
              ]),
            ],
          },
          parse_mode: "Markdown",
        });
        break;

      case "country":
        await storeCountryId(chatId, callbackData.split("_")[2]);
        const countryId31 = callbackData.split("_")[2];
        const countryName = await getCountryById(countryId31);
        degreesByCountry(
          callbackData.split("_")[2],
          1
        ).then(async (degrees) => {

          bot.editMessageText(countryName.name, {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: {
              inline_keyboard: [
                [{ text: `اسئلة بخصوص ${countryName.name}`, callback_data: `ask_${callbackData.split("_")[2]}` }],
                ...degrees.data.map((e) => [
                  {
                    text: e.name,
                    callback_data: `degree_${e.name}_${e.id
                      }`,
                  },
                ]),
                [{ text: "رجوع", callback_data: "start" }],
              ],
            },
            parse_mode: "Markdown",
          });
        });
        break;
      case "countri":
        await storeCountryId(chatId, callbackData.split("_")[2]);
        const countryId32 = await getCountryId(chatId);
        const countryName1 = await getCountryById(countryId32);
        degreesByCountry(
          callbackData.split("_")[2],
          1
        ).then(async (degrees) => {

          bot.editMessageText(countryName1.name, {
            chat_id: chatId,
            message_id: query.message.message_id,
            reply_markup: {
              inline_keyboard: [
                [{ text: `اسئلة بخصوص ${countryName1.name}`, callback_data: `ask_${callbackData.split("_")[2]}` }],
                ...degrees.data.map((e) => [
                  {
                    text: e.name,
                    callback_data: `degree_${e.name}_${e.id
                      }`,
                  },
                ]),
                [{ text: "رجوع الى الدول", callback_data: 'start' }]

              ],
            },
            parse_mode: "Markdown",
          });
        });
        break;
      case "degree":
        const countryId = await getCountryId(chatId);
        storeDegreeId(chatId, callbackData.split("_")[2]);
        collageByDegree(
          callbackData.split("_")[2], callbackData.split("_")[3], countryId
        ).then((collages) => {
          bot.editMessageText(callbackData.split("_")[1], {
            message_id: query.message.message_id,
            chat_id: chatId,
            reply_markup: {

              inline_keyboard: [
                // Splitting the collages into pairs for two columns
                ...collages.data.reduce((accumulator, currentValue, index) => {
                  // Check if it's the first collage of a pair
                  if (index % 2 === 0) {
                    accumulator.push([
                      // Add the first collage button
                      {
                        text: currentValue.name,
                        callback_data: `collage_${callbackData.split("_")[1]}_${currentValue.id}`,
                      },
                      // Check if there's a second collage available
                      collages.data[index + 1] ?
                        // Add the second collage button
                        {
                          text: collages.data[index + 1].name,
                          callback_data: `collage_${callbackData.split("_")[1]}_${collages.data[index + 1].id}`,
                        } : null, // If no second collage, add null
                    ].filter(Boolean)); // Filter out null values
                  }
                  return accumulator;
                }, []),
                // check if it's not first or last page and make 2 pagination buttons

                collages.pagesCount > collages.currentPage ? [
                  {
                    text: "التالي",
                    callback_data: `degre_${callbackData.split("_")[1]}_${callbackData.split("_")[2]}_${collages.currentPage + 1}`,
                  },
                ] :

                  []
                ,
                [{ text: "رجوع", callback_data: `countri_${callbackData.split("_")[1]}_${countryId}` }],
                [{ text: "رجوع الى الدول", callback_data: 'start' }]
              ],
            },

            parse_mode: "Markdown",
          });
        });
        break;
      case "degre":
        const countryId2 = await getCountryId(chatId);
        collageByDegree(
          callbackData.split("_")[2], callbackData.split("_")[3] ?? null, countryId2
        ).then(async (collages) => {
          const countryId30 = await getCountryId(chatId);
          console.log(collages.pagesCount > collages.currentPage && collages.currentPage > 1);
          console.log(collages.pagesCount > collages.currentPage);
          console.log(collages.currentPage > 1);
          bot.editMessageText(callbackData.split("_")[1], {

            message_id: query.message.message_id,
            chat_id: chatId,
            reply_markup: {
              inline_keyboard: [
                // Splitting the collages into pairs for two columns
                ...collages.data.reduce((accumulator, currentValue, index) => {
                  // Check if it's the first collage of a pair
                  if (index % 2 === 0) {
                    accumulator.push([
                      // Add the first collage button
                      {
                        text: currentValue.name,
                        callback_data: `collage_${callbackData.split("_")[1]}_${currentValue.id}`,
                      },
                      // Check if there's a second collage available
                      collages.data[index + 1] ?
                        // Add the second collage button
                        {
                          text: collages.data[index + 1].name,
                          callback_data: `collage_${callbackData.split("_")[1]}_${collages.data[index + 1].id}`,
                        } : null, // If no second collage, add null
                    ].filter(Boolean)); // Filter out null values
                  }
                  return accumulator;
                }, []),
                // check if it's not first or last page and make 2 pagination buttons

                collages.pagesCount > collages.currentPage && collages.currentPage > 1 ? [
                  {
                    text: "التالي",
                    callback_data: `degre_${callbackData.split("_")[1]}_${callbackData.split("_")[2]}_${collages.currentPage + 1}`,
                  },
                  {
                    text: "السابق",
                    callback_data: `degre_${callbackData.split("_")[1]}_${callbackData.split("_")[2]}_${collages.currentPage - 1}`,
                  },
                ] :
                  collages.pagesCount > collages.currentPage ? [
                    {
                      text: "التالي",
                      callback_data: `degre_${callbackData.split("_")[1]}_${callbackData.split("_")[2]}_${collages.currentPage + 1}`,
                    },

                  ] :
                    collages.currentPage > 1 ? [

                      {
                        text: "السابق",
                        callback_data: `degre_${callbackData.split("_")[1]}_${callbackData.split("_")[2]}_${collages.currentPage - 1}`,
                      },
                    ] :
                      []
                ,
                [{ text: "رجوع", callback_data: `countri_${callbackData.split("_")[1]}_${countryId2}` }],
                [{ text: "رجوع الى الدول", callback_data: 'start' }]

              ],
            },

            parse_mode: "Markdown",
          });
        });
        break;
      case "collage":
        const countryId3 = await getCountryId(chatId);
        const degId = await getDegreeId(chatId);
        const field = await getFieldById(callbackData.split("_")[2]);
        unis(countryId3,
          callbackData.split("_")[2], degId
        ).then((universities) => {
          const messageText = `الجامعات المتوفره في (${field.name}):\n\n${universities.data.map(
            (e, index) =>
              `${index + 1}- ${e.universityName}: ${e.price}$ ${e.isValid ? "(التسجيل مفتوح)" : "(التسجيل غير مفتوح)"
              } \n`
          )}`;
          bot.editMessageText(messageText, {
            message_id: query.message.message_id,
            chat_id: chatId,
            reply_markup: {
              inline_keyboard: [
                [{ text: "تواصل Whatsapp 📞", url: "https://wa.link/qztn5d" }],
                [{ text: "تواصل Telegram 💬", url: "https://t.me/derastek" }],
                [{
                  text: "رجوع",
                  callback_data: `degree_${callbackData.split("_")[1]}_${degId}`,

                }],
                [{
                  text: "رجوع الى البلد",
                  callback_data: `countri_${callbackData.split("_")[1]}_${countryId3}`,

                }],
                [{ text: "رجوع الى الدول", callback_data: 'start' }]


              ],
            },
            parse_mode: "Markdown",
          });
        });

        break;
      case "ask":
        asks(
          callbackData.split("_")[1]
        ).then((questions) => {
          qustionss = [...questions.data]
          bot.editMessageText("اهم الاسئلة", {
            message_id: query.message.message_id,
            chat_id: chatId,
            reply_markup: {
              inline_keyboard: [
                ...qustionss.map((e, index) => {

                  if (e.videoUrl == null) {
                    return [
                      {
                        text: e.questionTitle,
                        callback_data: `answer_${index}`,
                      },
                    ];

                  }
                  else {


                    return [
                      {
                        text: e.questionTitle,
                        callback_data: `answerv_${index}`,
                      },
                    ]
                  }
                }),
                [{
                  text: "رجوع الى البلد",
                  callback_data: `countri_${"jjj"}_${callbackData.split("_")[1]}`,

                }],
                [{ text: "رجوع الى الدول", callback_data: 'start' }]

              ],
            },
            parse_mode: "Markdown",
          });
        });
        break;
      case "answer":
        bot.sendMessage(chatId, qustionss[callbackData.split("_")[1]].questionAnswer, {

          parse_mode: "Markdown",
        });
        break;
      case "answerv":
        console.log(qustionss);
        bot.sendVideo(
          chatId,
          "https://study-api.jayak.net/" + qustionss[callbackData.split("_")[1]].videoUrl,
          {
            parse_mode: "Markdown",
            caption: qustionss[callbackData.split("_")[1]].questionTitle,
          });
        break;
      case 'medical':
        const medical = await getMedicalFields();
        bot.sendVideo(
          chatId,
          "https://study-api.jayak.net/" + medical.data[0].videoUrl,
          {
            parse_mode: "Markdown",
          });

    }
  } catch (error) {

  }
});