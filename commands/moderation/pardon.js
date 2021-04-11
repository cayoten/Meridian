const utils = require('../../lib/utils.js');
module.exports = {
    name: "pardon",
    usage: "< id > < warnId>",
    permlevel: "MANAGE_MESSAGES",
    catergory: "moderation",
    description: `Pardons a strike from the tagged user.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;

        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!wUser) return message.channel.send('Unable to find user.');

        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        if (warns[message.guild.id][wUser.id].length === 0) {
            return message.reply("This user has no strikes!")
        }

        if (isNaN(args[1]) || args[1] < 0 || args[1] >= warns[message.guild.id][wUser.id].length) {
            return message.reply("Please provide a valid Strike ID!")
        }

        let removedWarn = warns[message.guild.id][wUser.id].splice(args[1], 1); //Remove the warn.

        client.dataStorage.saveData()

        let warnchannel = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!warnchannel) {
            return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
        }

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        warnchannel.send(`\`[${numToDateString(Date.now())}]\` :heavy_minus_sign: **${message.author.tag}** has pardoned **${wUser.tag}** *(${wUser.id})*\n\`Strike Reason:\`${removedWarn[0]}\n\`Active Strike Count:\` ${warns[message.guild.id][wUser.id].length}`);
        message.channel.send("The user has been pardoned!");
    }
};