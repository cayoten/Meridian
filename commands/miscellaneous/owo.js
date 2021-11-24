module.exports = {
    name: "owo",
    usage: "< id / mention >",
    permLevel: "SEND_MESSAGES",
    category: "miscellaneous",
    description: `What's this?`,

    run: async function (client, message) {

        await message.channel.send({content: `OwO what's this?`});
        message.delete().catch();

    }

};