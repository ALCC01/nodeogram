'use strict';
const extend = require('util')._extend;

function InlineQueryResultContact(id, phone_number, first_name, options) {
    extend(this, options);
    this.type = 'contact';
    this.id = id;
    this.phone_number = phone_number;
    this.first_name = first_name;
}

module.exports = InlineQueryResultContact;