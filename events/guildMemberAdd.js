module.exports = async function (member) {
    this.joinThrottler.handleMember(member);
    member.send(`Welcome to **${member.guild.name}**. Please enjoy your stay!`)
        .catch(console.error);

    let jlChannel = member.guild.channels.cache.find(chan => chan.name === "join-leave-log");
    if (jlChannel === undefined) {
         return console.log(`A join and leave log channel doesn't exist!`)
    }

    jlChannel.send(`➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`);


    if(this.dataStorage.isUserMuted(member.user.id, member.guild.id)) {
        let muterole = member.guild.roles.cache.find(role => role.name === "Muted");
        member.roles.add(muterole.id);
    }
};