const utils = require('../../lib/utils.js');
const ms = require("ms");
module.exports = {
    name: "tempban",
    usage: "< id / mention >",
    permlevel: "BAN_MEMBERS",
    catergory: "moderation",
    description: `Temporarily ban a user. For example, $tempban @user 30m Reason`,
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

        let bantime = args[1];
        if (!bantime) {
            return message.reply("You didn't specify a time!");
        }

        if((ms(bantime) === undefined)) { return message.reply("an invalid ban time was supplied.")}


        const reason = args.slice(2).join(' ') || 'No reason specified.';

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        let incidents = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!incidents) {
            return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
        }

        try {
            await bUser.send(`You have been banned for ${ms(ms(bantime))} for the reason: **${reason}**`);
        } catch (e) {
        }
        await message.channel.send(`Action \`tempban\` on user ${bUser} has been applied successfully.`);
        incidents.send(`\`[${numToDateString(Date.now())}]\` :timer: **${message.author.tag}** has applied action: \`tempban\` \n\`Affected User:\` **${bUser.tag}** *(${bUser.id})*\n\`Duration:\` ${ms(ms(bantime))} \n\`Reason:\` ${reason}`);
        await message.guild.members.ban(bUser, {reason: reason});

        client.dataStorage.addUserBan(bUser.id, message.guild.id, ms(bantime));

    }

};

