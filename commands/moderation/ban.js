const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "ban",
    usage: "< id / mention >",
    permLevel: "BAN_MEMBERS",
    category: "moderation",
    description: `Bans the tagged user with a reason.`,

    run: async function (client, message, args) {

        if (message.deletable) await message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;

        if (!args[0]) return message.channel.send({content: "Where the hell is the member I need to ban?"});

        let banUser;
        try {
            banUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!banUser) return message.channel.send({content: 'Unable to find user.'});

        const member = message.guild.members.cache.get(banUser.id);
        if (member && member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send({content: "I can't ban that person."})
                .then(m => setTimeout(() => m.delete(), 5000));
        }

        const reason = args.slice(1).join(' ') || 'No reason specified.';

        let modLogChannel = utils.findTextChannel(message.guild, "mod-logs")
        if (!modLogChannel) {
            return message.channel.send({content: "Error encountered: `MISSING_CHANNEL: mod-logs`."});
        }

        const userId = banUser.id;
        const guildId = message.guild.id;
        if (client.dataStorage.isUserBanned(userId, guildId)) {
            client.dataStorage.removeBan(userId, guildId)
        }

        try {
            await banUser.send({content: `You have been banned for the reason: **${reason}**`});
        } catch (e) {
        }
        await message.channel.send({content: `Action \`ban user\` applied to ${banUser} successfully.`});
        await modLogChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :hammer: **${message.author.tag}** has performed action: \`ban\` \n\`Affected User:\` **${banUser.tag}** *(${banUser.id})* \n\`Reason:\` ${reason}`});
        await message.guild.members.ban(banUser, {days: 7, reason: reason});
    }

};

