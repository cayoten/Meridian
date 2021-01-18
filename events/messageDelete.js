const Discord = require("discord.js");
module.exports = async function (client) {

    let cLogChannel = client.guild.channels.cache.find(chan => chan.name === "chat-logs");

    if (cLogChannel === undefined) {
        return console.log(`Logging channel does not exist!`)
    }

    let cLog = new Discord.MessageEmbed()
        .setColor("#e82631")
        .setDescription(`${client.content}`);

    function numToDateString(num) {
        let date = new Date(num)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }


    cLogChannel.send(`\`[${numToDateString(Date.now())}]\` :x: **${client.author.tag}** *(${client.author.id})*'s message has been deleted from ${client.channel}:`);
    cLogChannel.send(cLog);
};