const Discord = require("discord.js");
module.exports = {
    name: "avatar",
    usage: "display amount of users",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Display's the @'ed user's avatar.`,

    run: async function (client, message) {
        if (message.channel.name === "general-chat" && !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send("You cannot use that command in this channel!");
        }

        const user = message.mentions.users.first() || message.author;
        if (!user) return message.channel.send(`Couldn't find defined user.`);

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(user.username)
            .setImage(user.avatarURL() + "?size=512");
        await message.channel.send(`Displaying avatar for user \`${user.username}\``);
        await message.channel.send({embeds: [avatarEmbed]});
    }
}
