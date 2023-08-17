const {
    SlashCommandBuilder,
    PermissionFlagsBits,
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
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Select a member and ban them.')
        .addStringOption((option) =>
            option.setName('title').setDescription('What is the title of your event?').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('votestowin')
                .setDescription('How many votes does an option need to win the poll?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('option1')
                .setDescription('Specify a date and time (EXAMPLE: 5/16/2023 5:00 PM)')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('option2').setDescription('Specify a date and time (EXAMPLE: 5/16/2023 5:00 PM)')
        )
        .addStringOption((option) =>
            option.setName('option3').setDescription('Specify a date and time (EXAMPLE: 5/16/2023 5:00 PM)')
        )
        .addStringOption((option) =>
            option.setName('option4').setDescription('Specify a date and time (EXAMPLE: 5/16/2023 5:00 PM)')
        )
        .addStringOption((option) =>
            option.setName('option5').setDescription('Specify a date and time (EXAMPLE: 5/16/2023 5:00 PM)')
        )
        // .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction) {
        // Set up options for slash command
        const title = interaction.options.getString('title');
        const votestowin = interaction.options.getString('votestowin') ?? 'No reason provided';
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');
        const option3 = interaction.options.getString('option3');
        const option4 = interaction.options.getString('option4');
        const option5 = interaction.options.getString('option5');
        const optionsArr = [option1];
        const emojiArr = ['1️⃣'];
        const reactionNums = [':one:', ':two:', ':three:', ':four:', ':five:'];
        const embedOptionsArr = [];
        const formattedDates = [];

        // Set up options arrays based on how many options were actually submitted
        if (option2 !== null) {
            emojiArr.push('2️⃣');
            optionsArr.push(option2);
        }
        if (option3 !== null) {
            emojiArr.push('3️⃣');
            optionsArr.push(option3);
        }
        if (option4 !== null) {
            emojiArr.push('4️⃣');
            optionsArr.push(option4);
        }
        if (option5 !== null) {
            emojiArr.push('5️⃣');
            optionsArr.push(option5);
        }
        console.log(emojiArr);
        console.log(optionsArr);

        // Set allowable date input formats and how they are reformatted for the poll embed
        for (i = 0; i < optionsArr.length; i++) {
            let pushDate = dayjs(`${optionsArr[i]}`, [
                'M-D-YYYY h:mm A',
                'M/D/YYYY h A',
                'MMM-D-YYYY',
                'M/D/YYYY',
                'MMM/D/YYYY',
            ]).format('dddd MMMM Do, YYYY @ h:mm A');
            formattedDates.push(pushDate);
        }

        console.log(formattedDates);

        // Create the array of options that will be shown in the poll embed
        for (let i = 0; i < optionsArr.length && i < 5; i++) {
            embedOptionsArr.push([reactionNums[i], formattedDates[i]]);
        }

        // Set up poll options by checking length of options array, then add the numbers to it with a for loop
        console.log(embedOptionsArr[0][1]);
        const displayOptions = embedOptionsArr.join('\n').replaceAll(',', ' ');
        // await interaction.reply(`${option1} ${option2} ${option3}`);

        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            // .setDescription('')
            .setColor('Random')
            .addFields({
                name: 'Respond to this event poll by selecting all options that work for you:',
                // value: `${displayOptions}`,
                value: `${displayOptions}`,
                inline: true,
            });

        // Create reactions for poll responses
        if (!interaction.isChatInputCommand()) return;

        const { commandName } = interaction;

        if (commandName === 'poll') {
            const message = await interaction.reply({
                embeds: [embed],
                fetchReply: true,
            });
            try {
                for (let i = 0; i < emojiArr.length; i++) {
                    await message.react(emojiArr[i]);
                }
            } catch (error) {
                console.error('One of the emojis failed to react:', error);
            }

            // Collect poll responses through reactions
            const collectorFilter = (reaction, user) => {
                return emojiArr.includes(reaction.emoji.name) && user.id === interaction.user.id;
            };

            message
                .awaitReactions({ filter: collectorFilter, max: 4, time: 60000, errors: ['time'] })
                .then((collected) => console.log(collected.size))
                .catch((collected) => {
                    console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
                });
        }
    },
};
