const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "say",
    category: "Divers",
    cooldown: 2,
    usage: "say [secret] <TEXTE>",
    description: 'Me fait parler (inutile on est d\'accord (qu\'est-ce que ce ma vie après tout) ||(Et oui c\'est illégal :rage:)|| (Am I itlaian ?)).\nRajoutez `secret` au début de votre message pour ne pas afficher votre commande.',
    run: async (client, message, args, user, text, prefix) => {
    try{
      if(!args[0]) {
        return message.channel.send({embeds : new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({text : ee.footertext, iconURL : ee.footericon})
            .setTitle(`❌ ERREUR | Vous n'avez pas donné de texte`)
            .setDescription(`Usage: \`${prefix}${this.usage}\``)
        });
      }
      else if (args[0].toLowerCase() == "secret") {
        text = text.slice(7);
        try{  message.delete();   }catch{}
      }
      message.channel.send({ content : text});
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
