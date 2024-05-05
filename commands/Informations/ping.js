const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "ping",
    category: "Informations",
    aliases: ["latency"],
    cooldown: 2,
    usage: "ping",
    description: "Donne le temps que le bot as mis pour envoyer un message.",
    run: async (client, message, args, user, text, prefix) => {
    try{
      if (Math.floor(Math.random() * 3) == 0) {
        // Easter egg
        message.channel.send({ content : "...pong"})
      }
      else {
        message.channel.send({embeds : [new MessageEmbed()
          .setColor(ee.color)
          .setFooter({text : ee.footertext, iconURL : ee.footericon})
          .setTitle(`🏓 Pinging....`)]}
        ).then(msg=>{
          msg.edit({embeds : [new MessageEmbed()
            .setColor(ee.color)
            .setFooter({text : ee.footertext, iconURL : ee.footericon})
            .setTitle(`🏓 Le ping est de \`${Math.round(client.ws.ping)}ms\``)]}
          );
        })
      }
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
