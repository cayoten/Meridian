const Discord = require("discord.js");
module.exports = {
    name: "userinfo",
    usage: "display amount of users",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Display's the @'ed user's information.`,

    run: async function (client, message, args) {

        let checkUser = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!checkUser) return message.channel.send(`${message.author}, user not found.`);

        const joinDate = checkUser.joinedAt;//Change this
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = joinDate.getFullYear();
        const month = months[joinDate.getMonth()];
        const date = joinDate.getDate();
        const hour = joinDate.getHours();
        const min = joinDate.getMinutes();
        const sec = joinDate.getSeconds();
        const joinTime = month + ' ' + date + ' ' + year + ' ' + '@' + ' ' + hour + ':' + min + ':' + sec;

        const merge = "https://images.google.com/searchbyimage?image_url=";


        const memberInfo = new Discord.MessageEmbed()
            .setTitle(`${checkUser.user.username}`)
            .setDescription(`[**Avatar Reverse Image Search**](${merge + checkUser.user.displayAvatarURL()})`)
            .addField("ID", `${checkUser.id}`)
            .addField("Created At", `${checkUser.user.createdAt}`)
            .addField("Joined At", joinTime)
            .addField("Status", `${checkUser.presence?.status || "unknown"}`)
            .setThumbnail(checkUser.user.displayAvatarURL())
            .setTimestamp();

        await message.channel.send({embeds: [memberInfo]});
    }
}