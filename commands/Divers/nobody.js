const { MessageEmbed, AttachmentBuilder } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const fs = require('fs');
const client = require('https');

const minImgNb = 3316;
const maxImgNb = 4316;

tries = 0;
const triesLimit = 30;

/* function getUrl() {
  tries += 1;
  if (tries == triesLimit) {
    reject(new Error(`Too much request tries`));
  }

  randomNb = Math.floor(Math.random() * (maxImgNb - minImgNb)) + minImgNb;
  console.log(randomNb);
  return `https://thispersondoesnotexist.xyz/img/${randomNb}.jpg`;
} */
function getUrl() {
  return "https://thispersondoesnotexist.com/"
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        // reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
        console.log("Rien trouvé");
        
        downloadImage(getUrl(), filepath);
      }
    });
  });
}

module.exports = {
    name: "nobody",
    category: "Divers",
    cooldown: 1,
    usage: "nobody",
    description: 'Vous affiche un nobody...',
    run: async (client, message, args, user, text, prefix) => {
    try{

      IMG_PATH = './nobody.jpeg'

      // We get the image
      // downloadImage('https://thispersondoesnotexist.com/image', IMG_PATH)
      downloadImage(getUrl(), IMG_PATH)
      .then(
        (onResolved) => {
          return message.channel.send({embeds : [new MessageEmbed()
            .setColor(ee.color)
            .setFooter({text : ee.footertext, iconURL : ee.footericon})
            .setImage('attachment://nobody.jpeg')
          ], files: [IMG_PATH]})
        }
      )

    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send({embeds : [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({text : ee.footertext, iconURL : ee.footericon})
            .setTitle(`❌ ERREUR | Une erreur est survenue : `)
            .setDescription(`\`\`\`${e.stack}\`\`\``)]
        });
    }
  }
}

/** Template by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template */
