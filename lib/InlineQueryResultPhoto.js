'use strict';
const extend = require('util')._extend;

function InlineQueryResultPhoto(id, photo_url, thumb_url, options) {
    extend(this, options);
    this.type = 'photo';
    this.id = id;
    this.photo_url = photo_url;
    this.thumb_url = thumb_url;
}

module.exports = InlineQueryResultPhoto;