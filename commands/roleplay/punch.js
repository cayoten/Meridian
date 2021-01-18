module.exports = {
    name: "punch",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let punchUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!punchUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        let array = ["in the face!", "in their stomach!", "in the back.", "on their arm!"];

        await message.channel.send(`${message.author} punches ${punchUser} ${array[Math.round(Math.random() * (array.length - 1))]}`);
    }

};
