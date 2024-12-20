const { MessageEmbed, Message } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const { sendNinluc } = require("../handlers/functions");

const RAPPEL_CHANNEL_ID = "1296051297262370866";

module.exports = {
	name: "Shop Marvel Snap",
  time: "21:00",
	run: async (client) => {
		try {
      client.channels.fetch(RAPPEL_CHANNEL_ID)
        .then(channel => channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(ee.color)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`Rappel : Shop Marvel Snap`)
            ],
          })
        );
		} catch (e) {
			console.log(String(e.stack).bgRed);
		}
	},
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
