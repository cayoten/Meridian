module.exports = {
    name: "enlarge",
    usage: "send emote",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Enlarge the specified emote.`,
    run: async function (client, message) {
        const arg = message.content.split(" ");

        if (message.channel.name === "general-chat" && !message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("you cannot use that command in this channel!")
        }

        const emojiRegEx2 = /([<]a?:[a-zA-Z_]{1,32}:[0-9]{18}>)/g;
        if (!emojiRegEx2.test(arg[1])) return message.channel.send("This message does not include any emojis.");

        const emoji = arg[1].split("<")[1].split(">")[0];
        const emojiID = emoji.split(":")[2];
        const emojiLink = `https://cdn.discordapp.com/emojis/${emojiID}${emoji.split(":")[0] === "a" ? ".gif?v=1" : ".png?v=1"}`;
        message.channel.send({
            files: [emojiLink]
        })
            .catch(console.error);
    }
};