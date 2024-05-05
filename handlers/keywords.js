const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Keyword triggers");
table.setHeading("Keyword", "Load status");
module.exports = (client) => {
  try{
    const keywords = readdirSync(`./keywords/`).filter((file) => file.endsWith(".js")); // Get all the js files
    for (let file of keywords) {
        let pull = require(`../keywords/${file}`);
        if (pull.keyword) {
            client.keywords.set(pull.regex, pull);
            table.addRow(pull.keyword, "Ready");
        } else {
            table.addRow(file, `error->missing a help.keyword,or help.keyword is not a string.`);
            continue;
        }
        if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.keywords.set(alias, pull));
    }
    console.log(table.toString().cyan);
  }catch (e){
    console.log(String(e.stack).bgRed)
  }
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
