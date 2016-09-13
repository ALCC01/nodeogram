const nodeogram = require('nodeogram'),
    config = require('./config.json'),
    Bot = nodeogram.Bot,
    InlineQueryResultArticle = nodeogram.InlineQueryResultArticle;

bot = new Bot(config.token, {profiles_path: __dirname + '/profiles.json', enableHelp: false, useWebhooks: config.useWebhooks, webhookPort: config.webhookPort, webhookRoute: config.webhookRoute});
bot.init();

function search(query, limit) {
    return bot.get('https://www.wikidata.org/w/api.php', {action: "wbsearchentities", search: query, language: "en", format: "json", limit: limit || 20}).then((res) => {
        return(res.body.search)
    });
}

function entity(id, key) {
    return bot.get('https://www.wikidata.org/w/api.php', {action: "wbgetentities", ids: id, languages: "en", format: "json", normalize: true, sitefilter: "enwikibooks|enwikinews|enwikiquote|enwikisource|enwiki"}).then((res) => {
        return(key ? {data: res.body.entities[id], key: key } : res.body.entities[id])
    });
}

function date(string, redundant) {
    var d = string.length > 4 ? new Date(string.substring(1)) : new Date(string);
    if (string[0] == "-") d.setFullYear(0-d.getFullYear());
    if (redundant) {
        d._yearonly = true;
    }
    if (d == 'Invalid Date') {
        if (!redundant) return date(string.substring(0, 5), true);
        else return undefined;
    }
    return d;
}

function dateString(date) {
    var text = ``;
    if (date.getFullYear() < 0)  {
        date.setFullYear(-date.getFullYear());
        if (date.getUTCDate() > 0 && !date._yearonly) {
            text += `${date.toDateString()} BCE`;
            return text;
        } else {
            text += `${date.getFullYear()} BCE`;
            return text;
        }
    } else {
        if (date.getUTCDate() > 0 && !date._yearonly) {
            text += date.toDateString();
            return text;
        } else {
            text += date.getFullYear();
            return text;
        }
    }

}

