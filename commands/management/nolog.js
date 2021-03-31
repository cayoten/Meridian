const utils = require('../../lib/utils.js');
module.exports = {
    name: "nolog",
    usage: "nolog add / remove",
    permlevel: "MANAGE_CHANNELS",
    catergory: "management",
    description: `A command to allow whitelisting of channels from logging.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_CHANNELS"))
            return;

        if (!client.dataStorage.serverData[message.guild.id]) client.dataStorage.serverData[message.guild.id] = {};
        if (!client.dataStorage.serverData[message.guild.id]["nolog"]) client.dataStorage.serverData[message.guild.id]["nolog"] = []

        if (args[0] === "add") {

            if (message.deletable) message.delete();

            let nologchannel = args.slice(1).join(" ");

            if (message.guild.channels.cache.get(nologchannel)) {

                client.dataStorage.serverData[message.guild.id]["nolog"].push(nologchannel);

                client.dataStorage.saveData();

                message.channel.send("The specified channel has been added!");

            } else {
                return message.channel.send("Hmm, are you sure that channel exists? I can't find it.")
            }

        } else if (args[0] === "remove") {

            if (message.deletable) message.delete();

            if (isNaN(args[1]) || args[1] < 0 || args[1] >= client.dataStorage.serverData[message.guild.id]["nolog"].length) {
                return message.reply("Please provide a valid log!")
            }

            client.dataStorage.serverData[message.guild.id]["nolog"].splice(args[1], 1); //Remove the warn.

            client.dataStorage.saveData();

            message.reply("I have removed the channel from the log!");

        } else if (args[0] === "list") {

            if (message.deletable) message.delete();

            if (client.dataStorage.serverData[message.guild.id]["nolog"].length > 0) {
                let nologMessage = `This list contains **${client.dataStorage.serverData[message.guild.id]["nolog"].length}** channels.\n`;
                client.dataStorage.serverData[message.guild.id]["nolog"].forEach((item, index) => {
                    nologMessage = nologMessage + `\`DB ID:\` ${index} \`Channel ID:\` ${item}\n`;
                })
                await message.reply(nologMessage)
            }
        }
    }
}