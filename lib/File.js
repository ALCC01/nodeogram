'use strict';
const extend = require('util')._extend;

function File(object, bot) {
    if (object == undefined) return;
    extend(this, object);
    this.bot = bot;

    this.download = () => {
        return this.bot.downloadFile(this)
    }
}

module.exports = File;