'use strict';
const PhotoSize = require('./PhotoSize.js'),
    extend = require('util')._extend;

function UserProfilePhotos(object, bot) {
    if (object == undefined) return;
    extend(this, object);

    this.bot = bot;

    if (this.photos) {
        var images = [];
        this.photos.forEach((photo) => {
            images.push([]);
            photo.forEach((image) => {
                images[images.length - 1].push(new PhotoSize(image, this.bot))
            })
        })
    }
}

module.exports = UserProfilePhotos;