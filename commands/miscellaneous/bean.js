module.exports = {
    name: "bean",
    usage: "< id / mention >",
    permLevel: "SEND_MESSAGES",
    category: "miscellaneous",
    description: `Beans the tagged user.`,

    run: async function (client, message, args) {

        let beUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send({content: "Please specify a user!"});

        await message.channel.send({content: `${beUser} has been beaned!`});
        message.delete().catch();
    }

};