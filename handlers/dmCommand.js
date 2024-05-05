const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("DM Commands");
table.setHeading("Command", "Load status");
module.exports = (client) => {
	try {
		const command = readdirSync(`./dmCommands/`).filter((file) =>
			file.endsWith(".js")
		); // Get all the js files
		for (let file of command) {
			let pull = require(`../dmCommands/${file}`);
			if (pull.name) {
				client.dmCommands.set(pull.name, pull);
				table.addRow(pull.name, "Ready");
			} else {
				table.addRow(
					file,
					`error->missing a help.name,or help.name is not a string.`
				);
				continue;
			}
		}
		console.log(table.toString().cyan);
	} catch (e) {
		console.log(String(e.stack).bgRed);
	}
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
