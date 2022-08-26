const { Interaction, MessageEmbed } = require("discord.js")

/**
 * @param {Interaction} interaction 
 * @param {string} description 
 */
module.exports = async function errorEmbed(interaction, description){
    const errorEmbed = new MessageEmbed()
    .setColor("RED")
    .setDescription(`${description}`)
    return interaction.reply({embeds:[errorEmbed]})
}
