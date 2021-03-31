module.exports = {
    name: "slap",
    usage: "amount of messages",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Slaps the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let bsUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!bsUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["bitch slapped", "slapped the FUCK out of", "decided to slap", "playfully slapped", "angrily slapped"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${bsUser}!`);

    }
}