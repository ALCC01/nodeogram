'use strict';
const nodeogram = require('nodeogram'),
    WebSocketClient = require('websocket').client,
    config = require('./config.json'),
    bot = new nodeogram.Bot(config.token, {profiles_path: __dirname + '/profiles.json', enableHelp: true, useWebhooks: config.useWebhooks, webhookPort: config.webhookPort, webhookRoute: config.webhookRoute}),
    request = require('superagent-promise')(require('superagent'), Promise);

var threads = {}, // thread_id: [user_id, ...]
    clients = {}, // thread_id: websocket_client
    messages = {}, // update_id: [message_id, ...]
    cache = {}; // thread_id: settings

bot.command('start', '', true, (args, message) => {
    if (args[0] != '') {
        updateUser(message.chat, args[0])
    } else {
        message.reply(`Hello there!\n\nI'm @redditlive_bot. I can fetch Reddit live threads and forward to you incoming messages, in order to keep you always updated.\n\nPlease use /follow to start following a thread. If any error occurs or you have a suggestion, you can query my owner @ALCC01 (https://albertocoscia.me).`)
    }
});

bot.command('follow', 'Start following a thread', false, (args, message) => {
    if (args[0] != '') {
        updateUser(message.chat, args[0]);
    } else {
        fetchThreads().then((threads) => {
            var text = '❓ Please select one of the current hot threads from /r/live\n\n';
            var keyboard = new nodeogram.Keyboard();
            var i = 1;
            threads.forEach((thread) => {
                text += `${i}\u20E3 ${thread.title}\n`;
                var row = i > 8 ? 1 : 0;
                keyboard.addButton(row, row == 0 ? i - 1 : i - 9, {text: '' + (i), callback_data: JSON.stringify({id: thread.secure_media.event_id, action: 'follow'})});
                i++;
            });
            text += '\nYou can also use /follow [id] if you already have an id for a live thread';
            keyboard.toInline();
            message.reply(text, {reply_markup: keyboard});
        }).catch(() => {
            message.reply('An error occurred while executing this command!')
        });
    }
});

bot.command('unfollow', 'Stop following a thread', false, (args, message) => {
    if (args[0] === '') {
        var keyboard = new nodeogram.Keyboard();
        var text = '❓ Which of these threads do you want to stop following?\n\n';
        var i = 1;
        for (var thread in threads) {
            if (threads.hasOwnProperty(thread) && threads[thread].includes(message.chat.id) && cache[thread]) {
                text += `${i}\u20E3 ${cache[thread].title}\n`;
                var row = i > 8 ? 1 : 0;
                keyboard.addButton(row, row == 0 ? i - 1 : i - 9, {text: '' + (i), callback_data: JSON.stringify({id: thread, action: 'unfollow'})});
                i++;
            }
        }
        text += '\nYou can also use /unfollow [id] if you already have an id for a live thread';
        keyboard.toInline();
        message.reply(text, {reply_markup: keyboard});
    } else {
        unfollow(message.chat, args[0])
    }
});

bot.on('callback_query', (query) => {
    var data = JSON.parse(query.data);
    if (data.action === 'follow') {
        if (query.message) {
            updateUser(query.message.chat, data.id);
            query.answer({text: '👍 Got it!'})
        }
    }
    if (data.action === 'unfollow') {
        if (query.message) {
            unfollow(query.message.chat, data.id);
            query.answer({text: '👍 Got it!'})
        }
    }
});

bot.init();
bot.on('message', (message) => {

});

function fetchThreads() {
    return get('https://www.reddit.com/r/live/hot.json?limit=10', {}).then((res) => {
        var threads = [];
        res.body.data.children.forEach((thread) => {
            if (thread.data.secure_media && thread.data.secure_media.event_id) {
                threads.push(thread.data);
            }
        });
        return threads;
    }).catch(err => console.log(err))
}

function updateUser(user, id) {
    if (!threads[id]) {
        threads[id] = [];
    } else {
        if (threads[id].indexOf(user.id) > -1) {
            user.sendMessage('⛔️ Looks like you\'re already following this thread!')
        }
    }

    threads[id].push(user.id);
    get(`https://api.reddit.com/live/${id}/about.json`, {})
        .then(res => {
            var thread = parseThread(res),
                message = `*${thread.title}*\n_${thread.description}_\n\n${thread.online ? '📡 Online' : '🔇 Offline'} ${thread.nsfw ? '🔞 NSFW' : '✅ SFW'} ${thread.viewer_count ? '👥 ' + thread.viewer_count + ' viewers' : ''}\n📅 ${new Date(thread.created_utc * 1000).toUTCString()}\n\n🌐 https://reddit.com/live/${thread.id} 🆔 \`${thread.id}\``;
            user.sendMessage(message, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            }).catch(err => console.log(err));
            user.sendMessage('*Resources* \n' + thread.resources, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            }).catch(err => user.sendMessage(`I was unable to parse the formatting of the resources from this thread, I\'m sending you an unparsed version!\n\n${thread.resources}`, {disable_web_page_preview: true}));
            if (thread.online) {
                user.sendMessage('🔓 This thread is currently live, I\'ll start keeping you updated. Please use /unfollow if you don\'t want to receive any update from this thread');
                if (!clients[id]) {
                    createClient(id, thread);
                }
            } else {
                user.sendMessage('🔒 Since this thread is offline at the moment I won\'t send you any update! :(');
                clearId(id)
            }
        }, err => {
            user.sendMessage('⛔️ An error occurred while fetching this thread, please try again later!')
        })
}

