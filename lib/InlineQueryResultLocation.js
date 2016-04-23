'use strict';
const extend = require('util')._extend;

function InlineQueryResultLocation(id, latitude, longitude, title, options) {
    this.type = 'location';
    this.id = id;
    this.title = title;
    this.latitude = latitude;
    this.longitude = longitude;
    extend(this, options);
}

module.exports = InlineQueryResultLocation;