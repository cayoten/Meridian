const Discord = require("discord.js");
//Optimization: we don't need to create this array every time we execute the command.
const responses = ["Oh HELL nah", "Try again when I feel like answering", "Did you really just ask me that?", "FUCK YEAH", "yes pls", "You know it sugar!", "Never ever in a million years", "sure why not, leave me alone"];
module.exports = {
    name: "8ball",
    usage: "< question > ",
    permLevel: "SEND_MESSAGES",
    category: "miscellaneous",
    description: `Roll the 8ball with a question.`,

    run: async function (client, message, args) {
        if (client.cooldownManager.checkCooldownAndNotify("8ball", message.author.id, message)) {
            return;
        }

        if (args.length === 0)
            return message.channel.send({content: "you gotta have a question."});

        client.cooldownManager.setCoolDown("8ball", message.author.id, 60);

        let ballembed = new Discord.MessageEmbed()
            .setTitle("Your sassy 8ball answer is:")
            .setColor("#f6ca2e")
            .setDescription(`${responses[Math.round(Math.random() * (responses.length - 1))]}`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        await message.channel.send({embeds: [ballembed]});
    }
};