const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "nolog",
    usage: "nolog add / remove",
    permLevel: "MANAGE_CHANNELS",
    category: "management",
    description: `A command to allow whitelisting of channels from logging.`,

    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_CHANNELS))
            return;

        if (!client.dataStorage.serverData[message.guild.id]) client.dataStorage.serverData[message.guild.id] = {};
        if (!client.dataStorage.serverData[message.guild.id]["nolog"]) client.dataStorage.serverData[message.guild.id]["nolog"] = []

        if (args[0] === "add") {

            if (message.deletable) message.delete();

            let noLogChannel = args.slice(1).join(" ");

            if (message.guild.channels.cache.get(noLogChannel)) {

                client.dataStorage.serverData[message.guild.id]["nolog"].push(noLogChannel);

                client.dataStorage.saveData();

                message.channel.send({content: "The specified channel has been added!"});

            } else {
                return message.channel.send({content: "Hmm, are you sure that channel exists? I can't find it."})
            }

        } else if (args[0] === "remove") {

            if (message.deletable) message.delete();

            if (isNaN(args[1]) || args[1] < 0 || args[1] >= client.dataStorage.serverData[message.guild.id]["nolog"].length) {
                return message.channel.send({content: "Please provide a valid log!"})
            }

            client.dataStorage.serverData[message.guild.id]["nolog"].splice(args[1], 1); //Remove the warn.

            client.dataStorage.saveData();

            message.channel.send({content: "I have removed the channel from the log!"});

        } else if (args[0] === "list") {

            if (message.deletable) message.delete();

            if (client.dataStorage.serverData[message.guild.id]["nolog"].length > 0) {
                let nologMessage = `This list contains **${client.dataStorage.serverData[message.guild.id]["nolog"].length}** channels.\n`;
                client.dataStorage.serverData[message.guild.id]["nolog"].forEach((item, index) => {
                    nologMessage = nologMessage + `\`DB ID:\` ${index} \`Channel ID:\` ${item}\n`;
                })
                await message.channel.send({content: nologMessage})
            }
        }
    }
}