const { SlashCommandBuilder } = require('discord.js');

const abc = new SlashCommandBuilder()
    .setName('testcomm')
    .setDescription('is this where the description is?')
    .addStringOption((option) => option.setName('itsits').setDescription('The input to echo back'));

module.exports = {
    data: abc,

    async execute(interaction) {
        const testvar = interaction.options.get('itsits');
        console.log(testvar);
        await interaction.reply(testvar.value);
    },
};
