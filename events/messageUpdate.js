const Discord = require("discord.js");
module.exports = async function (oldMessage, newMessage) {

    if (this.dataStorage.serverData[newMessage.guild.id]["nolog"].includes(newMessage.channel.id)) return;

    if (oldMessage.content === newMessage.content) {
        return;
    }
    if (oldMessage.author.bot) {
        return;
    }

    let uLogChannel = newMessage.guild.channels.cache.find(chan => chan.name === "chat-logs");

    if (uLogChannel === undefined) {
        return console.log(`Logging channel does not exist!`)
    }

    let cLog = new Discord.MessageEmbed()
        .setColor("#e8a726")
        .setDescription(`**From:** ${oldMessage.content} \n **To:** ${newMessage.content}`);

    function numToDateString(num) {
        let date = new Date(num)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }


    uLogChannel.send(`\`[${numToDateString(Date.now())}]\` :warning:  **${oldMessage.author.tag}** *(${oldMessage.author.id})*'s message has been edited in ${oldMessage.channel}:`);
    uLogChannel.send(cLog);
};