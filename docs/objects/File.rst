File
====

This object represents a Telegram file.

.. note::

    This object inherits some properties from the corresponding `Telegram object <https://core.telegram.org/bots/api#file>`_.

.. js:class:: File(object, bot)


.. warning::

    This constructor should be for internal use only.

Creates a new File object.

.. js:function:: download()

    :returns: A promise that resolves to a NodeJS `Buffer <https://nodejs.org/api/buffer.html>`_.