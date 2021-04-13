const utils = require('../../lib/utils.js');
const responses = ["Welcome, glad to have you here", "Welcome to the server,", "NEW MEMBER INCOMING WELCOME TO", "Welcome on in,"]
module.exports = {
    name: "approve",
    usage: "< id / mention >",
    permlevel: "MANAGE_MESSAGES",
    catergory: "moderation",
    description: `Verifies the @'ed user and sends them to the main lobby.`,
    run: async function (client, message) {

        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;

        let restricted = message.guild.roles.cache.find(b => b.name === "Server Restricted");
        if (!restricted) {
            return message.reply(`There isn't a "Server Restricted" role!`);
        }

        let members = message.mentions.members.array();
        let canVerify = [];

        members.forEach(member => {
            if (!member.roles.cache.has(r => r.name === "Member"))
                canVerify.push(member);
        })

        if (canVerify.length === 0)
            return message.channel.send("There are no users to be verified!");

        // TODO: make this not hard-coded, add a command to change these
        let roles = {
            "214193731283320832": "252637745531322378", // Glitch's Server
            "241268522792124416": "444518133018132480", // FoxedIn
            "588127059700613120": "693168060294496366" // Testing Server
        };


        let memberrole = message.guild.roles.cache.get(roles[message.guild.id]); //null/undefined if there's no member role.

        let log = message.guild.channels.cache.find(x => x.name === "join-approval-logs");
        if (!log) return message.channel.send(`Couldn't find "join-approval-logs" channel.`);

        let genchat = message.guild.channels.cache.find(x => x.name === "general-chat");
        if (!genchat) return message.channel.send("Couldn't find general-chat channel.");

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        for (const toVerify of canVerify) {

            if (message.content.includes("-sr")) {
                await toVerify.roles.add(restricted.id);
                log.send(`\`[${numToDateString(Date.now())}]\` :lock: **${toVerify.user.tag}** *(${toVerify.id})* has been approved as __**Server Restricted**__.`);
            } else {
                await log.send(`\`[${numToDateString(Date.now())}]\` :cloud: **${toVerify.user.tag}** (*${toVerify.id}*) has been approved.`);
            }
            await (toVerify.roles.add(memberrole));
            await genchat.send(`${responses[Math.round(Math.random() * (responses.length - 1))]} ${toVerify}!`);
        }
        await message.channel.send(`User(s) approved.`);
    }
};