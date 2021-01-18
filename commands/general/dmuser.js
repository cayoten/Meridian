const utils = require('../../lib/utils.js');

module.exports = {
    name: "dmuser",
    usage: "amount of messages",
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "BAN_MEMBERS"))
            return;
        
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send("Can't find the user!");

        let dMessage = args.slice(1).join(" ");
        if (dMessage.length < 1) return message.reply('You must supply a message!');

        await member.send(`__You have a new message:__\n\n**${dMessage}**`);
        let logChannel = message.guild.channels.cache.find(x => x.name === "mod-logs");

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        logChannel.send(`\`[${numToDateString(Date.now())}]\` :speak_no_evil:  **${message.author.tag}** has sent an automated DM to **${member.tag}** *(${member.id})* \n\`Message Content:\` ${dMessage}`);

        await message.channel.send(`You have sent the message to ${member}.`);

    }
};