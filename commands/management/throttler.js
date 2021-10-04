const Discord = require("discord.js");
const utils = require('../../lib/utils.js');
const numberOnly = /^[0-9]+/;
module.exports = {
    name: "throttler",
    usage: "< option > < value >",
    permlevel: "BAN_MEMBERS",
    catergory: "moderation",
    description: `Allows to configure the join throttler.`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @param args {string[]}
     * @return {Promise<?>}
     */
    run: async function (client, message, args) {
        if (!utils.checkPermissionAndNotify(message.member, message.channel, Discord.Permissions.FLAGS.BAN_MEMBERS)) {
            return;
        }

        let configKey = args[0] ?? "none";
        let value = args[1] ?? "none";
        let cfg = client.joinThrottler.getGuildPersistentData(message.guild);

        switch (configKey) {
            case "enabled":
            case "banOnRaid":
            case "warnOnRaid":
                if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
                    cfg[configKey] = value === "true";
                    await message.channel.send({content:`Changed \`${configKey}\` to ${value}!`});
                    client.dataStorage.saveData();
                } else {
                    await message.channel.send({content:`\`${value}\` is not a valid value!`});
                }
                break;
            case "warnChannel":
                value = String(value).replace("#", "")
                    .replace("<", "")
                    .replace(">", "");

                let channel;
                if (value.match(numberOnly)) {
                    channel = message.guild.channels.resolve(value);
                } else {
                    channel = message.guild.channels.cache.find(x => x.name === value);
                }

                if (channel) {
                    cfg.warnChannel = channel.id;
                    await message.channel.send({content:`Changed \`${configKey}\` to <#${channel.id}>!`});
                    client.dataStorage.saveData();
                } else {
                    await message.channel.send({content:`Unable to find \`${value.match(numberOnly) ? `<#${value}>` : value}\`.`});
                }
                break;
            case "warnMessage":
                if (args.length >= 2) {
                    let text = args.slice(1, args.length).join(" ");
                    cfg.warnMessage = text;
                    await message.channel.send({ 
                        content:`Changed \`${configKey}\` to "${text}"!`,
                        allowedMentions: {parse:[]}
                    });
                    client.dataStorage.saveData();
                } else {
                    await message.channel.send({content: `I need a valid text!`});
                }
                break;
            case "maxViolationLevel":
            case "violationPeriod":
            case "forgetTime":
                let number = parseInt(value);
                if (isFinite(number) && number > 0 && number < 2147483647) {
                    cfg[configKey] = number;
                    await message.channel.send({content:`Changed \`${configKey}\` to ${number}!`});
                    client.dataStorage.saveData();
                } else {
                    await message.channel.send({content:`\`${value}\` is not a valid value!`});
                }
                break;
            default:
                await message.channel.send({ content:`No such option \`${configKey}\` \n
Available options - possible values - current value - description
    \`enabled\` - true | false - ${cfg.enabled} - if true the anti-raid will be enabled.
    \`banOnRaid\` - true | false - ${cfg.banOnRaid} - if true will ban detected users instead of kicking them.
    \`warnOnRaid\` - true | false - ${cfg.warnOnRaid} - if true the bot will send an warning when a raid starts.
    \`warnChannel\` - channel - <#${cfg.warnChannel}> - the channel where the bot should send the warning.
    \`warnMessage\` - text - ${cfg.warnMessage} - the message the bot should send when a raid starts.
    \`maxViolationLevel\` - positive number - ${cfg.maxViolationLevel} - maximum violations the bot will tolerate before enabling the anti-raid.
    \`violationPeriod\` - time in milliseconds - ${cfg.violationPeriod} - the minimum time between joins, if someone joins while in a violation period the violation level will increase by one.
    \`forgetTime\` - time in seconds - ${cfg.forgetTime} - if nobody joins after the configured time the bot will forget about any previous violation level and raid status.
`,
                allowedMentions: {parse:[]}
                });
                break;
        }
    }
};