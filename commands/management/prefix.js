const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "prefix",
    usage: "prefix add / remove",
    permLevel: "MANAGE_GUILD",
    category: "management",
    description: `Sets the server's prefix.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (args[0] === "set") {
            if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_GUILD)) return;
            if (!client.dataStorage.serverData[message.guild.id]) client.dataStorage.serverData[message.guild.id] = {};
            if (message.deletable)
                await message.delete()

            client.dataStorage.serverData[message.guild.id]["prefix"] = args.slice(1).join(" ")
            message.channel.send({content:`This guild's prefix has been set to \`${args.slice(1).join(" ")}\``})
        } else if (args[0] === "del") {
             if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_GUILD)) return;
             if (!client.dataStorage.serverData[message.guild.id]) client.dataStorage.serverData[message.guild.id] = {};
             if (client.dataStorage.serverData[message.guild.id]["prefix"]) delete client.dataStorage.serverData[message.guild.id]["prefix"]
             message.channel.send({content:"I deleted the prefix!"})
        }
        else {
            const prefixes = ['$', '🐾', 'paw']
            try {
                if (client.dataStorage.serverData[message.guild.id]) {
                    if (client.dataStorage.serverData[message.guild.id]["prefix"]) prefixes.push(client.dataStorage.serverData[message.guild.id]["prefix"])
                }
            } catch(e) {}
            message.channel.send({content:`This guild's prefixes: ${prefixes.join(', ')}`})
        }
    }
}
