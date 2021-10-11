const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const responses = ["Welcome, glad to have you here", "Welcome to the server,", "NEW MEMBER INCOMING WELCOME TO", "Welcome on in,"]
module.exports = {
    name: "approve",
    usage: "< id / mention >",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Verifies the @'ed user and sends them to the main lobby.\nAvailable flags: -sr, -c`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}
     */
    run: async function (client, message) {

        if (message.deletable) await message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        let restricted = message.guild.roles.cache.find(b => b.name === "Server Restricted");
        if (!restricted) {
            return message.channel.send({content:`There isn't a "Server Restricted" role!`});
        }

        let members = [...message.mentions.members.values()];
        let canVerify = [];

        members.forEach(member => {
            if (!member.roles.cache.has(r => r.name === "Member"))
                canVerify.push(member);
        })

        if (canVerify.length === 0)
            return message.channel.send({content: "There are no users to be verified!"});

        // TODO: make this not hard-coded, add a command to change these
        let roles = {
            "241268522792124416": "444518133018132480", // FoxedIn
            "588127059700613120": "693168060294496366", // Testing Server
            "866825824966541332": "866827238842171403", // Glitch's New Server
            "708087852449136801": "717120288760004628" // µ - juan
        };


        let memberrole = message.guild.roles.cache.get(roles[message.guild.id]); //null/undefined if there's no member role.

        let log = utils.findTextChannel(message.guild, "join-approval-logs");
        if (!log) return message.channel.send({content:`Couldn't find "join-approval-logs" channel.`});

        let genchat = utils.findTextChannel(message.guild, "general-chat");
        if (!genchat) return message.channel.send({content:"Couldn't find general-chat channel."});


        for (const toVerify of canVerify) {

            if(toVerify.roles.cache.has(roles[message.guild.id])) {
                return message.channel.send({content:":x: The user is already verified!"}).then(m => setTimeout(() => m.delete(), 5000));
            }

            if (message.content.includes("-sr")) {

                await toVerify.roles.add(restricted.id);
                log.send({content:`\`[${utils.epochToHour(Date.now())}]\` :lock: **${toVerify.user.tag}** *(${toVerify.id})* has been approved as __**Server Restricted**__.`});

            } if (message.content.includes("-c")) {

            const pinned = (await message.channel.messages.fetch()).filter(msg => !msg.pinned)
                let deletedMessages = await message.channel.bulkDelete(pinned.first(parseInt("15")), true).catch(console.error);
                await log.send({content:`\`[${utils.epochToHour(Date.now())}]\` :cloud: **${toVerify.user.tag}** (*${toVerify.id}*) has been approved, and chat was cleared.`});
                if (deletedMessages === undefined || deletedMessages.size === 0) {
                    message.channel.send({content:"Error while attempting to clear messages, continuing..."}).then(m => setTimeout(() => m.delete(), 5000));

                }
                else {
                    message.channel.send({content:":warning: Chat cleared via flag"}).then(m => setTimeout(() => m.delete(), 5000));
                }

            } else {
                await log.send({content:`\`[${utils.epochToHour(Date.now())}]\` :cloud: **${toVerify.user.tag}** (*${toVerify.id}*) has been approved.`});
            }
            await (toVerify.roles.add(memberrole));
            await genchat.send({content:`${responses[Math.round(Math.random() * (responses.length - 1))]} ${toVerify}!`});
        }
        await message.channel.send({content:`:white_check_mark: User(s) approved.`}).then(m => setTimeout(() => m.delete(), 5000));
    }
};