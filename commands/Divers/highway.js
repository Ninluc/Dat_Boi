const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const misc = require("../../botconfig/misc.json");
const { delay } = require("../../handlers/functions");


function createLane(lanesNb, height, carPercent, specialCarPercent, separation, trees_distance) {
    // Check lanesNb
    if (lanesNb > 30) {
        return null;
    }
    
    // Default arguments
    lanesNb = lanesNb || 3;
    if (height > 300) {
        height = 300;
    } else {
        height = height || 30;
    }
    carPercent = carPercent || 15;
    specialCarPercent = specialCarPercent || 5;
    separation = separation || lanesNb >= 2 ? true : false
    trees_distance = trees_distance || 3

    ROAD_MIDDLE = Math.floor(lanesNb / 2)
    
    lanes = ""
    toSend = [];
    roadSeparation = Math.floor(Math.random() * 4) == 0
    separationLen = 0
    separationPart = 0
    for (i = 0; i<height;i++) {
        str = "";
        for (x = 0; x<lanesNb;x++) {
            // Try to get the separation back
            if (x == ROAD_MIDDLE && !roadSeparation && separationLen <= 0) {
                separationLen -= 1
                roadSeparation = Math.floor(Math.random() * (Math.abs(separationLen / (height / 5)))) != 0
            }

            // ROAD SEPARATION
            // Separation start
            if (separation && x == ROAD_MIDDLE && separationLen < 0 && roadSeparation) {
                str = str.slice(0, str.length - 1)
                
                if (separationPart == 1) {
                    str += ROAD_SEPARATION__START_2
                    separationPart = 0
                    separationLen = 0
                }
                else {
                    str += ROAD_SEPARATION__START_1
                    separationPart = 1
                }
            }
            // Separation end
            else if (separation && x == ROAD_MIDDLE && separationLen > 0 && !roadSeparation) {
                str = str.slice(0, str.length - 1)

                // if (separationLen < 0) {
                //     separationLen = 0
                // }

                if (separationPart == 1) {
                    str += ROAD_SEPARATION__END_2
                    separationPart = 0
                    separationLen = 0
                }
                else {
                    str += ROAD_SEPARATION__END_1
                    separationPart = 1
                }
            }
            else if (separation && x == ROAD_MIDDLE && roadSeparation) {
                str = str.slice(0, str.length - 1);
                if (separationLen % trees_distance == 0) {
                    str += ROAD_SEPARATION__TREE;
                } 
                else {
                    str += ROAD_SEPARATION;
                }
                separationLen += 1;

                roadSeparation = Math.floor(Math.random() * ((height/2) - separationLen)) != 0
            }
            else {

                // LEFT OUTER LANE
                if (x == 0) {
                    str += ROAD_LINE_CHAR;
                }
    
                if (Math.floor(Math.random() * (100/carPercent)) == 0) {
                    if (Math.floor(Math.random() * (100/specialCarPercent)) == 0) {
                        str += ROAD_WT_SPECIAL_CAR();
                    }
                    else {
                        str += ROAD_WT_CAR_CHAR;
                    }
                }
                else {
                    str += ROAD_CHAR;
                }
    
                // RIGHT OUTER LANE
                if (x == lanesNb -1) {
                    str += ROAD_LINE_CHAR;
                }
                else {
                    str += LANES_LINE_CHAR;
                }
            }

        }



        // MESSAGE LENGTH CHECK
        if ((lanes.length + str.length + 2) >= misc.MESSAGE_CHAR_LIMIT) {
            toSend.push(lanes);
            lanes = str + "\n"
        }
        else {
            lanes += str + "\n";
        }

    }
    toSend.push(lanes);

    // Slicing
    return toSend; 
}

module.exports = {
    name: "highway",
    category: "Divers",
    cooldown: 0,
    usage: "highway [nb_de_bandes] [hauteur] [pourcentage_de_voitures] [pourcentage_de_voitures_de_police] [separation_centrale (true | false)] [distance_entre_les_arbres]",
    description: 'Creer une autoroute juste pour vos beaux yeux.\n`nb_de_bandes` doit être plus petit ou égal à 30 (Limitation des longueurs de messages)',
    run: async (client, message, args, user, text, prefix) => {
    try{
        LANES_NB_MAX = 27;

        // ROAD_LINE_CHAR  = "︱";
        // ROAD_LINE_CHAR  = "❘";
        // ROAD_LINE_CHAR  = "❙";
        ROAD_LINE_CHAR  = "┃";
        LANES_LINE_CHAR = "।";
        // CENTRAL_LINE = "‖";    
        // ROAD_CHAR = "        ";
        // ROAD_CHAR = "                             ";
        ROAD_CHAR = "         ";
        ROAD_WT_CAR_CHAR = " 🚘 ";
        SPECIAL_CARS = ["🚔", "🚍", "🚖"];
        ROAD_WT_SPECIAL_CAR = () => {
            let car = SPECIAL_CARS[Math.floor(Math.random() * SPECIAL_CARS.length)];
            return ` ${car} `;
        };
        // ROAD_WT_POLICE_CAR_CHAR = " 🚔 ";
        ROAD_SEPARATION = ROAD_LINE_CHAR + "       " + ROAD_LINE_CHAR
        ROAD_SEPARATION__TREE = ROAD_LINE_CHAR + " 🌴 " + ROAD_LINE_CHAR
        ROAD_SEPARATION__END_1 = "  **\\ **     **/**  ";
        ROAD_SEPARATION__END_2 = "      **꣺**      ";
        ROAD_SEPARATION__START_1 = "     **^**     ";
        ROAD_SEPARATION__START_2 = "  **/**      **\\ ** ";

        // Check lanesNb
        if (args[0] > LANES_NB_MAX) {
            console.log("Highway : LanesNb is too long.");
            return message.channel.send({embeds : [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({text : ee.footertext, iconURL : ee.footericon})
                .setTitle(`❌ ERREUR | Largeur trop grande (\`nb_de_bandes\` > ${LANES_NB_MAX}) : \nUtilisez \`[help highway\` pour plus d'informations`)]
            });
        }

        highway = createLane(args[0], args[1], args[2], args[3], args[4], args[5]);
        // console.log("🚀 ~ file: highway.js ~ line 75 ~ run: ~ highway", highway);
        
        for (msg of highway) {
            if (msg != "") {
                message.channel.send({ content : msg});
                delay(30)
            }
        }
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
