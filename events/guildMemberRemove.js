const utils = require('../lib/utils.js');
module.exports = async function (member) {
    let jlChannel = utils.findTextChannel(member.guild, "join-leave-log")
    if (!jlChannel) {
        return console.log(`A join and leave log channel doesn't exist!`)
    }

    await jlChannel.send({content: `➖ ${member} (**${member.user.tag}**) has left. (${member.guild.memberCount}M)`});

    //Check if someone was kicked
    let logs = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'});
    let entries = [...logs.entries.values()];
    let foundLog;
    for (let i = 0; i < entries.length; i++) {
        let log = entries[i];
        if (15000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
            foundLog = log;
        }
    }
    if (foundLog) {
        let incidents = utils.findTextChannel(member.guild, "mod-logs");
        if (!incidents) {
            return;
        }

        await incidents.send({content: `\`[${utils.epochToHour(Date.now())}]\` :boot: **${foundLog.executor.tag}** has performed action: \`kick\` \n\`Affected User:\` **${foundLog.target.tag}** *(${foundLog.target.id})* \n\`Reason:\` ${foundLog.reason ?? "No reason specified"}`});

    }

    //Check if someone was banned
    let logsBan = await member.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
    let entriesBan = [...logsBan.entries.values()];
    let foundBan;
    for (let i = 0; i < entriesBan.length; i++) {
        let log = entriesBan[i];
        if (30000 > (Date.now() - log.createdTimestamp) && log.target.id === member.user.id && log.executor !== member.client.user) {
            foundBan = log;
        }
    }
    if (foundBan) {
        let incidents = utils.findTextChannel(member.guild, "mod-logs");
        if (!incidents) {
            return
        }
        await incidents.send({content: `\`[${utils.epochToHour(Date.now())}]\` :hammer: **${foundBan.executor.tag}** has performed action: \`ban\` \n\`Affected User:\` **${foundBan.target.tag}** *(${foundBan.target.id})* \n\`Reason:\` ${foundBan.reason ?? "No reason specified"}`});
    }

};