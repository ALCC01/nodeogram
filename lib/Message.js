'use strict';
const User = require('./User.js'),
    Chat = require('./Chat.js'),
    PhotoSize = require('./PhotoSize.js'),
    extend = require('util')._extend;

function Message(object, bot) {
    if (object == undefined) return;
    extend(this, object);

    this.from = new User(this.from, bot);
    this.chat = new Chat(this.chat, bot);
    this.forward_from = new User(this.forward_from, bot);
    this.forward_from_chat = new Chat(this.forward_from_chat, bot);
    this.reply_to_this = module.exports(this.reply_to_this);
    this.new_chat_member = new User(this.new_chat_member, bot);
    this.left_chat_member = new User(this.left_chat_member, bot);
    this.pinned_this = module.exports(this.pinned_this);
    this.commands = [];
    this.mentions = [];
    this.text_mentions = [];
    this.hashtags = [];
    this.links = [];
    this.command = undefined;
    this.bot = bot;

    if (this.entities) {
        this.entities.forEach((entity) => {
            var offset = entity.offset,
                length = entity.length,
                text = this.text.substr(offset, offset + length);
            switch (entity.type) {
                case 'bot_command':
                    var command,
                        rawCommand = command = text,
                        args = this.text.substr(offset + length +1).split(" "),
                        index = rawCommand.indexOf('@'),
                        recipient;

                    if (index !== -1) {
                        recipient = rawCommand.substr(index);
                        command = rawCommand.substr(0, index);
                    }
                    this.commands.push({command: command, recipient: recipient, args: args});
                    if (offset === 0) {
                        this.command = {command: command, recipient: recipient, args: args}
                    }
                    break;
                case 'mention':
                    this.mentions.push(text);
                    break;
                case 'hashtag':
                    this.hashtags.push(text);
                    break;
                case 'url':
                    this.links.push({type: 'url', url: text, text: text});
                    break;
                case 'text_link':
                    this.links.push({type: 'link', url: entity.url, text: text});
                    break;
                case 'text_mention':
                    this.text_mentions.push({text: text, user: new User(entity.user, this.bot)});
                    break;
            }
        })
    }

    if (this.photo) {
        let sizes = [];
        this.photo.forEach((size) => {
            sizes.push(new PhotoSize(size, this.bot))
        });
        this.photo = sizes;
    }

    if (this.new_chat_photo) {
        let sizes = [];
        this.new_chat_photo.forEach((size) => {
            sizes.push(new PhotoSize(size, this.bot))
        });
        this.new_chat_photo = sizes;
    }

    this.reply = (text, options) => {
        options = options || {};
        options.reply_to_message_id = this.message_id;
        return this.chat.sendMessage(text, options)
    };

    this.forward = (chat_id, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;

        return this.bot.forwardMessage(chat_id, this.chat.id, this.message_id, options)
    };

    this.editText = (text, inline, options) => {
        return bot.editMessageText(this.message_id, text, inline, options, this.chat.id)
    };

    this.editCaption = (caption, inline, options) => {
        return bot.editMessageCaption(this.message_id, caption, inline, options, this.chat.id)
    };

    this.editReplyMarkup = (markup, inline, options) => {
        return bot.editMessageReplyMarkup(this.message_id, markup, inline, options, this.chat.id)
    };
}

module.exports = Message;