const utils = require('../../lib/utils.js');
module.exports = {
    name: "approve",
    usage: "< id / mention >",
    run: async function (client, message) {

        if (message.deletable) message.delete();

        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;

        let verrole = message.guild.roles.cache.find(r => r.name === "Unverified");
        if (!verrole) {
            return message.reply(`There isn't an "Unverified" role!`);
        }
        let restricted = message.guild.roles.cache.find(b => b.name === "Server Restricted");
        if (!restricted) {
            return message.reply(`There isn't a "Server Restricted" role!`);
        }

        let members = message.mentions.members.array();
        let canVerify = [];

        members.forEach(member => {
            if (member.roles.cache.some(r => r.name === "Unverified"))
                canVerify.push(member);
        })

        if (canVerify.length === 0)
            return message.channel.send("There are no users to be verified!");


        let memberrole = message.guild.roles.cache.find(r => r.name === "Member"); //null/undefined if there's no member role.

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
            await (toVerify.roles.remove(verrole.id));
            await (toVerify.roles.add(memberrole));
            await genchat.send(`Welcome to the server, ${toVerify}!`);
        }
        await message.channel.send(`User(s) approved.`);
    }
};