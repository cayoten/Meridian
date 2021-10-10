const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "announce",
    usage: "announcement message",
    permLevel: "MANAGE_ROLES",
    category: "management",
    description: `Staff only command to make an announcement.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_ROLES))
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
        await message.channel.send({embeds:[anEmbed]});
    }

};
