Chat
====

This object represents a Telegram chat.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#chat>`_

.. js:class:: Chat(object, bot)

.. warning::

    This constructor should be for internal use only.

Creates a new Chat object.

.. js:function:: leave()

    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Leaves the chat.

.. js:function:: sendMessage(text[, options])

    :param string text:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a message to the chat.

.. js:function:: sendLocation(longitude, latitude[, options])

    :param number longitude:
    :param number latitude:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a location object to the chat.

.. js:function:: sendVenue(longitude, latitude, title, address[, options])

    :param number longitude:
    :param number latitude:
    :param string title:
    :param string address:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a venue object to the chat.

.. js:function:: sendContact(phone_number, first_name[, options])

    :param string phone_number:
    :param string first_name:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a contact object to the chat.

.. js:function:: sendGame (game_short_name[, options])

    :param string game_short_name: The Telegram game identifier.
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a Telegram game to the chat.

.. js:function:: forwardMessage(from_chat_id, message_id[, options])

    :param string from_chat_id:
    :param string message_id:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.


    Forwards a message to the chat.

.. js:function:: sendFile(type, path[, options])

    :param string type: <String> Must be one of the following: ``photo``, ``audio``, ``sticker``, ``document``, ``video``, ``voice``
    :param string path: File's path for local files or file's id for uploaded files
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends the specified file to the chat.

.. js:function:: getAdministrators()

    Returns a promise that resolves to an array of :doc:`ChatMember` objects.

.. js:function:: getMember(user_id)

    :param string user_id: Can also be a :doc:`User` object

    Returns a promise that resolves to a :doc:`ChatMember` object.

.. js:function:: kickMember(user_id)

    :param string user_id: Can also be a :doc:`User` object
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Kicks the specified user from the chat.

.. js:function:: unbanMember(user_id)

    :param string user_id: Can also be a :doc:`User` object
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Unbans the specified user from the chat.

.. js:function:: getMembersCount()

    :returns: A promise that resolves to the response.

.. js:function:: sendAction(action)

    :param string action: <String> Must be one of the following: ``typing``, ``upload_photo``, ``record_video``, ``upload_video``, ``record_audio``, ``upload_audio``, ``upload_document``, ``find_location``
    :returns: A promise that resolves to the response (true on success).

.. js:attribute:: Chat.name

    *Optional*. The full name of the chat (first name + last name) if available