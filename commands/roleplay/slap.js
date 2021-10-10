const Discord = require("discord.js");
module.exports = {
    name: "slap",
    usage: "amount of messages",
    permLevel: "SEND_MESSAGES",
    category: "roleplay",
    description: `Slaps the tagged user.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let bsUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!bsUser) return message.channel.send({content:`${message.author}, user not found.`});
        if (message.mentions.members.first().user === message.author) return message.channel.send({content:`${message.author}, you can't roleplay with yourself!`});
        
        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["bitch slapped", "slapped the FUCK out of", "decided to slap", "playfully slapped", "angrily slapped"];
        await message.channel.send({content: `${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${bsUser}!`});

    }
}