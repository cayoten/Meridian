module.exports = async function (member) {
    this.joinThrottler.handleMember(member);
    member.send(`Welcome to **${member.guild.name}**. Please enjoy your stay!`)
        .catch(console.error);

    let jlChannel = member.guild.channels.cache.find(chan => chan.name === "join-leave-log");
    // if (jlChannel === undefined) {
    //     return console.log(`A join and leave log channel doesn't exist!`)
    // }

    // jlChannel.send(`➕ ${member} (**${member.user.tag}**) has joined. (${member.guild.memberCount}M)`);


    if(this.dataStorage.isUserMuted(member.user.id, member.guild.id)) {
        let muterole = member.guild.roles.cache.find(role => role.name === "Muted");
        member.roles.add(muterole.id);
    }
    const roleList = [
        '361648335674671105', // Omega Bork
        '361648353789870082', // Furry Trash
        '361648348723150855', // Furocious
        '361648361968893976', // Floofball
        '361648353811103746', // Pawesome
        '361648652118130700', // Popufur
        '469646447013396480', // Hyperfluff
        '474384288239058964', // Silverfox
        '657066857030746123', // Furmidable
        '699361810574475375', // Holy Fur
        '776953245280239617', // No-Life FurF,
      ];
      setTimeout(() => {
          roleList.forEach(i => {
            if (member.roles.cache.has(i)) { // probably a bad way of doing it, but there's almost no documentation for Collection.hasAny, so this will work
                member.roles.add("444518133018132480"); // adds the Member role to the user if mee6 assigned a role
            } 
          });
      }, 5000)
};