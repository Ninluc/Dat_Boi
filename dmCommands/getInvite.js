const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
module.exports = {
	name: "getinvite",
	isPrivate: false,
    usage: "getInvite <NOM DU SERVEUR>",
    description: "Donne un lien d'invitation vers le serveur spécifié.",
	run: async (client, message, text, args) => {
		try {

            if (!args[0]) {
                message.channel.send({embeds: [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`❌ ERREUR | Pas assez d'arguments`)
                        .setDescription("`[help getinvite` pour plus d'informations")
                    ]})
                return;
            }



			let serverName = args.join(" ")

            // if (serverName.length < 3) {
            //     return message.channel.send(
            //         new MessageEmbed()
            //             .setColor(ee.wrongcolor)
            //             .setTitle(`❌ ERREUR | Pas de serveur avec ce nom trouvé`)
            //     );
            // }

            let guild = client.guilds.cache.find(guild => guild.name == `${serverName}`)
            if (guild) {
                if (!guild.me.permissions.has("ADMINISTRATOR")) {
                    if (guild.me.permissions.has("CREATE_INSTANT_INVITE")) {
                        let channel = guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT").first()
                        if (channel) {
                            let invite = await channel.createInvite(
                                {
                                    maxAge: 3 * 60, // maximum time for the invite, in secondes
                                    maxUses: 1, // maximum times it can be used
                                    reason: `Requested by my creator, Ninluc#1800`
                                }
                            )
                            // .then(() => {
                            console.log(invite);
                            message.channel.send({ embeds : [
                                new MessageEmbed()
                                    .setColor(ee.color)
                                    .setTitle(`✅ | https://www.discord.gg/${invite.code}`)]}
                            );
                            // })
                            // .catch((e) => {
                            //     console.log(String(e.stack).bgRed);
                            // })
                        }
                    }
                    else {
                        return message.channel.send({embeds : [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle(`❌ ERREUR | J'ai pas les droits fréro`)]}
                        );

                    }
                }
                else {
                    guild.invites.fetch().then((invites) => {
                        if (invites.first()) {
                            return message.channel.send({embeds : [
                                new MessageEmbed()
                                    .setColor(ee.color)
                                    .setTitle(`✅ | https://www.discord.gg/${invites.first().code}`)]}
                            );
                        }
                    })
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
	},
};
