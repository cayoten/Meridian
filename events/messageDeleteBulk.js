const Discord = require("discord.js");
const utils = require('../lib/utils.js');
/**
 * @param msgCollection {Discord.Collection <Discord.Snowflake, Discord.Message>}
 * @return {Promise<void>}
 */
module.exports = async function (msgCollection) {
    // TODO: Redo this logic, it's not only ugly but also slow - juan
    if (this.dataStorage.serverData[[...msgCollection.values()][0].guild.id]?.["nolog"]?.includes([...msgCollection.values()][0].channel.id)) return;

    let bufferedMessage = utils.makeWritableBuffer({
        initialSize: (100 * 1024),   // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
    });

    let logChannel = utils.findTextChannel([...msgCollection.values()][0].guild, "chat-logs")
    if (!logChannel)
        return;

    msgCollection.forEach(function (message) {
        bufferedMessage.write(
            `[${message.createdAt}] - ${message.author.tag}: ${message.content} \n`
        );
    });

    logChannel.send({
        files: [{
            attachment: bufferedMessage.getContents(),
            name: `Bulk_Message_Log.txt`
        }]
    }).catch(err => ({}));
};