const { Client, IntentsBitField } = require('discord.js');
const dotenv = require('dotenv').config();

const botClient = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

botClient.on('ready', (client) => {
    console.log(`${client.user.username} is available.`);
});

botClient.on('messageCreate', (message) => {
    console.log(message.content);
});

botClient.login(process.env.BOT_TOKEN);
