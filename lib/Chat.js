'use strict';
const extend = require('util')._extend;

function Chat(object, bot) {
    if (object == undefined) return;
    extend(this, object);

    this.name = this.first_name + (this.last_name ? " " + this.last_name : "");
    this.bot = bot;

    this.sendMessage = (text, options) => {
        return this.bot.sendMessage(this.id, text, options);
    };

    this.forwardMessage = (from_chat_id, message_id, options) => {
        return this.bot.forwardMessage(this.id, from_chat_id, message_id, options)
    };

    this.sendFile = (type, path, options) => {
        this.bot.sendFile(this.id, type, path, options)
    }
}

module.exports = Chat;