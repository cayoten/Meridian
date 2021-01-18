module.exports = {
    name: "hug",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let hugUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!hugUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        let array = ["happily hugs", "giggles and hugs", "sneaks up out of nowhere and hugs", "tackle-hugs"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${hugUser}!`);
    }

};