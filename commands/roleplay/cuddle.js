const Discord = require("discord.js");
module.exports = {
    name: "cuddle",
    usage: "< id / mention >",
    permLevel: "SEND_MESSAGES",
    category: "roleplay",
    description: `Cuddle with the tagged user.`,
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

        let cudUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!cudUser) return message.channel.send({content:`${message.author}, user not found.`});
        if (message.mentions.members.first().user === message.author) return message.channel.send({content:`${message.author}, you can't roleplay with yourself!`});

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["playfully cuddles with", "happily cuddles with", "gets cold and cuddles with", "cuddles with", "smooches and then cuddles with"];

        await message.channel.send({content:`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${cudUser}!`});
    }

};