const Discord = require("discord.js");
module.exports = {
    name: "usercount",
    usage: "display amount of users",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Displays the current user count.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}
     */
    run: async function (client, message) {
        await message.channel.send({content: `__${message.guild.name}__ currently has **${message.guild.memberCount}** members in total.`});
    }
};
