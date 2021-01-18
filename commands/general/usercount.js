module.exports = {
    name: "usercount",
    usage: "display amount of users",
    run: async function (client, message) {

        await message.channel.send(`__${message.guild.name}__ currently has **${message.guild.memberCount}** members in total.`);

    }
};
