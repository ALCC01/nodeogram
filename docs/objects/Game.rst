Game
====

This object represents a Telegram game.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#game>`_.

.. js:class:: Game(object, bot)

.. warning::

    This constructor should be for internal use only.

Creates a new Game object.

.. js:attribute:: Game.commands

    Array of objects, each one representing a command in the game description.

.. code-block:: javascript

    // Recipient is undefined if it's a direct command
    {command: '/echo', recipient: 'yourbot', args: ['Many', 'things']}

.. js:attribute:: Game.mentions

    Array of strings, each one representing a mention (e.g. @nickname) in the game description.

.. js:attribute:: Game.hashtags

    Array of strings, each one representing an hashtag (e.g. #things) in the game description.

.. js:attribute:: Game.links

    Array of objects, each one representing a link (both URL and parsed text links) in the game description.

.. code-block:: javascript

    // URL
    {type: 'url', url: 'http://google.com', text: 'http://google.it'}

    // Text link
    {type: 'link', url: 'http://google.com', text: 'Google'}

.. js:attribute:: Game.text_mentions

    Array of objects, each one representing a text mention (i.e. mentions of users without a nickname) in the game description.

.. code-block:: javascript

    {text: 'User', user: <User>}