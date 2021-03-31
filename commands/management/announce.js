const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "announce",
    usage: "announcement message",
    permlevel: "MANAGE_ROLES",
    catergory: "management",
    description: `Staff only command to make an announcement.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_ROLES"))
            return;

        let botmessage = args.join(" ");

        let anEmbed = new Discord.MessageEmbed()
            .setTitle(`Staff Announcement`)
            .setColor("#ff9d4b")
            .addField("Message:", `**${botmessage}**`)
            .addField("Sent by", `${message.author}`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        message.delete().catch();
        await message.channel.send(anEmbed);
    }

};
