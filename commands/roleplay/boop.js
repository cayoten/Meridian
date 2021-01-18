module.exports = {
    name: "boop",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let boopUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!boopUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");


        let array = ["has booped", "playfully boops", "giggles and boops", "squeals and then boops"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${boopUser}!`);
    }

};