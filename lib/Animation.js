'use strict';
const extend = require('util')._extend;

function Animation(object, bot) {
    if (object == undefined) return;
    this.bot = bot;
    extend(this, object);

    if (this.photo) {
        let sizes = [];
        this.photo.forEach((size) => {
            sizes.push(new PhotoSize(size, this.bot))
        });
        this.photo = sizes;
    }
}

module.exports = Animation;