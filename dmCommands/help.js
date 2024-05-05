const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const { isNinluc } = require("../handlers/functions");

module.exports = {
	name: "help",
	isPrivate: false,
    usage: "help [COMMANDE]",
    description: "Donne les commandes en messages privés disponibles",
	run: async (client, message, text, args) => {
		try {



            if (args[0]) {
                const embed = new MessageEmbed();
                const cmd = client.commands.get(args[0].toLowerCase()) || client.dmCommands.get(args[0].toLowerCase());
                if (!cmd) {
                    return message.channel.send({ embeds : [embed.setColor(ee.wrongcolor).setDescription(`Aucune info trouvée pour la commande **${args[0].toLowerCase()}**`)]});
                }
                if (cmd.name) embed.addField("**Commande :**", `\`${cmd.name}\``);
                if (cmd.name) embed.setTitle(`Informations à propos de la commande : \`${cmd.name}\``);
                if (cmd.description) embed.addField("**Description**", `${cmd.isPrivate ? "__*Commande privée*__.\n" : ""}${cmd.description}`);
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
                if (isNinluc(message.author.id)) {
                    var commands = client.dmCommands.map((cmd) => `\`${cmd.name}\``);
                }
                else {
                    var commands = client.dmCommands.filter((cmd) => !cmd.isPrivate).map((cmd) => `\`${cmd.name}\``);
                }
                try {

                    const n = 3;
                    const result = [[], [], []];
                    const wordsPerLine = Math.ceil(commands.length / 3);
                    for (let line = 0; line < n; line++) {
                        for (let i = 0; i < wordsPerLine; i++) {
                            const value = commands[i + line * wordsPerLine];
                            if (!value) continue;
                            result[line].push(value);
                        }
                    }
                    
                    embed.addField(`\u200b`, `> ${result[0].join("\n> ")}`, true);
                    embed.addField(`\u200b`, `${result[1].join("\n") ? result[1].join("\n") : "\u200b"}`, true);
                    embed.addField(`\u200b`, `${result[2].join("\n") ? result[2].join("\n") : "\u200b"}`, true);
                //   for (let i = 0; i < client.categories.length; i += 1) {
                //     const current = client.categories[i];
                //     const items = commands(current);
                //     const n = 3;
                //     const result = [[], [], []];
                //     const wordsPerLine = Math.ceil(items.length / 3);
                //     for (let line = 0; line < n; line++) {
                //         for (let i = 0; i < wordsPerLine; i++) {
                //             const value = items[i + line * wordsPerLine];
                //             if (!value) continue;
                //             result[line].push(value);
                //         }
                //     }
                //     embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${result[0].join("\n> ")}`, true);
                //     embed.addField(`\u200b`, `${result[1].join("\n") ? result[1].join("\n") : "\u200b"}`, true);
                //     embed.addField(`\u200b`, `${result[2].join("\n") ? result[2].join("\n") : "\u200b"}`, true);
                //   }
                } catch (e) {
                    console.log(String(e.stack).red);
                }
                message.channel.send({embeds : [embed]});
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
	},
};
