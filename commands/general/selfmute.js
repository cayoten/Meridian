const Discord = require("discord.js");
const ms = require("ms");
const replies = ["I have shut up", "I decided to poof", "GET THE FUCK OUTTA HERE", "*forces a muzzle onto*", "I pressed the mute button on", "You shall talk NO LONGER", "Thank god I got to mute", "Finally, they're gone... bye"];
module.exports = {
    name: "selfmute",
    usage: "mutes yourself",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Mute yourself for 10 minutes.`,

    run: async function (client, message) {

        //Define member
        const member = message.member;

        //If they're a staff, say no
        if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return message.channel.send("You're a staff, you can't use this!");

        //Timeout the user & log
        await (member.disableCommunicationUntil(Date.now() + ms("10 minutes")));
        message.channel.send({content: `${replies[Math.round(Math.random() * (replies.length - 1))]} <@${member.id}>`});
    }
};
