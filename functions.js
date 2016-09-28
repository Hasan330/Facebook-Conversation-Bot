module.exports = {
    userData: function(bot, message, controller) {

        controller.storage.users.get(message.user, function(err, user) {
            var user = {
                id: message.user,
            };
            console.log("User Details:", user.name, user.id)
            return user;
        });

        // var user = msg.user
        // console.log("User Details:", user.name, user.id)
    },
};
