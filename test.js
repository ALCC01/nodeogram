const nodeogram = require('./index.js'),
    bot = new nodeogram.Bot('121919558:AAGEsXhFkkm2W-tLuE2eHHtW4J5ONla32Kw');
bot.init()

bot.on('message', (message) => {
    console.log(message)
})