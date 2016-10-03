'use strict';
const request = require('superagent-promise')(require('superagent'), Promise),
    extend = require('util')._extend,
    Chat = require('./Chat.js'),
    User = require('./User.js'),
    Message = require('./Message.js'),
    InlineQuery = require('./InlineQuery.js'),
    File = require('./File.js'),
    ChosenInlineResult = require('./ChosenInlineResult.js'),
    CallbackQuery = require('./CallbackQuery.js'),
    ChatMember = require('./ChatMember.js'),
    UserProfilePhotos = require('./UserProfilePhotos.js'),
    GameHighScore = require('./GameHighScore.js'),
    fs = require('fs'),
    events = require('events'),
    endpoint = 'https://api.telegram.org';

function Bot(token, options) {
    this.token = token;
    this.lastUpdate = -1;
    this.limit = 100;
    // Wait up to 30 seconds before closing connection
    this.timeout = 30;
    this.commands = [];
    this.messageHandlers = [];
    this.me = {};
    this.emitter = new events.EventEmitter();
    this.saveUsers = true;
    this.saveChats = true;
    this.enableHelp = true;
    this.forms = {}; // user_id: {form, answers}
    this.debug = process.env.NODEOGRAM_DEBUG || false;
    this.webhookRoute = '/';
    this.webhookPort = 8080;
    this.autoFetch = true;
    extend(this, options);

    this.handleAPIError = (err) => {
        if (err.response) {
            console.log(`An error occurred while querying the Telegram API - ${err.response.text ? JSON.parse(err.response.text).error_code : ""} ${err.response.text ? JSON.parse(err.response.text).description : ""}`)
        }
        else console.log(err)
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
                if (!res.body.ok) throw new Error("Telegram API response was not OK");
                return res;
            }).catch((err) => {
                if (err.response.error.status == 403 || err.response.error.status == 400) {
                    throw new Error(JSON.parse(err.response.error.text).description);
                } else this.handleAPIError(err);
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
                if (!res.body.ok) throw "Telegram API response was not OK";
                return res;
            }).catch((err) => {
                if (err.response.error.status == 403 || err.response.error.status == 400) {
                    throw new Error(JSON.parse(err.response.error.text).description);
                } else throw err;
            })
    };

    this.handleUpdates = (updates) => {
        if (this.debug) console.log(JSON.stringify(updates));
        if (updates.length > 0) {
            this.lastUpdate = updates[updates.length - 1].update_id + 1;
            var now = Date.now() / 1000;
            updates.forEach((result) => {
                if (result.message) {
                    if (this.debug) console.log(`New message #${result.message.message_id}`);
                    if (result.message.date < now - 2000) {
                        if (this.debug) console.log(`Skipping backlog update #${result.update_id}`);
                        return;
                    }
                    var message = new Message(result.message, this);
                    var handleNext = true;
                    this.messageHandlers.forEach((handler) => {
                        if (handleNext) {
                            var res = handler(message);
                            handleNext = res === undefined ? true : res;
                        } else {
                            if (this.debug) console.log(`Not executing any other message handler for message #${message.message_id}`);
                        }
                    });
                }
                if (result.inline_query) {
                    if (this.debug) console.log(`New inline query #${result.inline_query.id}`);
                    this.emitter.emit('inline_query', new InlineQuery(result.inline_query, this));
                }
                if (result.callback_query) {
                    if (this.debug) console.log(`New callback query #${result.callback_query.id}`);
                    this.emitter.emit('callback_query', new CallbackQuery(result.callback_query, this));
                }
                if (result.edited_message) {
                    if (this.debug) console.log(`Message #${result.edited_message.message_id} was modified`);
                    this.emitter.emit('edited_message', new Message(result.edited_message, this));
                }
                if (result.chosen_inline_result) {
                    if (this.debug) console.log(`Inline result #${result.chosen_inline_result.result_id} was chosen`);
                    this.emitter.emit('chosen_inline_result', new ChosenInlineResult(result.chosen_inline_result, this))
                }
            });
        }
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
                if (!res.body.ok) throw "Telegram API response was not OK";
                this.handleUpdates(res.body.result);
                this.getUpdates();
            })
            .catch((err) => {
                this.handleAPIError(err);
                // Wait before retrying in order not to flood Telegram's servers
                this.lastUpdate = -1;
                setTimeout(() => {
                    this.getUpdates();
                }, 3000)
            });

    };

    this.command = (command, description, hidden, callback) => {
        this.commands.push({command: command, description: description, callback: callback, hidden: hidden});
        if (this.debug) console.log(`Command ${command} has been registered.`)
    };

    this.form = (user_id, object, callback) => {
        if (user_id instanceof Chat) user_id = user_id.id;
        if (user_id instanceof User) user_id = user_id.id;
        if (!this.forms[user_id]) {
            this.forms[user_id] = {
                form: object,
                answers: {},
                callback: callback
            }
        }
        if (this.debug) console.log(`A form for user #${user_id} has been registered.`)
        return this.sendMessage(user_id, object[Object.keys(object)[0]].message.text, object[Object.keys(object)[0]].message.options)
    };

    this.removeForm = (user_id) => {
        if (user_id instanceof Chat) user_id = user_id.id;
        if (user_id instanceof User) user_id = user_id.id;
        if (this.forms[user_id]) {
            delete this.forms[user_id]
            if (this.debug) console.log(`A form for user ${user_id} has been unregistered.`)
        }
    };

    this.getChat = (chat_id) => {
        if (this.debug) console.log(`Attempting to get chat #${chat_id}.`);
        return this.call('getChat', {chat_id: chat_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Chat(res.body.result, this)
        })
    };

    this.leaveChat = (chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (this.debug) console.log(`Attempting to leave chat #${chat_id}.`);
        return this.call('leaveChat', {chat_id: chat_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return res.body.result;
        })
    };

    this.sendMessage = (chat_id, text, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;
        options.text = text;

        if (this.debug) console.log(`Attempting to send a message to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('sendMessage', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Message(res.body.result, this);
        });
    };

    this.sendLocation = (chat_id, longitude, latitude, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;
        options.longitude = longitude;
        options.latitude = latitude;

        if (this.debug) console.log(`Attempting to send a location to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('sendLocation', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Message(res.body.result, this);
        });
    };

    this.sendVenue = (chat_id, longitude, latitude, title, address, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;
        options.longitude = longitude;
        options.latitude = latitude;
        options.title = title;
        options.address = address;

        if (this.debug) console.log(`Attempting to send a venue to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('sendVenue', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Message(res.body.result, this);
        });
    };

    this.sendContact = (chat_id, phone_number, first_name, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;
        options.phone_number = phone_number;
        options.first_name = first_name;

        if (this.debug) console.log(`Attempting to send a contact to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('sendContact', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Message(res.body.result, this);
        });
    };

    this.sendGame = (chat_id, game_short_name, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;
        options.game_short_name = game_short_name;

        if (this.debug) console.log(`Attempting to send a game to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('sendGame', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Message(res.body.result, this);
        });
    }


    this.forwardMessage = (chat_id, from_chat_id, message_id, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;
        options.from_chat_id = from_chat_id;
        options.message_id = message_id;

        if (this.debug) console.log(`Attempting to forward a message to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('forwardMessage', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new Message(res.body.result, this);
        });
    };

    this.answerCallbackQuery = (id, options, alert) => {
        // TODO Drop support for the old method signature
        if (typeof options === 'string') {
            options = {
                text: options,
                alert: alert
            }
        }
        options = options || {};
        options.callback_query_id = id;

        if (this.debug) console.log(`Attempting to answer callback query #${id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('answerCallbackQuery', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${id}.`);
            return res.body.result;
        });
    };

    this.getUserProfilePhotos = (user_id, options) => {
        if (user_id instanceof User) user_id = user_id.id;
        options = options || {};
        options.user_id = user_id;

        if (this.debug) console.log(`Attempting to get profile photos for user #${user_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('getUserProfilePhotos', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${user_id}.`);
            return new UserProfilePhotos(res.body.result, this);
        });
    };

    this.getFile = (file_id) => {
        if (this.debug) console.log(`Attempting to get file #${user_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('getFile', {file_id: file_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${file_id}.`);
            return new File(res.body.result, this);
        })
    };

    this.sendFile = (chat_id, type, path, options) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.chat_id = chat_id;

        if (this.debug) console.log(`Attempting to send file ${path} to chat/user #${chat_id} (${JSON.stringify(options, undefined, 0)}).`);
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
        if (this.debug) console.log(`Uploading a ${value} via the ${method} method.`);
        // We are uploading a file
        if (fs.existsSync(path)) {
            return this.callMultipart(method, options, path, value).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${path}.`);
                return new Message(res.body.result)
            });
        }
        // A file_id was passed
        else {
            options[value] = path;
            options[value] = path;
            return this.call(method, options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${path}.`);
                return new Message(res.body.result);
            });
        }
    };

    this.downloadFile = (file_id) => {
        if (file_id instanceof File) {
            if (this.debug) console.log(`Attempting to download file #${file_id}.`);
            return this.get(endpoint + '/file/bot' + this.token + '/' + file_id.file_path, {}).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${file_id}.`);
                return res.body;
            })
        } else {
            return this.getFile(file_id).then(file => file.download());
        }
    };

    this.answerInlineQuery = (inline_query_id, results, options) => {
        options = options || {};
        options.inline_query_id = inline_query_id;
        options.results = JSON.stringify(results);
        if (this.debug) console.log(`Attempting to answer inline query #${inline_query_id} (${JSON.stringify(options, undefined, 0)}).`);
        return this.call('answerInlineQuery', options).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${inline_query_id}.`);
            return res.body.result;
        });
    };

    this.editMessageText = (id, text, inline, options, chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.text = text;

        if (inline) {
            options.inline_message_id = id;
            if (this.debug) console.log(`Attempting to edit inline message #${options.inline_message_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('editMessageText', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.inline_message_id}.`);
                return res.body.result;
            })
        } else {
            options.chat_id = chat_id;
            options.message_id = id;
            if (this.debug) console.log(`Attempting to edit message #${options.message_id} for chat #${options.chat_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('editMessageText', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.message_id} in #${options.chat_id}.`);
                return new Message(res.body.result)
            })
        }
    };

    this.editMessageCaption = (id, caption, inline, options, chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.caption = caption;
        // Edit as inline message
        if (inline) {
            options.inline_message_id = id;
            if (this.debug) console.log(`Attempting to edit inline message caption #${options.inline_message_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('editMessageCaption', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.inline_message_id}.`);
                return res.body.result;
            })
        } else {
            options.chat_id = chat_id;
            options.message_id = id;
            if (this.debug) console.log(`Attempting to edit message caption #${options.message_id} for chat #${options.chat_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('editMessageCaption', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.message_id} in #${options.chat_id}.`);
                return new Message(res.body.result)
            })
        }
    };

    this.editMessageReplyMarkup = (id, markup, inline, options, chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        options = options || {};
        options.markup = markup;
        // Edit as inline message
        if (inline) {
            options.inline_message_id = id;
            if (this.debug) console.log(`Attempting to edit inline message markup #${options.inline_message_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('editMessageReplyMarkup', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.inline_message_id}.`);
                return res.body.result;
            })
        } else {
            options.chat_id = chat_id;
            options.message_id = id;
            if (this.debug) console.log(`Attempting to edit message markup #${options.message_id} for chat #${options.chat_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('editMessageReplyMarkup', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.message_id} in #${options.chat_id}.`);
                return new Message(res.body.result)
            })
        }
    };

    this.setGameScore = (id, user_id, score, inline, options, chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        if (user_id instanceof Chat) user_id = user_id.id;
        if (user_id instanceof User) user_id = user_id.id;

        options = options || {};
        options.user_id = user_id;
        options.score = score;

        if (inline) {
            options.inline_message_id = id;
            if (this.debug) console.log(`Attempting to edit inline message game score #${options.inline_message_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('setGameScore', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.inline_message_id}.`);
                return res.body.result;
            })
        } else {
            options.chat_id = chat_id;
            options.message_id = id;
            if (this.debug) console.log(`Attempting to edit message game score #${options.message_id} for chat #${options.chat_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('setGameScore', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.message_id} in #${options.chat_id}.`);
                return new Message(res.body.result)
            })
        }
    };

    this.getGameHighScores = (id, user_id, inline, chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        if (user_id instanceof Chat) user_id = user_id.id;
        if (user_id instanceof User) user_id = user_id.id;

        options = {};
        options.user_id = user_id;

        if (inline) {
            options.inline_message_id = id;
            if (this.debug) console.log(`Attempting to get inline message high scores #${options.inline_message_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('getGameHighScores', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.inline_message_id}.`);
                var scores = [];
                res.body.result.forEach(score => {
                    scores.push(new GameHighScore(score, this))
                });
                return scores;
            })
        } else {
            options.chat_id = chat_id;
            options.message_id = id;
            if (this.debug) console.log(`Attempting to get message high scores #${options.message_id} for chat #${options.chat_id} (${JSON.stringify(options, undefined, 0)}).`);
            return this.call('getGameHighScores', options).then((res) => {
                if (this.debug) console.log(`Successfully completed the request for #${options.message_id} in #${options.chat_id}.`);
                var scores = [];
                res.body.result.forEach(score => {
                    scores.push(new GameHighScore(score, this))
                });
                return scores;
            })
        }
    };

    this.getChatAdministrators = (chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;

        if (this.debug) console.log(`Attempting to get administrators for chat #${chat_id}.`);
        return this.call('getChatAdministrators', {chat_id: chat_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            var administrators = res.body.result;
            var processed = [];
            administrators.forEach((admin) => {
                processed.push(new ChatMember(admin, this))
            });
            return processed;
        })
    };

    this.getChatMember = (chat_id, user_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;
        if (user_id instanceof User) user_id = user_id.id;

        if (this.debug) console.log(`Attempting to get chat member #${user_id} for chat #${chat_id}.`);
        return this.call('getChatMember', {chat_id: chat_id, user_id: user_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return new ChatMember(res.body.result, this);
        })
    };

    this.kickChatMember = (chat_id, user_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (user_id instanceof User) user_id = user_id.id;

        if (this.debug) console.log(`Attempting to kick chat member #${user_id} from chat #${chat_id}.`);
        return this.call('kickChatMember', {chat_id: chat_id, user_id: user_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return res.body.result;
        })
    };

    this.unbanChatMember = (chat_id, user_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (user_id instanceof User) user_id = user_id.id;

        if (this.debug) console.log(`Attempting to unban chat member #${user_id} from chat #${chat_id}.`);
        return this.call('unbanChatMember', {chat_id: chat_id, user_id: user_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return res.body.result;
        })
    };

    this.getChatMembersCount = (chat_id) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;

        if (this.debug) console.log(`Attempting to get chat members count for chat #${chat_id}.`);
        return this.call('getChatMembersCount', {chat_id: chat_id}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return res.body.result;
        })
    };

    this.sendChatAction = (chat_id, action) => {
        if (chat_id instanceof Chat) chat_id = chat_id.id;
        if (chat_id instanceof User) chat_id = chat_id.id;

        if (this.debug) console.log(`Attempting to send chat action ${action} for chat #${chat_id}.`);
        return this.call('sendChatAction', {chat_id: chat_id, action: action}).then((res) => {
            if (this.debug) console.log(`Successfully completed the request for #${chat_id}.`);
            return res.body.result;
        })
    };

    this.handleCommands = (message) => {
        var returm = true;
        if (message.command) {
            var command = message.command;
            this.commands.forEach((entry) => {
                if (("/" + entry.command) == command.command && (!command.recipient || ("@" + this.me.username) == command.recipient)) {
                    if (this.debug) console.log(`Handling command ${command} for message #${message.message_id}`);
                    entry.callback(command.args, message);
                    returm = false;
                }
            });
        }
        return returm;
    };

    this.handleMessage = (message) => {
        if (this.debug) console.log(`Executing message handler handleMessage for message #${message.message_id}`);
        if (message.new_chat_member) this.emitter.emit('new_chat_member', message.new_chat_member, message);
        if (message.left_chat_member) this.emitter.emit('left_chat_member', message.left_chat_member, message);
        if (message.new_chat_title) this.emitter.emit('new_chat_title', message.new_chat_title, message);
        if (message.new_chat_photo) this.emitter.emit('new_chat_photo', message.new_chat_photo, message);
        if (message.delete_chat_photo) this.emitter.emit('delete_chat_photo	', message.delete_chat_photo, message);
        if (message.group_chat_created) this.emitter.emit('group_chat_created', message.group_chat_created, message);
        if (message.supergroup_chat_created) this.emitter.emit('supergroup_chat_created', message.supergroup_chat_created, message);
        if (message.channel_chat_created) this.emitter.emit('channel_chat_created', message.channel_chat_created, message);
        if (message.migrate_to_chat_id) this.emitter.emit('migrate_to_chat_id', message.migrate_to_chat_id, message);
        if (message.migrate_from_chat_id) this.emitter.emit('migrate_from_chat_id', message.migrate_from_chat_id, message);
        if (message.pinned_message) this.emitter.emit('pinned_message', message.pinned_message, message);

        this.emitter.emit('message', message);
    };

    this.handleProfiles = (message) => {
        if (this.debug) console.log(`Executing message handler handleProfiles for message #${message.message_id}`);
        var edited = false;
        if (!profiles.users[message.from.id] && this.saveUsers) {
            profiles.users[message.from.id] = message.from;
            profiles.users[message.from.id].bot = undefined;
            edited = true;
        }
        if (!profiles.chats[message.chat.id] && this.saveChats) {
            profiles.chats[message.chat.id] = message.chat;
            profiles.chats[message.chat.id].bot = undefined;
            edited = true;
        }
        if (edited) fs.writeFile(this.profiles_path, JSON.stringify(profiles), (err) => {
            if (err) console.log(err)
        })
    };

    this.handleForms = (message) => {
        if (this.debug) console.log(`Executing message handler handleForms for message #${message.message_id}`);
        var id = message.from.id;
        if (this.forms[id] && message.chat.type == 'private') {
            var next = false;
            var wait = false;
            for (var key in this.forms[id].form) {
                if (!next) {
                    if (this.forms[id].form.hasOwnProperty(key) && !this.forms[id].answers.hasOwnProperty(key)) {
                        var question = this.forms[id].form[key];
                        if (question.regex.test(message.text)) {
                            this.forms[id].answers[key] = message.text;
                            next = true;
                        } else {
                            message.reply(question.error.text, question.error.options);
                            wait = true;
                            break;
                        }
                    }
                } else {
                    if (this.forms[id].form.hasOwnProperty(key)) {
                        message.reply(this.forms[id].form[key].message.text, this.forms[id].form[key].message.options);
                        wait = true;
                    }
                    break;
                }
            }
            if (next == true && wait == false) {
                this.forms[id].callback(this.forms[id].answers)
                delete this.forms[id];
            }
            return false;
        }
    };

    this.broadcast = (filter, callback) => {
        if (!this.profiles_path) throw new Error("Profiles path is not defined");
        if (profiles.chats) {
            for (var chat in profiles.chats) {
                if (profiles.chats.hasOwnProperty(chat)) {
                    chat = profiles.chats[chat];
                    if (typeof filter == 'function') {
                        if (filter(chat)) callback(this.getChat(chat.id));
                    }
                    else if (chat.type == filter || filter == 'all') callback(this.getChat(chat.id))
                }
            }
        }
    };

    this.init = () => {
        if (!this.token) throw new Error("Invalid token!");
        this.messageHandlers = [
            this.handleForms,
            this.handleCommands,
            this.handleMessage
        ];
        if (this.profiles_path) {
            this.messageHandlers.unshift(this.handleProfiles);
            global.profiles = {users: {}, chats: {}};
            try {
                global.profiles = require(this.profiles_path)
            } catch (err) {
            }
        }
        if (this.enableHelp) {
            this.command('help', 'Display help for this bot', false, (args, message) => {
                var text = 'Commands:\n';
                var total = 0;
                this.commands.forEach((entry) => {
                    if (!entry.hidden) {
                        text += `\n/${entry.command} - ${entry.description}`;
                        total++;
                    }
                });
                if (total == 1) {
                    // Look like only the help command is registered
                    text = 'There are no commands for this bot!';
                }
                message.reply(text, {});
            });
        }
        if (this.autoFetch) {
            if (this.useWebhooks) {
                if (!this.express_app) {
                    let express = require('express');
                    this.express_app = express();
                    this.express_app.use(require('body-parser').json());
                }
                if (!this.webhookFunction) {
                    this.express_app.post(this.webhookRoute, (req, res) => {
                        this.handleUpdates([req.body]);
                        res.send({})
                    })
                } else {
                    this.express_app.post(this.webhookRoute, this.webhookFunction)
                }

                this.express_app.listen(this.webhookPort);
            } else {
                this.getUpdates();
            }
        }
    };

    this.call('getMe', {}).then((res) => {
        if (res) this.me = res.body.result;
    }).catch(err => console.log(err));

    // For more complex event handling use this.emitter
    this.on = (event, listener) => {
        this.emitter.on(event, listener);
    }
}

module.exports = Bot;



