const Discord = require("discord.js");
const ms = require("ms");
const replies = ["I have shut up", "I poofed", "GET THE FUCK OUTTA HERE", "*forces a muzzle onto*", "I pressed the mute button on"];
module.exports = {
    name: "selfmute",
    usage: "mutes yourself",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Mute yourself for 10 minutes.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}
     */
    run: async function (client, message) {

        const member = message.member;

        let muterole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muterole) 
            return message.channel.send("There isn't a `Muted` role.");

        if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) 
            return message.channel.send("You're a staff, you can't use this!");

        await (member.roles.add(muterole.id));

        message.channel.send({content:`${replies[Math.round(Math.random() * (replies.length - 1))]} <@${member.id}>`});

        client.dataStorage.addUserMute(member.id, message.guild.id, ms("10 minutes"));
    }
};
