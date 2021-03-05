const streamBuffers = require('stream-buffers'); //For sending everthin as a file.
module.exports = async function (msgCollection) {
    if (this.dataStorage.serverData[msgCollection.array()[0].guild.id]["nolog"].includes(msgCollection.array()[0].channel.id)) return;
    const bufferedMessage = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024),   // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
    });

    let logChannel = msgCollection.array()[0].guild.channels.cache.find(x => x.name === "chat-logs");
    if (!logChannel) return;

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