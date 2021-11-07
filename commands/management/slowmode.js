const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "slowmode",
    usage: "slowmode server",
    permLevel: "MANAGE_CHANNELS",
    category: "management",
    description: `Staff only command to set slowmode. Define seconds to set to Discord Slowmode`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_CHANNELS))
            return;

        message.delete().catch();


        let time = args[0];

        if (time === "off") {
            await message.channel.setRateLimitPerUser(0);
            await message.channel.send("Slowmode set to \`off\`.")
        } else if (time === undefined) {
            return message.channel.send(`Enable slowmode by defining the time in seconds, or turn it off by setting it to \`off\`.`);
        } else {
            await message.channel.setRateLimitPerUser(time);
            await message.channel.send(`Slowmode set to nearest time matching \`${time}\` seconds.`)
        }
    }

};
