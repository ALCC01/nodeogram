'use strict';
const extend = require('util')._extend;

function InlineQueryResultMpeg4Gif(id, mpeg4_url, thumb_url, options) {
    extend(this, options);
    this.type = 'gif';
    this.id = id;
    this.mpeg4_url = mpeg4_url;
    this.thumb_url = thumb_url;
}

module.exports = InlineQueryResultMpeg4Gif;