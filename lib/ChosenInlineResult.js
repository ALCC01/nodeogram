'use strict';
const extend = require('util')._extend,
    User = require('./User.js');

function ChosenInlineResult(object, bot) {
    if (object == undefined) return;
    extend(this, object);
    this.bot = bot;
    this.user = new User(this.user, this.bot);
}

module.exports = ChosenInlineResult;