//Importing all the needed Commands
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const colors = require("colors"); //this Package is used, to change the colors of our Console! (optional and doesn't effect performance)
const fs = require("fs"); //this package is for reading files and getting their inputs

//Creating the Discord.js Client for This Bot with some default settings ;) and with partials, so you can fetch OLD messages
const client = new Discord.Client({
  // makeCache: 60,
  // fetchAllMembers: false,
  // messageCacheMaxSize: 10,
  makeCache: Discord.Options.cacheWithLimits({
		MessageManager: 60,
		PresenceManager: 20
	}),
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true, // Will cause problems if want to reply to @everyone 
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_INVITES, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES]
});

//Client variables to use everywhere
client.commands = new Discord.Collection(); //an collection (like a digital map(database)) for all your commands
client.aliases = new Discord.Collection(); //an collection for all your command-aliases
client.categories = fs.readdirSync("./commands/"); //categories
client.cooldowns = new Discord.Collection(); //an collection for cooldown commands of each user
client.keywords = new Discord.Collection(); // all the keywords the bot will react to
client.dmCommands = new Discord.Collection(); // all the private commands

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "dmCommand", "events", "keywords", "timedMessages"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

console.log("Discord token", process.env.DISCORD_TOKEN);

//login into the bot
client.login(process.env.DISCORD_TOKEN);

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
