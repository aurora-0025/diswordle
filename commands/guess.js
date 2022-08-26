const db = require("quick.db");

const errorEmbed = require("../utils/errorEmbed");
const stringBoard = require("../utils/stringBoard");
const arrayEquals = require("../utils/arrayEquals");
const allWords = require("../words/allWords");
const emojis = require("../utils/emojis")

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, Interaction } = require("discord.js");
const moment = require("moment");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('To guess a word')
	    .addStringOption(option =>
		    option.setName('word')
			    .setDescription('The guess word')
			    .setRequired(true)),
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
	async execute(client, interaction) {
        if (
            !db.get(interaction.user.id) ||
            db.get(interaction.user.id)?.status == "ended"
          )
            return errorEmbed(
              interaction,
              `**No Ongoing Game!**\nuse ;start to start new game`
            );
          let {
            guess,
            leftGuesses,
            word,
            gameBoard,
            wins,
            losses,
            streak,
            maxStreak,
            status,
          } = db.get(interaction.user.id);
          const splitWord = word.split("");
          const guessWord = interaction.options.getString('word').toLowerCase();
          if (guessWord.length != 5)
            return errorEmbed(interaction, "**Guess a five letter word**");
          if (!allWords.includes(guessWord))
            return errorEmbed(interaction, `**Invalid Word**`);
          const splitGuess = guessWord.split("");
          let row = gameBoard[guess];
      
          //GREEN AND BLACK
          for (let ind = 0; ind < 5; ind++) {
            if (splitWord[ind] == splitGuess[ind]) {
              row[ind] = emojis[`${splitGuess[ind]}_green`];
              splitWord[ind] = " ";
              splitGuess[ind] = null;
            } else {
              row[ind] = emojis[`${splitGuess[ind]}_black`];
            }
          }
          //Yellow
          for (let ind = 0; ind < 5; ind++) {
            if (splitWord.includes(splitGuess[ind])) {
              let count = splitWord.filter((x) => x == splitGuess[ind]).length;
              if (count == 1) {
                let i = splitWord.indexOf(splitGuess[ind]);
                splitWord[i] = " ";
                row[ind] = emojis[`${splitGuess[ind]}_yellow`];
              } else {
                row[ind] = emojis[`${splitGuess[ind]}_yellow`];
              }
            }
          }
      
          gameBoard[guess] = row;
          guess += 1;
          leftGuesses -= 1;
          if (streak > maxStreak) {
            maxStreak = streak;
          }
          const winRow = [];
          //check win
          for (const letter of word.split("")) {
            winRow.push(emojis[`${letter}_green`]);
          }
      
          if (arrayEquals(row, winRow)) {
            streak += 1;
            winEmbed = new MessageEmbed()
              .setTitle("🎉Yay You Found The Word")
              .setColor("GREEN").setDescription(`
              ${await stringBoard(gameBoard)}\n
              you found the word **${word.toUpperCase()}** in **${
              6 - leftGuesses
            }** moves.\n
              **👤Player**: ${interaction.user}
              **✨Wins**:${wins + 1} **♦️Losses**:${losses}\n
              **🎊WinStreak**:${streak}
              `);
      
            interaction.reply({ embeds: [winEmbed] });
            return db.set(interaction.user.id, {
              wins: wins + 1,
              losses: losses,
              streak: streak,
              maxStreak: maxStreak,
              status: "ended",
              nextGameTime: moment().add(1, 'days'),
            });
          }
          //check loss
          if (leftGuesses == 0) {
            streak = 0;
            lossEmbed = new MessageEmbed()
              .setTitle("🥲You Failed To Find The Word")
              .setColor("RED").setDescription(`
              ${await stringBoard(gameBoard)}\n
              Today's wordle was **${word.toUpperCase()}**\n
              better luck next time\n
              **👤Player**: ${interaction.user}\n
              **✨Wins**:${wins} **♦️Losses**:${losses + 1}\n
              **🎊WinStreak**:${streak}
              `);
            interaction.reply({ embeds: [lossEmbed] });
            return db.set(interaction.user.id, {
              wins: wins,
              losses: losses + 1,
              streak: streak,
              status: "ended",
              nextGameTime: moment().add(1, 'days'),
            });
          }
          const newWordleEmbed = new MessageEmbed()
            .setDescription(`
                  ${await stringBoard(gameBoard)}\n
                  **🎲Guesses Left**:${leftGuesses}\n
                  **👤Player**: ${interaction.user}
                  `);
          interaction.reply({ embeds: [newWordleEmbed] });
          db.set(interaction.user.id, {
            guess: guess,
            leftGuesses: leftGuesses,
            word: word,
            gameBoard: gameBoard,
            wins: wins,
            losses: losses,
            maxStreak: maxStreak,
            streak: streak,
            status: "ongoing",
          });
      
	},
};