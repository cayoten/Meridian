const Discord = require("discord.js");
module.exports = {
    name: "avatar",
    usage: "display amount of users",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Display's the @'ed user's avatar.`,
    run: async function (client, message) {

        if (message.channel.name === "general-chat" && !message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("you cannot use that command in this channel!")
        }

        const user = message.mentions.users.first() || message.author;
        if (!user) return message.reply("user not found.");

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(user.username)
            .setImage(user.avatarURL() + "?size=512");
        await message.channel.send(avatarEmbed);
    }
}
