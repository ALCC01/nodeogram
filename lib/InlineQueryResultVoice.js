'use strict';
const extend = require('util')._extend;

function InlineQueryResultVoice(id, voice_url, title, options) {
    extend(this, options);
    this.type = 'voice';
    this.id = id;
    this.voice_url = voice_url;
    this.title = title;
}

module.exports = InlineQueryResultVoice;