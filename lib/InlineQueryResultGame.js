'use strict';
const extend = require('util')._extend;

function InlineQueryResultGame(id, game_short_name, options) {
    extend(this, options);
    this.type = 'article';
    this.id = id;
    this.game_short_name = game_short_name;
}

module.exports = InlineQueryResultGame;
