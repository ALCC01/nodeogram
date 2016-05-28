'use strict';
module.exports = {};
var Bot = module.exports.Bot = require('./lib/Bot.js'),
    User = module.exports.User = require('./lib/User.js'),
    Chat = module.exports.Chat = require('./lib/Chat.js'),
    Message = module.exports.Message = require('./lib/Message.js'),
    PhotoSize = module.exports.PhotoSize = require('./lib/PhotoSize.js'),
    File = module.exports.File = require('./lib/File.js'),
    InlineQuery = module.exports.InlineQuery = require('./lib/InlineQuery.js'),
    ChosenInlineResult = module.exports.ChosenInlineResult = require('./lib/ChosenInlineResult.js'),
    InlineQueryResultArticle = module.exports.InlineQueryResultArticle = require('./lib/InlineQueryResultArticle.js'),
    InlineQueryResultLocation = module.exports.InlineQueryResultLocation = require('./lib/InlineQueryResultLocation.js'),
    Keyboard = module.exports.Keyboard = require('./lib/Keyboard.js'),
    ChatMember = module.exports.ChatMember = require('./lib/ChatMember.js');

const bot = new Bot("121919558:AAHT7fH1QlAYGNAtQOwvBlwbOodIajou3Y8");
bot.init();

bot.on('message', (message) => {
    var keyboard = new Keyboard();
    keyboard.addButton(0, 0, {text:"sasasasa", callback_data: "uhuhuhuhuhuhu"});
    keyboard.toInline();
    message.reply("ygygygygygygy", {reply_markup: keyboard})
});

bot.on('callback_query', (query) => {
    query.message.editText("sassa", false, {}).catch((err) => {console.log(err)});
    query.message.chat.getMembersCount().then((user) => {
        query.message.chat.unbanMember(query.from)
    })
});