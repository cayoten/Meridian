const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "clear",
    usage: "amount of messages",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Clears the specified amount of messages from a channel.`,

    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        const pinned = (await message.channel.messages.fetch()).filter(msg => !msg.pinned);

        if (message.deletable)
            await message.delete();

        if (!args[0])
            return message.channel.send({content: "You didn't define an amount to clear."});

        let incidents = utils.findTextChannel(message.guild, "chat-logs");
        if (!incidents) {
            return message.channel.send({content: "Error encountered: `MISSING_CHANNEL: chat-logs`."});
        }

        let deletedMessages = await message.channel.bulkDelete(pinned.first(parseInt(args[0])), true).catch(console.error);
        if (deletedMessages === undefined || deletedMessages.size === 0) {
            return message.channel.send({content: "Unable to clear messages."})
        }
        message.channel.send({content: `Action \`clear chat [size ${deletedMessages.size}]\` applied successfully.`})
            .then(m => setTimeout(() => m.delete(), 5000));
        await incidents.send({content: `\`[${utils.epochToHour(Date.now())}]\` :broom: **${message.author.tag}** (*${message.author.id}*) has performed action: \`chat clear\`\n\`Cleared:\` **${deletedMessages.size}** messages.`});

    }

};
