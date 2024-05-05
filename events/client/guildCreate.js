// const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { sendNinluc } = require("../../handlers/functions.js")

module.exports = async (client, guild) => {
    try {

        let defaultChannel = "";
        guild.channels.cache.forEach((channel) => {
            if(channel.type == "GUILD_TEXT") {
                if(/g(é|e)n(é|e)ral/i.test(channel.name.toLowerCase()) && defaultChannel == "") {
                    defaultChannel = channel;
                }
            }
        })
        if (defaultChannel == "") {
            guild.channels.cache.forEach((channel) => {
                if(channel.type == "GUILD_TEXT") {
                    if(channel.permissionsFor(guild.me).has("SEND_MESSAGES") && defaultChannel == "") {
                        defaultChannel = channel;
                    }
                }
            })
        }

        if (defaultChannel) {
            // We send the message
            defaultChannel.send('Hello :wave:\nhttps://tenor.com/view/dat-boi-frog-unicycle-gif-5480965');
        }

        // PM THE OWNER (REMOVED BC NO NEED FOR THE MOMENT)
        // EMBEDS CREATION
        // const mpOwnerEmbed1 = new Discord.MessageEmbed()
        //     .setColor(ee.color)
        //     .setTitle(":gear: Configuration :wrench:")
        //     .setDescription('Pour que certaines commandes fonctionnent, vous devez d\'abord réaliser quelques étapes :')
        //     .addField("Étape 1","Dans les paramètres du serveur,\nVeuillez mettre le rôle \"test2\" tout au dessus comme ci-dessous :")
        //     .setImage("https://i.ibb.co/TcdcJmX/image.png")
        //     .addField("Info", "Tant que l'option \"afficher les membres ayant ce rôle séparement\" est désactivée, Je ne serais pas en haut dans la liste des membres.")

        // const mpOwnerEmbed2 = new Discord.MessageEmbed()
        //     .setColor(ee.color)
        //     .addField("Étape 2","Soyez sûr que je puisse écrire des messages dans le salon de bienvenue")
        //     .setFooter("c'est tout... :\)")

        // bot.users.fetch(guild.ownerID, false).then((user) => {
        //     user.send(`Hey :wave:,\nMerci de m'avoir invité à la fête :smiling_face_with_3_hearts:\n||~~Vous allez le regretter~~||`);
        //     user.send(mpOwnerEmbed1);
        //     setTimeout( () => {user.send(mpOwnerEmbed2)}, 1000)
        // });

        sendNinluc(client, `J'ai été invité dans le serveur **${guild.name}**\n\`[getInvite ${guild.name}\` pour avoir l'invitation.`);

    } catch (e) {
		console.log(e.stack)
	}
}