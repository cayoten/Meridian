module.exports = async function (member) {

    let jlChannel = member.guild.channels.cache.find(chan => chan.name === "join-leave-log");
    if (jlChannel === undefined) {
        return console.log(`A join and leave log channel doesn't exist!`)
    }

    jlChannel.send(`➖ ${member} (**${member.user.tag}**) has left. (${member.guild.memberCount}M)`);

    function numToDateString(num) {
        let date = new Date(num)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    //Check if someone was kicked
    let logs = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'});
    let entries = logs.entries.array();
    let foundLog;
    for (let i = 0; i < entries.length; i++) {
        let log = entries[i];
        if (15000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
            foundLog = log;
        }
    }
    if (foundLog) {
        let incidents = member.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!incidents) {
            return;
        }

        incidents.send(`\`[${numToDateString(Date.now())}]\` __AUDIT LOG__ :boot: **${foundLog.executor.tag}** has kicked **${foundLog.target.tag}** *(${foundLog.target.id})*. \n\`Kick Reason:\` ${foundLog.reason ?? "No reason specified"}`);

    }

    //Check if someone was
    let logsBan = await member.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
    let entriesBan = logsBan.entries.array();
    let foundBan;
    for (let i = 0; i < entriesBan.length; i++) {
        let log = entriesBan[i];
        if (30000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
            foundBan = log;
        }
    }
    if (foundBan) {
        let incidents = member.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!incidents) {
            return
        }
        incidents.send(`\`[${numToDateString(Date.now())}]\` __AUDIT LOG__ :hammer: **${foundBan.executor.tag}** has banned **${foundBan.target.tag}** *(${foundBan.target.id})* \n\`Ban Reason:\` ${foundBan.reason ?? "No reason specified"}`);
    }

};