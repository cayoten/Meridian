const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "release",
    usage: "< id / mention >",
    permLevel: "KICK_MEMBERS",
    category: "moderation",
    description: `Frees the tagged user from timeout.`,

    run: async function (client, message, args) {

        //$release <@user>
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        //Define toMute & member
        let toMute = message.mentions.users.first() || await client.users.fetch(args[0]);
        if (!toMute) return message.channel.send({content: 'Unable to find user.'});

        const member = message.guild.members.cache.get(toMute.id);

        // Mod logging channel
        let modLogChannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!modLogChannel) {
            return message.channel.send({content: "Error encountered: `MISSING_CHANNEL: mod-logs`."});
        }

        //Take action
        await member.disableCommunicationUntil(null);
        await modLogChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :speaking_head:  **${message.author.tag}** has performed action: \`remove timeout\` \n\`Affected User:\` **${toMute.tag}** *(${toMute.id})*`});
        await message.channel.send({content: `Action \`remove timeout\` applied to ${toMute} successfully.`});

    }

};