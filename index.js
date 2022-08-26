require("dotenv").config();
const { Client, Intents, Collection } = require('discord.js');

module.exports = client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.config = {
  prefix: ";",
};

client.commands = new Collection();

require("./handlers/command")(client);
require("./handlers/event")(client);

client.login(process.env.BOT_TOKEN);
