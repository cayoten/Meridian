module.exports = {
    name: "ping",
    usage: "shows bot ping",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Shows the bot's ping.`,

    run: async function (client, message) {
        /**@type {Discord.Message}*/
        const msg = await message.channel.send({content: "WHO HATH PING ME???"});
        await msg.edit(`Current bot latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\` with API latency \`${Math.round(client.ws.ping)}ms\`.`);

    }

};
