'use strict';
const extend = require('util')._extend;

function InlineQueryResultVideo(id, video_url, thumb_url, mime_type, title, options) {
    extend(this, options);
    this.type = 'video';
    this.id = id;
    this.video_url = video_url;
    this.thumb_url = thumb_url;
    this.mime_type = mime_type;
    this.title = title;
}

module.exports = InlineQueryResultVideo;