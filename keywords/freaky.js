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
	keyword: "freaky",
	regex: /^.*(freak|freaky).{0,17}$/i,
	cooldown: 3,
	random: 80,
	run: async (client, message, user) => {
		try {
			if (getRandomInt(2) == 1) {
				// Reaction
				let reactionEmojis = ["😏", "👀"];
				if (isLama(message.guildId)) {
					reactionEmojis.push("<:freaky:1266759402417819668>");
				}
				return message.react(choose(reactionEmojis));
			} else {
				var answers = [
					"Oil up bro",
					"Prepare I'm coming to your house 🚗",
					"Better be oiled up when I'm here 👀",
					"On dirait bien que qelqu'un est un peu 𝓯𝓻𝓮𝓪𝓴𝔂 par ici 😜",
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
