const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "say",
    usage: "make the bot say whatever you want",
    permLevel: "BAN_MEMBERS",
    category: "general",
    description: `Staff only command to make the bot say whatever you type.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;

        let saytext = args.join(" ");
        if (utils.isBlank(saytext)) {
            message.delete().catch();
            await message.channel.send({content: "_ _"}); //Discord does not allow us to send a blank message, so send something similar.
        } else {
            message.delete().catch();
            await message.channel.send({content: saytext, allowedMentions: {parse:[]}});
        }
    }

};