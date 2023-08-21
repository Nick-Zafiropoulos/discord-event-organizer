const {
    SlashCommandBuilder,
    GuildScheduledEvent,
    GuildScheduledEventManager,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
} = require('discord.js');

// Default 1 day poll duration
let pollDurationHours = 24;
let pollDuration = 8.64e7;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('POLL DURATION')
        .addStringOption((option) =>
            option
                .setName('pollduration')
                .setDescription('How long will the poll run for? (Example: "24" is a day)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const hoursOption = interaction.options.getString('pollduration');
        const hoursOptionNum = Number(hoursOption);

        pollDuration = hoursOptionNum * 3.6e6;
        console.log(pollDuration);
        await interaction.reply('Pong!!');
    },
};
