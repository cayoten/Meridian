module.exports = {
    name: "bean",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        let beUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

        if (!args[0]) return message.reply("Please specify a user!");

        await message.channel.send(`${beUser} has been beaned!`);
        message.delete().catch();
    }

};