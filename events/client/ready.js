const { choose, sendNinluc } = require('../../handlers/functions.js');
const ee = require('../../botconfig/config.json');
const misc = require('../../botconfig/misc.json');

// Moment lib
var moment = require('moment'); // require

const ascii = require("ascii-table");
let table = new ascii("Servers list");
table.setHeading("Name", "Link");

//here the event starts
const config = require("../../botconfig/config.json")
module.exports = client => {
  // Log of guilds bot is member
	try {
		let i = 0
		client.guilds.cache.forEach( (guild) => {
			if (!guild.me.permissions.has("ADMINISTRATOR")) {
				table.addRow(guild.name, "Missing permissions")
				i++
			}
			else {
				guild.invites.fetch().then((invites) => {
					i++
					if (invites.first()) {
						table.addRow(guild.name, "https://www.discord.gg/" + invites.first().code)
						if (i == client.guilds.cache.size) {
							console.log("\n")
							console.log(table.toString().cyan);
						}
					}
					else {
						if (guild.me.permissions.has("CREATE_INSTANT_INVITE")) {
							let channel = guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT").first()
							if (channel) {
								let invite = channel.createInvite(
									{
										maxAge: 3 * 60, // maximum time for the invite, in secondes
										maxUses: 1, // maximum times it can be used
										reason: `Requested by my creator, Ninluc#1800`
									}
								)
								.then(() => {
									table.addRow(guild.name, "https://www.discord.gg/" + invite.code)
								})
							}
						}
						else {
							table.addRow(guild.name, "No invites")
						}
					}
				})
			}
		})
	} catch (e) {
		console.log(String(e.stack).bgRed)
	}


  try{
	const stringlength = 69;
	console.log("\n")
	console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
	console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
	console.log(`     ┃ `.bold.brightGreen + `Discord Bot is online!`.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.brightGreen)
	console.log(`     ┃ `.bold.brightGreen + `/--/ ${client.user.tag} /--/  `.bold.brightGreen+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".bold.brightGreen)
	console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.brightGreen)
	console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
  }catch{ /* */ }


  try{
	client.user.setActivity(client.user.username, { type: "PLAYING" });
  }catch (e) {
	  console.log(String(e.stack).red);
  }



  try {
	// If running on the raspberry
	if (process.env.NODE_ENV == 'production') {
		sendNinluc(client, `Le bot a redémarré à \`${moment().utcOffset(1).format('HH:mm:ss')}\` le \`${moment().utcOffset(1).format('DD/MM/YYYY')}\``)
	}
  }catch (e) {
	  console.log(String(e.stack).red);
  }



  const statusList = [
	{text: "s'upgrade 🔧"},
	{text: "t'emmerder"},
	{text: "[help"},
	{text: "[help"},
	{text: "[help"},
	{text: "Like ur cut G"},
	{text: "une dernière fois Daft Punk", type: "LISTENING"}
  ]
  var status, lastStatus = ""

  //Change status each 10 minutes
  setInterval(()=>{
	try{
		do {
			status = choose(statusList)
		} while (status == lastStatus);
		lastStatus = status

	  	// client.user.setActivity(client.user.username, { type: "PLAYING" });
	 	 client.user.setActivity(status.text, { type: status.type ? status.type : "PLAYING" });
	}catch (e) {
		console.log(String(e.stack).red);
	}
  }, ee.statusChangeInterval *1000)
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
