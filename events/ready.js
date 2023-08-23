const { Events } = require('discord.js');

// This file indicates whether the bot is online.
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${client.user.tag} is available.`);
    },
};
