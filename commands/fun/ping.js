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

        const guildID = '1139307145301610537';
        const guild = await interaction.client.guilds.cache.get(guildID);

        if (!guild) return console.log('Guild not found');

        const event_manager = new GuildScheduledEventManager(guild);

        await event_manager.create({
            name: 'Test Event',
            scheduledStartTime: new Date('2023-09-24T00:00:00+05:30'),
            privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
            entityType: GuildScheduledEventEntityType.Voice,
            description: 'This is a test Scheduled Event',
            channel: '1139307145771368481',
            image: null,
            reason: 'Testing with creating a Scheduled Event',
        });
    },
};
