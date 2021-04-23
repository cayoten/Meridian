require("discord.js");
const utils = require('./utils.js');

/**
 * Heuristic anti-raid system.
 * @author juanmuscaria <juanmuscaria@gmail.com>
 */
class Throttler {
    /**
     * @type {Discord.Client}
     */
    client;
    volatileData = {};


    constructor(client) {
        this.client = client;
    }

    /**
     * @param {GuildMember} member
     */
    handleMember(member) {
        let configuration = this.getGuildPersistentData(member.guild);
        if (!configuration.enabled) {
            return;
        }

        let guildData = this.getGuildData(member.guild);
        let now = Date.now();
        let lastJoin = guildData.lastUserJoin;

        this.doCleanup(member.guild);

        // update data
        guildData.lastUserJoin = now;
        guildData.userJoinMap.set(member.id, now);

        if (guildData.underRaid) {
            this.punishMember(member);
        } else {
            if ((lastJoin + configuration.violationPeriod) > now) {
                guildData.violationLevel++;
            }
            if (guildData.violationLevel >= configuration.maxViolationLevel) {
                guildData.underRaid = true;
                let channel = this.client.channels.resolve(configuration.warnChannel);
                if (channel) {
                    channel.send(configuration.warnMessage);
                }
                guildData.userJoinMap.forEach((time, userId, map) => {
                    let user = member.guild.members.resolve(userId);
                    if (user) {
                        this.punishMember(user);
                    }
                });
            }
        }
    }

    /**
     *
     * @param {Guild} guild
     * @returns {{
                lastUserJoin: number,
                userJoinMap: Map<string, number>,
                violationLevel: number,
                underRaid: boolean
            }}
     */
    getGuildData(guild) {
        if (!this.volatileData[guild.id]) {
            this.volatileData[guild.id] = {
                lastUserJoin: -1,
                userJoinMap: new Map(),
                violationLevel: 0,
                underRaid: false
            };
        }
        return this.volatileData[guild.id];
    }

    /**
     *
     * @param {Guild} guild
     * @returns {{enabled: boolean,
                banOnRaid: boolean,
                warnOnRaid: boolean,
                warnChannel: string,
                warnMessage: string,
                maxViolationLevel: number,
                violationPeriod: number,
                forgetTime: number}}
     */
    getGuildPersistentData(guild) {
        if (!this.client.dataStorage.serverData[guild.id]) {
            this.client.dataStorage.serverData[guild.id] = {};
        }

        if (!this.client.dataStorage.serverData[guild.id]["throttlerConfiguration"]) {
            this.client.dataStorage.serverData[guild.id]["throttlerConfiguration"] = {
                enabled: false,
                banOnRaid: false,
                warnOnRaid: false,
                warnChannel: "",
                warnMessage: "Server under raid!",
                maxViolationLevel: 8,
                violationPeriod: 3000,
                forgetTime: 10
            };
        }

        return this.client.dataStorage.serverData[guild.id]["throttlerConfiguration"];
    }

    /**
     * @param {GuildMember} member
     */
    punishMember(member) {
        let configuration = this.getGuildPersistentData(member.guild);
        let reason = "Flagged for raid!";

        if (configuration.banOnRaid) {
            member.send(`You have been banned for the reason: **${reason}**`).catch(err => ({}));
            member.guild.members.ban(member, {days: 1, reason: reason}).catch(err => ({}));
            let incidents = member.guild.channels.cache.find(x => x.name === "mod-logs");
            if (incidents) {
                incidents.send(`\`[${utils.epochToHour(Date.now())}]\` :hammer: **${this.client.user.tag}'s anti-raid** has banned **${member.user.tag}** *(${member.id})* \n\`Ban Reason:\` ${reason}`);
            }
        } else {
            member.send(`You have been kicked for the reason: **${reason}**`).catch(err => ({}));
            member.kick(reason).catch(err => ({}));
            let incidents = member.guild.channels.cache.find(x => x.name === "mod-logs");
            if (incidents) {
                incidents.send(`\`[${utils.epochToHour(Date.now())}]\` :boot: **${this.client.user.tag}'s anti-raid** has kicked **${member.user.tag}** *(${member.id})* \n\`Kick Reason:\` ${reason}`);
            }

        }
    }

    /**
     * @param {Guild} guild
     */
    doCleanup(guild) {
        let configuration = this.getGuildPersistentData(guild);
        let guildData = this.getGuildData(guild);
        // remove old joins and raid status if nobody joined in the last x seconds
        if (((guildData.lastUserJoin + (configuration.forgetTime * 1000)) < Date.now()) && guildData.userJoinMap.size > 0) {
            if (guildData.underRaid) {
                let channel = this.client.channels.resolve(configuration.warnChannel);
                if (channel) {
                    channel.send("Raid marked as ended, the following users were punished:");
                    let users = [];
                    guildData.userJoinMap.forEach((time, userId, map) => {
                        users.push(`<@${userId}>\n`);
                    });

                    // Just in case of a big raid, we can fit all users in different messages
                    users = utils.chunksOf(users, 85);

                    for (let i = 0; i < users.length; i++) {
                        channel.send(users[i].join("")); // let's hope not having a raid with over 1k people
                    }
                }
            }

            guildData.userJoinMap.clear();
            guildData.underRaid = false;
            guildData.violationLevel = 0;
        }

    }
}

module.exports = Throttler;