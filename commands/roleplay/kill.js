const Discord = require("discord.js");
module.exports = {
    name: "kill",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Murders the tagged user.`,
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

        let killUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!killUser) return message.channel.send({content:`${message.author}, user not found.`});
        if (message.mentions.members.first().user === message.author) return message.channel.send({content:`${message.author}, you can't roleplay with yourself!`});
        
        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["tried to hide the body of", "stabbed and killed", "placed a banana to slip on for", "murdered"];
        await message.channel.send({content:`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${killUser}!`});
    }

};
