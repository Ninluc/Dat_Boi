const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
    name: "help",
    category: "Informations",
    aliases: ["h", "commandinfo", "cmds", "cmd"],
    cooldown: 4,
    usage: "help [Commande]",
    description: "Retourne toutes les commandes disponibles, ou des informations sur la commande spécifiée",
    run: async (client, message, args, user, text, prefix) => {
      try{
        if (args[0]) {
          const embed = new MessageEmbed();
          const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
          if (!cmd) {
              return message.channel.send({ embeds : [embed.setColor(ee.wrongcolor).setDescription(`Aucune info trouvée pour cette commande **${args[0].toLowerCase()}**`)]});
          }
          if (cmd.name) embed.addField("**Commande :**", `\`${cmd.name}\``);
          if (cmd.name) embed.setTitle(`Informations à propos de la commande : \`${cmd.name}\``);
          if (cmd.description) embed.addField("**Description**", `${cmd.description}`);
          if (cmd.aliases) embed.addField("**Alias**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
          if (cmd.cooldown) embed.addField("**Cooldown**", `${cmd.cooldown} Secondes`);
          else embed.addField("**Cooldown**", `\`${config.defaultCommandCooldown}\``);
          if (cmd.usage) {
              embed.addField("**Utilisation**", `\`${config.prefix}${cmd.usage}\``);
              embed.setFooter({text :"Syntaxe: <> = obligatoire, [] = optionnel"});
          }
          return message.channel.send({embeds : [embed.setColor(ee.color)]});
        } else {
          const embed = new MessageEmbed()
              .setColor(ee.color)
              .setThumbnail(client.user.displayAvatarURL().replace(".webp", ".gif"))
              .setTitle("Menu d'aide 📖 Commandes")
              .setFooter({text :`TIPS : Pour avoir des informations détaillées sur une commande, faites : \n${config.prefix}help [NOM_DE_LA_COMMANDE]`, iconURL : client.user.displayAvatarURL().replace(".webp", ".gif")});
          const commands = (category) => {
              return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          };
          try {
            for (let i = 0; i < client.categories.length; i += 1) {
              const current = client.categories[i];
              const items = commands(current);
              const n = 3;
              const result = [[], [], []];
              const wordsPerLine = Math.ceil(items.length / 3);
              for (let line = 0; line < n; line++) {
                  for (let i = 0; i < wordsPerLine; i++) {
                      const value = items[i + line * wordsPerLine];
                      if (!value) continue;
                      result[line].push(value);
                  }
              }
              embed.addField(`**${current.toUpperCase()} (${items.length})**`, `> ${result[0].join("\n> ")}`, true);
              embed.addField(`\u200b`, `${result[1].join("\n") ? result[1].join("\n") : "\u200b"}`, true);
              embed.addField(`\u200b`, `${result[2].join("\n") ? result[2].join("\n") : "\u200b"}`, true);
            }
          } catch (e) {
              console.log(String(e.stack).red);
          }
          message.channel.send({embeds : [embed]});
      }
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
