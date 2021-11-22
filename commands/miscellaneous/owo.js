const Discord = require("discord.js");
module.exports = {
    name: "owo",
    usage: "< id / mention >",
    permLevel: "SEND_MESSAGES",
    category: "miscellaneous",
    description: `What's this?`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {

        await message.channel.send({content:`OwO what's this?`});
        message.delete().catch();

    }

};