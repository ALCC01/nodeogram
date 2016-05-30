'use strict';
const extend = require('util')._extend;

function User(object, bot) {
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
        return this.bot.sendFile(this.id, type, path, options)
    };

    this.sendLocation = (longitude, latitude, options) => {
        return this.bot.sendLocation(this.id, longitude, latitude, options)
    };

    this.sendVenue = (longitude, latitude, title, address, options) => {
        return this.bot.sendVenue(this.id, longitude, latitude, title, address, options)
    };

    this.sendContact = (phone_number, first_name, options) => {
        return this.bot.sendContact(this.id, phone_number, first_name, options)
    };

    this.sendAction = (action) => {
        return this.bot.sendChatAction(this.id, action)
    };

    this.getProfilePhotos = (options) => {
        return this.bot.getUserProfilePhotos(this.id, options)
    }

}

module.exports = User;