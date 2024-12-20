const fs = require("fs");
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { sendNinluc } = require("../../handlers/functions.js")
const { createAudioPlayer, joinVoiceChannel, createAudioResource, StreamType } = require('@discordjs/voice');
const { VoiceConnectionStatus } = require('@discordjs/voice');

const player = createAudioPlayer();

const ffmpeg = require("ffmpeg-static");

// const { generateDependencyReport } = require('@discordjs/voice');
// console.log(generateDependencyReport().blue);

module.exports = async (client, oldState, voiceState) => {
    try {
        
        if (voiceState === null || voiceState.channel === null || !voiceState.guild ||  oldState.channel == voiceState.channel || voiceState.channel.full || !voiceState.channel.joinable) return;
        if (!voiceState.channel.permissionsFor(voiceState.guild.me).has("CONNECT")  || !voiceState.channel.permissionsFor(voiceState.guild.me).has("SPEAK")) {return;}
        
        player.on('error', error => {
            // subscription.unsubscribe()
            connection.destroy();
            console.error('Error:', error.message, 'with track', error.resource.metadata.title);
        });

        // Si c'est du bot alors se démute
        if (voiceState.member.user.id === client.user.id && voiceState.mute) {
            // Si il sait se demute
            if (voiceState.channel.permissionsFor(voiceState.guild.me).has("MUTE_MEMBERS")) {
                voiceState.setMute(false);
                return;
            } else {return;}
        }
        else if (voiceState.member.user.id === client.user.id) {
            return;
        }


        
        var finish = true
        var playRick = false;
        if (Math.floor(Math.random() * 14) == 0) {playRick = true}

        if (playRick && !voiceState.deaf && finish) {

            let videos = fs.readdirSync(`./sounds/`).filter((file) => file.endsWith(".mp3"))
            
            // voiceState.setSelfMute(0);
            // var channel = voiceState.channel
            const connection = joinVoiceChannel({
                channelId: voiceState.channel.id,
                guildId: voiceState.guild.id,
                adapterCreator: voiceState.guild.voiceAdapterCreator,
            });
            // const subscription = connection.subscribe(player);
            var rdVideoLink = videos[Math.floor(Math.random() * videos.length)]

            try {
                connection.on(VoiceConnectionStatus.Ready, async() => {
                    connection;
                    let subscription = connection.subscribe(player);
                    
                    const resource = createAudioResource("./sounds/" + rdVideoLink, {
                        inputType: StreamType.Arbitrary
                    });
                    resource.playStream.on("finish", () => {
                        setTimeout(() => {
                            subscription.unsubscribe()
                            connection.destroy();
                        }, 2000)
                    })

                    player.play(resource);
                })

                sendNinluc(client, `Je joue *${rdVideoLink.split('.')[0]}* dans le salon ${voiceState.channel} du serveur **${voiceState.guild.name}**`);
            } catch (error) {
                console.log(error.message)
            }

        }
    } catch (e) {
		console.log(e.stack)
	}
}