'use strict';
const User = require('./User.js'),
    Chat = require('./Chat.js'),
    PhotoSize = require('./PhotoSize.js'),
    Animation = require('./Animation.js'),
    extend = require('util')._extend;

function Game(object, bot) {
    if (object == undefined) return;
    extend(this, object);

    this.commands = [];
    this.mentions = [];
    this.text_mentions = [];
    this.hashtags = [];
    this.links = [];
    this.command = undefined;
    this.bot = bot;

    if (this.text_entities) {
        this.text_entities.forEach((entity) => {
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

    if (this.animation) {
        this.animation = new Animation(this.animation, this.bot);
    }
}

module.exports = Game;