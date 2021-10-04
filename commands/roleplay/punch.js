const Discord = require("discord.js");
module.exports = {
    name: "punch",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Punches the tagged user.`,
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

        let punchUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!punchUser) return message.reply({content:"user not found."});
        if (message.mentions.members.first().user === message.author) return message.reply({content:"you can't roleplay with yourself!"});
        
        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["in the face!", "in their stomach!", "in the back.", "on their arm!"];

        await message.channel.send({content:`${message.author} punches ${punchUser} ${array[Math.round(Math.random() * (array.length - 1))]}`});
    }

};
