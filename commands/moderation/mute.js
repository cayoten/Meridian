const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const ms = require("ms");

module.exports = {
    name: "mute",
    usage: "< id / mention > <reason>",
    permLevel: "KICK_MEMBERS",
    category: "moderation",
    description: `Mutes the tagged user with a time and reason.`,

    run: async function (client, message, args) {

        //!mute @user 1s/m/h/d
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        let toMute;
        try {
            toMute = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        if (!toMute) return message.channel.send({content: 'Unable to find user.'});

        const member = message.guild.members.cache.get(toMute.id);
        try {
            if (member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
                return message.channel.send({content: ":heavy_multiplication_x: You cannot mute them!"});
            }
        } catch (e) {
            return message.channel.send({content: "This user isn't in the server.."});
        }

        let muteRole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) return message.channel.send({content: `There's no role called \`Muted\`, please create one.`});

        let muteTime = args[1];
        if (!muteTime) {
            return message.channel.send({content: "You didn't specify a time!"});
        }
        if ((ms(muteTime) === undefined)) {
            return message.channel.send({content: "an invalid mute time was supplied."})
        }

        let reason = args.slice(2).join(' ') || "No reason specified";

        let muteChannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!muteChannel) {
            return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
        }

        await muteChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :no_mouth: **${message.author.tag}** has performed action: \`mute\`. \n**\`Affected User:\`${toMute.tag}** *(${toMute.id})*. \n\`Duration:\` ${muteTime}\n\`Reason:\` ${reason}`});

        try {
            await toMute.send({content: `You have been muted for \`${ms(ms(muteTime))}\` with the reason: **${reason}**`});
        } catch (e) {
        }
        await (member.roles.add(muteRole.id));
        await message.channel.send({content: `Action \`mute user\` has been applied successfully to <@${toMute.id}> for ${ms(ms(muteTime))}`});

        client.dataStorage.addUserMute(toMute.id, message.guild.id, ms(muteTime));

    }

};