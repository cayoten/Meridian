module.exports = {
    name: "bork",
    usage: "f!bork",
    permLevel: "SEND_MESSAGES",
    category: "miscellaneous",
    description: `Bork bork bork!`,

    run: async function (client, message) {

        await message.channel.send({content: `*borkborkborkborkborkbork*`});
        message.delete().catch();

    }

};