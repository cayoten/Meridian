module.exports = {
    name: "snug",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Snuggles the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let snugUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!snugUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        await message.channel.send(`${message.author} snuggles with ${snugUser}!`);
    }

};