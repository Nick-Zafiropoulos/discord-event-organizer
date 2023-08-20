const {
    SlashCommandBuilder,
    GuildScheduledEvent,
    GuildScheduledEventManager,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!!'),
    async execute(interaction) {
        await interaction.reply('Pong!!');

        const guildID = '';
        const guild = await interaction.client.guilds.cache.find(guildID);

        if (!guild) return console.log('Guild not found');

        const event_manager = new GuildScheduledEventManager(guild);

        await event_manager.create({
            name: 'Test Event',
            scheduledStartTime: new Date(winningIso),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice,
            description: 'This is a test Scheduled Event',
            channel: '1139307145771368480',
            image: null,
            reason: 'Testing with creating a Scheduled Event',
        });
    },
};
