const Discord = require("discord.js");
module.exports = {
    name: "pat",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Pats the tagged user.`,
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

        let patUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!patUser) return message.channel.send({content:`${message.author}, user not found.`});
        if (message.mentions.members.first().user === message.author) return message.channel.send({content:`${message.author}, you can't roleplay with yourself!`});
        
        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["gives headpats to", "pats", "pets the fluffy head of", "happily pets"];

        await message.channel.send({content:`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${patUser}!`});
    }

};
