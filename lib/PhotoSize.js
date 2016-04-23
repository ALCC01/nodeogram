'use strict';
const extend = require('util')._extend;

function PhotoSize(object, bot) {
    if (object == undefined) return;
    extend(this, object);
    this.bot = bot;

    this.getFile = () => {
        return bot.getFile(this.file_id);
    }
}

module.exports = PhotoSize;
