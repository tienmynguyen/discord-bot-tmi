const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Collection,
} = require("discord.js");

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();

["command", "event"].forEach((handler) =>
  require(`./handlers/${handler}`)(client)
);

client.login(process.env.TOKEN);
