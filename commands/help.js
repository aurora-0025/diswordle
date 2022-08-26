const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Interaction, Client } = require("discord.js");
const emojis = require("../utils/emojis")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('To see the information about the game'),
    /**
     * @param {Interactionn} interaction
     * @param {Client} client
    */
	async execute(client, interaction) {
        helpEmbed = new MessageEmbed()
        .setDescription(`
        Guess the **WORDLE** in six tries.

        Each guess must be a valid five-letter word by using the command **/guess word**. Hit the enter button to submit.
        
        After each guess, the color of the tiles will change to show how close your guess was to the word.
        
        **Examples**

        ${emojis.w_green} ${emojis.e_black} ${emojis.a_black} ${emojis.r_black} ${emojis.y_black}
        The letter **W** is in the word and in the correct spot.

        ${emojis.p_black} ${emojis.i_yellow} ${emojis.l_black} ${emojis.l_black} ${emojis.s_black}
        The letter **I** is in the word but in the wrong spot.

        ${emojis.v_black} ${emojis.a_black} ${emojis.g_black} ${emojis.u_black} ${emojis.e_black}
        The letter **U** is not in the word in any spot.

        --------------------------------------------------------------------------------------------
        **A new WORDLE will be available each day**
        --------------------------------------------------------------------------------------------
        **⚙️ COMMANDS**
        **/start**  | To start a new wordle
        **/guess**  | To make guess a word
        **/stats**  | To check user statistics
        **/board**  | To display ongoing game
        --------------------------------------------------------------------------------------------`)
        .setColor('BLURPLE').setFooter({text:'Clone of https://www.nytimes.com/games/wordle/'});
        interaction.reply({embeds:[helpEmbed]})
	},
};