User
====

This object represents a Telegram user.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#user>`_

.. js:class:: User(object, bot)

.. warning::

    This constructor should be for internal use only.

Creates a new User object.

.. js:function:: sendMessage(text[, options])

    :param string text:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a message to the user.

.. js:function:: sendLocation(longitude, latitude[, options])

    :param number longitude:
    :param number latitude:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a location object to the user.

.. js:function:: sendVenue(longitude, latitude, title, address[, options])

    :param number longitude:
    :param number latitude:
    :param string title:
    :param string address:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a venue object to the user.

.. js:function:: sendContact(phone_number, first_name[, options])

    :param string phone_number:
    :param string first_name:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends a contact object to the user.

.. js:function:: forwardMessage(from_chat_id, message_id[, options])

    :param string from_chat_id:
    :param string message_id:
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.


    Forwards a message to the user.

.. js:function:: sendFile(type, path[, options])

    :param string type: <String> Must be one of the following: ``photo``, ``audio``, ``sticker``, ``document``, ``video``, ``voice``
    :param string path: File's path for local files or file's id for uploaded files
    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`Message` object representing what has been sent.

    Sends the specified file to the user.


.. js:function:: sendAction(action)

    :param string action: <String> Must be one of the following: ``typing``, ``upload_photo``, ``record_video``, ``upload_video``, ``record_audio``, ``upload_audio``, ``upload_document``, ``find_location``
    :returns: A promise that resolves to the response (true on success).

.. js:function:: getProfilePhotos(options)

    :param object options: *Optional*
    :returns: A promise that resolves to a :doc:`UserProfilePhotos` object.

.. js:attribute:: User.name

    The full name of the chat (first name + last name).