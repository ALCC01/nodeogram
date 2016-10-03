'use strict';
const User = require('./User.js'),
    extend = require('util')._extend;

function GameHighScore(object, bot) {
    extend(this, object);
    this.bot = bot;

    this.user = new User(this.user, bot);

}

module.exports = GameHighScore;
