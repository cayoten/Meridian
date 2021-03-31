module.exports = {
    name: "kill",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Murders the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let killUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!killUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["tried to hide the body of", "stabbed and killed", "placed a banana to slip on for", "murdered"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${killUser}!`);
    }

};
