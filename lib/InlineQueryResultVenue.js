'use strict';
const extend = require('util')._extend;

function InlineQueryResultVenue(id, latitude, longitude, title, address, options) {
    extend(this, options);
    this.type = 'venue';
    this.id = id;
    this.title = title;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
}

module.exports = InlineQueryResultVenue;