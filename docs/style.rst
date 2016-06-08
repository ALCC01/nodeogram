Design & Best Practices
=======================

==============
Library design
==============

********
Promises
********

The whole Nodeogram library is promise-based. This means that it takes advantage of the relatively new
`ES6 native implementation <https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise>`_ of
promises made available in NodeJS starting from release ~0.12.14. Most of the functions provided by the library will
return promises in order to enable you to escape the `callback hell <http://callbackhell.com/>`_.

***************
Handling errors
***************

Nodeogram does not introduce intrusive error handling and as a result you should pay attention and always profile a
``catch`` function.

Nodeogram's functions can fail at any time - querying the API, attempting to send a message to a chat the
bot was kicked out, etc - and not handling errors properly might result in unexpected behaviours or worse - getting
your bot or IP address tempbanned from Telegram's server could really ruin your day.

==============
Best practices
==============

***************************
Don't feed initialized bots
***************************

Nodeogram's :doc:`objects/Bot` object is intended to be immutable once it's initialized. Making changes to its attributes after
calling the ``init()`` function may produce unexpected behaviours in other objects that rely on them (most notably,
pretty much all of the library objects).