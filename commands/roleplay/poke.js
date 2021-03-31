module.exports = {
    name: "poke",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "roleplay",
    description: `Poke the tagged user.`,
    run: async function (client, message, args) {

        if (client.cooldownManager.checkCooldownAndNotify("rp", message.author.id, message)) {
            return;
        }

        if (message.deletable) message.delete();

        let pokeUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!pokeUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        client.cooldownManager.setCoolDown("rp", message.author.id, 45);

        let array = ["poked", "decided to poke", "roughly poked", "almost slipped while poking", "snuck up on and poked"];

        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${pokeUser} on the snoot!`);
    }

};
