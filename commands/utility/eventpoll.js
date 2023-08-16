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
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Client,
    GatewayIntentBits,
} = require('discord.js');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
var advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

module.exports = {
    data: new SlashCommandBuilder().setName('eventpoll').setDescription('Create a poll to schedule an event'),

    async execute(interaction) {
        const modal = new ModalBuilder({
            customId: `eventModal-${interaction.user.id}`,
            title: 'Event Organizer Poll',
        });

        const eventOrganizerInput = new TextInputBuilder({
            customId: 'eventOrganizerInput',
            label: 'Enter the options for your poll (Max 5)',
            style: TextInputStyle.Paragraph,
        });
        const eventOrganizerReqResponses = new TextInputBuilder({
            customId: 'eventOrganizerReqResponses',
            label: 'Number of votes needed for an option to win?',
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

        const oneButton = new ButtonBuilder().setCustomId('oneButton').setLabel('1').setStyle(ButtonStyle.Secondary);
        const twoButton = new ButtonBuilder().setCustomId('twoButton').setLabel('2').setStyle(ButtonStyle.Secondary);
        const threeButton = new ButtonBuilder()
            .setCustomId('threeButton')
            .setLabel('3')
            .setStyle(ButtonStyle.Secondary);
        const fourButton = new ButtonBuilder().setCustomId('fourButton').setLabel('4').setStyle(ButtonStyle.Secondary);
        const fiveButton = new ButtonBuilder().setCustomId('fiveButton').setLabel('5').setStyle(ButtonStyle.Secondary);

        const buttonRow = new ActionRowBuilder();
        // .addComponents(
        //     oneButton,
        //     twoButton,
        //     threeButton,
        //     fourButton,
        //     fiveButton
        // );

        const choiceDropdown = new ActionRowBuilder().addComponents(pollChoiceCount);

        await interaction.showModal(modal);

        const filter = (interaction) => interaction.customId === `eventModal-${interaction.user.id}`;

        if (interaction.awaitModalSubmit) {
            interaction.awaitModalSubmit({ filter, time: 90_000 }).then((modalInteraction) => {
                const eventOrganizerInputValue = modalInteraction.fields.getTextInputValue('eventOrganizerInput');
                const eventOrganizerReqResponsesValue =
                    modalInteraction.fields.getTextInputValue('eventOrganizerReqResponses');

                // Create array based on modal input
                const optionsArr = eventOrganizerInputValue.split('\n');
                const reactionNums = [':one:', ':two:', ':three:', ':four:', ':five:'];

                console.log(optionsArr);

                console.log(eventOrganizerReqResponsesValue);

                const formattedDates = [];
                for (i = 0; i < optionsArr.length; i++) {
                    let pushDate = dayjs(`${optionsArr[i]}`, [
                        'M-D-YYYY h:mm A',
                        'MMM-D-YYYY',
                        'M/D/YYYY',
                        'MMM/D/YYYY',
                    ]).format('dddd MMMM Do, YYYY @ h:mm A');
                    formattedDates.push(pushDate);
                }

                const embedOptionsArr = [];
                for (let i = 0; i < optionsArr.length && i < 5; i++) {
                    embedOptionsArr.push([reactionNums[i], formattedDates[i]]);
                }

                console.log(formattedDates);

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

                if (optionsArr.length == 1) {
                    buttonRow.addComponents(oneButton);
                } else if (optionsArr.length == 2) {
                    buttonRow.addComponents(oneButton, twoButton);
                } else if (optionsArr.length == 3) {
                    buttonRow.addComponents(oneButton, twoButton, threeButton);
                } else if (optionsArr.length == 4) {
                    buttonRow.addComponents(oneButton, twoButton, threeButton, fourButton);
                } else if (optionsArr.length == 5) {
                    buttonRow.addComponents(oneButton, twoButton, threeButton, fourButton, fiveButton);
                }

                const response = modalInteraction.reply({
                    embeds: [embed],
                    components: [buttonRow],
                });

                // MANIPULATE THE DATA INTO PRESENTABLE EMBED WITH VOTING
            });
        }
    },
};
