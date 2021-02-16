const Discord = require("discord.js");
//Optimization: we don't need to create this array every time we execute the command.
const responses = ["Oh HELL nah", "Try again when I feel like answering", "Did you really just ask me that?", "FUCK YEAH", "yes pls", "You know it sugar!", "Never ever in a million years", "idk, ask yourself"];
module.exports = {
    name: "8ball",
    usage: "< question > ",
    run: async function (client, message, args) {
        if (client.cooldownManager.checkCooldownAndNotify("8ball", message.author.id, message)) {
            return;
        }

        if (args.length === 0)
            return message.reply("you gotta have a question.");

        client.cooldownManager.setCoolDown("8ball", message.author.id, 60);

        let ballembed = new Discord.MessageEmbed()
            .setTitle("Your 8ball answer is:")
            .setColor("#f6ca2e")
            .setDescription(`${responses[Math.round(Math.random() * (responses.length - 1))]}`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        await message.channel.send(ballembed);
    }
};