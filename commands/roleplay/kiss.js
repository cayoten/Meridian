module.exports = {
    name: "kiss",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Kiss the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let kissUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!kissUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["happily kisses", "blushes and then kisses", "surprise-kisses", "hastily kisses", "sneakily kisses"];

        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${kissUser}!`);
    }

};
