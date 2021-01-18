module.exports = {
    name: "bork",
    usage: "f!bork",
    run: async function (client, message) {

        await message.channel.send(`*borkborkborkborkborkbork*`);
        message.delete().catch();

    }

};