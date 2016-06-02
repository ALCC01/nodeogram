Bot
===

This object represents a Telegram bot.

.. warning::
    The Bot object and its attributes should remain unchanged after it has been initialized.

==========
Bot(token)
==========

* ``token`` <String> A valid token for the Telegram Bot API

Creates a new Bot object and fetches basic information about it (aysncronous call to Telegram's ``getMe`` method).

.. _init:

======
init()
======

Starts fetching updates for the bot.

============
getUpdates()
============

Retrieves updates for the bot from the Telegram API and processes them. This function is called by :ref:`init` and
shouldn't be called manually. The first call made by the bot will be with a -1 offset that will erase any backlog updates.
Updates older than 2 seconds are also ignored. Updates are retrieved 100 at a time, with a 30 seconds timeout.

=======================================
command(command, description, callback)
=======================================

* ``command`` <String> The command, without the opening /
* ``description`` <String> The command's description, will be used for the /help message
* ``callback`` <Function> This function will be called whenever the command is triggered with an array of arguments ``args`` along with the :doc:`Message` ``message`` responsible for triggering the command

Registers a command handler for the specified ``command``, with the provided ``description`` and ``callback``, also
adding the command to the /help message.

================
getChat(chat_id)
================

* ``chat_id`` <String>

Returns a promise that resolves to the :doc:`Chat` object of the requested chat.

==================
leaveChat(chat_id)
==================

* ``chat_id`` <String>|<Chat>

Leaves the chat and returns a promise that resolves to the response (according to Telegram, true on success).

===================================
sendMessage(chat_id, text, options)
===================================

* ``chat_id`` <String>|<Chat>|<User>
* ``text`` <String>
* ``options`` <Object> *Optional*

Sends a message to the specified chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

===================================================
sendLocation(chat_id, longitude, latitude, options)
===================================================

* ``chat_id`` <String>|<Chat>|<User>
* ``longitude`` <Number>
* ``latitude`` <Number>
* ``options`` <Object> *Optional*

Sends a location object to the specified chat and returns a promise that resolves to a :doc:`Message` object representing what
has been sent.

================================================================
sendVenue(chat_id, longitude, latitude, title, address, options)
================================================================

* ``chat_id`` <String>|<Chat>|<User>
* ``longitude`` <Number>
* ``latitude`` <Number>
* ``title`` <String>
* ``address`` <String>
* ``options`` <Object> *Optional*

Sends a venue object to the specified chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

=======================================================
sendContact(chat_id, phone_number, first_name, options)
=======================================================

* ``chat_id`` <String>|<Chat>|<User>
* ``phone_number`` <String>
* ``first_name`` <String>
* ``options`` <Object> *Optional*

Sends a contact object to the specified chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

==========================================================
forwardMessage(chat_id, from_chat_id, message_id, options)
==========================================================

* ``chat_id`` <String>|<Chat>|<User>
* ``from_chat_id`` <String>
* ``message_id`` <String>
* ``options`` <Object> *Optional*

Forwards a message to the specified chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

====================================
answerCallbackQuery(id, text, alert)
====================================

* ``id`` <String>
* ``text`` <String>
* ``alert`` <Boolean> Whether the user should be shown an alert

Answers a callback query and returns a promise that resolves to the response (according to Telegram, true on success).

======================================
getUserProfilePhotos(user_id, options)
======================================

* ``user_id`` <String>|<User>
* ``options`` <Object> *Optional*

Returns a promise that resolves to a :doc:`UserProfilePhotos` object.

================
getFile(file_id)
================

* ``file_id`` <String>

Returns a promise that resolves to a :doc:`File` object.

======================================
sendFile(chat_id, type, path, options)
======================================

* ``chat_id`` <String>|<Chat>|<User>
* ``type`` <String> Must be one of the following: ``photo``, ``audio``, ``sticker``, ``document``, ``video``, ``voice``
* ``path`` <String> File's path for local files or file's id for uploaded files
* ``options`` <Object> *Optional*

Sends the specified file to the specified chat and returns a promise that resolves to a :doc:`Message` object representing
what has been sent.

=====================
downloadFile(file_id)
=====================

* ``file_id`` <String>|<File>

Returns a promise that resolves to a NodeJS `Buffer <https://nodejs.org/api/buffer.html>`_.

====================================================
answerInlineQuery(inline_query_id, results, options)
====================================================

* ``inline_query_id`` <String>
* ``results`` <Array> Array of InlineQueryResult
* ``options`` <Object> *Optional*

Answers an inline query with the specified results and returns a promise that resolves to the response (according to
Telegram, true on success).

======================================================
editMessageText = (id, text, inline, options, chat_id)
======================================================

* ``id`` <String>
* ``text`` <String>
* ``inline`` <Boolean> Is the message an inline one?
* ``options`` <Object> *Optional*
* ``chat_id`` <String>|<Chat>|<User>

Updates the the specified message in the specified chat and returns a promise that resolves to a :doc:`Message` object
representing the updated message. True is returned by the promise if the message is an inline one.

============================================================
editMessageCaption = (id, caption, inline, options, chat_id)
============================================================

* ``id`` <String>
* ``caption`` <String>
* ``inline`` <Boolean> Is the message an inline one?
* ``options`` <Object> *Optional*
* ``chat_id`` <String>|<Chat>|<User>

Updates the the specified message caption in the specified chat and returns a promise that resolves to a :doc:`Message`
object representing the updated message. True is returned by the promise if the message is an inline one.

===============================================================
editMessageReplyMarkup = (id, markup, inline, options, chat_id)
===============================================================

* ``id`` <String>
* ``markup`` <Keyboard>
* ``inline`` <Boolean> Is the message an inline one?
* ``options`` <Object> *Optional*
* ``chat_id`` <String>|<Chat>|<User>

Updates the the specified message markup in the specified chat and returns a promise that resolves to a :doc:`Message`
object representing the updated message. True is returned by the promise if the message is an inline one.

===============================
getChatAdministrators (chat_id)
===============================

* ``chat_id`` <String>|<Chat>

Returns a promise that resolves to an array of :doc:`ChatMember` objects.

===============================
getChatMember(chat_id, user_id)
===============================

* ``chat_id`` <String>|<Chat>|<User>
* ``user_id`` <String>|<User>

Returns a promise that resolves to a :doc:`ChatMember` object.

================================
kickChatMember(chat_id, user_id)
================================

* ``chat_id`` <String>|<Chat>
* ``user_id`` <String>|<User>

Kicks the specified user from the specified chat and returns a promise that resolves to the response (according to
Telegram, true on success).

=================================
unbanChatMember(chat_id, user_id)
=================================

* ``chat_id`` <String>|<Chat>
* ``user_id`` <String>|<User>

Unbans the specified user from the specified chat and returns a promise that resolves to the response (according to
Telegram, true on success).

============================
getChatMembersCount(chat_id)
============================

* ``chat_id`` <String>|<Chat>

Returns a promise that resolves to the response.

===============================
sendChatAction(chat_id, action)
===============================

* ``chat_id`` <String>|<Chat>|<User>
* ``action`` <String> Must be one of the following: ``typing``, ``upload_photo``, ``record_video``, ``upload_video``, ``record_audio``, ``upload_audio``, ``upload_document``, ``find_location``

Returns a promise that resolves to the response (true on success).


