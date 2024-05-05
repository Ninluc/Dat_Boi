const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");

async function fetchMsg(client, id) {
  return new Promise(async resolve => {
    client.guilds.cache.forEach((guild) => {
      guild.channels.cache.forEach( async (channel) => {
        // console.log(channel.messages)
        if (channel.messages) {
          let find = await channel.messages.fetch(id)
            .catch(e => {})
            
          if (find) {
            console.log("found one")
            resolve(find);
          }
        }
      })
    })
  })
}

module.exports = {
    name: "react",
    usage: "react <MESSAGE_ID> <EMOJI>",
    description: 'Réagis à un message déterminé par son id',
    run: async (client, message, text, args) => {
      try {

        // Vérification
        if (!args[0] || !args[1]) {
          return message.channel.send({embeds: [
            new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`❌ ERREUR | Pas assez d'arguments`)
                .setDescription("`[help react` pour plus d'informations")
          ]})
        }

        // Prends le message
        let msg = await fetchMsg(client, args[0])
        if (msg) {
          msg.react(args[1]);
          message.react("✅");
        }
        else {
          message.react("❌");
        }

      } catch (e) {
        console.log(String(e.stack).bgRed);
        return message.channel.send({embeds : [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setTitle(`❌ ERREUR | Une erreur est survenue : `)
            .setDescription(`\`\`\`${e.stack}\`\`\``)]}
        );
      }
  }
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
