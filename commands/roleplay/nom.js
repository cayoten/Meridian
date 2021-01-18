module.exports = {
    name: "nom",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let nomUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!nomUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        let array = ["noms", "started to nom on", "noms and licks"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${nomUser}!`);
    }

};