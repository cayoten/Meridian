const fs = require("fs");
const Discord = require("discord.js");

const spaceRegex = / /g
const specialCharRegex = /[^a-zA-Z ]/g
module.exports = async function (message) {

    if (message.guild == null) return;
    if (message.member.hasPermission("MANAGE_MESSAGES")) return; //Replace with your role id for bypass, you might want to chage it to permission based, like member has permission to delete message it will ignore.
    //console.log(message.content);
    //Black magic and stuff.
    //console.time("black magic")
    let msgContent = message.content
        .normalize("NFD")
        .toLowerCase()
        .replace(spaceRegex, '')
        .replace(specialCharRegex, '');
    //console.timeEnd("black magic")
    //console.log(msgContent)

    if (!this.dataStorage.serverData[message.guild.id]) this.dataStorage.serverData[message.guild.id] = {};
    if (!this.dataStorage.serverData[message.guild.id]["filter"]) this.dataStorage.serverData[message.guild.id]["filter"] = ["discordgg", "discordcominvite"]


    const wordBlacklist = this.dataStorage.serverData[message.guild.id]["filter"];

    let matches = false;
    wordBlacklist.forEach(word => {
        if (msgContent.includes(word)) matches = true;
    });
    if (matches) {
        message.delete().then(message.channel.send(`${message.author}, you're not allowed to post that!`));
    }
};