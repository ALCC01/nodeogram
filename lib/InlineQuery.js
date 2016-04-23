'use strict';
const User = require('./User.js');

function InlineQuery(object, bot) {
    if (object == undefined) return;

    for (var attribute in object) {
        if (object.hasOwnProperty(attribute)) {
            this[attribute] = object[attribute];
        }
    }
    this.bot = bot;
    this.from = new User(this.from);

    this.answer = (results, options) => {
        return bot.answerInlineQuery(this.id, results, options);
    }
}

module.exports = InlineQuery;
