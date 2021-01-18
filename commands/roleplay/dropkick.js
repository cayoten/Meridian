module.exports = {
    name: "dropkick",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let dkUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!dkUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        await message.channel.send(`${message.author} has drop-kicked ${dkUser} all the way to the next country!`);
    }

};
