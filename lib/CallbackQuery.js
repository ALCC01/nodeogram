'use strict';
const User = require('./User.js'),
    Message = require('./Message.js'),
    Chat = require('./Chat.js'),
    extend = require('util')._extend;

function CallbackQuery(object, bot) {
    if (object == undefined) return;
    extend(this, object);
    this.bot = bot;

    this.from = new User(this.from, bot);
    if (this.message) this.message = new Message(this.message, bot);

    this.answer = (options, alert) => {
        // TODO Drop support for the old method signature
        if (typeof options === 'string') {
            console.log('WARNING! The old answerCallbackQuery method signature is deprecated and will likely be removed in the next releases.');
            console.trace();
            options = {
                text: options,
                alert: alert
            }
        }
        this.bot.answerCallbackQuery(this.id, options)
    }
}

module.exports = CallbackQuery;