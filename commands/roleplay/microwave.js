module.exports = {
    name: "microwave",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `SLAM the tagged user into a microwave.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let micUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!micUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        await message.channel.send(`${message.author} shoves ${micUser} into a microwave!`);
    }

};