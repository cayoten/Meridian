const Discord = require("discord.js");
const spaceRegex = / /g
const specialCharRegex = /[^a-zA-Z ]/g
/** @type {Map<string, number>}*/
const flaggedUsers = new Map();
const forgetAfter = 5; //time in seconds to forget about a flagged user
/**
 * @param message {Discord.Message}
 * @return {Promise<void>}
 */
module.exports = async function (message) {

    if (message.guild == null) return;
    if (message.author.bot) return;
    if (message.channel.id === "677744407583129600") return; // TODO: make this not hardcoded for artist-commissions
    if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return; //Replace with your role id for bypass, you might want to change it to permission based, like member has permission to delete message it will ignore.

    let count = {};
    let flagged;
    /**@type{Discord.TextChannel}*/
    let channel = message.channel;

    message.content.split(spaceRegex).forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
        if (count[i] >= 10) flagged = true;
    });
    if (flagged) {
        if (flaggedUsers.has(message.author.id)) {
            let flaggedAt = flaggedUsers.get(message.author.id);
            if ((forgetAfter * 1000) > Date.now() - flaggedAt) {
                await message.delete();
                await message.member.kick("[AutoMod] Spamming");
                await channel.send({content: `**${message.author}** has been kicked for chat flood. [ACTION]`});
                return;
            }
        }
        flaggedUsers.set(message.author.id, Date.now());
        message.delete().then(() => channel.send({content: `${message.author}, you've been flagged for chat flood. [ALERT]`}));
        return;
    }

    let msgContent = message.content
        .normalize("NFD")
        .toLowerCase()
        .replace(spaceRegex, '')
        .replace(specialCharRegex, '');

    if (!this.dataStorage.serverData[message.guild.id]) this.dataStorage.serverData[message.guild.id] = {};
    if (!this.dataStorage.serverData[message.guild.id]["filter"]) this.dataStorage.serverData[message.guild.id]["filter"] = ["discordgg", "discordcominvite"]


    const wordBlacklist = this.dataStorage.serverData[message.guild.id]["filter"];

    let matches = false;
    wordBlacklist.forEach(word => {
        if (msgContent.includes(word)) matches = true;
    });
    if (matches) {
        message.delete().then(() => channel.send({content: `${message.author}, you cannot post that! [WARN]`})
            .then(m => setTimeout(() => m.delete(), 5000)));

    }
};