'use strict';
const User = require('./User.js'),
    extend = require('util')._extend;

function InlineQuery(object, bot) {
    if (object == undefined) return;
    extend(this, object);

    this.bot = bot;
    this.from = new User(this.from);

    this.answer = (results, options) => {
        return bot.answerInlineQuery(this.id, results, options);
    }
}

module.exports = InlineQuery;
