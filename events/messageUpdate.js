const Discord = require("discord.js");
const utils = require('../lib/utils.js');
/**
 * @param oldMessage {Discord.Message}
 * @param newMessage {Discord.Message}
 * @return {Promise<void>}
 */
module.exports = async function (oldMessage, newMessage) {

    if (this.dataStorage.serverData[newMessage.guild.id]["nolog"]?.includes(newMessage.channel.id)) return;
    if (oldMessage.content === newMessage.content ||
        oldMessage.author.bot) {
        return;
    }

    let uLogChannel = utils.findTextChannel(newMessage.guild, "chat-logs");
    if (!uLogChannel) {
        return;
    }

    let cLog = new Discord.MessageEmbed()
        .setColor("#e8a726")
        .setTitle("Edited Message")
        .setDescription(`**From:** ${oldMessage.content} \n **To:** || ${newMessage.content} ||`);

    await uLogChannel.send({
        content: `\`[${utils.epochToHour(Date.now())}]\` :warning:  **${oldMessage.author.tag}** *(${oldMessage.author.id})*'s message has been edited in ${oldMessage.channel}:`,
        embeds: [cLog]
    });
};