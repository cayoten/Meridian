const utils = require('../../lib/utils.js');

module.exports = {
    name: "dmuser",
    usage: "amount of messages",
    permlevel: "BAN_MEMBERS",
    catergory: "moderation",
    description: `DMs the tagged user with the specified text.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "BAN_MEMBERS"))
            return;

        let member;
        try {
            member = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!member) return message.channel.send('Unable to find user.');

        let dMessage = args.slice(1).join(" ");
        if (dMessage.length < 1) return message.reply('You must supply a message!');

        try {
            await member.send(`__You have a new message:__\n\n**${dMessage}**`);
        } catch(e) { return message.channel.send("I couldn't deliver the message, their DMs are closed or they aren't in the server.")}

        let logChannel = message.guild.channels.cache.find(x => x.name === "mod-logs");

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        logChannel.send(`\`[${numToDateString(Date.now())}]\` :speak_no_evil:  **${message.author.tag}** has sent an automated DM to **${member.tag}** *(${member.id})* \n\`Message Content:\` ${dMessage}`);

        await message.channel.send(`You have sent the message to ${member}.`);

    }
};