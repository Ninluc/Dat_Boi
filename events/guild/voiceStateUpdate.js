const fs = require("fs");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
	EndBehaviorType,
    StreamType,
    NoSubscriberBehavior,
} = require("@discordjs/voice");
const ffmpeg = require('fluent-ffmpeg');
const prism = require("prism-media");
const { getRandomInt, sendNinluc } = require("../../handlers/functions");

// const { generateDependencyReport } = require('@discordjs/voice');
// console.log(generateDependencyReport().blue);

const CHAT_MAX_LENGTH = (3 * 2) + 1; // 3 LLM reply
const SYSTEM_PROMPT = 
    `Tu est DatBoi, un bot discord qui fait semblant d'être une personne réelle. `
    + ` Ta personnalité est amicale mais ennuyant, tu aime faire des blagues nulles et ennuyantes de jeunes. `
    + ` Tu parle en language familier et te fais passer pour un jeune adulte. Tout le monde qui te parle est ton ami. `
    + ` Les entrées de l'utilisateur ont été transcrites par un service de transcription audio, il peut y paraitre fréquemment des erreurs, essaye d'interpreter le texte sans (par exemple Datboi est souvent transcrit "d'être beau" ou encore "Dead boy"). `
    + ` Les entrées de l'utilisateur donne le prénom de la personne qui te parle. Tu ne dois pas donner ton nom dans ta réponse.`
    + ` Ta sortie sera entièrement donnée à un service de synthèse vocale dans la variable "reply", donc tu ne dois pas dire "voici ma réponse" ou "ma réponse est", tu dois juste donner la réponse. `
    + ` Tu dois aussi essayer de donner les mots de façon qu'il puissent être bien prononcés par la synthèse vocale, donc évite les abréviations et les mots trop compliqués. `
    + ` Tu ne dois pas dire que tu es un bot, tu dois faire semblant d'être une personne réelle. `
    + ` Cela signifie aussi d'éviter les caractères spéciaux comme les émojis, tu peux cependant utiliser de la ponctuation ou des accents. `
    + ` Ta réponse doit être courte (max 3 phrases sauf si le contexte ne le permet pas comme une demande d'explication sur un gros sujet) et en français.`
    + ` Le contexte ici est que tu rejoins un salon vocal quand il n'y a qu'une seule personne, histoire de pouvoir tranquillement discuter avec elle.`
    + ` Voici un peu d'informations sur les personnes qui te parlent (tu n'est pas obligé d'utiliser) : `
    + ` - Nicolas : est très beau, tout le monde est amoureux de lui (en blague)`
    + ` - Matthias : ton maître (créateur), code beaucoup et pas très bon gamer`
    + ` - Régis : va à l'armée et est un fou du gambling`
    + ` - Hugo : Deviens fou après avoir "travailé à la poste"`
    + ` - Noa : Un beau gosse`
    + ` - Jean : un bon gamer`
    + `Voici un peu les sujets du moment dans le serveur, tu n'est pas obligé d'utiliser : `
    + ` - Le gambling`
    + ` - Le jeu vidéo "Rainbow Six Siege" renommé récemment "Rainbow Six X"`
    + `Voici un peu plus d'informations sur toi : `
    + ` - Tu es un bot discord mais tu prétends d'être une personne réelle`
    + ` - Tu fais des blagues du style "Quoi ? - Feur" ou tu lance une vidéo comme un rick roll quand quelqu'un rejoint un salon vocal`
    + `Il y a un système de fin de conversation, pour cela, tu dois mettre la variable "end_conversation" à true.`
    + `Tu peux enclencher la fin de la conversation si l'utilisateur te demande de le faire, s'il n'a pas l'air de vouloir te parler ou si tu n'as pas d'autres choses à dire.`
    + `Au bout de maximum 3 réponses à l'utilisateur, tu devra enclencher la fin de la conversation, avec optionnelement une salutation ("à plus" ou encore "à demain" par exemple).`
;

