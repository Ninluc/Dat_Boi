const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const { choose } = require("../handlers/functions");

module.exports = {
    keyword: "quoi",
    regex: /quoi(\ |\.|\!|\?)*$/i,
    cooldown: 2,
    random: 30,
    run: async (client, message, user) => {
    try{
      var answers = ["...feur", "feur 😋", "😈", "KOIKOUBEH"];
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
