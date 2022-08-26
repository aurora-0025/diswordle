const db = require("quick.db");

const errorEmbed = require("../utils/errorEmbed");
const stringBoard = require("../utils/stringBoard");

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, Client } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('To See The Stats Of A Player')
        .addUserOption(option =>
            option.setName("target")
                .setDescription("The User Whose Stats Is To Be Retrieved")
        ),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
    */
	async execute(client, interaction) {
        let user = interaction.user
        if(interaction.options.getUser('target')){
            user = interaction.options.getUser('target');
        }
        
        if(!db.get(user.id)){
            return errorEmbed(interaction,`User ${user} haven't played any games yet`)
        }
        const {wins, losses, maxStreak, streak} = db.get(user.id);
        const statsEmbed = new MessageEmbed()
        .setTitle('STATS')
        .setDescription(`${interaction.user}\n**Total Played**:${wins+losses}\n**Wins**:${wins}\n**Losses**:${losses}\n**Current Streak**:${streak}\n**Max Streak**:${maxStreak}`)
        .setColor('BLURPLE')
        .setThumbnail()
        interaction.reply({embeds:[statsEmbed]})
	},
};