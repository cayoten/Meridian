module.exports = {
    name: "punch",
    usage: "< id / mention >",
    permLevel: "SEND_MESSAGES",
    category: "roleplay",
    description: `Punches the tagged user.`,

    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) await message.delete();

        let punchUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!punchUser) return message.channel.send({content: `${message.author}, user not found.`});
        if (message.mentions.members.first().user === message.author) return message.channel.send({content: `${message.author}, you can't roleplay with yourself!`});

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["in the face!", "in their stomach!", "in the back.", "on their arm!"];

        await message.channel.send({content: `${message.author} punches ${punchUser} ${array[Math.round(Math.random() * (array.length - 1))]}`});
    }

};