function statements(data) {
    data._statements = {};
    var promises = [];
    var claims = data.claims;
    try {
        if (claims.P31) data._statements.is = claims.P31//[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P279) data._statements.subclass_of = claims.P279[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P361) data._statements.part_of = claims.P361[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P61) data._statements.invented_by = claims.P61[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P1448) data._statements.officially_named = claims.P1448//[0].mainsnak.datavalue.value.text;
        if (claims.P1476) data._statements.title = claims.P1476//[0].mainsnak.datavalue.value.text;
        if (claims.P569) data._statements.born_on = date(claims.P569[0].mainsnak.datavalue.value.time);
        if (claims.P570) data._statements.died_on = date(claims.P570[0].mainsnak.datavalue.value.time);
        if (claims.P571) data._statements.inception = date(claims.P571[0].mainsnak.datavalue.value.time);
        if (claims.P19) data._statements.birth_place = claims.P19[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P20) data._statements.death_place = claims.P20[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P1196) data._statements.death_manner = claims.P1196[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P157) data._statements.killer = claims.P157[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P27) data._statements.citizenship = claims.P27//[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P106) data._statements.occupation = claims.P106[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P800) data._statements.magnum_opus = claims.P800//[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P140) data._statements.religion = claims.P140[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P348) data._statements.version = claims.P348[claims.P348.length -1].mainsnak.datavalue.value;
        if (claims.P275) data._statements.license = claims.P275;//[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P123) data._statements.publisher = claims.P123[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P127) data._statements.owner = claims.P127[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P50) data._statements.author = claims.P50[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P178) data._statements.developer = claims.P178;
        if (claims.P277) data._statements.programming_language = claims.P277;
        if (claims.P908) data._statements.pegi_rating = claims.P908[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P852) data._statements.esrb_rating = claims.P852[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P1733) data._statements.steamid = claims.P1733[0].mainsnak.datavalue.value;
        if (claims.P400) data._statements.platforms = claims.P400;//[0].mainsnak.datavalue.value;
        if (claims.P306) data._statements.osystems = claims.P306;
        if (claims.P1401) data._statements.bugs = claims.P1401[0].mainsnak.datavalue.value;
        if (claims.P136) data._statements.genre = claims.P136;
        if (claims.P840) data._statements.narrative_location = claims.P840;
        if (claims.P166) data._statements.awards = claims.P166;
        if (claims.P495) data._statements.origin = claims.P495[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P170) data._statements.creator = claims.P170[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P1641) data._statements.port = claims.P1641[0].mainsnak.datavalue.value.amount.toString().substring(1);
        if (claims.P1482) data._statements.stackexchange = claims.P1482[0].mainsnak.datavalue.value;
        if (claims.P281) data._statements.zip = claims.P281[0].mainsnak.datavalue.value;
        if (claims.P421) data._statements.timezone = claims.P421[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P473) data._statements.local_dialing = claims.P473[0].mainsnak.datavalue.value;
        if (claims.P131) data._statements.admin_unit = claims.P131[claims.P131.length - 1].mainsnak.datavalue.value["numeric-id"];
        if (claims.P17) data._statements.country = claims.P17[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P856) data._statements.website = claims.P856[0].mainsnak.datavalue.value;
        if (claims.P6) data._statements.government_head = claims.P6[claims.P6.length - 1].mainsnak.datavalue.value["numeric-id"];
        if (claims.P1082) data._statements.population = claims.P1082[claims.P1082.length - 1].mainsnak.datavalue.value.amount;
        if (claims.P1376) data._statements.capital_of = claims.P1376;
        if (claims.P118) data._statements.leagues = claims.P118;
        if (claims.P286) data._statements.coach = claims.P286[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P641) data._statements.sports = claims.P641;//[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P371) data._statements.presenter = claims.P371;
        if (claims.P449) data._statements.network = claims.P449;
        if (claims.P2437) data._statements.seasons = claims.P2437[0].mainsnak.datavalue.value.amount;
        if (claims.P1113) data._statements.episodes = claims.P1113[0].mainsnak.datavalue.value.amount;
        if (claims.P963) data._statements.streaming = claims.P963[0].mainsnak.datavalue.value;
        if (claims.P161) data._statements.cast = claims.P161;
        if (claims.P162) data._statements.producer = claims.P162;
        if (claims.P57) data._statements.director = claims.P57;
        if (claims.P1478) data._statements.immediate_cause = claims.P1478;
        if (claims.P1120) data._statements.deaths = claims.P1120[0].mainsnak.datavalue.value.amount;
        if (claims.P1339) data._statements.injuried = claims.P1339[0].mainsnak.datavalue.value.amount;
        if (claims.P1446) data._statements.missing = claims.P1446[0].mainsnak.datavalue.value.amount;
        if (claims.P1590) data._statements.casualties = claims.P1590[0].mainsnak.datavalue.value.amount;
        if (claims.P580) data._statements.start = date(claims.P580[0].mainsnak.datavalue.value.time);
        if (claims.P582) data._statements.end = date(claims.P582[0].mainsnak.datavalue.value.time);
        if (claims.P585) data._statements.time = date(claims.P585[0].mainsnak.datavalue.value.time);
        if (claims.P1867) data._statements.voters = claims.P1867[0].mainsnak.datavalue.value.amount;
        if (claims.P1868) data._statements.ballots = claims.P1868[0].mainsnak.datavalue.value.amount;
        if (claims.P1346) data._statements.winner = claims.P1346[0].mainsnak.datavalue.value["numeric-id"];
        if (claims.P991) data._statements.winner_candidate = claims.P991;
        if (claims.P726) data._statements.candidates = claims.P726;
        if (claims.P2002) data._statements.twitter = claims.P2002[0].mainsnak.datavalue.value;
        if (claims.P2003) data._statements.instagram = claims.P2003[0].mainsnak.datavalue.value;
        if (claims.P2013) data._statements.facebook = claims.P2003[0].mainsnak.datavalue.value;
        if (claims.P2847) data._statements.plus = claims.P2847[0].mainsnak.datavalue.value;


    } catch (err) {
        console.log(err.stack);
        console.log(data.claims);
        console.log(data.title)
    }
    for (var key in data._statements) {
        if (data._statements.hasOwnProperty(key)) {
            switch (typeof data._statements[key]) {
                case "number":
                    promises.push(
                        entity("Q"+data._statements[key], key).then((d) => {
                            try {
                                if (d.data.labels.en) {
                                    data._statements[d.key] =d.data.labels.en.value;
                                }
                            } catch(err) {
                                console.log(err);
                                console.log(key);
                                console.log(data._statements[key]);
                                // FU
                            }
                        })
                    );
                    break;
                case "object":
                    var stmts = data._statements[key];
                    if (stmts instanceof Array) {
                        data._statements[key] = [];
                        stmts.forEach((entry) => {
                            if (entry.mainsnak.datavalue.value.text) {
                                data._statements[key].push(entry.mainsnak.datavalue.value.text);
                            }
                            else if (entry.mainsnak.datavalue.value["numeric-id"]) {
                                promises.push(
                                    entity("Q" + entry.mainsnak.datavalue.value["numeric-id"], key).then((d) => {
                                        if (d.data.labels.en) data._statements[d.key].push(d.data.labels.en.value);
                                    })
                                );
                            }
                        })
                    }
            }
        }
    }

    return Promise.all(promises).then(() => {
        return data;
    }, (err) => {
        console.log(err);
        console.log(err.stack)
        console.log(data.id)
    })
}

