const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "filter",
    usage: "filter add / remove",
    permlevel: "MANAGE_ROLES",
    catergory: "management",
    description: `A complex filter command per-server. Use $filter add (word or words WITHOUT SPACES) to create a word, $filter remove (ID) to remove a word, and $filter list to view word IDs.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_ROLES"))
            return;

        if (!client.dataStorage.serverData[message.guild.id]) client.dataStorage.serverData[message.guild.id] = {};
        if (!client.dataStorage.serverData[message.guild.id]["filter"]) client.dataStorage.serverData[message.guild.id]["filter"] = ["discordgg", "discordcominvite"]

        if (args[0] === "add") {

            if (message.deletable) message.delete();

            let filterword = args.slice(1).join(" ");

            client.dataStorage.serverData[message.guild.id]["filter"].push(filterword);

            client.dataStorage.saveData();

            message.channel.send("The specified word has been added!");
        } else if (args[0] === "remove") {

            if (message.deletable) message.delete();

            if (isNaN(args[1]) || args[1] < 0 || args[1] >= client.dataStorage.serverData[message.guild.id]["filter"].length) {
                return message.reply("Please provide a valid Strike ID!")
            }

            client.dataStorage.serverData[message.guild.id]["filter"].splice(args[1], 1); //Remove the warn.

            client.dataStorage.saveData();

            message.reply("I have removed the word from the filter!");

        } else if (args[0] === "list") {

            if (message.deletable) message.delete();

            if (client.dataStorage.serverData[message.guild.id]["filter"].length > 0) {
                let filterMessage = `This filter contains **${client.dataStorage.serverData[message.guild.id]["filter"].length}** words.\n`;
                client.dataStorage.serverData[message.guild.id]["filter"].forEach((item, index) => {
                    filterMessage = filterMessage + `\`Word ID:\` ${index} \`Word:\` ||${item}||\n`;
                })
                await message.reply(filterMessage)
            }
        }
    }
}