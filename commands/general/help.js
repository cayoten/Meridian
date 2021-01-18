const Discord = require("discord.js");

module.exports = {
    name: "help",
    usage: "announcement message",
    run: async function (client, message, args) {

        if (!args[0]) return message.reply("Please specify whether you want **general**, **miscellaneous**, **moderation**, or **roleplay** commands.");

        let gHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**General Commands**")
            .setColor("#8be099")
            .addField("announce", `Staff only command to make an announcement.`)
            .addField("avatar", `Display's the @'ed user's avatar.`)
            .addField("botinfo", `Displays information about Foxhunt.`)
            .addField("dmuser", `DMs the tagged user with the specified text.`)
            .addField("enlarge", `Enlarge the specified emote.`)
            .addField("ping", `Shows the bot's ping.`)
            .addField("poll", `Staff only command to create a poll with the specified question.`)
            .addField("say", `Staff only command to make the bot say whatever you type.`)
            .addField("selfmute", `Mute yourself for 10 minutes.`)
            .addField("stealemote", `Staff only command to add the emote corresponded, counted by the messages above with the ^ symbol.`)
            .addField("usercount", `Displays the current user count.`)
            .addField("userinfo", `Display's the @'ed user's information.`)
            .setFooter("Developed by Raimu Akuna")
            .setTimestamp();

        let miscHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Miscellaneous Commands**")
            .setColor("#e7dfdf")
            .addField("8ball", `Roll the 8ball with a question.`)
            .addField("bap", `Beans the user tagged.`)
            .addField("bean", `Beans the tagged user.`)
            .addField("bork", `Bork bork bork!`)
            .addField("sfw", `CAN'T YOU FUCKERS KEEP IT APPROPRIATE??`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let mHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Moderation Commands**")
            .setColor("#c91c1c")
            .addField("approve", `Verifies the @'ed user and sends them to the main lobby.`)
            .addField("ban", `Bans the tagged user with a reason.`)
            .addField("clear", `Clears the specified amount of messages from a channel.`)
            .addField("filter", `A complex filter command per-server. Use $filter add (word or words WITHOUT SPACES) to create a word, $filter remove (ID) to remove a word, and $filter list to view word IDs.`)
            .addField("kick", `Kicks the tagged user with a reason.`)
            .addField("mute", `Mutes the tagged user with a time and reason.`)
            .addField("pardon", `Pardons a strike from the tagged user.`)
            .addField("strike", `Strikes the tagged user with a reason.`)
            .addField("strikes", `Shows the amount of Strikes for a user.`)
            .addField("tempban", `Temporarily ban a user. For example, $tempban @user 30m Reason`)
            .addField("unban", `Unbans the tagged user.`)
            .addField("unmute", `Unmutes the tagged user.`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let rpHelpEmbed = new Discord.MessageEmbed()
            .setTitle("Roleplay Commands")
            .setColor("#a82fff")
            .addField("boop", `Boop the tagged user.`)
            .addField("burn", `Burn the specified user.`)
            .addField("cuddle", `Cuddle with the tagged user.`)
            .addField("dropkick", `Dropkicks the user tagged.`)
            .addField("hug", `Gives the tagged user a hug.`)
            .addField("kill", `Murders the tagged user.`)
            .addField("kiss", `Kiss the tagged user.`)
            .addField("lick", `Gives you the option to lick somebody's "face", "paws", or "talons".`)
            .addField("microwave", `SLAM the tagged user into a microwave.`)
            .addField("obliterate", `Wipe the tagged user from existence.`)
            .addField("pat", `Pats the tagged user.`)
            .addField("poke", `Poke the tagged user.`)
            .addField("punch", `Punches the tagged user.`)
            .addField("slap", `Slaps the tagged user.`)
            .addField("snug", `Snuggles the tagged user.`)
            .addField("nom", `Noms the tagged user.`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        if (args[0] === "moderation") await message.channel.send(mHelpEmbed);
        if (args[0] === "general") await message.channel.send(gHelpEmbed);
        if (args[0] === "roleplay") await message.channel.send(rpHelpEmbed);
        if (args[0] === "miscellaneous") await message.channel.send(miscHelpEmbed);

    }

};