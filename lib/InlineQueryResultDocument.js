'use strict';
const extend = require('util')._extend;

function InlineQueryResultDocument(id, document_url, mime_type, title, options) {
    extend(this, options);
    this.type = 'document';
    this.id = id;
    this.document_url = document_url;
    this.mime_type = mime_type;
    this.title = title;
}

module.exports = InlineQueryResultDocument;