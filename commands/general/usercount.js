module.exports = {
    name: "usercount",
    usage: "display amount of users",
    permLevel: "SEND_MESSAGES",
    category: "general",
    description: `Displays the current user count.`,

    run: async function (client, message) {
        await message.channel.send({content: `__${message.guild.name}__ currently has **${message.guild.memberCount}** members in total.`});
    }
};
