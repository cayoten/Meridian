const Discord = require("discord.js");
module.exports = {
    name: "help",
    usage: "",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Well, this command, of course!`,

    run: async function (client, message) {

        //Delete command
        if (message.deletable) await message.delete({reason: "Auto-Delete"});

        //Define all 4 embeds
        let gHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**General Commands**")
            .setColor("#8be099")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let rpHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Roleplay Commands**")
            .setColor("#a82fff")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let miscHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Miscellaneous Commands**")
            .setColor("#e7dfdf")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let mHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Moderation Commands (Staff Only)**")
            .setColor("#c91c1c")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        let manageHelpEmbed = new Discord.MessageEmbed()
            .setDescription("**Management Commands (Admin Only)**")
            .setColor("#ffd394")
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        //Send embeds
        client.chatCommands.forEach((cmd/*, i */) => {
                if (cmd.category === 'general') {
                    // if (message.guild) {
                    //     if (message.member.permissions.has(Discord.Permissions.FLAGS[cmd.permLevel])) {
                    //         gHelpEmbed.addField(cmd.name, cmd.description)
                    //     }
                    // } else {
                    gHelpEmbed.addField(cmd.name, cmd.description)
                    // }
                } else if (cmd.category === 'roleplay') {
                    // if (message.guild) {
                    //     if (message.member.permissions.has(Discord.Permissions.FLAGS[cmd.permLevel])) {
                    //         rpHelpEmbed.addField(cmd.name, cmd.description)
                    //     }
                    // } else {
                    rpHelpEmbed.addField(cmd.name, cmd.description)
                    // }
                } else if (cmd.category === 'miscellaneous') {
                    // if (message.guild) {
                    //     if (message.member.permissions.has(Discord.Permissions.FLAGS[cmd.permLevel])) {
                    //         miscHelpEmbed.addField(cmd.name, cmd.description)
                    //     }
                    // } else {
                    miscHelpEmbed.addField(cmd.name, cmd.description)
                    // }
                } else if (cmd.category === 'moderation') {
                    // if (message.guild) {
                    //     if (message.member.permissions.has(Discord.Permissions.FLAGS[cmd.permLevel])) {
                    //         mHelpEmbed.addField(cmd.name, cmd.description)
                    //     }
                    // } else {
                    mHelpEmbed.addField(cmd.name, cmd.description)
                }
                // }
                else if (cmd.category === 'management') {
                    // if (message.guild) {
                    //     if (message.member.permissions.has(Discord.Permissions.FLAGS[cmd.permLevel])) {
                    //         manageHelpEmbed.addField(cmd.name, cmd.description)
                    //     }
                    // } else {
                    manageHelpEmbed.addField(cmd.name, cmd.description)
                    // }
                }
            }
        )
        let embedArray = [gHelpEmbed, rpHelpEmbed, miscHelpEmbed, mHelpEmbed, manageHelpEmbed]
        const Pagination = require('discord-paginationembed');

        await new Pagination.Embeds(embedArray)
            .setArray(embedArray)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
            .setPageIndicator(true)
            .setPage(1)
            // Methods below are for customising all embeds
            .build();
    }
};
