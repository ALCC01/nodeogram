Overview
========

This guide provides an overview of the main Nodeogram features.

.. warning::

    Please note that Nodeogram is still in early development and its features could change in any given moment.

=========================
Getting access to the API
=========================

First things first, you'll need to get an API token for your bot. API tokens are provided by Telegram via
`@BotFather <http://telegram.me/botfather>`_. It's a pretty straight-forward process, start the bot, use the
``/newbot`` command and then provide the informations you'll be asked for.

.. note::

    Please note that the API token **should remain private** as it provides full access to your bot, so make sure to omit it
    when publishing code or configurations

Once you're done, you should have a token that looks like this:

.. code-block:: none

    123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi

If you have obtained your API token, we can then move on to the next part.

================
Creating the bot
================

It's time to start writing code! Create a new script/project/npm package/whatever and instantiate your bot:

.. code-block:: javascript
    :linenos:

    const nodeogram = require('nodeogram'),
    bot = new nodeogram.Bot('your-token-goes-here');

    bot.init();

So, what we've done here is requiring Nodeogram and creating a Bot object with our token (lines 1-2) and then calling the
``init()`` function, that makes the bot start fetching updates for the bot. We are now going to start adding some
functionalities to the bot in order to make it actually useful.

.. note::

    Nodeogram handles backlog updates for you, so you don't have to worry about them. When the bot starts fetching
    updates it sends a request with a -1 offset, erasing all the available updates.

=================
Handling messages
=================

The bot only fetches the updates so far, but it completely ignores them. Nodeogram provides an event-based interface for
interacting with incoming updates of any kind, so we are going to make the bot forward every message it receives to the
sender.

.. code-block:: javascript
    :linenos:

    bot.on('message', message => message.forward(message.from));

This registers a new event listener for the ``message`` event, which is called every time the bot receives a message,
and forwards the message (a Message object ) to the sender (a User object). In order to send it back to the original
chat instead of the sender, we could just provide the ``message.chat`` Chat object (or the chat id itself for a specific
chat) as an argument.

.. warning::

    A ``message`` event will be emitted even if a command or a service message event is triggered! Make sure
    to not produce unintended behaviors

********
Commands
********

You are now probably wondering if you have to parse every message in order to implement commands in your bot. The answer
is no, you don't, because Nodeogram provides a command framework that handles the parsing for you, both for direct
commands and those with mentions. Let's suppose you want to create the ``/echo`` command that sends a message containing
the arguments provided.

.. code-block:: javascript
    :linenos:

    bot.command('echo', 'Echoes your voice', false, (args, message) => {
        if (args[0] != '') message.reply(args.join(' '), {});
    });

This registers a new handler for the command ``/echo`` with the description *Echoes your voice* and acts as defined in
the callback. Oh, did I mention that it also adds it automagically to the ``/help`` command? If you don't want your users
to know about the command, just make it a secret between you and the bot setting the third argument to ``true``.

****************
Service messages
****************

Nodeogram also provides an higher level interface for service messages via the following events. Every event comes with
the corresponding object as defined by the `Telegram documentation <https://core.telegram.org/bots/api#message>`_.

* ``new_chat_title`` A chat title was changed to this value
* ``new_chat_photo`` A chat photo was change to this value
* ``delete_chat_photo`` Service message: the chat photo was deleted
* ``group_chat_created`` Service message: the group has been created
* ``supergroup_chat_created`` Service message: the supergroup has been created.
* ``channel_chat_created`` Service message: the channel has been created.
* ``migrate_to_chat_id`` The group has been migrated to a supergroup with the specified identifier.
* ``migrate_from_chat_id`` The supergroup has been migrated from a group with the specified identifier.
* ``pinned_message`` Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it is itself a reply.

********
Entities
********

`MessageEntities <https://core.telegram.org/bots/api#messageentity>`_ are handled by Nodeogram, making it easier for you
to work with them. Other than having the standard ``entities`` field, Message objects also have ``commands``,
``mentions``, ``text_mentions``, ``hashtags`` and ``links`` properties. Say, for example, that you want your bot to
reply when his username is the first mention in a message:

.. code-block:: javascript
    :linenos:

    bot.on('message', message => {
        if (message.mentions[0] == '@' + bot.me.username) message.reply('Hey m8!')
    });

==============
Inline queries
==============

`Inline queries <https://core.telegram.org/bots/api#inlinequery>`_ are one of the most characteristic features of
Telegram bots and are fully supported by Nodeogram. You can interact with them via the ``inline_query`` event.

.. code-block:: javascript
    :linenos:

    bot.on('inline_query', query => console.log(`New query: ${query.query}`));

To answer an inline query you can just use the ``.answer()`` method and some of the ``InlineQueryResult`` objects.

.. code-block:: javascript
    :linenos:

    const InlineQueryResultArticle = nodeogram.InlineQueryResultArticle;

    bot.on('inline_query', (query) => {
        query.answer([new InlineQueryResultArticle(
            'id',
            'Here\'s an article',
            {
                message_text: 'This is the message that will be sent'
            },
            {
                description: 'This is the description'
            }
        )])
    });

=========
Keyboards
=========

