module.exports = {
    name: "bork",
    usage: "f!bork",
    permlevel: "SEND_MESSAGES",
    catergory: "miscellaneous",
    description: `Bork bork bork!`,
    run: async function (client, message) {

        await message.channel.send(`*borkborkborkborkborkbork*`);
        message.delete().catch();

    }

};