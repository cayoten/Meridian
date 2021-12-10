const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "kick",
    usage: "< id / mention >",
    permLevel: "KICK_MEMBERS",
    category: "moderation",
    description: `Kicks the tagged user with a reason.`,

    run: async function (client, message, args) {

        if (message.deletable) await message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        if (!args[0]) return message.channel.send({content: "You didn't specify a member."});


        let kickUser;
        try {
            kickUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!kickUser) return message.channel.send({content: 'Unable to find user.'});

        const member = message.guild.members.cache.get(kickUser.id);
        if (member && member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send({content: "I can't kick that person."})
                .then(m => setTimeout(() => m.delete(), 5000));
        }

        const reason = args.slice(1).join(' ') || 'No reason specified.';

        let incidents = utils.findTextChannel(message.guild, "mod-logs")
        if (!incidents) {
            return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
        }

        try {
            await kickUser.send({content: `You have been kicked for the reason: **${reason}**`});
        } catch (e) {
        }
        await message.channel.send(`Action \`kick user\` applied to ${kickUser} successfully.`);
        await incidents.send({content: `\`[${utils.epochToHour(Date.now())}]\` :boot: **${message.author.tag}** has performed action: \`kick\` \n\`Affected User:\` **${kickUser.tag}** *(${kickUser.id})* \n\`Reason:\` ${reason}`});
        await member.kick(reason);
    }
};

