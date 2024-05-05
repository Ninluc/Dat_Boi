const uptime = require('../commands/Informations/uptime.js');
module.exports = {
	name: uptime.name,
	isPrivate: false,
	usage: uptime.usage,
    description: uptime.description,
	run: uptime.run,
};
