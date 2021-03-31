module.exports = {
    name: "punch",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Punches the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let punchUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!punchUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["in the face!", "in their stomach!", "in the back.", "on their arm!"];

        await message.channel.send(`${message.author} punches ${punchUser} ${array[Math.round(Math.random() * (array.length - 1))]}`);
    }

};
