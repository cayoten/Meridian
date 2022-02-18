const Discord = require("discord.js");
const ms = require("ms");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "strike",
    usage: "< id / mention > < reason >",
    permLevel: "MANAGE_MESSAGES",
    category: "moderation",
    description: `Strikes the tagged user with a reason.`,

    run: async function (client, message, args) {
        //$strike <@user | ID> reason

        if(message.deletable) await message.delete();

        //Check perms
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.MANAGE_MESSAGES))
            return;

        //Define user
        let warnUser;
        try {
            warnUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        // Return if user isn't found
        if (!warnUser) return message.channel.send({content: "Error encountered: `USER_NOT_FOUND`"});

        // Define member
        const member = message.guild.members.cache.get(warnUser.id);
        if (member && member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.channel.send({content: "I cannot strike a user with the permission \`MANAGE_MESSAGES\!."})
                .then(m => setTimeout(() => m.delete(), 5000));
        }

        // Define reason or create default reason
        let warnReason = args.slice(1).join(" ");
        if (!warnReason) return message.channel.send({content: "Please specify a reason for striking this user!"});

        //Warn creation and storage
        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][warnUser.id]) warns[message.guild.id][warnUser.id] = [] ///Create a new empty array fot this user.

        await warns[message.guild.id][warnUser.id].push(warnReason);

        //Writes the warning to a file
        await client.dataStorage.saveData()

        //Finds the strike embed
        let warnChannel = utils.findTextChannel(message.guild, "mod-logs");
        if (!warnChannel) return message.channel.send({content: "Error encountered: `MISSING_CHANNEL: mod-logs`."});


        //Sends the strike to chat & DMs
        await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :triangular_flag_on_post: **${message.author.tag}** has performed action: \`strike\` \n\`Affected User:\` **${warnUser.tag}** *(${warnUser.id})* \n\`Reason:\` ${warnReason}`});
        await message.channel.send({content: `Action \`strike\` on user ${warnUser} applied successfully.`})
            .then(m => setTimeout(() => m.delete(), 5000));
        try {
            await warnUser.send({content: `__**New Strike Received**__ \n You have been given a strike for the reason: **${warnReason}**`});
        } catch (e) {
        }

        // Defines amount of warns
        let WarnAmount = warns[message.guild.id][warnUser.id].length;


        //Actions on X warns.

        if (WarnAmount === 2) {
            await member.disableCommunicationUntil(Date.now() + ms("30 minutes"), "2 strikes reached.")
            await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :no_mouth: **Meridian Automation** has performed action: \`timeout\` \n\`Affected User:\` **${warnUser.tag}** *(${warnUser.id})* \n\`Duration:\` 30m \n\`Reason:\` 2 strikes reached.`});
            await message.channel.send({content: `${warnUser} has had an automatic 30m timeout applied for passing the **2** strike threshold.`});

        } else if (WarnAmount === 3) {
            await member.disableCommunicationUntil(Date.now() + ms("2 hours"), "3 strikes reached.")
            await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :no_mouth: **Meridian Automation** has performed action: \`timeout\` \n\`Affected User:\` **${warnUser.tag}** *(${warnUser.id})* \n\`Duration:\` 2h \n\`Reason:\` 3 strikes reached.`});
            await message.channel.send({content: `${warnUser} has had an automatic 2h timeout applied for passing the **3** strike threshold.`});

        } else if (WarnAmount === 4) {
            await member.kick(warnReason);
            await message.channel.send({content: `${warnUser} has been automatically kicked for passing the **4** strike threshold.`});
            await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :boot: **Meridian Automation** has performed action: \`kick\` \n\`Affected User:\` **${warnUser.tag}** *(${warnUser.id})*`});

        } else if (WarnAmount === 5) {
            await warnUser.send({content: "------------------------------\n⚠ __**Automated Alert**__ ⚠\n------------------------------\nYou are on your **fifth** strike. Your next strike will result in an automatic ban."})
            await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\`‼ The user **${warnUser.tag}** *(${warnUser.id})* has reached **5/6** strikes. Their next strike is an automatic ban.`})

        } else if (WarnAmount >= 6) {
            await message.guild.members.ban(warnUser, {reason: warnReason});
            await warnChannel.send({content: `\`[${utils.epochToHour(Date.now())}]\` :hammer: **Meridian Automation**  has applied action: \`ban\`\n\`Affected User:\` **${warnUser.tag}** *(${warnUser.id})* \n\`Reason:\` 6 strikes reached.`});
            await message.channel.send({content: `${warnUser} has been banned for reaching 6 strikes.`});

        }
    }
};
