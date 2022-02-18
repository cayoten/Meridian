const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const ms = require("ms");
module.exports = {
    name: "tempban",
    usage: "< id / mention >",
    permLevel: "BAN_MEMBERS",
    category: "moderation",
    description: `Temporarily ban a user. For example, $tempban @user 30m Reason`,

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

        let banTime = args[1];
        if (!banTime) {
            return message.channel.send({content: "You didn't specify a time!"});
        }

        if ((ms(banTime) === undefined)) {
            return message.channel.send({content: "an invalid ban time was supplied."})
        }


        const reason = args.slice(2).join(' ') || 'No reason specified.';

        let incidents = utils.findTextChannel(message.guild, "mod-logs");
        if (!incidents) {
            return message.channel.send({content: "Error encountered: `MISSING_CHANNEL: mod-logs`."});
        }

        try {
            await banUser.send({content: `You have been banned for ${ms(ms(banTime))} for the reason: **${reason}**`});
        } catch (e) {
        }
        await message.channel.send({content: `Action \`tempban\` on user ${banUser} has been applied successfully.`})
            .then(m => setTimeout(() => m.delete(), 5000));
        await incidents.send({content: `\`[${utils.epochToHour(Date.now())}]\` :timer: **${message.author.tag}** has performed action: \`tempban\` \n\`Affected User:\` **${banUser.tag}** *(${banUser.id})*\n\`Duration:\` ${ms(ms(banTime))} \n\`Reason:\` ${reason}`});
        await message.guild.members.ban(banUser, {reason: reason});

        client.dataStorage.addUserBan(banUser.id, message.guild.id, ms(banTime));

    }

};

