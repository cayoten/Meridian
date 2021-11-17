module.exports = async function () {
    console.log(`\n-------------------------\n${this.user.username} is online!\n-------------------------`);

    await this.user.setActivity(`you | v3.1.1`, {type: "WATCHING"});

    //Auto broadcast in FoxedIn gen chat every 2 hours about the server
   // setInterval(async () => {
   //
   //     let array = [
   //         "[Auto] Did you know FoxedIn has a Minecraft Server, and a Telegram? You can join the Telegram by going to https://t.me/FoxedIn or the MC by joining `play.foxedin.xyz` on Java or Bedrock!",
   //         "[Auto] Have you voted for us yet? If not, use `!vote` in <#575332169610821654>!",
   //         "[Auto] Need help, but want to stay anonymous? DM the ModMail bot for fast, private help!",
   //         "[Auto] Interested in supporting the server? Check out <#457355636276199445> on how to do so.",
   //         "[Auto] If you haven't already, you can leave feedback for our server by checking out the Feedback Form in <#558038139734851585>!"
   //     ]
   //     const channel = this.channels.resolve("588863799281451069");
   //     await channel.send({content: array[Math.round(Math.random() * (array.length - 1))]});
   //
   // },  7200000);



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
                                    let muteRole = guild.roles.cache.find(r => r.name === "Muted");
                                    member.roles.remove(muteRole.id);
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