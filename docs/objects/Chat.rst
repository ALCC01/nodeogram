Chat
====

This object represents a Telegram chat.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#chat>`_

=================
Chat(object, bot)
=================

.. warning::

    This constructor should be for internal use only.

Creates a new Chat object.

=======
leave()
=======

Leaves the chat and returns a promise that resolves to the response (according to Telegram, true on success).

==========================
sendMessage(text, options)
==========================

* ``text`` <String>
* ``options`` <Object> *Optional*

Sends a message to the chat and returns a promise that resolves to a :doc:`Message` object representing what has been sent.

==========================================
sendLocation(longitude, latitude, options)
==========================================

* ``longitude`` <Number>
* ``latitude`` <Number>
* ``options`` <Object> *Optional*

Sends a location object to the chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

=======================================================
sendVenue(longitude, latitude, title, address, options)
=======================================================

* ``longitude`` <Number>
* ``latitude`` <Number>
* ``title`` <String>
* ``address`` <String>
* ``options`` <Object> *Optional*

Sends a venue object to the chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

==============================================
sendContact(phone_number, first_name, options)
==============================================

* ``phone_number`` <String>
* ``first_name`` <String>
* ``options`` <Object> *Optional*

Sends a contact object to the chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

=================================================
forwardMessage(from_chat_id, message_id, options)
=================================================

* ``from_chat_id`` <String>
* ``message_id`` <String>
* ``options`` <Object> *Optional*

Forwards a message to the chat and returns a promise that resolves to a :doc:`Message` object representing what has
been sent.

=============================
sendFile(type, path, options)
=============================

* ``type`` <String> Must be one of the following: ``photo``, ``audio``, ``sticker``, ``document``, ``video``, ``voice``
* ``path`` <String> File's path for local files or file's id for uploaded files
* ``options`` <Object> *Optional*

Sends the specified file to the chat and returns a promise that resolves to a :doc:`Message` object representing
what has been sent.

===================
getAdministrators()
===================

* ``chat_id`` <String>|<Chat>

Returns a promise that resolves to an array of :doc:`ChatMember` objects.

==================
getMember(user_id)
==================

* ``user_id`` <String>|<User>

Returns a promise that resolves to a :doc:`ChatMember` object.

===================
kickMember(user_id)
===================

* ``user_id`` <String>|<User>

Kicks the specified user from the chat and returns a promise that resolves to the response (according to
Telegram, true on success).

====================
unbanMember(user_id)
====================

* ``user_id`` <String>|<User>

Unbans the specified user from the chat and returns a promise that resolves to the response (according to
Telegram, true on success).

=================
getMembersCount()
=================

Returns a promise that resolves to the response.

==================
sendAction(action)
==================

* ``action`` <String> Must be one of the following: ``typing``, ``upload_photo``, ``record_video``, ``upload_video``, ``record_audio``, ``upload_audio``, ``upload_document``, ``find_location``

Returns a promise that resolves to the response (true on success).

====
name
====

<String> *Optional*. The full name of the chat (first name + last name) if available