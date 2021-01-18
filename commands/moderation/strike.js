const utils = require('../../lib/utils.js');
module.exports = {
    name: "strike",
    usage: "< id / mention > < reason >",
    run: async function (client, message, args) {
        //f!warn @Raimu being a bean
        //Will send the reason in reports
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;

        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!wUser) return message.channel.send('Unable to find user.');

        const member = message.guild.members.cache.get(wUser.id);
        if (member && member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("I can't strike that person.")
                .then(m => m.delete({timeout: 5000}));
        }

        let wReason = args.slice(1).join(" ");
        if (!wReason) return message.channel.send("Please specify a reason for striking this user!");

        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        warns[message.guild.id][wUser.id].push(wReason);

        //Writes the warning to a file
        client.dataStorage.saveData()

        //Finds the warn embed
        let warnchannel = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!warnchannel) return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        //Sends the warn to chat & DMs
        warnchannel.send(`\`[${numToDateString(Date.now())}]\` :triangular_flag_on_post: **${message.author.tag}** has given a strike to **${wUser.tag}** *(${wUser.id})* \n\`Warn Reason:\` ${wReason}`);
        await message.channel.send(`The user ${wUser} has been given a strike for the reason **${wReason}**.`);
        try {
            await wUser.send(`You have been given a strike for the reason: **${wReason}**`);
        } catch (e) {
        }

        let WarnAmount = warns[message.guild.id][wUser.id].length;

        //Kicks for X amount of warns
        if (WarnAmount === 3) {
            await member.kick(wReason);
            await message.channel.send(`${wUser} has been kicked for reaching 3 strikes.`);
            warnchannel.send(`\`[${numToDateString(Date.now())}]\` :boot: **${message.author.tag}**  has kicked **${wUser.tag}** *(${wUser.id})* \n\`Kick Reason:\` 3 strikes reached.`);

        } else if (WarnAmount >= 6) {
            await message.guild.members.ban(wUser, {reason: wReason});
            await message.channel.send(`${wUser} has been banned for reaching 6 strikes.`);
            warnchannel.send(`\`[${numToDateString(Date.now())}]\` :boot: **${message.author.tag}**  has banned **${wUser.tag}** *(${wUser.id})* \n\`Ban Reason:\` 6 strikes reached.`);
        }

    }

};
