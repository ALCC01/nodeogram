CallbackQuery
=============

This object represents a Telegram callback query.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#callbackquery>`_.

.. js:class:: CallbackQuery(object, bot)

.. warning::

    This constructor should be for internal use only.

Creates a new CallbackQuery object.

.. js:function:: answerCallbackQuery(text, alert)

    :param string text:
    :param boolean alert: Whether the user should be shown an alert
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Answers the query.