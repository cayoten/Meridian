const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "unmute",
    usage: "< id / mention >",
    permLevel: "KICK_MEMBERS",
    category: "moderation",
    description: `Unbans the tagged user.`,

    run: async function (client, message, args) {

        //!mute @user 1s/m/h/d reason
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        let muterole = message.guild.roles.cache.find(r => r.name === "Muted");

        let tomute;
        try {
            tomute = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!tomute) return message.channel.send({content: 'Unable to find user.'});
        const member = message.guild.members.cache.get(tomute.id);
        // FIXME: Is this permission check right? - juan
        if (member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
            return message.channel.send({content: ":heavy_multiplication_x: You cannot mute them!"});
        }

        let unmutechannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!unmutechannel) {
            return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
        }

        if (!member.roles.cache.some(r => r.name === "Muted"))
            return message.channel.send({content: "User isn't muted!"});


        client.dataStorage.removeMute(member.id, message.guild.id);
        await (member.roles.remove(muterole.id));
        await unmutechannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :speaking_head:  **${message.author.tag}** has performed action: \`unmute\` \n\`Affected User:\` **${tomute.tag}** *(${tomute.id})*`});
        await message.channel.send({content: `Action \`unmute\` applied to ${tomute} successfully.`});

    }

};