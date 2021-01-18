const Discord = require("discord.js");
//Optimization: we don't need to create this array every time we execute the command.
const responses = ["Oh HELL nah", "Try again when I feel like answering", "Did you really just ask me that?", "FUCK YEAH", "yes pls", "You know it sugar!", "Never ever in a million years", "idk, ask yourself"];
const lastUsedMap = new Map(); // User id -> last time used in ms, this can be dangerous over time if you have more than 1k people running the command
const commandCooldown = 60; //Command cooldown in seconds

module.exports = {
    name: "8ball",
    usage: "< question > ",
    run: async function (client, message, args) {

        if (lastUsedMap.has(message.author.id)) { //Ok, the user exist on our map, let's check if they can execute the command.
            let lastTimeUsed = lastUsedMap.get(message.author.id);
            let timeleft = (lastTimeUsed + (1000 * commandCooldown)) - Date.now()
            const secondsleft = Math.round(timeleft / 1000)
            if (lastTimeUsed + (1000 * commandCooldown) > Date.now()) {//The user still needs to wait to execute the command again.
                if (message.deletable) message.delete({reason: "It had to be done."})
                return message.reply(`You need to wait ${secondsleft} seconds before running this command again!`);
            }
        }
        if (args.length === 0)
            return message.reply("you gotta have a question.");

        lastUsedMap.set(message.author.id, Date.now()); //add the user to our map.

        let ballembed = new Discord.MessageEmbed()
            .setTitle("Your 8ball answer is:")
            .setColor("#f6ca2e")
            .setDescription(`${responses[Math.round(Math.random() * (responses.length - 1))]}`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        await message.channel.send(ballembed);
    }
};