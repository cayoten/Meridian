const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "kick",
    usage: "< id / mention >",
    permlevel: "KICK_MEMBERS",
    catergory: "moderation",
    description: `Kicks the tagged user with a reason.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {

        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        if (!args[0]) return message.reply({content:"You didn't specify a member."});


        let kUser;
        try {
            kUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!kUser) return message.channel.send({content:'Unable to find user.'});

        const member = message.guild.members.cache.get(kUser.id);
        if (member && member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.reply({content:"I can't kick that person."})
                .then(m => setTimeout(() => m.delete(), 5000));
        }

        const reason = args.slice(1).join(' ') || 'No reason specified.';

        let incidents = utils.findTextChannel(message.guild, "mod-logs")
        if (!incidents) {
            return message.channel.send({content:`:warning: Cannot find the "mod-logs" channel.`});
        }

        try {
            await kUser.send({content:`You have been kicked for the reason: **${reason}**`});
        } catch (e) {
        }
        await message.channel.send(`The user ${kUser} has been kicked.`);
        incidents.send({content:`\`[${utils.epochToHour(Date.now())}]\` :boot: **${message.author.tag}** has performed action: \`kick\` \n\`Affected User:\` **${kUser.tag}** *(${kUser.id})* \n\`Reason:\` ${reason}`});
        await member.kick(reason);
    }
};

