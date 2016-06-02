Message
=======

This object represents a Telegram message.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#message>`_.

====================
Message(object, bot)
====================

.. warning::

    This constructor should be for internal use only.

Creates a new Message object.

====================
reply(text, options)
====================

* ``text`` <String>
* ``options`` <Object> *Optional*

Replies to the message and returns a promise that resolves to a :doc:`Message` object representing what has been sent.

=========================
forward(chat_id, options)
=========================

* ``chat_id`` <String>|<Chat>|<User>
* ``options`` <Object> *Optional*

Forwards the message to the specified chat and returns a promise that resolves to a :doc:`Message` object representing
what has been sent.

==================================
editText = (text, inline, options)
==================================

* ``text`` <String>
* ``inline`` <Boolean> Is the message an inline one?
* ``options`` <Object> *Optional*

Updates the the specified message in the specified chat and returns a promise that resolves to a :doc:`Message` object
representing the updated message. True is returned by the promise if the message is an inline one.

========================================
editCaption = (caption, inline, options)
========================================

* ``caption`` <String>
* ``inline`` <Boolean> Is the message an inline one?
* ``options`` <Object> *Optional*

Updates the the specified message caption in the specified chat and returns a promise that resolves to a :doc:`Message`
object representing the updated message. True is returned by the promise if the message is an inline one.

===========================================
editReplyMarkup = (markup, inline, options)
===========================================

* ``markup`` <Keyboard>
* ``inline`` <Boolean> Is the message an inline one?
* ``options`` <Object> *Optional*

Updates the the specified message markup in the specified chat and returns a promise that resolves to a :doc:`Message`
object representing the updated message. True is returned by the promise if the message is an inline one.

========
commands
========
<Array> Array of objects, each one representing a command in the message.

.. code-block:: javascript

    // Recipient is undefined if it's a direct command
    {command: '/echo', recipient: 'yourbot', args: ['Many', 'things']}

========
mentions
========

<Array> Array of strings, each one representing a mention (e.g. @nickname) in the message.

========
hashtags
========

<Array> Array of strings, each one representing an hashtag (e.g. #things) in the message.

=====
links
=====

<Array> Array of objects, each one representing a link (both URL and parsed text links) in the message.

.. code-block:: javascript

    // URL
    {type: 'url', url: 'http://google.com', text: 'http://google.it'}

    // Text link
    {type: 'link', url: 'http://google.com', text: 'Google'}

=============
text_mentions
=============

<Array> Array of objects, each one representing a text mention (i.e. mentions of users without a nickname) in the
message.

.. code-block:: javascript

    {text: 'User', user: <User>}

=====
photo
=====

<Array> Array of :doc:`PhotoSize` objects.

==============
new_chat_photo
==============

<Array> Array of :doc:`PhotoSize` objects.