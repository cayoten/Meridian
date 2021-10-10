const Discord = require("discord.js");
module.exports = {
    name: "ping",
    usage: "shows bot ping",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Shows the bot's ping.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}
     */
    run: async function (client, message) {
        /**@type {Discord.Message}*/
        const msg = await message.channel.send({content: "WHO HATH PING ME???"});
        await msg.edit(`Pong! The Bot's Latency is **${msg.createdTimestamp - message.createdTimestamp}ms**, and the API Latency is **${Math.round(client.ws.ping)}ms**.`);

    }

};
