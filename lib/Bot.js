'use strict';
const request = require('superagent-promise')(require('superagent'), Promise),
    Chat = require('./Chat.js'),
    User = require('./User.js'),
    Message = require('./Message.js'),
    InlineQuery = require('./InlineQuery.js'),
    File = require('./File.js'),
    ChosenInlineResult = require('./ChosenInlineResult.js'),
    fs = require('fs'),
    events = require('events'),
    endpoint = 'https://api.telegram.org';

function Bot(token) {
    this.token = token;
    this.lastUpdate = -1;
    this.limit = 100;
    // Wait up to 30 seconds before closing connection
    this.timeout = 30;
    this.commands = [];
    this.messageHandlers = [];
    this.me = {};
    this.emitter = new events.EventEmitter();

    this.handleAPIError = (err) => {
        console.log(`An error occurred while querying the Telegram API - ${JSON.parse(err.response.text).error_code} ${JSON.parse(err.response.text).description}`)
    };

    this.get = (path, query) => {
        return request
            .get(path)
            .query(query)
            .end()
    };

    this.post = (path, query) => {
        return request
            .post(path)
            .send(query)
    };

    this.call = (method, args) => {
        let path = endpoint + '/bot' + token + '/' + method;
        return this.post(path, args)
            .end()
            .then((res) => {
                if (!res.body.ok) throw res.body.error_code;
                return res;
            }).catch((err) => {
                this.handleAPIError(err);
            })
    };

    this.callMultipart = (method, args, path, name) => {
        var restPath = endpoint + '/bot' + token + '/' + method;
        var req = this.post(restPath, args)
            .attach(name, path);
        for (var key in args) {
            if (args.hasOwnProperty(key)) req = req.field(key, args[key])
        }
        return req
            .then((res) => {
                if (!res.body.ok) throw res.body.error_code;
                return res;
            }).catch((err) => {
                this.handleAPIError(err);
            })
    };

    this.getUpdates = () => {
        let path = endpoint + '/bot' + this.token + '/getUpdates';
        this.post(path, {
                offset: this.lastUpdate,
                limit: this.limit,
                timeout: this.timeout
            })
            .end()
            .then((res) => {
                if (!res.body.ok) throw new Error('Telegram API response was not OK');
                if (res.body.result.length > 0) {
                    this.lastUpdate = res.body.result[res.body.result.length - 1].update_id + 1;
                    res.body.result.forEach((result) => {
                        if (result.message) {
                            if (result.message.date < (Date.now() / 1000) - 2000) {
                                console.log(`Skipping backlog update ${result.update_id}`);
                                return;
                            }
                            var message = new Message(result.message, this);
                            this.messageHandlers.forEach((handler) => {
                                handler(message);
                            });
                        }
                        if (result.inline_query) {
                            this.emitter.emit('inline_query', new InlineQuery(result.inline_query, this));
                        }
                    });
                }
                this.getUpdates();
            })
            .catch((err) => {
                // Wait before retrying in order not to flood Telegram's servers
                setTimeout(() => {
                    this.getUpdates();
                }, 3000)
            });

    };

    this.command = (command, description, callback) => {
        this.commands.push({command: command, description: description, callback: callback});
    };

    this.getChat = (id) => {
        return this.call('getChat', {chat_id: id}).then((res) => {
            return new Chat(res.body.result, this)
        })
    };
    this.leaveChat = (id) => {
        return this.call('leaveChat', {chat_id: id}).then((res) => {
            return res.body.result;
        })
    };

    this.sendMessage = (chat_id, text, options) => {
        options = options || {};
        options.chat_id = chat_id;
        options.text = text;
        return this.call('sendMessage', options).then((res) => {
            return new Message(res.body.result, this);
        });
    };

    this.forwardMessage = (chat_id, from_chat_id, message_id, options) => {
        options = options || {};
        options.chat_id = chat_id;
        options.from_chat_id = from_chat_id;
        options.message_id = message_id;
        return this.call('forwardMessage', options).then((res) => {
            return new Message(res.body.result, this);
        });
    };

    this.getFile = (file_id) => {
        return this.call('getFile', {file_id: file_id}).then((res) => {
            return new File(res.body.result, this);
        })
    };

    this.sendFile = (chat_id, type, path, options) => {
        options = options || {};
        options.chat_id = chat_id;
        var method;
        var value;
        switch (type) {
            case 'photo':
                method = 'sendPhoto';
                value = 'photo';
                break;
            case 'audio':
                method = 'sendAudio';
                value = 'audio';
                break;
            case 'document':
                method = 'sendDocument';
                value = 'document';
                break;
            case 'sticker':
                method = 'sendSticker';
                value = 'sticker';
                break;
            case 'video':
                method = 'sendVideo';
                value = 'video';
                break;
            case 'voice':
                method = 'sendVoice';
                value = 'voice';
                break;
        }
        // We are uploading a file
        if (fs.existsSync(path)) {
            return this.callMultipart(method, options, path, value).then((res) => {
                return new Message(res.body.result)
            });
        }
        // A file_id was passed
        else {
            options[value] = path;
            options[value] = path;
            return this.call(method, options).then((res) => {
                return new Message(res.body.result);
            });
        }
    };

    this.downloadFile = (file) => {
        if (file instanceof File) {
            return this.get(endpoint + '/file/bot' + this.token + '/' + file.file_path, {}).then((res) => {
                return res.body;
            })
        } else {
            return this.getFile(file).download();
        }
    };

    this.answerInlineQuery = (inline_query_id, results, options) => {
        options = options || {};
        options.inline_query_id = inline_query_id;
        options.results = JSON.stringify(results);
        return this.call('answerInlineQuery', options);
    };

    this.handleCommands = (message) => {
        if (message.commands.length > 0) {
            var command = message.commands[0];
            this.commands.forEach((entry) => {
                if (("/" + entry.command) == command.command && (!command.recipient || ("@" + this.me.username) == command.recipient)) {
                    entry.callback(command.args, message);
                }
            });
        }
    };

    this.handleMessage = (message) => {
        this.emitter.emit('message', message);
    };

    this.init = () => {
        this.messageHandlers = [
            this.handleCommands,
            this.handleMessage
        ];
        this.command('help', 'Get help\'d m8', (args, message) => {
            var text = 'Commands:\n';
            this.commands.forEach((entry) => {
                text += `\n/${entry.command} - ${entry.description}`
            });
            message.reply(text, {});
        });
        this.getUpdates();
    };

    this.call('getMe', {}).then((res) => {
        this.me = res.body.result;
    });

    // For more complex event handling use this.emitter
    this.on = (event, listener) => {
        this.emitter.on(event, listener);
    }
}

module.exports = Bot;



