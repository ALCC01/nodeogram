Bot
===

This object represents a Telegram bot.

.. warning::
    The Bot object and its attributes should remain unchanged after it has been initialized.


.. js:class:: Bot(token[, options])

    :param string token: A valid token for the Telegram Bot API
    :param object options: *Optional*
    :returns: A Bot object

    Creates a new Bot object and fetches basic information about it (aysncronous call to Telegram's ``getMe`` method).

    Valid ``options`` are:

    .. code-block:: javascript

    {
        // File to which profiles should be saved
        profiles_path: __dirname +'/profiles.json',
        // Whether or not users should be saved
        saveUsers: true;
        // Whether or not chats should be saved
        saveChats: true
    }

.. _init:
.. js:function:: init()

    Starts fetching updates for the bot.

.. js:function:: getUpdates()

    Retrieves updates for the bot from the Telegram API and processes them. This function is called by :ref:`init` and
    shouldn't be called manually. The first call made by the bot will be with a -1 offset that will erase any backlog updates.
    Updates older than 2 seconds are also ignored. Updates are retrieved 100 at a time, with a 30 seconds timeout.

.. js:function:: command(command, description, callback)

    :param string command: The command, without the opening /
    :param string description: <String> The command's description, will be used for the /help message
    :param function callback: <Function> This function will be called whenever the command is triggered with an array of arguments ``args`` along with the :doc:`Message` ``message`` responsible for triggering the command

    Registers a command handler for the specified ``command``, with the provided ``description`` and ``callback``, also
    adding the command to the /help message.

.. js:function:: getChat(chat_id)

    :param string chat_id:
    :returns: A promise that resolves to the :doc:`Chat` object of the requested chat.

.. js:function:: leaveChat(chat_id)

    :param string chat_id: Can also be a :doc:`Chat` object
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Leaves the chat.

.. js:function:: sendMessage(chat_id, text[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param string text:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a message to the specified chat.

.. js:function:: sendLocation(chat_id, longitude, latitude[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param number longitude:
    :param number latitude:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.


    Sends a location object to the specified chat.

.. js:function:: sendVenue(chat_id, longitude, latitude, title, address[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param number longitude:
    :param number latitude:
    :param string title:
    :param string address:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a venue object to the specified chat.

.. js:function:: sendContact(chat_id, phone_number, first_name[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param string phone_number:
    :param string first_name:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.


    Sends a contact object to the specified chat.

.. js:function:: forwardMessage(chat_id, from_chat_id, message_id[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param string from_chat_id:
    :param string message_id:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Forwards a message to the specified chat,

.. js:function:: answerCallbackQuery(id, text, alert)

    :param string id:
    :param string text:
    :param boolean alert: Whether the user should be shown an alert
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Answers a callback query.

.. js:function:: getUserProfilePhotos(user_id[, options])

    :param string user_id: Can also be a :doc:`User` object
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`UserProfilePhotos` object.

.. js:function:: getFile(file_id)

    :param string file_id:
    :returns: A promise that resolves to a :doc:`File` object.

.. js:function:: sendFile(chat_id, type, path[, options])

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param string type: Must be one of the following: ``photo``, ``audio``, ``sticker``, ``document``, ``video``, ``voice``
    :param string path: File's path for local files or file's id for uploaded files
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends the specified file to the specified chat,

.. js:function:: downloadFile(file_id)

    :param string file_id: Can also be a :doc:`File` object
    :returns: A promise that resolves to a NodeJS `Buffer <https://nodejs.org/api/buffer.html>`_.

.. js:function:: answerInlineQuery(inline_query_id, results[, options])

    :param string inline_query_id:
    :param array results: Array of InlineQueryResult
    :param object options: *Optional*
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Answers an inline query with the specified results.

.. js:function:: editMessageText(id, text, inline, options, chat_id)

    :param string id:
    :param string text:
    :param boolean inline: Is the message an inline one?
    :param object options:
    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one.

    Updates the specified message in the specified chat.

.. js:function:: editMessageCaption(id, caption, inline, options, chat_id)

    :param string id:
    :param string caption:
    :param boolean inline: Is the message an inline one?
    :param object options:
    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one.

    Updates the specified message caption in the specified chat.

.. js:function:: editMessageReplyMarkup(id, markup, inline, options, chat_id)

    :param string id:
    :param keyboard markup:
    :param boolean inline: Is the message an inline one?
    :param object options:
    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :returns: A promise that resolves to a :doc:`Message` object representing the updated message. True is returned by the promise if the message is an inline one.

    Updates the specified message markup in the specified chat.

.. js:function:: getChatAdministrators (chat_id)

    :param string chat_id: Can also be a :doc:`Chat` object

    Returns a promise that resolves to an array of :doc:`ChatMember` objects.

.. js:function:: getChatMember(chat_id, user_id)

    :param string chat_id: Can also be a :doc:`Chat` object
    :param string user_id: Can also be a :doc:`User` object
    :returns: A promise that resolves to a :doc:`ChatMember` object.

.. js:function:: kickChatMember(chat_id, user_id)

    :param string chat_id: Can also be a :doc:`Chat` object
    :param string user_id: Can also be a :doc:`User` object
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Kicks the specified user from the specified chat.

.. js:function:: unbanChatMember(chat_id, user_id)

    :param string chat_id: Can also be a :doc:`Chat` object
    :param string user_id: Can also be a :doc:`User` object
    :returns: A promise that resolves to the response (according to Telegram, true on success).

    Unbans the specified user from the specified chat.

.. js:function:: getChatMembersCount(chat_id)

    :param string chat_id: Can also be a :doc:`Chat` object
    :returns: A promise that resolves to the response.

.. js:function:: sendChatAction(chat_id, action)

    :param string chat_id: Can also be a :doc:`Chat` or a :doc:`User` object
    :param string action: Must be one of the following: ``typing``, ``upload_photo``, ``record_video``, ``upload_video``, ``record_audio``, ``upload_audio``, ``upload_document``, ``find_location``
    :returns: A promise that resolves to the response (according to Telegram, true on success).

.. js:function:: broadcast(filter, callback)

    :param string filter: Must be one of the following: ``private``, ``group``, ``supergroup``, ``channel`` or ``all``. Can also be a function that accepts one argument (a :doc:`Chat` object without functions) and returns a boolean value
    :param function callback: A function to which is provided a single argument, a promise that resolves to a :doc:`Chat` object.

    Iterates a function through all of chats stored in the profiles storage.