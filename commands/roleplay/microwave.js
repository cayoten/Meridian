module.exports = {
    name: "microwave",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let micUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!micUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        await message.channel.send(`${message.author} shoves ${micUser} into a microwave!`);
    }

};