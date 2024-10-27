const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Timed messages");
table.setHeading("Name", "Load status");
module.exports = (client) => {
  try{
    const timesMessagesFiles = readdirSync(`./timedMessages/`).filter((file) => file.endsWith(".js")); // Get all the js files
    for (let file of timesMessagesFiles) {
        let pull = require(`../timedMessages/${file}`);
        if (pull.name && pull.time) {
          ([hour, second] = pull.time.split(":"))

          function getNextRunETA(hour, second) {
            var todayDate = new Date();
            var nextRunDate = new Date();
            nextRunDate.setHours(hour, second, 0)
            if (nextRunDate <= todayDate) {
              nextRunDate.setDate(todayDate.getDate() + 1)
            }
            return nextRunDate - todayDate;
          }

          function runMessage(hour, second) {
            pull.run(client)
            
            setTimeout(runMessage, getNextRunETA(hour, second), hour, second)
          }
          
          setTimeout(runMessage, getNextRunETA(hour, second), hour, second)

          table.addRow(pull.name, "Ready");
        } else {
            table.addRow(file, `error->missing a name or time or is not a string.`);
            continue;
        }
    }
    console.log(table.toString().cyan);
  }catch (e){
    console.log(String(e.stack).bgRed)
  }
};

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
