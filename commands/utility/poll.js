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
    GuildScheduledEvent,
    GuildScheduledEventManager,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventEntityType,
    MessageReaction,
} = require('discord.js');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
var advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

module.exports = {
    // Builds the poll command including all input options available to user.
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
                .setName('pollduration')
                .setDescription('How long will the poll run for? (Example: "24" is a day)')
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
        .setDMPermission(false),

    async execute(interaction) {
        // Gather data from users inputs during slash command.
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
        const isoDatesArr = [];
        const reactionData = [
            { name: '1️⃣', count: 0 },
            { name: '2️⃣', count: 0 },
            { name: '3️⃣', count: 0 },
            { name: '4️⃣', count: 0 },
            { name: '5️⃣', count: 0 },
        ];
        const cancelArr = ['❌'];
        let cancelReaction = false;

        // Set duration of poll in milliseconds.
        const hoursOption = interaction.options.getString('pollduration');
        const hoursOptionNum = Number(hoursOption);
        const pollDuration = hoursOptionNum * 3.6e6;

        // Error handling for incorrect votestowin and pollduration inputs.
        const votestowinNum = Number(votestowin);
        if (Number.isNaN(votestowinNum)) {
            await interaction.reply({
                content: 'The value entered in the "votestowin" field was not valid, please try again.',
                ephemeral: true,
            });
        }
        if (Number.isNaN(hoursOptionNum)) {
            await interaction.reply({
                content: 'The value entered in the "pollduration" field was not valid, please try again.',
                ephemeral: true,
            });
        }
        if (hoursOptionNum > 168 || hoursOptionNum <= 0) {
            await interaction.reply({
                content:
                    'The value entered in the "pollduration" field was outside of allowable limits, please enter a different duration.',
                ephemeral: true,
            });
        }

        // Set up options arrays based on how many options were actually submitted.
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
        emojiArr.push('❌');

        // Set allowable date input formats and how they are reformatted for the poll embed.
        for (i = 0; i < optionsArr.length; i++) {
            try {
                let pushDate = dayjs(`${optionsArr[i]}`, [
                    'M-D-YYYY h:mm A',
                    'M/D/YYYY h A',
                    'MMM-D-YYYY',
                    'M/D/YYYY',
                    'MMM/D/YYYY',
                ]).format('dddd MMMM Do, YYYY @ h:mm A');
                formattedDates.push(pushDate);
                let isoDatesFormat = dayjs(`${optionsArr[i]}`, [
                    'M-D-YYYY h:mm A',
                    'M/D/YYYY h A',
                    'MMM-D-YYYY',
                    'M/D/YYYY',
                    'MMM/D/YYYY',
                ]).toISOString();
                isoDatesArr.push(isoDatesFormat);
            } catch (error) {
                console.log(error);
            }
        }

        // Create the array of options that will be shown in the poll embed.
        for (let i = 0; i < optionsArr.length && i < 5; i++) {
            embedOptionsArr.push([reactionNums[i], formattedDates[i]]);
        }

        // Error handling for incorrectly inputted poll options.
        if (formattedDates.indexOf('Invalid Date') !== -1) {
            await interaction.reply({
                content: 'An invalid date was entered for one or more of the poll options. Please try again.',
                ephemeral: true,
            });
        }

        // Format the poll options to look readable to users.
        const displayOptions = embedOptionsArr.join('\n').replaceAll(',', ' ');

        // Create the embed to display poll options.
        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            // .setDescription('')
            .setColor('Random')
            .addFields({
                name: 'Respond to this event poll by selecting all options that work for you:',
                value: `${displayOptions}`,
                inline: true,
            });

        // Create reactions for poll responses.
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
                await message.react(cancelArr[0]);
            } catch (error) {
                console.error('One of the emojis failed to react:', error);
            }

            // Collect poll responses through reactions.
            const uniqueReactsArr = [];
            const collectorFilter = (reaction, user) => {
                if (uniqueReactsArr.indexOf(user.id) == -1 && user.id !== message.author.id) {
                    uniqueReactsArr.push(user.id);
                }

                return emojiArr.includes(reaction.emoji.name) && user.id !== message.author.id;
            };

            const collector = message.createReactionCollector({
                filter: collectorFilter,
                time: pollDuration,
                dispose: true,
            });

            let winningOption;
            let winningIso;
            let timeout = true;

            // Increase vote count when reactions are logged, decrease when reactions are removed.
            // Check against total votes required for an option to win.
            collector.on('collect', (reaction, user) => {
                if (uniqueReactsArr.indexOf(user.id) == -1 && user.id !== message.author.id) {
                    uniqueReactsArr.push(user.id);
                }

                // Increase vote count based on reaction added.
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
                        case '❌':
                            cancelReaction = true;
                            break;
                    }
                }

                // Compare votes against total vote count required for an option to win.
                if (reactionData[0].count == votestowin) {
                    winningOption = formattedDates[0];
                    winningIso = isoDatesArr[0];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[1].count == votestowin) {
                    winningOption = formattedDates[1];
                    winningIso = isoDatesArr[1];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[2].count == votestowin) {
                    winningOption = formattedDates[2];
                    winningIso = isoDatesArr[2];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[3].count == votestowin) {
                    winningOption = formattedDates[3];
                    winningIso = isoDatesArr[3];
                    timeout = false;
                    collector.stop();
                } else if (reactionData[4].count == votestowin) {
                    winningOption = formattedDates[4];
                    winningIso = isoDatesArr[4];
                    timeout = false;
                    collector.stop();
                } else if (cancelReaction == true) {
                    timeout = false;
                    collector.stop();
                } else {
                }
            });

            collector.on('remove', (reaction, user) => {
                // Decrease vote count based on reaction added.
                if (user.id !== message.author.id) {
                    switch (reaction.emoji.name) {
                        case '1️⃣':
                            reactionData[0].count--;
                            break;
                        case '2️⃣':
                            reactionData[1].count--;
                            break;
                        case '3️⃣':
                            reactionData[2].count--;
                            break;
                        case '4️⃣':
                            reactionData[3].count--;
                            break;
                        case '5️⃣':
                            reactionData[4].count--;
                            break;
                    }
                }
            });

            // On termination of poll, decide what happens.
            collector.on('end', (collected) => {
                if (timeout == true) {
                    message.reply(`No option reached the required amount of votes, poll cancelled.`);
                    timeout = false;
                    winningOption = '';
                } else if (cancelReaction == true) {
                    message.reply(`Poll manually cancelled.`);
                    timeout = false;
                    winningOption = '';
                } else {
                    message.reply(`${title} is now scheduled for ${winningOption}.`);

                    const guildID = `${message.guild.id}`;
                    const guild = interaction.client.guilds.cache.get(guildID);

                    if (!guild) return console.log('Guild not found');

                    const event_manager = new GuildScheduledEventManager(guild);

                    event_manager.create({
                        name: `${title}`,
                        scheduledStartTime: new Date(`${winningIso}`),
                        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                        entityType: GuildScheduledEventEntityType.Voice,
                        description: '',
                        channel: `${process.env.EVENT_CHANNEL}`,
                        image: null,
                        reason: 'Testing with creating a Scheduled Event',
                    });

                    timeout = false;
                    winningOption = '';
                }
            });
        }
    },
};
