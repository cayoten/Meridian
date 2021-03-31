const utils = require('../../lib/utils.js');
module.exports = {
    name: "unban",
    usage: "< id / mention >",
    permlevel: "BAN_MEMBERS",
    catergory: "moderation",
    description: `Unbans the tagged user.`,
    run: async function (client, message, args) {
        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, "BAN_MEMBERS"))
            return;

        if (!args[0]) {
            return message.channel.send("Either you didn't specify an ID, or the user wasn't banned.");
        }

        client.users.fetch(args[0])
            .then(User => {

                let infractionchannel = message.guild.channels.cache.find(x => x.name === "mod-logs");
                if (!infractionchannel) {
                    return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
                }

                function numToDateString(num) {
                    let date = new Date(num)
                    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                }

                const userId = User.id;
                const guildId = message.guild.id;

                if (client.dataStorage.isUserBanned(userId, guildId)) {
                    client.dataStorage.removeBan(userId, guildId)
                }

                message.guild.members.unban(User.id);
                message.reply("the user specified has been unbanned!")
                    .then(m => m.delete({timeout: 5000}));
                infractionchannel.send(`\`[${numToDateString(Date.now())}]\` :wave: **${message.author.tag}** has unbanned **${User.tag}** *(${User.id})*`)
            })
    }

};