'use strict';
const ChatMember = require('./ChatMember.js'),
    User = require('./User.js'),
    extend = require('util')._extend;

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
    };

    this.kickMember = (user_id) => {
        if (user_id instanceof User) user_id = user_id.id;
        return this.bot.kickChatMember(this.id, user_id)
    };

    this.unbanMember = (user_id) => {
        if (user_id instanceof User) user_id = user_id.id;
        return this.bot.unbanChatMember(this.id, user_id)
    };

    this.leave = () => {
        return this.bot.leaveChat(this.id);
    };

    this.getAdministrators = () => {
        return this.bot.getChatAdministrators(this.id);
    };

    this.getMember = (user_id) => {
        if (user_id instanceof User) user_id = user_id.id;
        return this.bot.getChatMember(this.id, user_id);
    };

    this.getMembersCount = () => {
        return this.bot.getChatMembersCount(this.id);
    }

    this.sendAction = (action) => {
        return this.bot.sendChatAction(this.id, action)
    }
}

module.exports = Chat;