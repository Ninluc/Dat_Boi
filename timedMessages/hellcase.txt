const { MessageEmbed } = require("discord.js");
const ee = require("../botconfig/embed.json");

const RAPPEL_CHANNEL_ID = "1296051297262370866";

module.exports = {
	name: "Hellcase",
  time: "21:30",
	run: async (client) => {
		try {
      client.channels.fetch(RAPPEL_CHANNEL_ID)
        .then(channel => channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(ee.color)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`Rappel : Caisse gratuite Hellcase`)
                .setDescription("[Hellcase](https://hellcase.com/)")
            ],
          })
        );
		} catch (e) {
			console.log(String(e.stack).bgRed);
		}
	},
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
