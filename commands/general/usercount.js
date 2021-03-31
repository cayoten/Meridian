module.exports = {
    name: "usercount",
    usage: "display amount of users",
    permlevel: "SEND_MESSAGES",
    catergory: "general",
    description: `Displays the current user count.`,
    run: async function (client, message) {

        await message.channel.send(`__${message.guild.name}__ currently has **${message.guild.memberCount}** members in total.`);

    }
};
