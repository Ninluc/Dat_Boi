const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const { choose, isNinluc } = require("../handlers/functions");

module.exports = {
    keyword: "slt",
    regex: /^.{0,5}(slt|salut).{0,17}$/i,
    cooldown: 3,
    random: 80,
    run: async (client, message, user) => {
    try{
      // If it has mentions → return nothing
      if (message.mentions.members.size) {return;}

      

      if (isNinluc(message.author.id)) {
        var answers = ["Sup bro 🤛"];
      }
      else {
        var answers = ["Salut 👋", `slt ${message.author}`];
      }

      return message.channel.send({ content : choose(answers)})

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