function parseThread(res) {
    var obj = res.body.data;
    cache[obj.id] = obj;
    obj.online = obj.state === 'live';
    return obj;
}

function createClient(id, thread) {
    var client = new WebSocketClient();
    client.on('connectionFailed', err => {
        console.log(err);
    });

    client.on('connect', connection => {
        console.log(`Connection established for thread ${id}`);

        connection.on('error', err => {
            // We don't know for sure if the socket is still in a clean state, so we restart it
            console.log(err);
            console.log(`Restarting websocket for thread ${id} due to an error`);
            createClient(id, thread)
        });

        connection.on('close', (code) => {
            if (code === 1000) {
                console.log(`Websocket for thread ${id} was closed with code 1000`);
                clearId(id);
                return;
            }
            // This may be due to the address expiration
            console.log(`Fetching a new websocket URL for thread ${id}`);
            get(`https://api.reddit.com/live/${id}/about.json`, {})
                .then(res => {
                    thread = parseThread(res);
                    if (thread.online) {
                        console.log(`Restarting websocket for thread ${id} due to a connection closure`);
                        createClient(id, thread)
                    } else {
                        console.log(`Websocket for thread ${id} went offline along with its thread`);
                        clearId(id);
                    }
                })
                .catch(err => {
                    console.log(`Could not fetch a new URL for thread ${id}`);
                    console.log(err)
                })
        });

        connection.on('message', message => {
            if (message.type === 'utf8') {
                message = JSON.parse(message.utf8Data);
                switch (message.type) {
                    case 'activity':
                    case 'embeds_ready':
                        // We're ignoring them atm
                        break;
                    case 'settings':
                        if (cache[id]) {
                            for (var key in message.payload) {
                                if (message.payload.hasOwnProperty(key)) {
                                    cache[id][key] = message.payload[key];
                                }
                            }
                        }
                        break;
                    case 'update':
                        if (message.payload.kind == 'LiveUpdate') {
                            streamToUsers(id, `Update from 🗣 /u/${message.payload.data.author} 📢 ${thread.title}\n\n${message.payload.data.body}`, message.payload.data.name, {parse_mode: 'Markdown'});
                        }
                        break;
                    case 'delete':
                        remove(message.payload.data);
                        break;
                    case 'strike':
                        strikeToUsers(message.payload.data);
                        break;
                    case 'complete':
                        streamToUsers(id, `🔒 This thread has been marked as complete. It is now offline and you will no longer receive any update about it.`);
                        clearId(id);
                        connection.close(1000);
                        break;
                }
            }
        })
    });

    client.connect(thread.websocket_url/*'ws://localhost:8080/'*/);
    clients[id] = client;
}

function clearId(id) {
    delete threads[id];
    delete clients[id];
    delete cache[id];
}

function streamToUsers(id, message, update_id, options) {
    if (threads[id]) {
        threads[id].forEach(user => {
            options = options ? options : {};
            if (update_id) messages[update_id] = [];
            bot.sendMessage(user, message, options)
                .then(message => {
                    if (update_id) {
                        messages[update_id].push(message);
                    }
                })
                .catch(() => {
                    options.parse_mode = undefined;
                    bot.sendMessage(user, message, options).then(message => {
                        if (update_id) {
                            messages[update_id].push(message);
                        }
                    });
                })
        })
    }
}

function strikeToUsers(update_id) {
    if (messages[update_id]) {
        messages[update_id].forEach(message => {
            message.editText('☢ This update has been marked as incorrect ☢\n' + message.text, false, {parse_mode: 'Markdown'})
                .catch(() => {
                    message.editText('☢ This update has been marked as incorrect ☢\n' + message.text, false, {parse_mode: undefined})
                })
        });
        messages[update_id] = [];
    }
}

function remove(update_id) {
    if (messages[update_id]) {
        messages[update_id].forEach(message => {
            message.editText('📛 *This update has been removed!* 📛', false, {parse_mode: 'Markdown'})
                .catch(() => {
                    message.editText('📛 *This update has been removed!* 📛' + message.text, false, {parse_mode: undefined})
                })
        });
        messages[update_id] = [];
    }
}

function unfollow(user, id) {
    if (threads[id] && threads[id].indexOf(user.id) > -1) {
        threads[id].splice(threads[id].indexOf(user.id), 1);
        bot.sendMessage(user.id, '💔 You successfully stopped following this thread.')
    } else {
        bot.sendMessage(user.id, '🦄 Looks like you\'re not following this thread or this thread does not exist.')
    }
}

function get(path, query) {
    return request
        .get(path)
        .set('User-Agent', 'nodejs:redditlivebot:1.0.0 (by /u/alcc01)')
        .query(query)
        .end()
}