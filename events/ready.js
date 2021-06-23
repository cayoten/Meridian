module.exports = async function () {
    console.log(`\n-------------------------\n${this.user.username} is online!\n-------------------------`);

    await this.user.setActivity(`https://github.com/cayoten | v3.0.2`, {type: "WATCHING"});

    setInterval(() => {
        for (const guildId in this.dataStorage.mutes) {
            if (this.dataStorage.mutes.hasOwnProperty(guildId)) {
                const users = this.dataStorage.mutes[guildId];
                for (const userId in users) {
                    if (users.hasOwnProperty(userId)) {
                        const muteTime = users[userId];
                        if (Date.now() > muteTime) {
                            // Remove Expired Mute
                            this.dataStorage.removeMute(userId, guildId);
                            let guild = this.guilds.cache.get(guildId);
                            if (guild) {
                                let member = guild.members.cache.get(userId)
                                if (member) {
                                    let muterole = guild.roles.cache.find(r => r.name === "Muted");
                                    member.roles.remove(muterole.id);
                                }
                            }
                        }
                    }
                }
            }
        }

        for (const guildId in this.dataStorage.bans) {
            if (this.dataStorage.bans.hasOwnProperty(guildId)) {
                const users = this.dataStorage.bans[guildId];
                for (const userId in users) {
                    if (users.hasOwnProperty(userId)) {
                        const banTime = users[userId];
                        if (Date.now() > banTime) {
                            // Remove expired bans
                            this.dataStorage.removeBan(userId, guildId);
                            let guild = this.guilds.cache.get(guildId);
                            if (guild) {
                                guild.members.unban(userId);

                            }
                        }
                    }
                }
            }
        }
    }, 60)

    setInterval(() => {
       this.guilds.cache.forEach((guild, guildId, map) => {
           if (this.joinThrottler.getGuildPersistentData(guild).enabled) {
               this.joinThrottler.doCleanup(guild);
           }
       });
    }, 15000);
};