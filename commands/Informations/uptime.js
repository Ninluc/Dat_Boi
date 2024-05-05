const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { duration } = require("../../handlers/functions")
module.exports = {
    name: "uptime",
    category: "Informations",
    aliases: [],
    cooldown: 10,
    usage: "uptime",
    description: "Donne la durée depuis le démarrage du bot",
    run: async (client, message, args, user, text, prefix) => {
    try{
      message.channel.send({embeds : [new MessageEmbed()
        .setColor(ee.color)
        .setFooter({text : ee.footertext, iconURL : ee.footericon})
        .setTitle(`:white_check_mark: **${client.user.username}** est en ligne depuis :\n ${duration(client.uptime)}.`)]}
      );
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({embeds : [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({text : ee.footertext, iconURL : ee.footericon})
            .setTitle(`❌ ERREUR | Une erreur est survenue : `)
            .setDescription(`\`\`\`${e.stack}\`\`\``)]}
        );
    }
  }
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
