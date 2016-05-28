'use strict';
const User = require('./User.js'),
    extend = require('util')._extend;

function ChatMember(object, bot) {
    if (object == undefined) return;
    extend(this, object);

    this.user = new User(this.user, bot);
    this.bot = bot;
}

module.exports = ChatMember;

