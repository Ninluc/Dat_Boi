const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const { choose } = require("../handlers/functions");
const { createAudioPlayer, joinVoiceChannel, createAudioResource, StreamType } = require('@discordjs/voice');
const { VoiceConnectionStatus } = require('@discordjs/voice');

const player = createAudioPlayer();

const ffmpeg = require("ffmpeg-static");

module.exports = {
	name: "joinvc",
	isPrivate: false,
    usage: "joinvc <ID_DE_LA_VOC>",
    description: "Rejoins le salon vocal spécifié à l'aide de son id (activer le mode développeur → clic droit sur la voc → copier l'identifiant).",
	run: async (client, message, text, args) => {
		try {
            if (!args[0]) {
                message.channel.send({embeds: [
                    new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`❌ ERREUR | Pas assez d'arguments`)
                        .setDescription("`[help joinvc` pour plus d'informations")
                    ]})
                return;
            }

            let channel = client.channels.cache.find(channel => channel.id == `${args[0]}`)

            if (
                !channel || !channel.isVoice()
                || !channel.permissionsFor(channel.guild.me).has("CONNECT")
                || !channel.permissionsFor(channel.guild.me).has("SPEAK")
                ) {
                    // message.react("❌")
                    return message.channel.send({embeds : [
                        new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setTitle(`❌ ERREUR | Pas de voc trouvée :(`)]}
                    );
            }
            
            player.on('error', error => {
                // subscription.unsubscribe()
                
                if (connection.state.status != "destroyed") {
                    connection.destroy();
                }
            });

            player.on('idle', () => {
                // subscription.unsubscribe()
                
                if (connection.state.status != "destroyed") {
                    connection.destroy();
                }
                console.log('Info : Ended track');
            });


            let videos = fs.readdirSync(`./sounds/`).filter((file) => file.endsWith(".mp3"))
            
            // voiceState.setSelfMute(0);
            // var channel = voiceState.channel
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            // const subscription = connection.subscribe(player);
            var rdVideoLink = choose(videos)

            try {
                connection.on(VoiceConnectionStatus.Ready, async() => {
                    connection;
                    let subscription = connection.subscribe(player);
                    
                    const resource = createAudioResource("./sounds/" + rdVideoLink, {
                        inputType: StreamType.Arbitrary
                    });
                    resource.playStream.on("finish", () => {
                        setTimeout(() => {
                            // subscription.unsubscribe()
                            if (connection.state.status != "destroyed") {
                                connection.destroy();
                            }
                        }, 2000)
                    })
                    
                    // if (subscription) {
                    //     // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
                    //     setTimeout(() => subscription.unsubscribe(), 5_000);
                    // }

                    player.play(resource);
                })
            
            

                // setTimeout(() => {
                //     subscription.unsubscribe()
                //     if (connection.state.status != "destroyed") {
                //         connection.destroy();
                //     }
                // }, 60 * 1000)

                message.channel.send(`Je joue *${rdVideoLink.split('.')[0]}* dans le salon ${channel} du serveur **${channel.guild.name}**`);
            } catch (error) {
                console.log(error.message)
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
