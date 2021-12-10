const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "pardon",
    usage: "< id > < warnId>",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Pardons a strike from the tagged user.`,

    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        let warnUser;
        try {
            warnUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!warnUser) return message.channel.send({content: 'Unable to find user.'});

        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][warnUser.id]) warns[message.guild.id][warnUser.id] = [] ///Create a new empty array fot this user.

        if (warns[message.guild.id][warnUser.id].length === 0) {
            return message.channel.send({content: "This user has no strikes!"})
        }

        if (isNaN(args[1]) || args[1] < 0 || args[1] >= warns[message.guild.id][warnUser.id].length) {
            return message.channel.send({content: "Please provide a valid Strike ID!"})
        }

        let removedWarn = warns[message.guild.id][warnUser.id].splice(args[1], 1); //Remove the warn.

        client.dataStorage.saveData()

        let warnChannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!warnChannel) {
            return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
        }

        await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :heavy_minus_sign: **${message.author.tag}** has performed action: \`pardon\`\n\`Affected User:\` **${warnUser.tag}** *(${warnUser.id})*\n\`Strike Reason:\`${removedWarn[0]}\n\`Active Strike Count:\` ${warns[message.guild.id][warnUser.id].length}`});
        message.channel.send({content: "Action \`pardon user\` applied successfully."});
    }
};