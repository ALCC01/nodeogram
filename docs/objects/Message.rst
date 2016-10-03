Message
=======

This object represents a Telegram message.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#message>`_.

.. js:class:: Message(object, bot)

.. warning::

    This constructor should be for internal use only.

Creates a new Message object.

.. js:function:: reply(text[, options])

    :param string text:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Replies to the message.

.. js:function:: forward(chat_id[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param object options: *Optional*

    Forwards the message to the specified chat.

.. js:function:: editText(text, inline[, options])

    :param string text:
    :param boolean inline: Is the message an inline one?
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one.

    Updates the the specified message.

.. js:function:: editCaption(caption, inline[, options])

    :param string caption:
    :param boolean inline: Is the message an inline one?
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one.

    Updates the specified message caption.

.. js:function:: editReplyMarkup(markup, inline[, options])

    :param keyboard markup:
    :param boolean inline: Is the message an inline one?
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one.

    Updates the specified message markup.

.. js:function:: setGameScore(user_id, score, inline[, options])

    :param string user_id: Can also be a :doc:`User` object
    :param number score:
    :param boolean inline: Is the message an inline one?
    :param object options:
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one or if the request did not instruct Telegram to edit the original message.

    Sets a user's score for a game.

.. js:function:: getGameHighScores(user_id, inline)

    :param string user_id: Can also be a :doc:`User` object
    :param boolean inline: Is the message an inline one?
    :returns: A promise that resolves to an array of :doc:`GameHighScore` objects.

    Returns information about the user's rank and score for a game.

.. js:attribute:: Message.commands

    Array of objects, each one representing a command in the message.

.. code-block:: javascript

    // Recipient is undefined if it's a direct command
    {command: '/echo', recipient: 'yourbot', args: ['Many', 'things']}

.. js:attribute:: Message.mentions

    Array of strings, each one representing a mention (e.g. @nickname) in the message.

.. js:attribute:: Message.hashtags

    Array of strings, each one representing an hashtag (e.g. #things) in the message.

.. js:attribute:: Message.links

    Array of objects, each one representing a link (both URL and parsed text links) in the message.

.. code-block:: javascript

    // URL
    {type: 'url', url: 'http://google.com', text: 'http://google.it'}

    // Text link
    {type: 'link', url: 'http://google.com', text: 'Google'}

.. js:attribute:: Message.text_mentions

    Array of objects, each one representing a text mention (i.e. mentions of users without a nickname) in themessage.

.. code-block:: javascript

    {text: 'User', user: <User>}

.. js:attribute:: Message.photo

    Array of :doc:`PhotoSize` objects.

.. js:attribute:: Message.new_chat_photo

    Array of :doc:`PhotoSize` objects.