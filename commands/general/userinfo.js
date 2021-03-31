const Discord = require("discord.js");
module.exports = {
    name: "userinfo",
    usage: "display amount of users",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Display's the @'ed user's information.`,
    run: async function (client, message, args) {

        let tocheck = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!tocheck) return message.reply("user not found.");

        const joinDate = tocheck.joinedAt;//Change this
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = joinDate.getFullYear();
        const month = months[joinDate.getMonth()];
        const date = joinDate.getDate();
        const hour = joinDate.getHours();
        const min = joinDate.getMinutes();
        const sec = joinDate.getSeconds();
        const joinTime = month + ' ' + date + ' ' + year + ' ' + '@' + ' ' + hour + ':' + min + ':' + sec;

        const memberinfo = new Discord.MessageEmbed()
            .setTitle(`${tocheck.user.username}`)
            .addField("ID", `${tocheck.id}`)
            .addField("Created At", `${tocheck.user.createdAt}`)
            .addField("Joined At", joinTime)
            .addField("Status", `${tocheck.user.presence.status}`)
            .setThumbnail(tocheck.user.displayAvatarURL())
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        await message.channel.send(memberinfo);
    }
}