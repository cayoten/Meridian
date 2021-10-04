const Discord = require("discord.js");
const utils = require('../lib/utils.js');
/**
 * @param message {Discord.Message}
 * @return {Promise<void>}
 */
module.exports = async function (message) {
    if (this.dataStorage.serverData[message.guild.id]?.["nolog"]?.includes(message.channel.id)) return;
    if (message.author.bot) return;

    let cLogChannel = utils.findTextChannel(message.guild, "chat-logs")

    if (!cLogChannel) {
        return console.log(`Logging channel does not exist!`)
    }

    let cLog = new Discord.MessageEmbed()
        .setColor("#e82631")
        .setTitle("Deleted Message")
        .setDescription(`|| ${utils.isBlank(message.content)? "<empty>" : message.content} ||`);

    let urls = [...message.attachments.values()];
    for (let i = 0; i < urls.length; i++) {
        cLog.addField("Attachments", urls[i].proxyURL)
    }

    await cLogChannel.send({
        content: `\`[${utils.epochToHour(Date.now())}]\` :x: **${message.author.tag}** *(${message.author.id})*'s message has been deleted from ${message.channel}:`,
        embeds: [cLog]
    });

};