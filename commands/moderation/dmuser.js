const Discord = require("discord.js");
const utils = require('../../lib/utils.js');

module.exports = {
    name: "dmuser",
    usage: "amount of messages",
    permLevel: "BAN_MEMBERS",
    category: "moderation",
    description: `DMs the tagged user with the specified text.`,

    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;

        let member;
        try {
            member = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!member) return message.channel.send({content: 'Unable to find user.'});

        let pmMessage = args.slice(1).join(" ");
        if (pmMessage.length < 1) return message.channel.send({content: 'You must supply a message!'});

        try {
            await member.send({content: `__You have a new message:__\n\n**${pmMessage}**`});
        } catch (e) {
            return message.channel.send({content: "I couldn't deliver the message, their DMs are closed or they aren't in the server."})
        }

        let logChannel = utils.findTextChannel(message.guild, "mod-logs");

        await logChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :speak_no_evil:  **${message.author.tag}** has sent an automated DM to **${member.tag}** *(${member.id})* \n\`Message Content:\` ${pmMessage}`});

        await message.channel.send({content: `Action \`dm user\` applied to ${member} successfully.`});

    }
};