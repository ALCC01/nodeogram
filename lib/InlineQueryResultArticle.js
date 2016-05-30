'use strict';
const extend = require('util')._extend;

function InlineQueryResultArticle(id, title, input_message_content, options) {
    extend(this, options);
    this.type = 'article';
    this.id = id;
    this.title = title;
    this.input_message_content = input_message_content;
}

module.exports = InlineQueryResultArticle;
