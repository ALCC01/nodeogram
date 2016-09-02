Inline Query Results
====================

Every non-cached `InlineQueryResult <https://core.telegram.org/bots/api#inlinequeryresult>`_ is currently implemented in
the Nodeogram library. This page documents their constructors, as there are no special functions or values implemented and
the objects' properties are directly inherited from the upstream Telegram API.

.. note::

    These objects inherit some properties from the corresponding `Telegram objects <https://core.telegram.org/bots/api#inlinequeryresult>`_.

.. js:class:: InlineQueryResultArticle(id, title, input_message_content[, options])

    :param string id:
    :param string title:
    :param object input_message_content: One of the `Telegram supported ones <https://core.telegram.org/bots/api#inputmessagecontent>`_.
    :param object options: *Optional*.

.. js:class:: InlineQueryResultAudio(id, audio_url, title[, options])

    :param string id:
    :param string audio_url:
    :param string title:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultContact(id, phone_number, first_name[, options])

    :param string id:
    :param string phone_number:
    :param string first_name:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultDocument(id, document_url, mime_type, title[, options])

    :param string id:
    :param string document_url:
    :param string mime_type:
    :param string title:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultGif(id, gif_url, thumb_url[, options])

    :param string id:
    :param string gif_url:
    :param string thumb_url:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultLocation(id, latitude, longitude, title[, options])

    :param string id:
    :param number latitude:
    :param number lognitude:
    :param string title:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultMpeg4Gif(id, mpeg4_url, thumb_url[, options])

    :param string id:
    :param string mpeg4_url:
    :param string thumb_url:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultPhoto(id, photo_url, thumb_url[, options])

    :param string id:
    :param string photo_url:
    :param string thumb_url:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultVenue(id, latitude, longitude, title, address[, options])

    :param string id:
    :param number latitude:
    :param number lognitude:
    :param string title:
    :param string address:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultVideo(id, video_url, thumb_url, mime_type, title[, options])

    :param string id:
    :param string video_url:
    :param string thumb_url:
    :param string mime_type:
    :param string title:
    :param object options: *Optional*.

.. js:class:: InlineQueryResultVoice(id, voice_url, title[, options])

    :param string id:
    :param string voice_url:
    :param string title:
    :param object options: *Optional*.