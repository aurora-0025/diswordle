const db = require("quick.db");

const errorEmbed = require("../utils/errorEmbed");
const stringBoard = require("../utils/stringBoard");
const words = require("../words/words");
const emojis = require("../utils/emojis")

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, Client } = require("discord.js");
const moment = require("moment");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('To Start a new game'),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
    */
	async execute(client, interaction) {
        let guess = 0;
        let leftGuesses = 6;
        let losses = 0;
        let wins = 0;
        let streak = 0;
        let maxStreak = 0;
        const random = Math.floor(Math.random() * words.length);
        const word = words[random]
        console.log(word);
        let gameBoard = [
          [emojis.empty, emojis.empty, emojis.empty, emojis.empty, emojis.empty],
          [emojis.empty, emojis.empty, emojis.empty, emojis.empty, emojis.empty],
          [emojis.empty, emojis.empty, emojis.empty, emojis.empty, emojis.empty],
          [emojis.empty, emojis.empty, emojis.empty, emojis.empty, emojis.empty],
          [emojis.empty, emojis.empty, emojis.empty, emojis.empty, emojis.empty],
          [emojis.empty, emojis.empty, emojis.empty, emojis.empty, emojis.empty],
        ];
        if(db.get(interaction.user.id)){
          if(moment() <  (moment(db.get(interaction.user.id)?.nextGameTime))) return errorEmbed(interaction,`You can play again `+ moment(db.get(interaction.user.id).nextGameTime).fromNow())
        }
        if (!db.get(interaction.user.id)||db.get(interaction.user.id)?.status=="ended") {
          let user = db.get(interaction.user.id)     
          if(user!=null){
            wins = user.wins;
            losses = user.losses;
            streak = user.streak;
            maxStreak = user.streak;
          }
          const wordleEmbed = new MessageEmbed().setDescription(`
                    ${await stringBoard(gameBoard)}\n
                    **🎲Guesses Left**:${leftGuesses}\n
                    **👤Player**: ${interaction.user}
                `).setColor('BLURPLE');
          await interaction.reply({ embeds: [wordleEmbed] });
          db.set(interaction.user.id, {
            guess: guess,
            leftGuesses: leftGuesses,
            word: word,
            gameBoard: gameBoard,
            wins: wins,
            losses: losses,
            streak: streak,
            maxStreak: maxStreak,
            status: "ongoing",
            nextGameTime: moment()
          });
        }
      },
};