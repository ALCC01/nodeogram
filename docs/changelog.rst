Changelog
=========

===============
Nodeogram 0.0.1
===============

* The first Nodeogram pre-release.
* Extensive support for the main objects of the Telegram API.

===============
Nodeogram 0.0.2
===============

* Fixed multiple inconsistencies I found while documenting the code.
* Documented most of the library.

===============
Nodeogram 0.0.3
===============

* Made the Bot object more configurable.

    * The default /help command can be disabled.

* Introduced the new profiles management feature

    * It is possible to provide a path to which save chats and users that the bot is aware of
    * It is possible to specify which data should be saved
    * You can broadcast to saved chats and users

* Commands can now be hidden from the default /help command

===============
Nodeogram 0.0.4
===============

* Forms: ask questions to your users the easy way
* Commands are now invoked only if ``/`` is the first character of the message
* The ``message`` event is no longer fired if the message triggers a command

===============
Nodeogram 0.0.5
===============

* Added support for webhooks
* It is now possible to disable the automatic fetching of updates
* It is now possible to manually provide updates to the bot

===============
Nodeogram 0.0.6
===============

* Added support for the Telegram gaming platform

    * New objects: Animation, Game, GameHighScore, InlineQueryResultGame
    * Added parsing for the Game object
    * Implemented sendGame, setGameScore, getGameHighScores

* Changed the signature for methods ``Bot#answerCallbackQuery`` and ``CallbackQuery#answer``

    * Implemented a deprecation warning
    * The old signature will likely be available until the next release

* Implemented debug logging

    * Can be activated either by passing ``debug: true`` to the bot or using the ``NODEOGRAM_DEBUG`` environment variable