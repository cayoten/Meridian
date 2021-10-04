const Discord = require("discord.js");
module.exports = {
    name: "obliterate",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Wipe the tagged user from existence.`,
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

        let obUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!obUser) return message.reply({content:"user not found."});
        if (message.mentions.members.first().user === message.author) return message.reply({content:"you can't roleplay with yourself!"});
        
        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["used ZA WARUDO", "exploded", "used magic", "did an OwO", "died", "did a thing"];
        await message.channel.send({content:`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} so that they could OBLITERATE ${obUser} from existence!`});
    }

};