function message(data) {
    if (!data) {
        return "";
    }
    try {
        var urls = ["website", "stackexchange", "streaming"];
        urls.forEach((prop) => {
            if (data._statements[prop]) {
                data._statements[prop] = data._statements[prop].replace(/ /g, '_');
                data._statements[prop] = data._statements[prop].replace(/\(/g, '%28');
                data._statements[prop] = data._statements[prop].replace(/\)/g, '%29');
            }
        });
        if (data.sitelinks.enwiki) {
            data.sitelinks.enwiki.link = data.sitelinks.enwiki.title.replace(/ /g, '_');
            data.sitelinks.enwiki.link = data.sitelinks.enwiki.link.replace(/\(/g, '%28');
            data.sitelinks.enwiki.link = data.sitelinks.enwiki.link.replace(/\)/g, '%29');
        }
        var text = `✳ *${data.labels.en.value}*\n▶ _${data.descriptions.en.value ? data.descriptions.en.value : data.title + " on WikiData"}_\n\n`;
        if (data._statements.is) text += `${data.labels.en.value} is a *${data._statements.is.join(", ")}*\n`;
        if (data._statements.part_of) text += `Part of *${data._statements.part_of}*\n`;
        if (data._statements.occupation) text += `Works as a *${data._statements.occupation}*\n`;
        if (data._statements.magnum_opus) text += `Notable work: *${data._statements.magnum_opus}*\n`;
        if (data._statements.awards) text += `Awards received: *${data._statements.awards.join(", ")}*\n`;
        if (data._statements.officially_named) text += `Officially named *${data._statements.officially_named.join(", ")}*\n`;
        if (data._statements.title) text += `Titled _${data._statements.title.join("_, _")}_\n`;
        if (data._statements.invented_by) text += `Invented or discovered by *${data._statements.invented_by}*\n`;
        if (data._statements.creator) text += `Created by *${data._statements.creator}*\n`;
        if (data._statements.inception) text += `Creation date *${dateString(data._statements.inception)}*\n`;
        if (data._statements.born_on) text += `Birth date: *${dateString(data._statements.born_on)}*\n`;
        if (data._statements.birth_place) text += `Birth place: *${data._statements.birth_place}*\n`;
        if (data._statements.died_on) text += `Death date: *${dateString(data._statements.died_on)}*\n`;
        if (data._statements.death_place) text += `Death place: *${data._statements.death_place}*\n`;
        if (data._statements.death_manner) text += `Died because of *${data._statements.death_manner}*\n`;
        if (data._statements.killer) text += `Killed by *${data._statements.killer}*\n`;
        if (data._statements.citizenship) text += `Citizen of *${data._statements.citizenship.join(", ")}*\n`;
        if (data._statements.religion) text += `Religion: *${data._statements.religion}*\n`;
        if (data._statements.origin) text += `Originally from *${data._statements.origin}*\n`;
        if (data._statements.owner) text += `Owned by *${data._statements.owner}*\n`;
        if (data._statements.platforms) text += `Available on *${data._statements.platforms.join(", ")}*\n`;
        if (data._statements.osystems) text += `Works on *${data._statements.osystems.join(", ")}*\n`;
        if (data._statements.version) text += `Latest version: *${data._statements.version}*\n`;
        if (data._statements.license) text += `Licensed under *${data._statements.license.join(", ")}*\n`;
        if (data._statements.author) text += `Created by *${data._statements.author}*\n`;
        if (data._statements.developer) text += `Developed by *${data._statements.developer.join(", ")}*\n`;
        if (data._statements.publisher) text += `Published by *${data._statements.publisher}*\n`;
        if (data._statements.programming_language) text += `Developed in *${data._statements.programming_language.join(", ")}*\n`;
        if (data._statements.port) text += `Defaults to port *${data._statements.port}*\n`;
        if (data._statements.genre) text += `Genres: *${data._statements.genre.join(", ")}*\n`;
        if (data._statements.narrative_location) text += `Takes place in *${data._statements.narrative_location.join(", ")}*\n`;
        if (data._statements.pegi_rating) text += `Rated *${data._statements.pegi_rating}* by the PEGI system\n`;
        if (data._statements.esrb_rating) text += `Rated *${data._statements.esrb_rating}* by the ESRB system\n`;
        if (data._statements.steamid) text += `Steam Application [${data._statements.steamid}](https://store.steampowered.com/app/${data._statements.steamid}/)\n`;
        if (data._statements.zip) text += `ZIP code: *${data._statements.zip}*\n`;
        if (data._statements.timezone) text += `Located in the *${data._statements.timezone}* timezone\n`;
        if (data._statements.local_dialing) text += `Local dialing code is *${data._statements.local_dialing}*\n`;
        if (data._statements.country) text += `Located in *${data._statements.country}*\n`;
        if (data._statements.admin_unit) text += `Located into the *${data._statements.admin_unit}* administrative unit\n`;
        if (data._statements.government_head) text += `*${data._statements.government_head}* is the head of government\n`;
        if (data._statements.population) text += `*${data._statements.population}* inhabitants\n`;
        if (data._statements.capital_of) text += `Capital of *${data._statements.capital_of .join(", ")}*\n`;
        if (data._statements.sports) text += `Plays *${data._statements.sports.join(", ")}*\n`;
        if (data._statements.leagues) text += `Leagues: *${data._statements.leagues.join(", ")}*\n`;
        if (data._statements.coach) text += `Coached by *${data._statements.coach}*\n`;
        if (data._statements.presenter) text += `Hosted by *${data._statements.presenter.join(", ")}*\n`;
        if (data._statements.director) text += `Directed by *${data._statements.director.join(", ")}*\n`;
        if (data._statements.cast) text += `Cast: *${data._statements.cast.join(", ")}*\n`;
        if (data._statements.producer) text += `Produced by *${data._statements.producer.join(", ")}*\n`;
        if (data._statements.network) text += `Originally aired by *${data._statements.network.join(", ")}*\n`;
        if (data._statements.episodes) text += `*${data._statements.episodes}* episodes\n`;
        if (data._statements.seasons) text += `*${data._statements.seasons}* seasons\n`;
        if (data._statements.immediate_cause) text += `Immediate effect of *${data._statements.immediate_cause.join(", ")}*\n`;
        if (data._statements.deaths) text += `*${data._statements.deaths}* deaths\n`;
        if (data._statements.injuried) text += `*${data._statements.injuried}* wounded\n`;
        if (data._statements.missing) text += `*${data._statements.missing}* missing\n`;
        if (data._statements.casualties) text += `*${data._statements.casualties}* casualties\n`;
        if (data._statements.start) text += `Beginning date: *${data._statements.start}*\n`;
        if (data._statements.end) text += `Ending date: *${data._statements.end}*\n`;
        if (data._statements.time) text += `Date: *${data._statements.time}*\n`;
        if (data._statements.voters) text += `*${data._statements.voters}* eligible voters\n`;
        if (data._statements.ballots) text += `*${data._statements.ballots}* ballots cast\n`;
        if (data._statements.candidates) text += `Candidates: *${data._statements.candidates.join(", ")}*\n`;
        if (data._statements.winner) text += `Winner: *${data._statements.winner}*\n`;
        if (data._statements.winner_candidate) text += `Successful candidate(s): *${data._statements.winner_candidate.join(", ")}*\n`;

        if (data._statements.twitter) text += `📘  [Facebook profile](http://facebook.com/${data._statements.twitter})\n`;
        if (data._statements.plus) text += `➕  [${data._statements.plus}](http://plus.google.com/${data._statements.plus}) on Google+\n`;
        if (data._statements.twitter) text += `🐦  [@${data._statements.twitter}](http://twitter.com/${data._statements.twitter}) on Twitter\n`;
        if (data._statements.instagram) text += `📷  [${data._statements.instagram}](http://instagram.com/${data._statements.instagram}) on Instagram\n`;
        if (data._statements.streaming) text += `📡 [Available via streaming](${data._statements.streaming})\n`;
        if (data._statements.stackexchange) text += `☝ [StackExchange Tag](${data._statements.stackexchange})\n`;
        if (data._statements.bugs) text += `🐛 [Bug Tracking](${data._statements.bugs})\n`;
        if (data._statements.website) text += `🌍 [Official Website](${data._statements.website})\n`;
        if (data.sitelinks.enwiki) text += `\n📚 [Wikipedia Article](https://en.wikipedia.org/wiki/${data.sitelinks.enwiki.link})`;
        text += `\n#${data.id} on Wikidata`;

        return text;
    } catch (err) {
        console.log(err);
        console.log(err.stack)
    }
}

