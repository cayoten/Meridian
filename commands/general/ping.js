module.exports = {
    name: "ping",
    usage: "shows bot ping",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Shows the bot's ping.`,
    run: async function (client, message) {

        const msg = await message.channel.send("WHO HATH PING ME???");
        await msg.edit(`Pong! The Bot's Latency is **${msg.createdTimestamp - message.createdTimestamp}ms**, and the API Latency is **${Math.round(client.ws.ping)}ms**.`);

    }

};
