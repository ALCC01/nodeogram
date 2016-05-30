'use strict';
const extend = require('util')._extend;

function InlineQueryResultAudio(id, audio_url, title, options) {
    extend(this, options);
    this.type = 'audio';
    this.id = id;
    this.audio_url = audio_url;
    this.title = title;
}

module.exports = InlineQueryResultAudio;