module.exports = {
    name: "cuddle",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Cuddle with the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let cudUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!cudUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["playfully cuddles with", "happily cuddles with", "gets cold and cuddles with", "cuddles with", "smooches and then cuddles with"];

        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${cudUser}!`);
    }

};