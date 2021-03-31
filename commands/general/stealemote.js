const utils = require('../../lib/utils.js');
module.exports = {
    name: "stealemote",
    usage: "{^ + however many times above the command the emote is} {emotename}",
    permlevel: "ADMINISTRATOR",
    catergory: "general",
    description: `Staff only command to add the emote corresponded, counted by the messages above with the ^ symbol.`,
    run: async function (client, message) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "ADMINISTRATOR"))
            return;

        const arg = message.content.split(" ");

        const emojiName = arg[2] ? arg[2] : "emoji" + (message.guild.emojis.cache.size + 1);
        message.channel.messages.fetch({limit: (arg[1].split("^").length - 1) + 1}).then(messages => {
            const msg = messages.last().content;
            const emojiRegEx2 = /([<]a?:[a-zA-Z_]{1,32}:[0-9]{18}>)/g;

            if (!emojiRegEx2.test(msg)) return message.channel.send("This message does not include any emojis.");

            const emoji = msg.split("<")[1].split(">")[0];
            const emojiID = emoji.split(":")[2];
            const emojiLink = `https://cdn.discordapp.com/emojis/${emojiID}${emoji.split(":")[0] === "a" ? ".gif?v=1" : ""}`;
            message.guild.emojis.create(emojiLink, emojiName).then(() => {
                return message.channel.send("**The emoji was created!**")
            }).catch(e => {
                console.log(e);
                message.channel.send(" I could not create the emoji.");
            });

        })

    }

};