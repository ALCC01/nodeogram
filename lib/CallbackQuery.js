'use strict';
const User = require('./User.js'),
    Chat = require('./Chat.js'),
    Message = require('./Message.js'),
    extend = require('util')._extend;

function CallbackQuery(object, bot) {
    if (object == undefined) return;
    extend(this, object);
    this.bot = bot;

    this.from = new User(this.from, bot);
    if (this.message) this.message = new Message(this.message, bot);

    this.answer = (text, alert) => {
        this.bot.answerCallbackQuery(this.id, text, alert)
    }
}

module.exports = CallbackQuery;