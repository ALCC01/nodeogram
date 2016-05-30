const nodeogram = require('./index.js'),
    bot = new nodeogram.Bot('121919558:AAGEsXhFkkm2W-tLuE2eHHtW4J5ONla32Kw');
bot.init()

bot.on('message', (message) => {
    message.chat.sendLocation(0, 0, {});
    message.chat.sendVenue(0, 0, 'sasasa', 'sasasasasasasasa', {});
    message.chat.sendContact(37747374374, 'sasasasasasa', {});
    message.from.getProfilePhotos({}).then(c => console.log(c)).catch(e => console.log(e))
})