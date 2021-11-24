const utils = require('../lib/utils.js');
module.exports = async function (member) {
    this.joinThrottler.handleMember(member);

    //Attempt to DM users, if it fails, lol
    try {
        await member.send(`Welcome to **${member.guild.name}**. Check #verification in the server to get started. Please enjoy your stay!`);
    } catch (e) {
    }

    let jlChannel = utils.findTextChannel(member.guild, "join-leave-log")
    if (jlChannel === undefined) {
        return console.log(`A join and leave log channel doesn't exist!`)
    }

    await jlChannel.send(`➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`);


    if (this.dataStorage.isUserMuted(member.user.id, member.guild.id)) {
        let muteRole = member.guild.roles.cache.find(role => role.name === "Muted");
        await member.roles.add(muteRole.id);
    }
};
