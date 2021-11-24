const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "strikes",
    usage: "< id / mention > ",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Shows the amount of Strikes for a user.`,

    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!wUser) return message.channel.send({content: 'Unable to find user.'});

        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        let userWarns = warns[message.guild.id][wUser.id];
        //Let's list warns by index
        if (userWarns.length > 0) {
            let warnMessage = `Listing **${userWarns.length}** strikes for user ${wUser}.\n`;
            userWarns.forEach((item, index) => {
                warnMessage = warnMessage + `\`Strike ID:\` ${index} \`Strike Reason:\` ${item}\n`;
            })
            await message.channel.send({content: warnMessage});
        } else {
            await message.channel.send({content: `This user holds 0 strikes.`});
        }

    }

};