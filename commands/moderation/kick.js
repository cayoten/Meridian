const utils = require('../../lib/utils.js');
module.exports = {
    name: "kick",
    usage: "< id / mention >",
    permlevel: "KICK_MEMBERS",
    catergory: "moderation",
    description: `Kicks the tagged user with a reason.`,
    run: async function (client, message, args) {

        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, "KICK_MEMBERS"))
            return;

        if (!args[0]) return message.reply("You didn't specify a member.");


        let kUser;
        try {
            kUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!kUser) return message.channel.send('Unable to find user.');

        const member = message.guild.members.cache.get(kUser.id);
        if (member && member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("I can't kick that person.")
                .then(m => m.delete({timeout: 5000}));
        }

        const reason = args.slice(1).join(' ') || 'No reason specified.';

        let incidents = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!incidents) {
            return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
        }

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        try {
            await kUser.send(`You have been kicked for the reason: **${reason}**`);
        } catch (e) {
        }
        await message.channel.send(`The user ${kUser} has been kicked.`);
        incidents.send(`\`[${numToDateString(Date.now())}]\` :boot: **${message.author.tag}** has kicked **${kUser.tag}** *(${kUser.id})* \n\`Kick Reason:\` ${reason}`);
        await member.kick(reason);
    }
};