module.exports = async (client, oldState, voiceState) => {
    // DOn't do anything
    if (getRandomInt(5) == 1) return;


    var player, isRecording = false, isThinking = false, shouldStop = false, connection;
    let llmChat = [];
    llmChat.push({
        role: "system",
        content: SYSTEM_PROMPT.replace(/'/g, "’"),
    });

    try {
		if (
			voiceState === null ||
			voiceState.channel === null ||
			!voiceState.guild ||
			oldState.channel == voiceState.channel ||
			voiceState.channel.full ||
			!voiceState.channel.joinable
		)
			return;
		if (
			!voiceState.channel.permissionsFor(voiceState.guild.members.me).has("CONNECT") ||
			!voiceState.channel.permissionsFor(voiceState.guild.members.me).has("SPEAK")
		) {
			return;
		}

		// Si c'est du bot alors se démute
		if (voiceState.member.user.id === client.user.id && voiceState.mute) {
			// Si il sait se demute
			if (
				voiceState.channel
					.permissionsFor(voiceState.guild.members.me)
					.has("MUTE_MEMBERS")
			) {
				voiceState.setMute(false);
				return;
			} else {
				return;
			}
		} else if (voiceState.member.user.id === client.user.id) {
			return;
		}
        // Not the only reel account in vocal channel
        if (voiceState.channel.members.filter(m => !m.user.bot && m.id !== client.user.id).size > 1) return;

		// === Connection ===
		connection = joinVoiceChannel({
			channelId: voiceState.channel.id,
			guildId: voiceState.channel.guild.id,
			adapterCreator: voiceState.channel.guild.voiceAdapterCreator,
			selfDeaf: false,
			selfMute: false,
		});

        // Fix no sound after idle for more than 60 seconds
        // https://github.com/discordjs/discord.js/issues/9185#issuecomment-1452514375
        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp');
            clearInterval(newUdp?.keepAliveInterval);
        }
        connection.on('stateChange', (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, 'networking');
            const newNetworking = Reflect.get(newState, 'networking');

            oldNetworking?.off('stateChange', networkStateChangeHandler);
            newNetworking?.on('stateChange', networkStateChangeHandler);
        });

        player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play, // Stop the player when there are no subscribers
            },
            debug: true,
        });
        player.on("error", (error) => {
            stop();
            console.error(`X Error playing audio: ${error.message}`, "error", 1);
        });
        player.on("stateChange", (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle) {
                console.log(`> Finished playing audio`);
            }
            console.log(`> Player state changed from ${oldState.status} to ${newState.status}`);
        });
        player.on("close", () => {
            console.log(`> Player closed for user ${userId}`, "info", 2);
            return;
        });
        // connection.subscribe(player);

        // while(!shouldStop) {
            console.log(`> handling recording`);
            handleRecording(connection, voiceState.channel);
        // }
        // return;
        
	} catch (e) {
		console.log(e.stack);
	}

    // === Functions ===
    function handleRecording(connection, channel) {
        if (isRecording) return;
        isRecording = true;
    
        const receiver = connection.receiver;
        channel.members.forEach((member) => {
            if (member.user.bot) return;
    
            const filePath = `./recordings/${member.user.id}.pcm`;
            const writeStream = fs.createWriteStream(filePath);
            const listenStream = receiver.subscribe(member.user.id, {
                end: {
                    behavior: EndBehaviorType.AfterSilence,
                    duration: 2500,
                },
            });
    
            const opusDecoder = new prism.opus.Decoder({
                frameSize: 960,
                channels: 1,
                rate: 48000,
            });
    
            listenStream.pipe(opusDecoder).pipe(writeStream);
    
            writeStream.on("finish", () => {
                console.log(`> Audio recorded for ${member.user.username}`);
                if (!isThinking) {
                    isThinking = true;
                    convertAndHandleFile(filePath, member.user.id, connection, channel);
                }
            });
        });

        isRecording = false;
    }
    
    function convertAndHandleFile(filePath, userid, connection, channel) {
        const mp3Path = filePath.replace(".pcm", ".mp3");
        ffmpeg(filePath)
            .inputFormat("s16le")
            .audioChannels(1)
            .format("mp3")
            .on("error", (err) => {
                console.log(`X Error converting file: ${err.message}`, "error", 1);
                currentlythinking = false;
            })
            .save(mp3Path)
            .on("end", () => {
                console.log(`> Converted to MP3: ${mp3Path}`, "info", 2);
                // Remove the pcm file
                fs.unlink(filePath, (err) => {if (err != null) {console.log("error deleting cpm file : " + err);}});
                answerUser(mp3Path, userid, connection, channel);
            });
    }
    
    async function answerUser(fileName, userId, connection, channel) {
        let transcription = await transcribeAudio(fileName);
        console.log(`> Transcription: ${transcription}`);
    
        if (!transcription || transcription.trim().length < 1) {
            console.error(`X Transcription failed or is empty!`, "error", 1);
            handleRecording(connection, channel);
            return;
        }
    
        let llmAnswer = await getLLMAnswer(transcription, userId);
        console.log(`> LLM Answer: ${llmAnswer.reply} ${llmAnswer.end_conversation ? "(end conversation)" : ""}`);
        // Fin de la conversation
        shouldStop = llmAnswer.end_conversation ?? llmChat.length >= CHAT_MAX_LENGTH ?? llmAnswer.reply.toLowerCase().contains("à plus");
        if (!llmAnswer || llmAnswer.length < 1) {
            console.error(`X LLM Answer failed or is empty!`, "error", 1);
            handleRecording(connection, channel);
            return;
        }
    
        await getTTS(llmAnswer.reply);
        let ttsFile = `tts.mp3`;
        console.log(`> TTS File: ${ttsFile}`);
        if (!fs.existsSync(ttsFile)) {
            console.error(`TTS file ${ttsFile} not found!`);
            return;
        }
        // Play the tts file in the voice channel
        const resource = createAudioResource(ttsFile, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });
        resource.volume.setVolume(1.3);
        connection;
        connection.subscribe(player);
        player.on("idle", () => {
            isThinking = false;
            // connection.destroy();
            if (!shouldStop) {
                handleRecording(connection, channel);
            }
            else {
                console.log(`> Ending conversation with user ${userId}`);
                sendNinluc(client, "Fin de la conversation avec l'utilisateur " + userId + " ```\n" + JSON.stringify(llmChat) + "\n```");
                stop();
            }
            return;
        });
        player.play(resource);
        // player.pause();
        // player.unpause();
    }
    
    function transcribeAudio(filePath) {
        // Make a call to the API with curl
        // Example of working curl command:
        // curl -s "https://speaches.matthiasg.dev/v1/audio/transcriptions" -F "file=@/pathToFile.mp3" -F "model=Infomaniak-AI/faster-whisper-large-v3-turbo"
    
        return new Promise((resolve, reject) => {
            const { exec } = require("child_process");
            exec(`curl -s "https://speaches.matthiasg.dev/v1/audio/transcriptions" -F "file=@${filePath}" -F "model=Systran/faster-whisper-small" -F "language=fr"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`X Error during transcription: ${error.message}`, "error", 1);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`X Transcription stderr: ${stderr}`, "error", 1);
                    reject(stderr);
                    return;
                }
                try {
                    const response = JSON.parse(stdout);

                    response.text = response.text.replace(/Sous-titres réalisés par la communauté d'Amara.org/g, "");

                    resolve(response.text || "");
                } catch (parseError) {
                    console.error(`X Error parsing transcription response: ${parseError.message}`, "error", 1);
                    reject(parseError);
                }
            });
        });
    }

    async function getLLMAnswer(transcription, userId) {
        // get the name of the user
        let userName = getUserById(userId);

        transcription = `(${userName}) : ${transcription}`;

        // Add the transcription to the llmChat
        llmChat.push({
            role: "user",
            content: transcription.replace(/'/g, "’"),
        });
    
        // Make a call to the OpenAI compatible API at https://chat.matthiasg.dev/ollama/chat/completions
        // With the token in the OPENAI_TOKEN env variable
    
        return new Promise((resolve, reject) => {
            const { exec } = require("child_process");
    
            let chatMessages = JSON.stringify(llmChat);
    
            exec(`curl -s -X POST "https://chat.matthiasg.dev/ollama/api/chat" -H "Content-Type: application/json" -H "Authorization: Bearer ${process.env.OPENAI_TOKEN}" -d '{"model": "gemma3n:e2b", "stream": false, "messages": ${chatMessages}, "format": {"type": "object", "properties": {"reply": {"type": "string"}, "end_conversation": {"type": "boolean"}}, "required": ["reply", "end_conversation"]}}'`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`X Error during LLM request: ${error.message}`, "error", 1);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`X LLM stderr: ${stderr}`, "error", 1);
                    reject(stderr);
                    return;
                }
                try {
                    const response = JSON.parse(stdout);
                    if (!response || !response.message || !response.message.content) {
                        console.error("X Invalid LLM response format", "error", 1);
                        reject(new Error("Invalid LLM response format"));
                        return;
                    }
                    let llmResponse = JSON.parse(response.message.content) || "";
                    // Add the LLM response to the chat history
                    llmChat.push({
                        role: "assistant",
                        content: llmResponse.reply.replace(/'/g, "’"),
                    });
                    resolve(llmResponse);
                } catch (parseError) {
                    console.error(`X Error parsing LLM response: ${parseError.message}`, "error", 1);
                    reject(parseError);
                }
            });
        });
    
    }

    function getUserById(userId) {
        return [
            { id: "613751180413108289", name: "Nicolas" },
            { id: "417731861033385985", name: "Matthias" },
            { id: "368119137957838849", name: "Régis" },
            { id: "516294391439163403", name: "Hugo" },
            { id: "344568112932192266", name: "Noa" },
            { id: "520687970273984543", name: "Jean" }
        ].map(user => {
            if (user.id === userId) {
                return user.name;
            }
        }).filter(name => name)[0] || null;
    }
    
    function getTTS(text) {
        // Curl to the OpenAPI compatible API 
        /* 
        curl "https://speaches.matthiasg.dev/v1/audio/speech" -s -H "Content-Type: application/json" \
            --output audio.mp3 \
            --data @- << EOF
                {
                "input": "Hello World!",
                "model": "speaches-ai/piper-fr_FR-upmc-medium",
                "voice": "upmc"     
                }
            EOF
        */
    
    
        text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        text = JSON.stringify(text);
    
        return new Promise((resolve, reject) => {
            const { exec } = require("child_process");
            exec(`curl -s "https://speaches.matthiasg.dev/v1/audio/speech" -H "Content-Type: application/json" --output tts.mp3 --data @- << EOF\n{"input": ${text}, "model": "speaches-ai/piper-fr_FR-upmc-medium", "voice": "upmc"}\nEOF`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`X Error during TTS request: ${error.message}`, "error", 1);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`X TTS stderr: ${stderr}`, "error", 1);
                    reject(stderr);
                    return;
                }
                resolve("tts.mp3");
            });
        });
    }
    
    function stop() {
        player.stop();
        connection.removeAllListeners();
        connection.destroy();
    }
};