function results(objects, chat) {
    var promises = [];
    var result = [];

    objects.forEach((object) => {
        if (object.description && object.description != "Wikimedia disambiguation page" && object.description != "Wikipedia disambiguation page" && !object.label.startsWith("Template:")) {
            promises.push(entity(object.id).then((data) => {
                return statements(data).then((data) => {
                    if (chat) {
                        result.push({
                            id: object.id,
                            label: object.label,
                            is: object.description ? object.description : object.title + " on WikiData"
                        })
                    } else {
                        result.push(
                            new InlineQueryResultArticle(
                                object.id,
                                object.label,
                                {
                                    message_text: message(data),
                                    parse_mode: 'Markdown',
                                    disable_web_page_preview: true
                                },
                                {
                                    url: object.concepturi,
                                    description: object.description ? object.description : object.title + " on WikiData"
                                }
                            )
                        );
                    }
                });
            }));
        }
    });

    return Promise.all(promises).then(() => {
        return result;
    }).catch((err) => {
        console.log(err);
    })
}

bot.on('message', (message) => {
    if (message.commands.length > 0) return;
    console.log(`New message '${message.text}' from ${message.from.username}`);
    console.time(message.message_id);
    message.chat.sendAction('typing');
    search(message.text, 10).then((objects) =>{
        results(objects, true).then((results) => {
            if (results.length < 1) {
                message.reply("❗ I'm sorry but it looks like you are searching for something that hasn't been invented yet or that's hiding from you.");
                console.timeEnd(message.message_id);
            } else {
                var i = 1;
                var list = "❓ Which one of these entries are you looking for?\n\n";
                var keyboard = new nodeogram.Keyboard();
                results.forEach((result) => {
                    list += `${i}\u20E3 *${result.label}* - ${result.is}\n`;
                    var row = i > 8 ? 1 : 0;
                    keyboard.addButton(row, row == 0 ? i - 1 : i - 9, {text: "" + i, callback_data: result.id});
                    i++;
                });
                keyboard.toInline();
                message.reply(list, {reply_markup: keyboard, parse_mode: 'Markdown'});
                console.timeEnd(message.message_id);
            }
        })
    })
});

