const db = require("quick.db");

const errorEmbed = require("../utils/errorEmbed");
const stringBoard = require("../utils/stringBoard");

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, Client } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('board')
		.setDescription('To See The GameBoard'),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
    */
	async execute(client, interaction) {
        if (!db.get(interaction.user.id)||db.get(interaction.user.id)?.status=="ended")return errorEmbed(interaction,`**No Ongoing Game!**\nuse /start to start new game`);
        const user = db.get(interaction.user.id);
        const wordleEmbed = new MessageEmbed().setDescription(`
        ${await stringBoard(user.gameBoard)}\n
        **🎲Guesses Left**:${leftGuesses}\n
        **👤Player**: ${interaction.user}
        `).setColor('BLURPLE')
        await interaction.reply({ embeds: [wordleEmbed] });
	},
};