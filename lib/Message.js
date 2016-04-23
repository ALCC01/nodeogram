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
    this.reply_to_this = module.exports(this.reply_to_this);
    this.new_chat_member = new User(this.new_chat_member, bot);
    this.left_chat_member = new User(this.left_chat_member, bot);
    this.pinned_this = module.exports(this.pinned_this);
    this.commands = [];
    this.mentions = [];
    this.hashtags = [];
    this.links = [];
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
            }
        })
    }

    if (this.photo) {
        var sizes = [];
        this.photo.forEach((size) => {
            sizes.push(new PhotoSize(size, this.bot))
        });
        this.photo = sizes;
    }

    this.reply = (text, options) => {
        options = options || {};
        options.reply_to_message_id = this.message_id;
        return this.chat.sendMessage(text, options)
    };

    this.forward = (chat, options) => {
        // A chat id was passed
        if (typeof chat == "number" || typeof chat == "string") {
            return this.bot.forwardMessage(chat, this.chat.id, this.message_id, options)
        }
        // A Chat object was passed
        if (typeof chat == "object") {
            return chat.forwardMessage(this.chat.id, this.message_id, options)
        }
    };

    this.editText = (text, inline, options) => {
        options = options || {};
        options.text = text;
        // Edit as inline message
        if (inline) {
            options.inline_message_id = this.message_id;
            return this.bot.call('editMessageText', options)
        } else {
            options.chat_id = Message.chat.id;
            options.message_id = this.message_id;
            return this.bot.call('editMessageText', options)
        }
    };
}

module.exports = Message;