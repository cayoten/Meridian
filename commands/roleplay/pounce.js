module.exports = {
    name: "pounce",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let pounceUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!pounceUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");


        let array = ["giggles and pounces on", "pounces on", "sneaks up to and pounces on", "playfully pounces on", "happily pounces on"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${pounceUser}!`);
    }

};