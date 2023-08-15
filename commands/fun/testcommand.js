const { SlashCommandBuilder } = require('discord.js');

// .addStringOption((option) => option.setName('second').setDescription('The input to echo back'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testcomm')
        .setDescription('is this where the description is?')
        .addStringOption((option) => option.setName('first').setDescription('The input to echo back')),

    async execute(interaction) {
        const testvar = interaction.options.get('first');
        console.log(testvar);
        await interaction.reply(testvar.value);
    },
};