bot.on('callback_query', (query) => {
    console.log(`New callback query '${query.data}' from ${query.from.username}`);
    console.time(query.id);
    entity(query.data).then(entity => statements(entity)
        .then((data) => {
            var msg = message(data);
            query.message.editText(msg, false, {parse_mode: 'Markdown', disable_web_page_preview: true});
            query.answer("👍 Alright, got it!", true);
            console.timeEnd(query.id)
        })
    )
});

bot.on('inline_query', (query) => {
    if (query.query == '') {
        query.answer([new InlineQueryResultArticle(
            'wisdom_unofficial',
            'Wisdom',
            {
                message_text: `✳ *Wisdom*
▶ _Deep understanding of or knowledge of a subject_

Wisdom is a *property*

📚 [Wikipedia Article](https://en.wikipedia.org/wiki/Wisdom)
#Q799 on Wikidata
`,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            },
            {
                url: "http://www.wikidata.org/entity/Q799",
                description: "deep understanding of or knowledge of a subject",
                hide_url: true,
                thumb_url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Rodin_le_penseur.JPG",
                thumb_height: 1536,
                thumb_width: 2048
            }
        )], {cache_time: 0});
    } else {
        console.log(`New query '${query.query}' from ${query.from.username}`);
        console.time(query.id);
        search(query.query).then((objects) => {
            results(objects).then((result) => {
                query.answer(result, {cache_time: 300000})
                    .then((res) => {
                        console.timeEnd(query.id);
                    })
                    .catch((err) => {
                        //console.log(err);
                        console.timeEnd(query.id);
                        console.log(err.stack)
                        result.forEach((r) => {
                            if (!r.input_message_content.message_text) console.log(r)
                        })
                    });
            });
        });
    }
});

bot.command('start', 'Start this bot', true, (args, message) => {
    message.reply(`Hi there, I'm ThingsBot.

I can search things for you in the structured data universe. I'm powered by the magic of Wikidata, a project of the Wikimedia Foundation (the guys from Wikipedia) that provides free structured data under CC0.

You can start looking up things via inline queries, using \`@thingybot [you query]\`
If you are forever alone or you don't want to flood other chats, you can just write me your query and I will answer you with the best results I can find.

If any error occurs or you have a suggestion, you can query my owner @ALCC01 (https://albertocoscia.me). My userpic is released under CC BY-SA as it contains the Wikidata logo`, {parse_mode: "Markdown"})
});
