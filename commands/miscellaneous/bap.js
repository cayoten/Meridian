module.exports = {
    name: "bap",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "miscellaneous",
    description: `Beans the user tagged.`,
    run: async function (client, message) {

        await message.channel.send(`*baps you* \nNO! BAD!`);
        message.delete().catch();

    }

};