const { MessageEmbed, Message } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const {
	getRandomInt,
	choose,
	isNinluc,
	isLama,
} = require("../handlers/functions");

module.exports = {
	keyword: "gambling",
	regex: /^.{0,5}(gambling|gamble).{0,17}$/i,
	cooldown: 3,
	random: 80,
	run: async (client, message, user) => {
		try {
			if (getRandomInt(2) == 1) {
				// Reaction
				let reactionEmojis = ["😏", "👀", "🎲", "🎰", "🤑"];
				if (isLama(message.guildId)) {
					reactionEmojis.push("<:image:1114257700038119506>");
				}
				return message.react(choose(reactionEmojis));
			} else {
				var answers = [
					"Gambliiing",
          "🤑"
				];

				return message.channel.send({ content: choose(answers) });
			}
		} catch (e) {
			console.log(String(e.stack).bgRed);
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter({ text: ee.footertext, iconURL: ee.footericon })
						.setTitle(`❌ ERREUR | Une erreur est survenue : `)
						.setDescription(`\`\`\`${e.stack}\`\`\``),
				],
			});
		}
	},
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
