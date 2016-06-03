InlineQuery
===========

This object represents a Telegram inline query.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#inlinequery>`_.

.. js:class:: InlineQuery(object, bot)

.. warning::

    This constructor should be for internal use only.

Creates a new InlineQuery object.

.. js:function:: answer(results, options)

    :param array results: Array of InlineQueryResult's
    :param object options: *Optional*
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Answers the inline query with the specified results.