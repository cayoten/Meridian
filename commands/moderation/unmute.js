const utils = require('../../lib/utils.js');
module.exports = {
    name: "unmute",
    usage: "< id / mention >",
    permlevel: "KICK_MEMBERS",
    catergory: "moderation",
    description: `Unbans the tagged user.`,
    run: async function (client, message, args) {

        //!mute @user 1s/m/h/d reason
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "KICK_MEMBERS"))
            return;

        let muterole = message.guild.roles.cache.find(r => r.name === "Muted");

        let tomute;
        try {
            tomute = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!tomute) return message.channel.send('Unable to find user.');
        const member = message.guild.members.cache.get(tomute.id);
        if (member.hasPermission("KICK_MEMBERS")) {
            return message.channel.send(":heavy_multiplication_x: You cannot mute them!");
        }

        let unmutechannel = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!unmutechannel) {
            return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
        }

        if (!member.roles.cache.some(r => r.name === "Muted"))
            return message.channel.send("User isn't muted!");

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        client.dataStorage.removeMute(member.id, message.guild.id);
        await (member.roles.remove(muterole.id));
        unmutechannel.send(`\`[${numToDateString(Date.now())}]\` :speaking_head:  **${message.author.tag}** has unmuted **${tomute.tag}** *(${tomute.id})*`);
        await message.channel.send(`${tomute} has been unmuted!`);

    }

};