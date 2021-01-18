module.exports = {
    name: "bap",
    usage: "< id / mention >",
    run: async function (client, message) {

        await message.channel.send(`*baps you* \nNO! BAD!`);
        message.delete().catch();

    }

};