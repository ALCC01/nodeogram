Keyboard
========

This object represents Telegram's reply and inline keyboard markups.

==========================
Message(keyboard, options)
==========================

* ``keyboard`` <Array> Array of arrays of buttons, each one representing a row
* ``options`` <Object> *Optional* Optional fields for both reply and inline keyboards, as defined by the Telegram API.

=============================
addButton(row, index, button)
=============================

* ``row`` <Number>
* ``index`` <Number> The place of the button on the row. **Make sure that all preceding positions are filled!**
* ``button`` <String>|<Object>

Adds a button to the keyboard. The ``button`` argument can both be a string (i.e. the text of the button, works only for
reply keyboards) or an object with the corresponding properties (`inline <https://core.telegram.org/bots/api#inlinekeyboardbutton>`_
and `reply <https://core.telegram.org/bots/api#keyboardbutton>`_ keyboards)

==========
hide(bool)
==========

* ``bool`` <Boolean> *Optional*. Whether or not the keyboard should be hidden. Defaults to true.

Setting this to true will make Telegram clients hide the current custom keyboard and display the default letter-keyboard.

==========
toInline()
==========

Makes this an inline keyboard. It can't be undone.