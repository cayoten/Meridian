const utils = require('../../lib/utils.js');
module.exports = {
    name: "ban",
    usage: "< id / mention >",
    permlevel: "BAN_MEMBERS",
    catergory: "moderation",
    description: `Bans the tagged user with a reason.`,
    run: async function (client, message, args) {

        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, "BAN_MEMBERS"))
            return;

        if (!args[0]) return message.reply("Where the hell is the member I need to ban?");

        let bUser;
        try {
            bUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!bUser) return message.channel.send('Unable to find user.');

        const member = message.guild.members.cache.get(bUser.id);
        if (member && member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("I can't ban that person.")
                .then(m => m.delete({timeout: 5000}));
        }

        const reason = args.slice(1).join(' ') || 'No reason specified.';

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        let incidents = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!incidents) {
            return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
        }

        const userId = bUser.id;
        const guildId = message.guild.id;
        if (client.dataStorage.isUserBanned(userId, guildId)) {
            client.dataStorage.removeBan(userId, guildId)
        }

        try {
            await bUser.send(`You have been banned for the reason: **${reason}**`);
        } catch (e) {
        }
        await message.channel.send(`The user ${bUser} has been banned.`);
        incidents.send(`\`[${numToDateString(Date.now())}]\` :hammer: **${message.author.tag}** has banned **${bUser.tag}** *(${bUser.id})* \n\`Ban Reason:\` ${reason}`);
        await message.guild.members.ban(bUser, {days: 7, reason: reason});
    }

};

