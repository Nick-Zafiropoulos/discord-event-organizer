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
    EmbedBuilder,
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
        const eventOrganizerReqResponses = new TextInputBuilder({
            customId: 'eventOrganizerReqResponses',
            label: 'How many responses are required?',
            style: TextInputStyle.Short,
        });

        const inputFieldRow = new ActionRowBuilder().addComponents(eventOrganizerInput);
        const inputFieldRowResponses = new ActionRowBuilder().addComponents(eventOrganizerReqResponses);

        modal.addComponents(inputFieldRow, inputFieldRowResponses);

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

        if (interaction.awaitModalSubmit) {
            interaction.awaitModalSubmit({ filter, time: 90_000 }).then((modalInteraction) => {
                const eventOrganizerInputValue = modalInteraction.fields.getTextInputValue('eventOrganizerInput');
                const eventOrganizerReqResponsesValue =
                    modalInteraction.fields.getTextInputValue('eventOrganizerReqResponses');
                const optionsArr = eventOrganizerInputValue.split('\n');
                console.log(optionsArr);
                console.log(eventOrganizerReqResponsesValue);

                const reactionNums = [':one:', ':two:', ':three:', ':four:', ':five:'];

                const embedOptionsArr = reactionNums.map(function (e, i) {
                    return [e, optionsArr[i]];
                });

                // Set up poll options by checking length of options array, then add the numbers to it with a for loop
                console.log(embedOptionsArr[0][1]);
                const displayOptions = embedOptionsArr.join('\n').replaceAll(',', ' ');

                const embed = new EmbedBuilder()
                    .setTitle('Event Organizer Poll')
                    // .setDescription('')
                    .setColor('Random')
                    .addFields({
                        name: 'Respond to this event poll by selecting all options that work for you:',
                        value: `${displayOptions}`,
                        inline: true,
                    });

                modalInteraction.reply({
                    embeds: [embed],
                });

                // modalInteraction.reply({
                //     content: `${optionsArr}\n\n How many responses are required?`,
                //     components: [choiceDropdown],
                // });

                // MANIPULATE THE DATA INTO PRESENTABLE EMBED WITH VOTING
            });
        }
        //  else if (interaction) {
        //     const response = await interaction.reply({
        //         //Content of message that actually gets sent
        //         content: 'How many options do you want for your poll?',
        //         components: [choiceDropdown],
        //     });

        //     //MULTIPLE RESPONSE FIELDS
        //     const collector = response.createMessageComponentCollector({
        //         componentType: ComponentType.StringSelect,
        //         time: 3_600_000,
        //     });

        //     const selectionsArr = [];

        //     collector.on('collect', async (i) => {
        //         const selection = i.values[0];
        //         selectionsArr.push(selection);

        //         // await i.update(`${i.user} has selected ${selection}!`);

        //         await i.update({
        //             content: `${selectionsArr}`,
        //             components: [choiceDropdown],
        //         });
        //     });
        // }
    },
};
