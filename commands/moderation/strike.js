const ms = require("ms");
const utils = require('../../lib/utils.js');
module.exports = {
    name: "strike",
    usage: "< id / mention > < reason >",
    permlevel: "MANAGE_MESSAGES",
    catergory: "moderation",
    description: `Strikes the tagged user with a reason.`,
    run: async function (client, message, args) {
        //$strike @Raimu being a bean
        //Check perms
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;

        //Define user
        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (e) {
        }

        // Return if user isn't found
        if (!wUser) return message.channel.send('Unable to find user.');

        // Define member
        const member = message.guild.members.cache.get(wUser.id);
        if (member && member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("I can't strike that person.")
                .then(m => m.delete({timeout: 5000}));
        }

        // Define reason or create default reason
        let wReason = args.slice(1).join(" ");
        if (!wReason) return message.channel.send("Please specify a reason for striking this user!");

        //Warn creation and storage
        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        warns[message.guild.id][wUser.id].push(wReason);

        //Writes the warning to a file
        client.dataStorage.saveData()

        //Finds the warn embed
        let warnchannel = message.guild.channels.cache.find(x => x.name === "mod-logs");
        if (!warnchannel) return message.channel.send(`:warning: Cannot find the "mod-logs" channel.`);

        //Number system at start of strike log messages
        function numToDateString(num) {
            let date = new Date(num)
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }

        //Sends the warn to chat & DMs
        warnchannel.send(`\`[${numToDateString(Date.now())}]\` :triangular_flag_on_post: **${message.author.tag}** has given a strike to **${wUser.tag}** *(${wUser.id})* \n\`Warn Reason:\` ${wReason}`);
        await message.channel.send(`The user ${wUser} has been given a strike for the reason **${wReason}**.`);
        try {
            await wUser.send(`__**New Strike Received**__ \n You have been given a strike for the reason: **${wReason}**`);
        } catch (e) {
        }

        // Defines amount of warns
        let WarnAmount = warns[message.guild.id][wUser.id].length;
        //Actions on X warns
        try {
            let muterole = message.guild.roles.cache.find(role => role.name === "Muted");
            if (!muterole) return message.channel.send(`There's no role called \`Muted\`, please create one.`);


            if (WarnAmount === 2) {
                await (member.roles.add(muterole.id));
                await client.dataStorage.addUserMute(wUser.id, message.guild.id, ms("30 minutes"));
                await message.channel.send(`${wUser} has had an automated mute applied for passing the **2** strike threshold.`);

            } else if (WarnAmount === 3) {
                await (member.roles.add(muterole.id));
                await client.dataStorage.addUserMute(wUser.id, message.guild.id, ms("2 hours"));
                await message.channel.send(`${wUser} has had an automated mute applied for passing the **3** strike threshold.`);

            } else if (WarnAmount === 4) {
                await member.kick(wReason);
                await message.channel.send(`${wUser} has been automatically kicked for passing the **4** strike threshold.`);
                await warnchannel.send(`\`[${numToDateString(Date.now())}]\` :boot: **AUTOMOD**  has kicked **${wUser.tag}** *(${wUser.id})* \n\`Kick Reason:\` Automatic - **4** strikes reached.`);

            } else if (WarnAmount === 5) {
                await wUser.send("------------------------------\n⚠ __**Automated Alert**__ ⚠\n------------------------------\nYou are on your **fifth** strike. Your next strike will result in an automatic ban.")
                await warnchannel.send(`\`[${numToDateString(Date.now())}]\`‼ The user **${wUser.tag}** *(${wUser.id})* has reached **5/6** strikes.`)
            }
            if (WarnAmount >= 6) {
                await message.guild.members.ban(wUser, {reason: wReason});
                await message.channel.send(`${wUser} has been banned for reaching 6 strikes.`);
                await warnchannel.send(`\`[${numToDateString(Date.now())}]\` :boot: **AUTOMOD**  has banned **${wUser.tag}** *(${wUser.id})* \n\`Ban Reason:\` Automatic - **6** strikes reached.`);
            }

            //If this shit goes bonkers ignore it (It won't, but I'm a bad coder too so...)
        } catch (e) {
        }

    }
};
