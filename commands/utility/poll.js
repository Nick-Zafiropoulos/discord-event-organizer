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
        const votestowin = interaction.options.getString('votestowin');
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
        const reactionData = [
            { name: '1️⃣', count: 0 },
            { name: '2️⃣', count: 0 },
            { name: '3️⃣', count: 0 },
            { name: '4️⃣', count: 0 },
            { name: '5️⃣', count: 0 },
        ];

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
            const uniqueReactsArr = [];
            const collectorFilter = (reaction, user) => {
                if (uniqueReactsArr.indexOf(user.id) == -1 && user.id !== message.author.id) {
                    uniqueReactsArr.push(user.id);
                    console.log(uniqueReactsArr);
                }
                console.log(message.author.id);

                return emojiArr.includes(reaction.emoji.name) && user.id !== message.author.id;
                // return emojiArr.includes(reaction.emoji.name) && user.id === interaction.user.id;
            };

            const collector = message.createReactionCollector({ filter: collectorFilter, time: 15000 });

            let winningOption;
            let timeout = true;

            collector.on('collect', (reaction, user) => {
                if (uniqueReactsArr.indexOf(user.id) == -1 && user.id !== message.author.id) {
                    uniqueReactsArr.push(user.id);
                    console.log(uniqueReactsArr);
                }
                console.log(message.author.id);

                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

                if (user.id !== message.author.id) {
                    switch (reaction.emoji.name) {
                        case '1️⃣':
                            reactionData[0].count++;
                            break;
                        case '2️⃣':
                            reactionData[1].count++;
                            break;
                        case '3️⃣':
                            reactionData[2].count++;
                            break;
                        case '4️⃣':
                            reactionData[3].count++;
                            break;
                        case '5️⃣':
                            reactionData[4].count++;
                            break;
                    }
                }

                // Compare votes against total vote count required for an option to win
                if (reactionData[0].count == votestowin) {
                    winningOption = formattedDates[0];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[1].count == votestowin) {
                    winningOption = formattedDates[1];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[2].count == votestowin) {
                    winningOption = formattedDates[2];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[3].count == votestowin) {
                    winningOption = formattedDates[3];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[4].count == votestowin) {
                    winningOption = formattedDates[4];
                    timeout = false;
                    collector.stop();
                } else {
                }
            });

            collector.on('end', (collected) => {
                if (timeout == true) {
                    console.log(`No option reached the required amount of votes, poll cancelled.`);
                    timeout = false;
                    winningOption = '';
                } else {
                    console.log(`Collected ${collected} items and the winning date is ${winningOption}`);
                    message.reply(`The winning date is ${winningOption}`);
                    timeout = false;
                    winningOption = '';
                }
            });
        }
    },
};