Telegram features two different types of keyboards: `ReplyKeyboards <https://core.telegram.org/bots/api#replykeyboardmarkup>`_,
that appear in place of the normal keyboard, and `InlineKeyboards <https://core.telegram.org/bots/api#inlinekeyboardmarkup>`_,
that are directly attached to a message. Nodeogram abolishes this difference in favor of a more consistent definition,
implementing both objects via the Keyboard object.

.. code-block:: javascript

    const Keyboard = nodeogram.Keyboard;

***************
Reply keyboards
***************

.. code-block:: javascript
    :linenos:

    var keyboard = new Keyboard([], {one_time_keyboard: true});
    keyboard.addButton(0, 0, "Girl");
    keyboard.addButton(0, 1, "Boy");

    message.reply("Are you a boy? Or ar you a girl?", {reply_markup: keyboard})

****************
Hiding keyboards
****************

Telegram's `ReplyKeyboardHide <https://core.telegram.org/bots/api#replykeyboardhide>`_ object is also implemented by the
Keyboard object.

.. code-block:: javascript
    :linenos:

    var keyboard = new Keyboard();
    keyboard.hide();

    message.reply("Your very own Pokémon legend is about to unfold! A world of dreams and adventures with Pokémon awaits! Let's go!", {reply_markup: keyboard})

****************
Inline keyboards
****************

A Keyboard object can be turned into an inline keyboard using the ``toInline()`` function.

.. code-block:: javascript
    :linenos:

    var keyboard = new Keyboard();
    keyboard.addButton(0, 0, {text: "Bulbasaur", callback_data: "Bulbasaur"});
    keyboard.addButton(0, 1, {text: "Charmander", callback_data: "Charmander"});
    keyboard.addButton(0, 2, {text: "Squirtle", callback_data: "Squirtle"});
    keyboard.toInline();

    message.reply("Here, take one of these rare Pokèmon!", {reply_markup: keyboard})

================
Callback queries
================

Interaction with callback queries is provided via the ``callback_query`` event.

.. code-block:: javascript
    :linenos:

    bot.on('callback_query', (query) => {
        query.answer('This Pokémon is really energetic!', true);
        if (query.message) query.message.editText(`You have chosen ${query.data}!`)
    });

================
Sending messages
================

Nodeogram provides many ways to send messages. You can use Bot object's ``sendMessage()`` function, but User, Chat and
Message objects have some similar methods too. The reason for this is that sending messages through the Bot object would
require you to provide chat ids and other arguments, that are instead automatically taken care of by more specialized
methods.

.. code-block:: javascript
    :linenos:

    bot.on('message', (message) => {
        // Send a message through the User object
        message.from.sendMessage(`Hi, *${message.from.username}*`, {parse_mode: 'Markdown'})
        // Send a message through the Bot object
        bot.sendMessage(message.from.id, `Hi, *${message.from.username}*`, {parse_mode: 'Markdown'})
    });

This becomes particularly important when handling more complex tasks.

.. code-block:: javascript
    :linenos:

    bot.on('message', (message) => {
        // Reply to a message through the Message object
        message.reply(`Hi, *${message.from.username}*`, {parse_mode: 'Markdown'});
        // Reply to a message through the Bot object
        bot.sendMessage(message.chat.id, `Hi, *${message.from.username}*`, {reply_to_message_id: message.message_id, parse_mode: 'Markdown'})
    });

*************
Sending files
*************

Files upload is handled by the Bot object's ``sendFile()`` function and, again, by more specialized methods in the Chat
and User objects. It seamlessly supports both paths on your computer and file ids provided by Telegram, making it easier
for you to make use of already uploaded files.


.. code-block:: javascript
    :linenos:

    bot.on('message', (message) => {
        // Send a photo via file_id
        message.chat.sendFile('photo', 'AgADBAADt6cxG0ZYRAcdRs7TZcW-5lT2ijAABGrSMByHPh5hghgphgp', {})
        // Send a photo via path
        message.chat.sendFile('photo', __dirname + '/photo.png', {})
    });

*********************
Sending other objects
*********************

Contacts, venues and locations can be sent through the corresponding functions.

.. code-block:: javascript
    :linenos:

    bot.on('message', (message) => {
        // Send location
        message.chat.sendLocation(12.4828, 41.8931, {})
        // Send venue
        message.chat.sendVenue(12.4828, 41.8931, 'Roma', 'Piazza Campidoglio, 00186 Roma, Italia', {})
        // Send contact
        message.chat.sendContact('+424314159', 'Bot', {last_name: 'Support'})
    });

================
Editing messages
================

Telegram's ``editMessageText()``, ``editMessageCaption()`` and ``editMessageReplyMarkup()`` are implemented both in the Bot and the Message
objects. They all require to specify if the message being edited is an inline one, in order to provide the
correct id.

.. code-block:: javascript

    // Normal message
    if (query.message) query.message.editText(`You have chosen ${query.data}!`)

    // Inline message
    if (query.message) query.message.editText(`You have chosen ${query.data}!`, true)

===================
Profiles management
===================

Nodeogram provides a simple way for you and your bot to keep track of the users and chats that are using your services by
its profile management interface. If a bot is instantiated with ``profiles_path`` in its options, it will start saving
basic information about any user and chat he will become aware of.

The ``broadcast()`` function will enable you to easily access that data and interact with your users.