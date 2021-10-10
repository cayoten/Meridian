const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const ms = require("ms");
module.exports = {
    name: "tempban",
    usage: "< id / mention >",
    permLevel: "BAN_MEMBERS",
    category: "moderation",
    description: `Temporarily ban a user. For example, $tempban @user 30m Reason`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {

        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;


        if (!args[0]) return message.channel.send({content: "Where the hell is the member I need to ban?"});

        let bUser;
        try {
            bUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!bUser) return message.channel.send({content: 'Unable to find user.'});

        const member = message.guild.members.cache.get(bUser.id);
        if (member && member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send({content: "I can't ban that person."})
                .then(m => setTimeout(() => m.delete(), 5000));
        }

        let bantime = args[1];
        if (!bantime) {
            return message.channel.send({content:"You didn't specify a time!"});
        }

        if((ms(bantime) === undefined)) { return message.channel.send({content:"an invalid ban time was supplied."})}


        const reason = args.slice(2).join(' ') || 'No reason specified.';

        let incidents = utils.findTextChannel(message.guild, "mod-logs");
        if (!incidents) {
            return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
        }

        try {
            await bUser.send({content:`You have been banned for ${ms(ms(bantime))} for the reason: **${reason}**`});
        } catch (e) {
        }
        await message.channel.send({content:`Action \`tempban\` on user ${bUser} has been applied successfully.`});
        await incidents.send({content: `\`[${utils.epochToHour(Date.now())}]\` :timer: **${message.author.tag}** has performed action: \`tempban\` \n\`Affected User:\` **${bUser.tag}** *(${bUser.id})*\n\`Duration:\` ${ms(ms(bantime))} \n\`Reason:\` ${reason}`});
        await message.guild.members.ban(bUser, {reason: reason});

        client.dataStorage.addUserBan(bUser.id, message.guild.id, ms(bantime));

    }

};

