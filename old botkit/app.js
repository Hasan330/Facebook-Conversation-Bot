'use strict'
const http = require('http')
const Bot = require('messenger-bot')
var handle = require("./handleMessage")

let bot = new Bot({
    token: 'EAAQA8eJNThwBALBn6mIbdjFmElIRe3IllqEVoIF89UdksnumZCbfOmouKc08VZBGptBEbOc66PRZCOujLa4OF9RAkZCYWUZCtLUBlMFRDffRT2pYZBlA4p7udgVnH9N9GqpZCBPhpEZAH3NZC17I26MPJ91B9WSnZBbg0e3wqf07jaigZDZD',
    verify: 'VERIFY_TOKEN'
})

bot.on('error', (err) => {
    console.log("The error that occured is:", err.message)
})


bot.on('message', (payload, reply) => {
    let text = payload.message.text

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err

        // handleMessage(text, reply, profile);
        var firstName = profile.first_name;
        var lastName = profile.last_name
        console.log("Message recieved from", firstName, lastName, ":", text)

        handle.reply(text, reply, profile)


        // if (text == "hey") {
        //     reply({ text: `Why hello there ${profile.first_name} ${profile.last_name}!` }, (err) => {
        //         if (err) throw err

        //         console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        //     })
        // } else
        //     reply({ text: `be more polite ${profile.first_name} ${profile.last_name}!` }, (err) => {
        //         if (err) throw err

        //         console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
        //     })

    })
})

http.createServer(bot.middleware()).listen(3000)
