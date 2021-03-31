const utils = require('../../lib/utils.js');
module.exports = {
    name: "clear",
    usage: "amount of messages",
    permlevel: "MANAGE_MESSAGES",
    catergory: "moderation",
    description: `Clears the specified amount of messages from a channel.`,
    run: async function (client, message, args) {

        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;

        const pinned = (await message.channel.messages.fetch()).filter(msg => !msg.pinned)

        if (message.deletable) message.delete({reason: "Auto-Delete"});

        let incidents = message.guild.channels.cache.find(x => x.name === "chat-logs");
        if (!incidents) {
            return message.channel.send(`:warning: Cannot find the "chat-logs" channel.`);
        }


        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        let deletedMessages = await message.channel.bulkDelete(pinned.first(parseInt(args[0])), true).catch(console.error);
        if(!args[0]) return message.channel.send("You didn't define an amount to clear.")
        message.channel.send(`${deletedMessages.size} messages have been cleared from this chat.`).then(m => m.delete({timeout: 5000, reason: "Auto-Delete"}));
        await incidents.send(`\`[${numToDateString(Date.now())}]\` :broom: **${message.author.tag}** (*${message.author.id}*) has cleared **${deletedMessages.size}** messages.`);

    }

};
