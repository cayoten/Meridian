const Discord = require("discord.js");
module.exports = {
    name: "enlarge",
    usage: "send emote",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Enlarge the specified emote.`,

    run: async function (client, message) {

        //Define argument
        const arg = message.content.split(" ");

        //Not allow it to be run in gen chat
        if (message.channel.name === "general-chat" && !message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send("you cannot use that command in this channel!")
        }

        //Obtain emoji
        const emojiRegEx2 = /([<]a?:[a-zA-Z_]{1,32}:[0-9]{18}>)/g;
        if (!emojiRegEx2.test(arg[1])) return message.channel.send("This message does not include any emojis.");

        const emoji = arg[1].split("<")[1].split(">")[0];
        const emojiID = emoji.split(":")[2];
        const emojiLink = `https://cdn.discordapp.com/emojis/${emojiID}${emoji.split(":")[0] === "a" ? ".gif?v=1" : ".png?v=1"}`;

        //Send emoji
        message.channel.send({
            files: [emojiLink]
        })
            .catch(console.error);
    }
};