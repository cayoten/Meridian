const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "poll",
    usage: "{question}",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Staff only command to create a poll with the specified question.`,

    run: async function (client, message, args) {

        //Check perms
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_ROLES))
            return;

        //Delete command
        if (message.deletable) await message.delete();

        //If no args, return
        if (!args[0]) return message.channel.send({content: "Question not defined."});

        //Create poll embed
        const pollEmbed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle(`Server Poll`)
            .setDescription(args.join(" "))
            .setTimestamp();

        //Send message
        let msg = await message.channel.send({embeds: [pollEmbed]});

        //Add reactions
        await msg.react("✔");
        await msg.react("✖");

    }

};