const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const ms = require("ms");

module.exports = {
    name: "mute",
    usage: "< id / mention > <reason>",
    permLevel: "KICK_MEMBERS",
    category: "moderation",
    description: `Mutes the tagged user with a time and reason.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {

        //!mute @user 1s/m/h/d
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.KICK_MEMBERS))
            return;

        let tomute;
        try {
            tomute = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!tomute) return message.channel.send({content:'Unable to find user.'});
        
        const member = message.guild.members.cache.get(tomute.id);
        try {
            if (member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
                return message.channel.send({content:":heavy_multiplication_x: You cannot mute them!"});
            }
        } catch(e) { return message.channel.send({content:"This user isn't in the server.."}); }

        let muterole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muterole) return message.channel.send({content:`There's no role called \`Muted\`, please create one.`});

        let mutetime = args[1];
        if (!mutetime) {
            return message.channel.send({content:"You didn't specify a time!"});
        }
        if((ms(mutetime) === undefined)) { return message.channel.send({content:"an invalid mute time was supplied."})}

        let reason = args.slice(2).join(' ') || "No reason specified";

        let mutechannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!mutechannel) {
            return message.channel.send({content:`:warning: Cannot find the "mod-logs" channel.`});
        }

        await mutechannel.send({content:`\`[${utils.epochToHour(Date.now())}]\` :no_mouth: **${message.author.tag}** has performed action: \`mute\`. \n**\`Affected User:\`${tomute.tag}** *(${tomute.id})*. \n\`Duration:\` ${mutetime}\n\`Reason:\` ${reason}`});

        try {
            await tomute.send({content:`You have been muted for \`${ms(ms(mutetime))}\` with the reason: **${reason}**`});
        } catch (e) {
        }
        await (member.roles.add(muterole.id));
        await message.channel.send({content:`Action \`mute user\` has been applied successfully to <@${tomute.id}> for ${ms(ms(mutetime))}`});

        client.dataStorage.addUserMute(tomute.id, message.guild.id, ms(mutetime));

    }

};