const utils = require('../../lib/utils.js');
module.exports = {
    name: "say",
    usage: "make the bot say whatever you want",
    permlevel: "BAN_MEMBERS",
    catergory: "general",
    description: `Staff only command to make the bot say whatever you type.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "BAN_MEMBERS"))
            return;

        let saytext = args.join(" ");
        if (utils.isBlank(saytext)) {
            message.delete().catch();
            await message.channel.send("_ _"); //Discord does not allow us to send a blank message, so send something similar.
        } else {
            message.delete().catch();
            await message.channel.send(saytext);
        }
    }

};