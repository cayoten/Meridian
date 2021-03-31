const Discord = require("discord.js");
module.exports = {
    name: "help",
    usage: "",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Well, this command, of course!`,
    run: async function (client, message, args) {

        let gHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**General Commands**")
            .setColor("#8be099")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let miscHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Miscellaneous Commands**")
            .setColor("#e7dfdf")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let mHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Moderation Commands**")
            .setColor("#c91c1c")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let rpHelpEmbed = new Discord.MessageEmbed()
            .setTitle("**Roleplay Commands**")
            .setColor("#a82fff")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let manageHelpEmbed = new Discord.MessageEmbed()
            .setTitle("**Management Commands**")
            .setColor("#ffd394")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        client.commands.forEach((cmd, i) => {
                if (cmd.catergory === 'general') {
                    if (message.member.hasPermission(cmd.permlevel)) {
                        gHelpEmbed.addField(cmd.name, cmd.description)
                    }
                }
                else if (cmd.catergory === 'miscellaneous') {
                    if (message.member.hasPermission(cmd.permlevel)) {
                        miscHelpEmbed.addField(cmd.name, cmd.description)
                    }
                }
                else if (cmd.catergory === 'moderation') {
                    if (message.member.hasPermission(cmd.permlevel)) {
                        mHelpEmbed.addField(cmd.name, cmd.description)
                    }
                }
                else if (cmd.catergory === 'management') {
                    if (message.member.hasPermission(cmd.permlevel)) {
                        manageHelpEmbed.addField(cmd.name, cmd.description)
                    }
                }
                else if (cmd.catergory === 'roleplay') {
                    if (message.member.hasPermission(cmd.permlevel)) {
                        rpHelpEmbed.addField(cmd.name, cmd.description)
                    }
                }
            }
        )
        await message.author.send(gHelpEmbed)
        await message.author.send(miscHelpEmbed)
        await message.author.send(mHelpEmbed)
        await message.author.send(rpHelpEmbed)
        await message.author.send(manageHelpEmbed)
    }
};
