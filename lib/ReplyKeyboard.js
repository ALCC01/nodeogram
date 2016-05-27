'use strict';
const extend = require('util')._extend;

function ReplyKeyboard(keyboard, options) {
    this.keyboard = keyboard || [];
    if (options) extend(this, options);

    this._addRow = (index) => {
        if (!this.keyboard[index]) this.keyboard[index] = [];
    };

    this.addButton = (row, index, button) => {
        if (!this.keyboard[row]) {
            this._addRow(row)
        }
        this.keyboard[row][index] = button;
    };

    this.hide = (bool) => {
        if (bool == undefined) bool = true;
        this.hide_keyboard = bool;

    };
}

module.exports = ReplyKeyboard;