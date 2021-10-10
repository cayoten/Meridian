const Discord = require("discord.js");
const ms = require("ms");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "strike",
    usage: "< id / mention > < reason >",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Strikes the tagged user with a reason.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        //$strike @Raimu being a bean
        //Check perms
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        //Define user
        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        // Return if user isn't found
        if (!wUser) return message.channel.send({content: 'Unable to find user.'});

        // Define member
        const member = message.guild.members.cache.get(wUser.id);
        if (member && member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send({content: "I can't strike that person."})
                .then(m => setTimeout(() => m.delete(), 5000));
        }

        // Define reason or create default reason
        let wReason = args.slice(1).join(" ");
        if (!wReason) return message.channel.send({content: "Please specify a reason for striking this user!"});

        //Warn creation and storage
        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        warns[message.guild.id][wUser.id].push(wReason);

        //Writes the warning to a file
        client.dataStorage.saveData()

        //Finds the warn embed
        let warnchannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!warnchannel) return message.channel.send({content: `:warning: Cannot find the "mod-logs" channel.`});


        //Sends the warn to chat & DMs
        warnchannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :triangular_flag_on_post: **${message.author.tag}** has performed action: \`strike\` \n\`Affected User:\` **${wUser.tag}** *(${wUser.id})* \n\`Reason:\` ${wReason}`});
        await message.channel.send({content: `Action \`strike\` on user ${wUser} applied successfully.`});
        try {
            await wUser.send({content: `__**New Strike Received**__ \n You have been given a strike for the reason: **${wReason}**`});
        } catch (e) {
        }

        // Defines amount of warns
        let WarnAmount = warns[message.guild.id][wUser.id].length;
        //Actions on X warns
        try {
            let muterole = message.guild.roles.cache.find(role => role.name === "Muted");
            if (!muterole) return message.channel.send({content: `There's no role called \`Muted\`, please create one.`});


            if (WarnAmount === 2) {
                await (member.roles.add(muterole.id));
                await client.dataStorage.addUserMute(wUser.id, message.guild.id, ms("30 minutes"));
                await message.channel.send({content: `${wUser} has had an automated mute applied for passing the **2** strike threshold.`});

            } else if (WarnAmount === 3) {
                await (member.roles.add(muterole.id));
                await client.dataStorage.addUserMute(wUser.id, message.guild.id, ms("2 hours"));
                await message.channel.send({content: `${wUser} has had an automated mute applied for passing the **3** strike threshold.`});

            } else if (WarnAmount === 4) {
                await member.kick(wReason);
                await message.channel.send({content: `${wUser} has been automatically kicked for passing the **4** strike threshold.`});
                await warnchannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :boot: **AUTOMOD**  has applied action: \`kick\`\n\`Affected User:\` **${wUser.tag}** *(${wUser.id})* \n\`Reason:\` Automatic - **4** strikes reached.`});

            } else if (WarnAmount === 5) {
                await wUser.send({content: "------------------------------\n⚠ __**Automated Alert**__ ⚠\n------------------------------\nYou are on your **fifth** strike. Your next strike will result in an automatic ban."})
                await warnchannel.send({content: `\`[${utils.epochToHour(Date.now())}]\`‼ The user **${wUser.tag}** *(${wUser.id})* has reached **5/6** strikes.`})
            }
            if (WarnAmount >= 6) {
                await message.guild.members.ban(wUser, {reason: wReason});
                await message.channel.send({content: `${wUser} has been banned for reaching 6 strikes.`});
                await warnchannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :boot: **AUTOMOD**  has applied action: \`ban\`\n\`Affected User:\` **${wUser.tag}** *(${wUser.id})* \n\`Reason:\` Automatic - **6** strikes reached.`});
            }

            //If this shit goes bonkers ignore it (It won't, but I'm a bad coder too so...)
        } catch (e) {
            console.log(e) // Do not supress exceptions on important code logic! It makes impossible to debug it later - juan
        }

    }
};
