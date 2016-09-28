module.exports = {
    reply: function(message, reply, profile) {
        if (message == "hey") {
            reply({ text: `Why hello there: ${profile.first_name} ${profile.last_name}!` }, (err) => {
                if (err) throw err

                console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${message}`)
            })
        } else
            reply({ text: `Be more polite ${profile.first_name} ${profile.last_name}!` }, (err) => {
                if (err) throw err

                console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${message}`)
            })
    }
}