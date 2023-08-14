const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder,
    ComponentType,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('eopoll').setDescription('Create a poll to schedule an event.'),

    async execute(interaction) {
        // Gather data for use in message
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        // Set up buttons
        const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Success);
        const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);

        // Set up select menus
        const pollChoiceCount = new StringSelectMenuBuilder()
            .setCustomId('pollChoiceCount')
            .setPlaceholder('Select a value')
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel('1').setValue('1'),
                new StringSelectMenuOptionBuilder().setLabel('2').setValue('2'),
                new StringSelectMenuOptionBuilder().setLabel('3').setValue('3'),
                new StringSelectMenuOptionBuilder().setLabel('4').setValue('4'),
                new StringSelectMenuOptionBuilder().setLabel('5').setValue('5'),
                new StringSelectMenuOptionBuilder().setLabel('6').setValue('6'),
                new StringSelectMenuOptionBuilder().setLabel('7').setValue('7'),
                new StringSelectMenuOptionBuilder().setLabel('8').setValue('8'),
                new StringSelectMenuOptionBuilder().setLabel('9').setValue('9'),
                new StringSelectMenuOptionBuilder().setLabel('10').setValue('10')
            );

        const monthSelect = new StringSelectMenuBuilder()
            .setCustomId('monthSelect')
            .setPlaceholder('Choose a month')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('January')

                    .setValue('January'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('February')

                    .setValue('February'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('March')

                    .setValue('March')
            );

        const daySelect = new StringSelectMenuBuilder()
            .setCustomId('daySelect')
            .setPlaceholder('Choose a day')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('1')

                    .setValue('1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('2')

                    .setValue('2'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('3')

                    .setValue('3')
            );

        // Send buttons to row
        const buttonRow = new ActionRowBuilder().addComponents(cancel, confirm);
        const choiceDropdown = new ActionRowBuilder().addComponents(pollChoiceCount);
        const monthDropdown = new ActionRowBuilder().addComponents(monthSelect);

        const response = await interaction.reply({
            //Content of message that actually gets sent
            content: 'How many options do you want for your poll?',
            components: [choiceDropdown, monthDropdown],
        });

        //MULTIPLE RESPONSE FIELDS
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000,
        });

        const selectionsArr = [];

        collector.on('collect', async (i) => {
            const selection = i.values[0];
            selectionsArr.push(selection);

            // await i.update(`${i.user} has selected ${selection}!`);

            await i.update({
                content: `${selectionsArr}`,
                components: [choiceDropdown],
            });
        });

        // //UPDATED AFTER OPTION SELECT
        // const collector = response.createMessageComponentCollector({
        //     componentType: ComponentType.StringSelect,
        //     time: 3_600_000,
        // });

        // collector.on('collect', async (i) => {
        //     const selection = i.values[0];
        //     await i.reply(`${i.user} has selected ${selection}!`);
        // });

        // SINGLE RESPONSE FIELD
        // const collectorFilter = (i) => i.user.id === interaction.user.id;

        // try {
        //     const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

        //     if (confirmation. === '1') {
        //         await confirmation.update({
        //             content: 'Choose a date',
        //             components: [dateDropdown, buttonRow],
        //         });
        //     } else if (confirmation.customId === 'cancel') {
        //         await confirmation.update({ content: 'Event creation has been cancelled.', components: [] });
        //     }
        // } catch (e) {
        //     await interaction.editReply({
        //         content: 'Confirmation not received within 1 minute, poll has been cancelled.',
        //         components: [],
        //     });
        // }
    },
};
