const Discord = require("discord.js");
module.exports = {
    name: "bap",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "miscellaneous",
    description: `Beans the user tagged.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        let bapUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!bapUser) return message.reply({content:"user not found."});
        if (message.mentions.members.first().user === message.author) return message.reply({content: "you can't roleplay with yourself!"});

        await message.channel.send({content:`*baps ${bapUser}* \nNO! BAD!`});
        message.delete().catch();

    }

};