var userMood = "happy";
var flagSet = false;
module.exports = {
    set: function(mood, bot, controller, message, repetition) {
        userMood = mood;
        console.log("Setting current user feeling to", mood);
        flagSet = true;

        controller.storage.users.get(message.user, function(err, user) {

            user = {
                id: message.user,
                name: user.name,
                userMood: mood,
                moodRepetition: repetition,
            };
            controller.storage.users.save(user, function(err, id) {
                bot.startConversation(message, function(err, convo) {
                    convo.say('Setting user mood to', mood);
                });
            });
        });

    },

    get: function(bot, message, controller) {
        console.log("Usermood is:", userMood);
        if (flagSet) {
            bot.reply(message, "I suppose you are " + userMood + " right now");
        } else {
            bot.reply(message, "Well I'm not a betting man but I could guess that you are " + userMood + " right now");
        }
    }
}
