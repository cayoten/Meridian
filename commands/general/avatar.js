const Discord = require("discord.js");
const utils = require('../../lib/utils.js');

module.exports = {
    name: "avatar",
    usage: "display amount of users",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Display's the @'ed user's avatar.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}
     */
    run: async function (client, message) {
        if (message.channel.name === "general-chat" && !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send("you cannot use that command in this channel!")
        }

        const user = message.mentions.users.first() || message.author;
        if (!user) return message.channel.send(`${message.author}, user not found.`);

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(user.username)
            .setImage(user.avatarURL() + "?size=512");
        await message.channel.send({embeds:[avatarEmbed]});
    }
}
