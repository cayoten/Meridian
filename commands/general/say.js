const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "say",
    usage: "make the bot say whatever you want",
    permLevel: "BAN_MEMBERS",
    category: "general",
    description: `Staff only command to make the bot say whatever you type.`,

    run: async function (client, message, args) {

        //Check perms
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;

        //Catch argument, or set to _ _ to prevent bot from throwing error then send
        let sayText = args.join(" ");
        if (utils.isBlank(sayText)) {
            message.delete().catch();
            await message.channel.send({content: "_ _"}); //Discord does not allow us to send a blank message, so send something similar.
        } else {
            message.delete().catch();
            await message.channel.send({content: sayText, allowedMentions: {parse: []}});
        }
    }

};