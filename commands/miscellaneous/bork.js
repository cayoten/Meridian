const Discord = require("discord.js");
module.exports = {
    name: "bork",
    usage: "f!bork",
    permLevel: "SEND_MESSAGES",
    category: "miscellaneous",
    description: `Bork bork bork!`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}
     */
    run: async function (client, message) {

        await message.channel.send({content:`*borkborkborkborkborkbork*`});
        message.delete().catch();

    }

};