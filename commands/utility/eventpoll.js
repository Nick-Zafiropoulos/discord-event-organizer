const {
    SlashCommandBuilder,
    ActionRowBuilder,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('eventpoll').setDescription('Create a poll to schedule an event'),

    async execute(interaction) {
        const modal = new ModalBuilder({
            customId: `eventModal-${interaction.user.id}`,
            title: 'Event Organizer Poll',
        });

        const eventOrganizerInput = new TextInputBuilder({
            customId: 'eventOrganizerInput',
            label: 'Enter the options for your poll',
            style: TextInputStyle.Paragraph,
        });

        const inputFieldRow = new ActionRowBuilder().addComponents(eventOrganizerInput);

        modal.addComponents(inputFieldRow);

        // Choose required response count
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

        const choiceDropdown = new ActionRowBuilder().addComponents(pollChoiceCount);

        await interaction.showModal(modal);

        const filter = (interaction) => interaction.customId === `eventModal-${interaction.user.id}`;
        interaction.awaitModalSubmit({ filter, time: 90_000 }).then((modalInteraction) => {
            const eventOrganizerInputValue = modalInteraction.fields.getTextInputValue('eventOrganizerInput');
            const optionsArr = eventOrganizerInputValue.split('\n');
            console.log(optionsArr);

            modalInteraction.reply({
                content: `${optionsArr}\n\n How many responses are required?`,
                components: [choiceDropdown],
            });

            // MANIPULATE THE DATA INTO PRESENTABLE EMBED WITH VOTING
        });

        const response = await interaction.reply({
            //Content of message that actually gets sent
            content: 'How many options do you want for your poll?',
        });
    },
};
