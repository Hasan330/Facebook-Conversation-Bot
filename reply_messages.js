var mood = require("./user_mood.js")
var laughCount = 0;
var func = require("./functions.js")

module.exports = {
    funny: function(bot, message, controller) {
        // user= func.userData(bot, message, controller);
        // console.log("user:", user)
        laughCount++;
        console.log("User has laughed", laughCount, "time(s) this conversation")
        mood.set("having fun seeing that you are laughing", bot, controller, message, laughCount)
        if (laughCount > 2) {
            console.log("User is laughing a lot");
            bot.reply(message, "I see you have laughed " + laughCount + " times this conversation alone, that makes me proud! :D :D");
        } else {
            var random = Math.floor(Math.random() * (4 - 0 + 1));
            console.log("Responding with funny response number", random)
            var responses = ["glad to see you have a sense of humor :D ", "You found that to be funny, excellent!", ":D :D", "hehe", "http://giphy.com/gifs/the-simpsons-bart-simpson-lisa-Y5GVgQZCluUWQ"]
            bot.reply(message, responses[random]);

            bot.startConversation(message, function(err, convo) {
                convo.say("You know I am an excellent judge of character, I bet you 10 bucks I can tell how you're feeling, just ask");
            });

        }
    },

    greeting: function(bot, message, controller) {

    },

    friends: function(bot, message, controller) {
        bot.reply(message, 'يا رجل انساك منه هاد مدمن');
    },

    unhandledButCommon: function(bot, message, controller){
    	 bot.reply(message, "The weather is beautiful, wear some sunglasses!");
    },

    impressed: function(bot, message, controller) {
        var random = Math.floor(Math.random() * (3 - 0 + 1));
        var responses = ["I know right!", "Thank you, thank you", "I still have plenty left in stores", "that was nice of you to say :D"];
        console.log("Responding with impressed response number", random)
        bot.reply(message, responses[random]);

        mood.set("impressed", controller)
        bot.startConversation(message, function(err, convo) {
            convo.say("You know I can actually tell how you're feeling, just ask");
        });
    },

    feelings: function(bot, message, feelings, controller) {
        bot.reply(message, "Really? Why are you feeling " + feelings + "?");
        mood.set(feelings, controller)
    },

    robot: function(bot, message, controller) {
        bot.reply(message, "As a robot, this makes me feel so offended !");
    },

    master: function(bot, message, controller) {
        bot.reply(message, "I will not speak ill of my master");
    },

    dirtyTalk: function(bot, message, controller) {
        var random = Math.floor(Math.random() * (3 - 0 + 1));
        var responses = ["You just hurt my feelings", "Mrs Robot will not be happy to hear that", "Fuck you bitch", "You have anger management issues", "Wanna fight, tough guy?"];
        console.log("Responding with curse response number", random)
        bot.reply(message, responses[random]);
        mood.set("aggressive and insecure", controller)

        bot.startConversation(message, function(err, convo) {
            convo.say("You know I can actually tell how you're feeling, just ask");
        });
    }
}
