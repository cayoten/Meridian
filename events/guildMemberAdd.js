module.exports = async function (member) {

    member.send(`Welcome to **${member.guild.name}**. Please enjoy your stay!`)
        .catch(console.error);

    let jlChannel = member.guild.channels.cache.find(chan => chan.name === "join-leave-log");
    if (jlChannel === undefined) {
        return console.log(`A join and leave log channel doesn't exist!`)
    }

    jlChannel.send(`➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`);

};