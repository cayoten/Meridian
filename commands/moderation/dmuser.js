const Discord = require("discord.js");
const utils = require('../../lib/utils.js');

module.exports = {
    name: "dmuser",
    usage: "amount of messages",
    permlevel: "BAN_MEMBERS",
    catergory: "moderation",
    description: `DMs the tagged user with the specified text.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;

        let member;
        try {
            member = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!member) return message.channel.send({content:'Unable to find user.'});

        let dMessage = args.slice(1).join(" ");
        if (dMessage.length < 1) return message.channel.send({content:'You must supply a message!'});

        try {
            await member.send({content:`__You have a new message:__\n\n**${dMessage}**`});
        } catch(e) { return message.channel.send({content:"I couldn't deliver the message, their DMs are closed or they aren't in the server."})}

        let logChannel = utils.findTextChannel(message.guild, "mod-logs");

        logChannel.send({content:`\`[${utils.epochToHour(Date.now())}]\` :speak_no_evil:  **${message.author.tag}** has sent an automated DM to **${member.tag}** *(${member.id})* \n\`Message Content:\` ${dMessage}`});

        await message.channel.send({content:`You have sent the message to ${member}.`});

    }
};