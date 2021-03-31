const utils = require('../../lib/utils.js');
const ms = require("ms");

module.exports = {
    name: "mute",
    usage: "< id / mention > <reason>",
    permlevel: "KICK_MEMBERS",
    catergory: "moderation",
    description: `Mutes the tagged user with a time and reason.`,
    run: async function (client, message, args) {

        //!mute @user 1s/m/h/d
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "KICK_MEMBERS"))
            return;

        let tomute;
        try {
            tomute = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!tomute) return message.channel.send('Unable to find user.');
        
        const member = message.guild.members.cache.get(tomute.id);
        try {
            if (member.hasPermission("MANAGE_MESSAGES")) {
                return message.channel.send(":heavy_multiplication_x: You cannot mute them!");
            }
        } catch(e) { return message.channel.send("This user isn't in the server.."); }

        let muterole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muterole) return message.channel.send(`There's no role called \`Muted\`, please create one.`);

        let mutetime = args[1];
        if (!mutetime) {
            return message.reply("You didn't specify a time!");
        }

        let reason = args.slice(2).join(' ') || "No reason specified";

        let mutechannel = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!mutechannel) {
            return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);
        }

        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        await mutechannel.send(`\`[${numToDateString(Date.now())}]\` :no_mouth: **${message.author.tag}** has muted **${tomute.tag}** *(${tomute.id})* for ${mutetime}. \n\`Mute Reason:\` ${reason}`);

        try {
            await tomute.send(`You have been muted for \`${ms(ms(mutetime))}\` with the reason: **${reason}**`);
        } catch (e) {
        }
        await (member.roles.add(muterole.id));
        await message.channel.send(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

        client.dataStorage.addUserMute(tomute.id, message.guild.id, ms(mutetime));

    }

};