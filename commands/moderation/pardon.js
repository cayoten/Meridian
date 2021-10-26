const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "pardon",
    usage: "< id > < warnId>",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Pardons a strike from the tagged user.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!wUser) return message.channel.send({content:'Unable to find user.'});

        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        if (warns[message.guild.id][wUser.id].length === 0) {
            return message.channel.send({content:"This user has no strikes!"})
        }

        if (isNaN(args[1]) || args[1] < 0 || args[1] >= warns[message.guild.id][wUser.id].length) {
            return message.channel.send({content:"Please provide a valid Strike ID!"})
        }

        let removedWarn = warns[message.guild.id][wUser.id].splice(args[1], 1); //Remove the warn.

        client.dataStorage.saveData()

        let warnchannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!warnchannel) {
            return message.channel.send({content:`:warning: Cannot find the "mod-logs" channel.`});
        }

        await warnchannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :heavy_minus_sign: **${message.author.tag}** has performed action: \`pardon\`\n\`Affected User:\` **${wUser.tag}** *(${wUser.id})*\n\`Strike Reason:\`${removedWarn[0]}\n\`Active Strike Count:\` ${warns[message.guild.id][wUser.id].length}`});
        message.channel.send({content: "Action \`pardon user\` applied successfully."});
    }
};