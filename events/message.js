const spaceRegex = / /g
const specialCharRegex = /[^a-zA-Z ]/g
/***
 * @type {Map<string, number>}
 */
const flaggedUsers = new Map();
const forgetAfter = 5; //time in seconds to forget about a flagged user
module.exports = async function (message) {

    if (message.guild == null) return;
    if (message.member.hasPermission("MANAGE_MESSAGES")) return; //Replace with your role id for bypass, you might want to chage it to permission based, like member has permission to delete message it will ignore.

    let count = {};
    let flagged;
    message.content.split(spaceRegex).forEach(function(i) {
        count[i] = (count[i]||0) + 1;
        if (count[i] >= 10) flagged = true;
    });
    if (flagged) {
        if (flaggedUsers.has(message.author.id)) {
            let flaggedAt = flaggedUsers.get(message.author.id);
            if ((forgetAfter * 1000) > Date.now() - flaggedAt) {
                message.delete();
                await message.member.kick("[AutoMod] Spamming");
                await message.channel.send(`**${message.author}** has been kicked for spamming.`);
                return;
            }
        }
        flaggedUsers.set(message.author.id, Date.now());
        message.delete().then(message.channel.send(`${message.author}, you've been flagged for spam! Please stop doing that.`));
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
        message.delete().then(message.channel.send(`${message.author}, you're not allowed to post that!`));
    }
};