const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "poll",
    usage: "{question}",
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_ROLES"))
            return;

        if (!args[0]) return message.channel.send("Usage for this command: $poll {question}.");

        const pollEmbed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle(`Server Poll`)
            .setDescription(args.join(" "))
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let msg = await message.channel.send(pollEmbed);

        await msg.react("✔");
        await msg.react("✖");

        message.delete({timeout: 1000});

    }

};