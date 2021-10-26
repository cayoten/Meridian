const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "unban",
    usage: "< id / mention >",
    permLevel: "BAN_MEMBERS",
    category: "moderation",
    description: `Unbans the tagged user.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (message.deletable) await message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS))
            return;

        if (!args[0]) {
            return message.channel.send({content: "Either you didn't specify an ID, or the user wasn't banned."});
        }

        client.users.fetch(args[0])
            .then(User => {

                let infractionchannel = utils.findTextChannel(message.guild, "mod-logs");
                if (!infractionchannel) {
                    return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});
                }


                const userId = User.id;
                const guildId = message.guild.id;

                if (client.dataStorage.isUserBanned(userId, guildId)) {
                    client.dataStorage.removeBan(userId, guildId)
                }

                message.guild.members.unban(User.id);
                message.channel.send({content:"Action \`unban\` applied successfully."})
                    .then(m => setTimeout(() => m.delete(), 5000));
                infractionchannel.send({content:`\`[${utils.epochToHour(Date.now())}]\` :wave: **${message.author.tag}** has performed action: \`unban\` \n\`Affected User:\` **${User.tag}** *(${User.id})*`})
            })
    }

};