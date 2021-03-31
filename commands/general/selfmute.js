const ms = require("ms");
module.exports = {
    name: "selfmute",
    usage: "mutes yourself",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Mute yourself for 10 minutes.`,
    run: async function (client, message) {

        let array = ["I have shut up", "I poofed", "GET THE FUCK OUTTA HERE", "*forces a muzzle onto*", "I pressed the mute button on"];

        let tomute = message.author;
        const member = message.guild.members.cache.get(tomute.id);

        let muterole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!muterole) return message.reply("There isn't a `Muted` role.");

        if (message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You're a staff, you can't use this!");

        await (member.roles.add(muterole.id));

        message.channel.send(`${array[Math.round(Math.random() * (array.length - 1))]} <@${tomute.id}>`);

        client.dataStorage.addUserMute(member.id, message.guild.id, ms("10 minutes"));
    }
};
