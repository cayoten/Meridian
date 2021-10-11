const Discord = require("discord.js");
module.exports = {
    name: "microwave",
    usage: "< id / mention >",
    permLevel: "SEND_MESSAGES",
    category: "roleplay",
    description: `SLAM the tagged user into a microwave.`,
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

        if (message.deletable) await message.delete();

        let micUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!micUser) return message.channel.send({content:`${message.author}, user not found.`});
        if (message.mentions.members.first().user === message.author) return message.channel.send({content:`${message.author}, you can't roleplay with yourself!`});
        
        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        await message.channel.send({content:`${message.author} shoves ${micUser} into a microwave!`});
    }

};