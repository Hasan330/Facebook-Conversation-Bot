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
    page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node facebook_bot.js
  Use localtunnel.me to make your bot available on the web:
    lt --port 3000
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

var greetings = ['hello', 'hi', 'hey'];

var users = {
        'user_id1' : {
            'category' : '',
            'destination':'',
            'dates':''
        },
        'user_id2' : {

        }
}
// var showCategories = require('./showCategories.js');

if (!process.env.page_token) {
    console.log('Error: Specify page_token in environment');
    process.exit(1);
}

if (!process.env.verify_token) {
    console.log('Error: Specify verify_token in environment');
    process.exit(1);
}


var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.facebookbot({
    debug: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});

// function identifyUser(userId) {
//
//     if (!currentState[userId]) {
//         currentState[userId] = {};
//     }
//
// }


controller.hears(['hello', 'hi', 'hey'], 'message_received', function(bot, message) {

    console.log(message);
    console.log(message.user);

    // identifyUser(message.user);

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        }
        bot.reply(message, 'Hey, I can plan your trip, what kind of vacation?');
        bot.reply(message, {
          attachment: {
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Please select a category?",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Honey Moon",
                  "payload":"HoneyMoon"
                },
                {
                  "type":"postback",
                  "title":"العشره الاواخر",
                  "payload":"last10"
                },
                {
                  "type":"postback",
                  "title":"رمضان",
                  "payload":"Ramadan"
                }
              ]
            }
        }
        });
    });
});




function handleCategoriesSelection(message) {
  users[message.user].category = message.payload;
}
//
// var askDestination = function(bot) {
//
//   // bot.startConversation(message, function(err, convo) {
//   //                 if (!err) {
//   //                     convo.ask('Where do youb like to go??', function(response, convo) {
//   //                         // save city
//   //                         askDates(convo);
//   //                     });
//   //                 }
//   // }
// }
//
// function askDates(convo) {
//
//     // get the dates
//     // show matching packages
//     //
// }

// controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function(bot, message) {
//     var name = message.match[1];
//     controller.storage.users.get(message.user, function(err, user) {
//         if (!user) {
//             user = {
//                 id: message.user,
//             };
//         }
//         user.name = name;
//         controller.storage.users.save(user, function(err, id) {
//             bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
//         });
//     });
// });

// controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {
//     controller.storage.users.get(message.user, function(err, user) {
//         if (user && user.name) {
//             bot.reply(message, 'Your name is ' + user.name);
//         } else {
//             bot.startConversation(message, function(err, convo) {
//                 if (!err) {
//                     convo.say('I do not know your name yet!');
//                     convo.ask('What should I call you?', function(response, convo) {
//                         convo.ask('You want me to call you `' + response.text + '`?', [
//                             {
//                                 pattern: 'yes',
//                                 callback: function(response, convo) {
//                                     // since no further messages are queued after this,
//                                     // the conversation will end naturally with status == 'completed'
//                                     convo.next();
//                                 }
//                             },
//                             {
//                                 pattern: 'no',
//                                 callback: function(response, convo) {
//                                     // stop the conversation. this will cause it to end with status == 'stopped'
//                                     convo.stop();
//                                 }
//                             },
//                             {
//                                 default: true,
//                                 callback: function(response, convo) {
//                                     convo.repeat();
//                                     convo.next();
//                                 }
//                             }
//                         ]);
//
//                         convo.next();
//
//                     }, {'key': 'nickname'}); // store the results in a field called nickname
//
//                     convo.on('end', function(convo) {
//                         if (convo.status == 'completed') {
//                             bot.reply(message, 'OK! I will update my dossier...');
//
//                             controller.storage.users.get(message.user, function(err, user) {
//                                 if (!user) {
//                                     user = {
//                                         id: message.user,
//                                     };
//                                 }
//                                 user.name = convo.extractResponse('nickname');
//                                 controller.storage.users.save(user, function(err, id) {
//                                     bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
//                                 });
//                             });
//
//
//
//                         } else {
//                             // this happens if the conversation ended prematurely for some reason
//                             bot.reply(message, 'OK, nevermind!');
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });
//