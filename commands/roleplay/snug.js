module.exports = {
    name: "snug",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let snugUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!snugUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        await message.channel.send(`${message.author} snuggles with ${snugUser}!`);
    }

};