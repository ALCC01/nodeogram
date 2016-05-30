'use strict';
const extend = require('util')._extend;

function InlineQueryResultGif(id, gif_url, thumb_url, options) {
    extend(this, options);
    this.type = 'gif';
    this.id = id;
    this.gif_url = gif_url;
    this.thumb_url = thumb_url;
}

module.exports = InlineQueryResultGif;
