const Discord = require("discord.js");
const utils = require('../lib/utils.js');
/**
 * @param member {Discord.GuildMember}
 * @return {Promise<void>}
 */
module.exports = async function (member) {
    this.joinThrottler.handleMember(member);
    member.send(`Welcome to **${member.guild.name}**. Check #verification in the server to get started. Please enjoy your stay!`)
        .catch(console.error);

    let jlChannel = utils.findTextChannel(member.guild, "join-leave-log")
    if (jlChannel === undefined) {
         return console.log(`A join and leave log channel doesn't exist!`)
    }

    jlChannel.send(`➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`);


    if(this.dataStorage.isUserMuted(member.user.id, member.guild.id)) {
        let muteRole = member.guild.roles.cache.find(role => role.name === "Muted");
        member.roles.add(muteRole.id);
    }
};
