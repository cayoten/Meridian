module.exports = {
    name: "sfw",
    usage: "< id / mention >",
    permlevel: "SEND_MESSAGES",
    catergory: "miscellaneous",
    description: `CAN'T YOU FUCKERS KEEP IT APPROPRIATE??`,
    run: async function (client, message) {

        let array = ["ur mom is cleaner than this chat\nand thats saying something", "what the FUCK\ncan't you keep the chat clean?", "Get a broom and clean this chat up!", "Too dirty, even for here. Keep it appropriate!", "Why are you like this, stop being nsfw pls kthx", "You guys are so inappropriate it makes me want to leave and I'm a bot.", "What is WRONG with you? Keep it clean smh", "How did the staff miss how inappropriate this chat is", "clean\nchat\nnow\n*ooga booga*", "Even Seasalt would disapprove of chat. Behave!", "CAN'T YOU FUCKERS KEEP IT APPROPRIATE??"];
        await message.channel.send(`${array[Math.round(Math.random() * (array.length - 1))]}`);
        message.delete().catch();

    }

};