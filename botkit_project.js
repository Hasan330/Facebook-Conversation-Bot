/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
This is a sample Facebook bot built with Botkit.
This bot demonstrates many of the core features of Botkit:
* Connect to Facebook's Messenger APIs
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.
# RUN THE BOT:
  Follow the instructions here to set up your Facebook app and page:
    -> https://developers.facebook.com/docs/messenger-platform/implementation
  Run your bot from the command line:
    page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node facebook_bot.js [--lt [--ltsubdomain LOCALTUNNEL_SUBDOMAIN]]
  Use the --lt option to make your bot available on the web through localtunnel.me.
# USE THE BOT:
  Find your bot inside Facebook to send it a direct message.
  Say: "Hello"
  The bot will reply "Hello!"
  Say: "who are you?"
  The bot will tell you its name, where it running, and for how long.
  Say: "Call me <nickname>"
  Tell the bot your nickname. Now you are friends.
  Say: "who am I?"
  The bot will tell you your nickname, if it knows one for you.
  Say: "shutdown"
  The bot will ask if you are sure, and then shut itself down.
  Make sure to invite your bot into other channels using /invite @<my bot>!
# EXTEND THE BOT:
  Botkit has many features for building cool and useful bots!
  Read all about it here:
    -> http://howdy.ai/botkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


// if (!process.env.page_token) {
//     console.log('Error: Specify page_token in environment');
//     process.exit(1);
// }

// if (!process.env.verify_token) {
//     console.log('Error: Specify verify_token in environment');
//     process.exit(1);
// }

var Botkit = require('botkit');
var os = require('os');
var commandLineArgs = require('command-line-args');
var localtunnel = require('localtunnel');
var replytoUser = require('./reply_messages');
var mood = require("./user_mood.js")
var awkwardness = 0;
var firebaseStorage = require('botkit-storage-firebase')({ firebase_uri: 'https://self-learning.firebaseio.com/' })

const cli = commandLineArgs([{
    name: 'lt',
    alias: 'l',
    args: 1,
    description: 'Use localtunnel.me to make your bot available on the web.',
    type: Boolean,
    defaultValue: false
}, {
    name: 'ltsubdomain',
    alias: 's',
    args: 1,
    description: 'Custom subdomain for the localtunnel.me URL. This option can only be used together with --lt.',
    type: String,
    defaultValue: null
}, ]);

const ops = cli.parse();
if (ops.lt === false && ops.ltsubdomain !== null) {
    console.log("error: --ltsubdomain can only be used together with --lt.");
    process.exit();
}

var controller = Botkit.facebookbot({
    debug: false,
    access_token: 'EAAQA8eJNThwBALBn6mIbdjFmElIRe3IllqEVoIF89UdksnumZCbfOmouKc08VZBGptBEbOc66PRZCOujLa4OF9RAkZCYWUZCtLUBlMFRDffRT2pYZBlA4p7udgVnH9N9GqpZCBPhpEZAH3NZC17I26MPJ91B9WSnZBbg0e3wqf07jaigZDZD',
    verify_token: 'VERIFY_TOKEN',
    storage: firebaseStorage,
});

var bot = controller.spawn({});

try{
    controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
        if (ops.lt) {
            var tunnel = localtunnel(process.env.port || 3000, { subdomain: ops.ltsubdomain }, function(err, tunnel) {
                if (err) {
                    throw err;
                    console.log("Controller error:",err);
                    process.exit();
                }
                console.log("Your bot is available on the web at the following URL : " + tunnel.url + '/facebook/receive');
            });

            tunnel.on('close', function() {
                console.log("Your bot is no longer available on the web at the localtunnnel.me URL.");
                process.exit();
            });
        }
    });
});} catch (err){
        console.log(err);
    }



var testUser = { id: "445", name: "hasan k" };
try {
    controller.storage.users.save(testUser, function(err) {
        if (err) {
            throw err;
        }
    });
} catch (err) {
    // This will not catch the throw!
    console.log(err);
}

// console.log("User details:", controller.storage.users.get('444'));


controller.hears(['hello', 'hi', 'hey', 'marhaba'], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Why hello there stranger!');

            bot.startConversation(message, function(err, convo) {
                convo.say('I am afraid we havent been properly introduced yet, what would you like me to call you? Say "Call me ...." then type your name');
            });
        }
    });
});

controller.hears(['call me (.*)', 'my name is (.*)', 'I am (.*)', "I'm (.*)"], 'message_received', function(bot, message) {
    var name = message.match[1];
    console.log("name sentence is:", message.text)
    console.log("name to be stored is", name, "message match array is", message.match)
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
            bot.startConversation(message, function(err, convo) {
                convo.say('You can test my memory by asking me what your name is, or asking me what my name is');
            });
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name + ", how about you ask me what my name is");
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [{
                            pattern: 'yes',
                            callback: function(response, convo) {
                                // since no further messages are queued after this,
                                // the conversation will end naturally with status == 'completed'
                                convo.next();
                            }
                        }, {
                            pattern: 'no',
                            callback: function(response, convo) {
                                // stop the conversation. this will cause it to end with status == 'stopped'
                                convo.stop();
                            }
                        }, {
                            default: true,
                            callback: function(response, convo) {
                                convo.repeat();
                                convo.next();
                            }
                        }]);

                        convo.next();

                    }, { 'key': 'nickname' }); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(["because", "my"], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    bot.reply(message, "Ouch ! that must be harsh");
});

