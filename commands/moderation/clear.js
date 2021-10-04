const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "clear",
    usage: "amount of messages",
    permlevel: "MANAGE_MESSAGES",
    catergory: "moderation",
    description: `Clears the specified amount of messages from a channel.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        const pinned = (await message.channel.messages.fetch()).filter(msg => !msg.pinned);

        if (message.deletable) 
            message.delete();
        
        if (!args[0]) 
            return message.channel.send({content:"You didn't define an amount to clear."});

        let incidents = utils.findTextChannel(message.guild, "chat-logs");
        if (!incidents) {
            return message.channel.send({content:`:warning: Cannot find the "chat-logs" channel.`});
        }

        let deletedMessages = await message.channel.bulkDelete(pinned.first(parseInt(args[0])), true).catch(console.error);
        if (deletedMessages === undefined || deletedMessages.size === 0) {
            return message.channel.send({content:"Unable to clear messages."})
        }
        message.reply({content:`${deletedMessages.size} messages have been cleared from this chat.`}).then(m => setTimeout(() => m.delete(), 5000));
        await incidents.send({content:`\`[${numToDateString(Date.now())}]\` :broom: **${message.author.tag}** (*${message.author.id}*) has applied action: \`chat clear\`\n\`Cleared:\` **${deletedMessages.size}** messages.`});

    }

};
