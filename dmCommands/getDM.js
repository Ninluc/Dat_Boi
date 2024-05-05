const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const misc = require("../botconfig/misc.json")
const { delay } = require("../handlers/functions");
module.exports = {
	name: "getdm",
	isPrivate: true,
    usage: "getDM <USER_ID> [MAX_FETCH]",
    description: "Donne la conversation du bot avec l'utilisateur spécifié. Prends les `MAX_FETCH` derniers messages (100 par défaut)",
	run: async (client, message, text, args) => {
		try {

			client.users.fetch(args[0], false).then(async (u) =>  {
                let dmChannel = u.dmChannel || await u.createDM()

                fetchLimit = args[1] || 100

                dmChannel.messages.fetch({ limit: fetchLimit }).then(messages => {
                    if (messages.size == 0) {
                        return message.channel.send({embeds : [
                            new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setTitle(`❌ ERREUR | Aucun message n'as été envoyé à cet utilisateur.`)
                        ]}
                        );
                    }

                    messages.sort((msgA, msgB) => msgA.createdTimestamp - msgB.createdTimestamp);
                    // console.log(`Received ${messages.size} messages`);
                    let toSend = ""
                    messages.sorted((msgA, msgB) => msgA.createdTimestamp - msgB.createdTimestamp).forEach(msg => {
                        let txt = `${msg.author} : ${msg.content}   \`${msg.createdAt.toLocaleDateString()} ${msg.createdAt.getHours()}:${msg.createdAt.getMinutes()}:${msg.createdAt.getSeconds()}\`\n`
                        if (toSend.length + txt.length >= misc.MESSAGE_CHAR_LIMIT) {
                            delay(30)
                            message.channel.send({ content : toSend})
                            toSend = txt.slice(0, misc.MESSAGE_CHAR_LIMIT - 1)
                        }
                        else {
                            toSend += txt
                            if (txt.includes("http")) {
                                delay(100)
                                message.channel.send({ content : toSend})
                                toSend = ""
                            }
                        }
                    })

                    if (toSend.length > 0) {
                        delay(30)
                        message.channel.send({ content : toSend})
                    }


                    message.channel.send({embeds : [
                        new MessageEmbed()
                            .setColor(ee.color)
                            .setTitle(`Reçu ${messages.size} messages`)]}
                    );
                })

            }).catch((e) => {
                console.log(e)
				return message.channel.send({embeds : [
					new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setTitle(`❌ ERREUR | C'est utilisateur n'existe pas :(`)]}
				);
			})

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
