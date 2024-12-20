/**
 * @INFO
 * Loading all needed File Information Parameters
 */
const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { escapeRegex, sendNinluc, isNinluc } = require("../../handlers/functions"); //Loading all needed functions
//here the event starts
module.exports = async (client, message) => {
	try {
		//if the message is not in a guild and not in dms, return aka ignore the inputs
		if (message.channel.type != "DM" && !message.guild) return;
		// if the message  author is a bot, return aka ignore the inputs
		if (message.author.bot) return;
		//if the channel is on partial fetch it
		if (message.channel.partial) await message.channel.fetch();
		//if the message is on partial fetch it
		if (message.partial) await message.fetch();
		//get the current prefix from the botconfig/config.json
		let prefix = config.prefix;
		//the prefix can be a Mention of the Bot / The defined Prefix of the Bot
		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
		);
		//if its a command
		if (prefixRegex.test(message.content)) {
			//now define the right prefix either ping or not ping
			const [, matchedPrefix] = message.content.match(prefixRegex);
			// If the used prefix is "[" we check if it is not juste a use of "[some text]"
			if (matchedPrefix == prefix) {
				const closingBrace = new RegExp(/^(?:\[[^\[\]]*\])/);
				if (closingBrace.test(message.content)) return;
			}
			//create the arguments with slicing of of the right prefix length
			const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
			//creating the cmd argument by shifting the args by 1
			const cmd = args.shift().toLowerCase();
			// if no cmd added return error
			if (cmd.length === 0) {
				// If bot is pinged
				if (matchedPrefix.includes(client.user.id)) {
					// If it's Ninluc
					if (isNinluc(message.author.id)) {
						return message.channel.send({content: "Bebou 💗"})
					}

					return message.channel.send({embeds : [
						new Discord.MessageEmbed()
							.setColor(ee.color)
							.setFooter({text : ee.footertext, iconURL : ee.footericon})
							.setTitle(`U Stupid !`)
							.setDescription(`Pour voir les commandes ya \`${prefix}help\``)]}
					);
				}
				return;
			}



			//if the message is in dm
			if (message.channel.type == "DM") {
				let command  = client.dmCommands.get(cmd);
				
				if (command) {

					if (!isNinluc(message.author.id)) {
						sendNinluc(client, `${message.author} m'a demandé la commande ${command.name} : "${message.content}"`)
					}


					// If the command is private and the user is not Ninluc
					if (command.isPrivate && !isNinluc(message.author.id)) {
						message.channel.send({ content : "what did u tried there ?"})
						return;
					}
					else {
						command.run(client, message, args.join(" "), args)
					}
				}
				return;
			}



			//get the command from the collection
			let command = client.commands.get(cmd);
			//if the command does not exist, try to get it by his alias
			if (!command) command = client.commands.get(client.aliases.get(cmd));
			//if the command is now valid
			if (command) {
				if (!client.cooldowns.has(command.name)) {
					//if its not in the cooldown, set it too there
					client.cooldowns.set(command.name, new Discord.Collection());
				}
				const now = Date.now(); //get the current time
				const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
				const cooldownAmount =
					(command.cooldown || config.defaultCommandCooldown) * 1000; //get the cooldown amount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
				if (timestamps.has(message.author.id)) {
					//if the user is on cooldown
					const expirationTime =
						timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
					if (now < expirationTime) {
						//if he is still on cooldonw
						const timeLeft = (expirationTime - now) / 1000; //get the time left
						return message.channel.send({embeds : [
							new Discord.MessageEmbed()
								.setColor(ee.wrongcolor)
								.setFooter({text : ee.footertext, iconURL : ee.footericon})
								.setTitle(
									`❌ Veuillez attendre encore  ${timeLeft.toFixed(
										1
									)} seconde(s) avant de réutiliser la commande \`${
										command.name
									}\`.`
								)]}
						); //send an information message
					}
				}
				timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
				setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
				try {
					//try to delete the message of the user who ran the cmd
					// try{  message.delete();   }catch{}
					//if Command has specific permission return error
					if (
						command.memberpermissions &&
						!message.member.hasPermission(command.memberpermissions, {
							checkAdmin: command.adminPermOverride,
							checkOwner: command.adminPermOverride,
						})
					) {
						return message.channel
							.send({embeds : [
								new Discord.MessageEmbed()
									.setColor(ee.wrongcolor)
									.setFooter({text : ee.footertext, iconURL : ee.footericon})
									.setTitle("❌ Erreur | Vous n'êtes pas autorisés à utiliser cette commande !")
									.setDescription(
										`You need these Permissions: \`${command.memberpermissions.join(
											"`, ``"
										)}\``
									)]}
							)
							.then((msg) =>
								msg
									.delete({ timeout: 5000 })
									.catch((e) => console.log("Couldn't Delete --> Ignore".gray))
							);
					}
					//if the Bot has not enough permissions return error
					let required_perms = [
						// "ADD_REACTIONS",
						"PRIORITY_SPEAKER",
						"VIEW_CHANNEL",
						"SEND_MESSAGES",
						"EMBED_LINKS",
						"CONNECT",
						"SPEAK"
						// "DEAFEN_MEMBERS",
					];
					if (!message.guild.members.me.permissions.has(required_perms)) {
						try {
							message.react("❌");
						} catch {}
						return message.channel.send({embeds : [
							new Discord.MessageEmbed()
								.setColor(ee.wrongcolor)
								.setFooter({text : ee.footertext, iconURL : ee.footericon})
								.setTitle("❌ Erreur | Je n'ai pas assez de Permissions!")
								.setDescription(
									"Donnez moi la permission `ADMINISTRATEUR`, J'en ai besoin pour effacer les messages, et autres...\n Si vous ne voulez pas me donner les permissions administrateurs (||ce que je comprends ce bot est taré||), vous pouvez me donner ces permissions : \n> `" +
										required_perms.join("`, `") +
										"`"
								)]}
						);
					}
					//run the command with the parameters:  client, message, args, user, text, prefix,
					command.run(
						client,
						message,
						args,
						message.member,
						args.join(" "),
						prefix
					);
				} catch (e) {
					console.log(String(e.stack).red);
					return message.channel
						.send({embeds : [
							new Discord.MessageEmbed()
								.setColor(ee.wrongcolor)
								.setFooter({text : ee.footertext, iconURL : ee.footericon})
								.setTitle(
									"❌ Quelques chose s'est mal passé en essayant d'exécuter la commande `" +
										command.name +
										"`."
								)
								.setDescription(`\`\`\`${e.message}\`\`\``)]}
						)
						.then((msg) =>
							msg
								.delete({ timeout: 5000 })
								.catch((e) => console.log("Couldn't Delete --> Ignore".gray))
						);
				}
			} //if the command is not found send an info msg
			else {
				return message.channel
					.send({embeds : [
						new Discord.MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter({text : ee.footertext, iconURL : ee.footericon})
							.setTitle(`❌ Commande inconnue, essayez : **\`${prefix}help\`**`)
							.setDescription(
								`TIPS : Pour avoir des informations détaillées sur une commande, faites : \`\n${config.prefix}help [NOM_DE_LA_COMMANDE]\``
							)]}
					)
					.then((msg) =>
						setTimeout(() => msg.delete().catch((e) => console.log("Couldn't Delete --> Ignore".gray)), 11000)
						// msg
						// 	.delete({ timeout: 5000 })
							
					);
			}
		}


		
		else {
			// TEMP :
			if (message.channel.type != "DM") {
				// INFO : For dorian
				if (message.author.id == "424305097158426626") {
					if (Math.floor(Math.random() * 40) == 1) {
						message.react('👶');
					}
				}
				// INFO : For Ninluc
				if (message.author.id == "417731861033385985" && message.guild.id == "805809277980901388") {
					if (Math.floor(Math.random() * 60) == 0) {
						const reacs = ["🇫", "🇩", "🇵"];
						for (reac of reacs) {
							message.react(reac);
						}
					}
				}
			}
			

			// else we look for a keyword
			var keyword;
			for (k of client.keywords.keys()) {
				if (k.test(message.content) && keyword == undefined) {
					keyword = client.keywords.get(k);
				}
			}
			if (keyword) {
				// - COOLDOWN
				if (!client.cooldowns.has(keyword.keyword)) {
					//if its not in the cooldown, set it too there
					client.cooldowns.set(keyword.keyword, new Discord.Collection());
				}
				const now = Date.now(); //get the current time
				const timestamps = client.cooldowns.get(keyword.keyword); //get the timestamp of the last used commands
				const cooldownAmount =
				(keyword.cooldown || config.defaultCommandCooldown) * 1000; //get the cooldown amount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
				if (timestamps.has(message.author.id)) {
					//if the user is on cooldown
					const expirationTime =
						timestamps.get(message.author.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
					if (now < expirationTime) {
						//if he is still on cooldown

						// If it less than colldownAmount / 10
						if (now < timestamps.get(message.author.id) + (cooldownAmount / 2)) {
							
							let cooldownMessages = ["fuck u ⏱", "IT'S TIME TO STOP !", "⏰", "⏲", "YOU'VE REACHED THE LIMITS ⌚️", "heheheha"]
							if (message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) {
								cooldownMessages = cooldownMessages.concat(["https://youtu.be/2k0SmqbBIpQ",  "https://youtu.be/b6dAcK199s8"])
							}

							message.channel.send({ content : cooldownMessages[Math.floor(Math.random() * cooldownMessages.length)]})
						}
						return;
					}
				}

				timestamps.set(message.author.id, now); //if he is not on cooldown, set it to the cooldown
				setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again

				// - RANDOMNESS
				// If randomness != 100% and it pass the random test
				if (keyword.random < 100 && Math.floor(Math.random() * (100 / keyword.random)) != 0) {return;}

				// - RUN
				// Run the keyword activation
				keyword.run(
					client,
					message,
					message.member
				);
			}

			if (message.channel.type == "DM" && !isNinluc(message.author.id)) {
				if (!message.content.includes("http")) {
					sendNinluc(client, `${message.author} m'a envoyé : "${message.content}"`)
				}
				else {
					sendNinluc(client, `${message.author} m'a envoyé : ${message.content}`)
				}
			}

			return;
		}

	} catch (e) {
		console.log(e.stack)
		return message.channel.send({embeds : [
			new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle(`❌ ERREUR | Une erreur est survenue : `)
				.setDescription(`\`\`\`${e.stack}\`\`\``)]}
		);
	}
	/**
	 * @INFO
	 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
	 * @INFO
	 * Work for Milrato Development | https://milrato.eu
	 * @INFO
	 * Please mention Him / Milrato Development, when using this Code!
	 * @INFO
	 */
};
