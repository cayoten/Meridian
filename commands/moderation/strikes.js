const utils = require('../../lib/utils.js');
module.exports = {
    name: "strikes",
    usage: "< id / mention > ",
    permlevel: "MANAGE_MESSAGES",
    catergory: "moderation",
    description:  `Shows the amount of Strikes for a user.`,
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, "MANAGE_MESSAGES"))
            return;
        
        let wUser;
        try {
            wUser = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch(e) {}

        if (!wUser) return message.channel.send('Unable to find user.');

        let warns = client.dataStorage.warnings;
        if (!warns[message.guild.id]) warns[message.guild.id] = {};//Create a new empty object fot this guild.
        if (!warns[message.guild.id][wUser.id]) warns[message.guild.id][wUser.id] = [] ///Create a new empty array fot this user.

        let userWarns = warns[message.guild.id][wUser.id];
        //Let's list warns by index
        if (userWarns.length > 0) {
            let warnMessage = `This user has **${userWarns.length}** strikes.\n`;
            userWarns.forEach((item, index) => {
                warnMessage = warnMessage + `\`Strike ID:\` ${index} \`Strike Reason:\` ${item}\n`;
            })
            await message.reply(warnMessage);
        } else {
            await message.reply(`this user doesn't have any strikes. They're a role model!`);
        }

    }

};