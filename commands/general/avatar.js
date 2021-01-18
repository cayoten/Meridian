const Discord = require("discord.js");
module.exports = {
    name: "avatar",
    usage: "display amount of users",
    run: async function (client, message) {

        const user = message.mentions.users.first() || message.author;
        if(!user) return message.reply("user not found.");

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(user.username)
            .setImage(user.avatarURL() + "?size=512");
        await message.channel.send(avatarEmbed);
    }
}
