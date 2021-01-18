module.exports = {
    name: "kill",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let killUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!killUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        let array = ["tried to hide the body of", "stabbed and killed", "placed a banana to slip on for", "murdered"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} ${killUser}!`);
    }

};
