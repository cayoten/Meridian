const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const ms = require("ms");

module.exports = {
    name: "timeout",
    usage: "< id / mention > <reason>",
    permLevel: "KICK_MEMBERS",
    category: "moderation",
    description: `Times out the tagged user with a time and reason.`,

    run: async function (client, message, args) {

        //$timeout @user 1s/m/h/d
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        //Define toMute and member
        let toMute = message.mentions.users.first() || await client.users.fetch(args[0]);
        if (!toMute) return message.channel.send({content: 'Unable to find user.'});

        const member = message.guild.members.cache.get(toMute.id);

        //Define mute time
        let muteTime = args[1];
        if (!muteTime) {
            return message.channel.send({content: "Invalid time."});
        }

        //Set reason or set to None specified
        let reason = args.slice(2).join(' ') || "No reason specified";

        //Set up mute channel and return if not found
        let muteChannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!muteChannel) {
            return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
        }

        //Wrap in a try in case DMs are closed, cringe!
        try {
            await toMute.send({content: `You have been given a timeout for \`${muteTime}\` with the reason: **${reason}**`});
        } catch (e) {
        }

        //Mute and log
        await member.disableCommunicationUntil(Date.now() + ms(muteTime), reason)
        await muteChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :no_mouth: **${message.author.tag}** has performed action: \`timeout\`. \n**\`Affected User:\`${toMute.tag}** *(${toMute.id})*. \n\`Duration:\` ${ms(ms(muteTime))}\n\`Reason:\` ${reason}`});
        await message.channel.send({content: `Action \`timeout user\` has been applied successfully to <@${toMute.id}> for ${muteTime}`});

    }

};