controller.hears(["I am feeling (.*)", "I'm feeling (.*)", "I am (.*)"], 'message_received', function(bot, message) {
    var feelings = message.match[1];
    console.log('User said', message.text);
    console.log("User is feeling", feelings)
    replytoUser.feelings(bot, message, feelings, controller)
});

controller.hears(["(.*)hasan(.*)"], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    replytoUser.master(bot, message)
});

controller.hears(["robot"], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    replytoUser.robot(bot, message)
});

controller.hears(["how old are you"], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    bot.reply(message, "Oh I see you are interested, I am almost one day old");
});

controller.hears(["favourite food", "food you like", "food"], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    bot.reply(message, "Hmmm.. as a robot, I can't say I have much to say about food though I'd like to try some one day");
});

controller.hears(['abu3ali(.*)', 'abu ali(.*)', 'abood(.*)', 'asem(.*)', 'janem(.*)', 'أبوعلي(.*)'], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    replytoUser.friends(bot, message)
        // bot.reply(message, 'يا رجل انساك منه هاد مدمن');
});

controller.hears(['structured'], 'message_received', function(bot, message) {
    console.log('User said', message.text);
    bot.startConversation(message, function(err, convo) {
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [{
                        'title': 'Classic White T-Shirt',
                        'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                        'subtitle': 'Soft white cotton t-shirt is back in style',
                        'buttons': [{
                            'type': 'web_url',
                            'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                            'title': 'View Item'
                        }, {
                            'type': 'web_url',
                            'url': 'https://petersapparel.parseapp.com/buy_item?item_id=100',
                            'title': 'Buy Item'
                        }, {
                            'type': 'postback',
                            'title': 'Bookmark Item',
                            'payload': 'White T-Shirt'
                        }]
                    }, {
                        'title': 'Classic Grey T-Shirt',
                        'image_url': 'http://petersapparel.parseapp.com/img/item101-thumb.png',
                        'subtitle': 'Soft gray cotton t-shirt is back in style',
                        'buttons': [{
                            'type': 'web_url',
                            'url': 'https://petersapparel.parseapp.com/view_item?item_id=101',
                            'title': 'View Item'
                        }, {
                            'type': 'web_url',
                            'url': 'https://petersapparel.parseapp.com/buy_item?item_id=101',
                            'title': 'Buy Item'
                        }, {
                            'type': 'postback',
                            'title': 'Bookmark Item',
                            'payload': 'Grey T-Shirt'
                        }]
                    }]
                }
            }
        }, function(response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next();
        });
    });
});

controller.on('facebook_postback', function(bot, message) {

    bot.reply(message, 'Great Choice!!!! (' + message.payload + ')');

});





controller.hears(['haha(.*)', 'hehe(.*)', 'هه(.*)'], 'message_received', function(bot, message) {
    console.log("User is laughing", message.text)
    replytoUser.funny(bot, message, controller)
});

controller.hears(['bitch(.*)', 'fuck(.*)', 'ass(.*)', 'fucking', 'asshole', 'cunt', 'stupid', 'idiot'], 'message_received', function(bot, message) {
    console.log("User is cursing", message.text)
    replytoUser.dirtyTalk(bot, message, controller)
});

controller.hears(['(.*)haleebi(.*)'], 'message_received', function(bot, message) {
    console.log("Ellen is the user :P", message.text)
    bot.reply(message, 'Did you know that haleebi means "my milk" in Arabic?');
});

controller.hears(['(.*)impressed', '(.*)clever', '(.*)wow(.*)', '(.*)impressive', "(.*)cool(.*)", "(.*)nice(.*)", 'funny'], 'message_received', function(bot, message) {
    console.log("User is impressed", message.text)
    replytoUser.impressed(bot, message, controller)
});

controller.hears(['how are you(.*)'], 'message_received', function(bot, message) {
    bot.reply(message, "You know, some ups and downs. Sometimes I feel like I'm not alive");
    bot.startConversation(message, function(err, convo) {
        convo.say('Anywho, how are you?');
    });

});

controller.hears(['how am I feeling', 'what am i like', 'what am i', 'how do i feel'], 'message_received', function(bot, message) {
    console.log("User wants to know how they are feeling", message.text)
    mood.get(bot, message, controller)
});

controller.hears(['weather', 'music', 'gym', 'boyfriend', 'married', 'single'], 'message_received', function(bot, message) {
    console.log("repetitive questions that are not handled yet", message.text)
    replytoUser.unhandledButCommon(bot, message, controller)
});

controller.hears(['shutdown'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [{
            pattern: bot.utterances.yes,
            callback: function(response, convo) {
                convo.say('Bye!');
                convo.next();
                setTimeout(function() {
                    process.exit();
                }, 3000);
            }
        }, {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you(.*)', 'what is your name(.*)', "what's your name"], 'message_received',
    function(bot, message) {
        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());
        bot.reply(message,
            'My name is Reek, and soon I will take over the world!');

        bot.startConversation(message, function(err, convo) {
            convo.say('How are you feeling?');
        });
    });


controller.on('message_received', function(bot, message) {
    console.log("User said:", message.text, "which is still not handled yet")
    bot.reply(message, 'Hmm, I am still unaware of what "' + message.text + '" means, how about we try something else?');
    awkwardness++;

    if (awkwardness > 2) {
        bot.startConversation(message, function(err, convo) {
            convo.say("Well this is awkward, I feel like I'm not ready to be out there yet");
        });
    } else {
        bot.startConversation(message, function(err, convo) {
            convo.say("This doesn't have to be awkward try tallking to me");
        });
    }
    return false;
});


function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
