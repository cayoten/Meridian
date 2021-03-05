module.exports = async function (member) {

    let jlChannel = member.guild.channels.cache.find(chan => chan.name === "join-leave-log");
    if (jlChannel === undefined) {
        return console.log(`A join and leave log channel doesn't exist!`)
    }

    jlChannel.send(`➖ ${member} (**${member.user.tag}**) has left. (${member.guild.memberCount}M)`);


};