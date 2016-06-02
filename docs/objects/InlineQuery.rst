InlineQuery
===========

This object represents a Telegram inline query.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#inlinequery>`_.

========================
InlineQuery(object, bot)
========================

.. warning::

    This constructor should be for internal use only.

Creates a new InlineQuery object.

========================
answer(results, options)
========================

* ``results`` <Array> Array of InlineQueryResult
* ``options`` <Object> *Optional*

Answers the inline query with the specified results and returns a promise that resolves to the response (according to
Telegram, true on success).