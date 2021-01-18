const Discord = require("discord.js");

module.exports = {
    name: "botinfo",
    usage: "displays bot information",
    run: async function (client, message) {

        let infoEmbed = new Discord.MessageEmbed()
            .setTitle("Bot Information:")
            .setColor("#6bf442")
            .addField("Bot Name:", "Meridian")
            .addField("Bot Creator", "<@714663951320744037>", true)
            .addField("Creation Date", `Tuesday, May 14th 2019`, true)
            .addField("API Ping:", `${Math.round(client.ws.ping)}`, true)
            .addField("Command Count:", `41 Commands`)
            .setFooter("Developed by Cayoten")
            .setTimestamp();

        await message.channel.send(infoEmbed);

    }

};