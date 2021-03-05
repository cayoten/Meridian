const Discord = require("discord.js");
module.exports = async function (message) {

    if (this.dataStorage.serverData[message.guild.id]["nolog"].includes(message.channel.id)) return;

    let cLogChannel = message.guild.channels.cache.find(chan => chan.name === "chat-logs");

    if (cLogChannel === undefined) {
        return console.log(`Logging channel does not exist!`)
    }

    let cLog = new Discord.MessageEmbed()
        .setColor("#e82631")
        .setDescription(`${message.content}`);

    function numToDateString(num) {
        let date = new Date(num)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    cLogChannel.send(`\`[${numToDateString(Date.now())}]\` :x: **${message.author.tag}** *(${message.author.id})*'s message has been deleted from ${message.channel}:`);
    cLogChannel.send(cLog);
};