# Nodeogram
Nodeogram is a simple yet complete Node.JS module for Telegram bots.

## Features
* **Not a wrapper**. Nodeogram takes the Telegram API to the next level and allows you to create your bots while handling all the boring stuff for you
* **Complete**. Nodeogram features all of the most recent API updates and is designed not to block you from using right away the not yet implemented ones
* **Promises**. The entire library is promise-based
* **Event based**. Nodeogram provides an event-based handling of updates, allowing you to interact more easily with messages, commands, callback and inline queries.

Nodeogram is an open-source project available on `GitHub <https://github.com/ALCC01/nodeogram>`_ and `npm <https://www.npmjs.com/package/nodeogram>`_.

## Getting started

First, you'll need to install the module

```bash
npm i --save nodeogram
```

Once the package is installed, you can start working on your bot.

```javascript
const nodeogram = require('nodeogram'),
bot = new nodeogram.Bot('your-token-goes-here');

bot.init();
bot.on('message', message => message.reply("Hello World!"));
```

And you are done. You can see more extensive examples in the [library overview](https://dev.albertocoscia.me/nodeogram/quickstart.html)

## Documentation
Please refer to the [Nodeogram documentation](https://dev.albertocoscia.me/nodeogram/)

## License

    Nodeogram - A Node.JS Telegram bots API library
    Copyright (C) 2016 Alberto Coscia <inbox@albertocoscia.me>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.