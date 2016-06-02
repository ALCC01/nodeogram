CallbackQuery
=============

This object represents a Telegram callback query.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#callbackquery>`_.

==========================
CallbackQuery(object, bot)
==========================

.. warning::

    This constructor should be for internal use only.

Creates a new CallbackQuery object.

================================
answerCallbackQuery(text, alert)
================================

* ``text`` <String>
* ``alert`` <Boolean> Whether the user should be shown an alert

Answers the query and returns a promise that resolves to the response (according to Telegram, true on success).