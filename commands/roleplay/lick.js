module.exports = {
    name: "lick",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Gives you the option to lick somebody's "face", "paws", or "talons".`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("user not found.");

        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["grins and licks", "flops and licks", "gets up and licks", "happily licks", "submissively licks", "smooches and licks", "pushed over and licked"];

        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${user}'s face!`);

    }

};
