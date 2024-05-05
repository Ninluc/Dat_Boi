const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "name",
    category: "Informations",
    aliases: ["n"],
    cooldown: 4,
    usage: "name",
    description: "Retourne le nom du bot.",
    run: async (client, message, args, user, text, prefix) => {
      try{
          const embed = new MessageEmbed();
          embed.setTitle(message.guild.me.nickname ? message.guild.me.nickname : client.user.username)
          return message.channel.send({embeds : [embed.setColor(ee.color)]});
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({embeds : [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({text : ee.footertext, iconURL : ee.footericon})
            .setTitle(`❌ ERREUR | Une erreur est survenue : `)
            .setDescription(`\`\`\`${e.stack}\`\`\``)]
        });
    }
  }
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
