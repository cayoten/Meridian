const utils = require('../lib/utils.js');
module.exports = async function (member) {

    //Raid check
    this.joinThrottler.handleMember(member);

    //Attempt to DM users, if it fails, lol
    //Deprecated due to it being annoying lul
    // try {
    //     await member.send(`Welcome to **${member.guild.name}**. Check #verification in the server to get started. Please enjoy your stay!`);
    // } catch (e) {
    // }

    //Define join-leave-log
    let jlChannel = utils.findTextChannel(member.guild, "join-leave-log")
    if (jlChannel === undefined) {
        return console.log(`A join and leave log channel doesn't exist!`)
    }

    //Send message to JL log
    await jlChannel.send(`➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`);
};
