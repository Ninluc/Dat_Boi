const { MessageEmbed } = require("discord.js");
const ee = require("../botconfig/embed.json");
module.exports = {
	name: "dm",
	isPrivate: true,
	usage: "dm <USER_ID> <MESSAGE>",
    description: "Envoie un message privé à l'utilisateur spécifié par son id.",
	run: async (client, message, text, args) => {
		try {

			let text = args.slice(1).join(" ")

            client.users.fetch(args[0], false).then(u =>  {
				try {
					u.send({ content : text}).then(() => {
						message.react("✅")
					})
					.catch(e => {
						message.react("❌")
					})
				}
				catch (e) {
					message.react("❌")
					console.log(String(e.stack).bgRed);
				}
			}).catch(() => {
				return message.channel.send({embeds : [
					new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setTitle(`❌ ERREUR | Pas d'utilisateur trouvé :(`)]}
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
