const Discord = require("discord.js");
const fs = require("fs");
const readline = require('readline');
require('dotenv').config();
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES, // too bad it will become privileged - juan
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_PRESENCES
    ]});
client.chatCommands = new Discord.Collection();

//Set up Sentry Logging
const Sentry = require("@sentry/node");
require("@sentry/tracing");
const {BrowserTracing} = require("@sentry/tracing");

Sentry.init({
    dsn: process.env.SENTRY,
    integrations: [new BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

//Per-server core features & utilities
const DataStorage = require('./lib/dataStorage.js');
const Utils = require('./lib/utils.js');
const JoinThrottler = require('./lib/joinThrottler.js');
client.dataStorage = new DataStorage(client)
client.cooldownManager = new Utils.CooldownManager();
client.joinThrottler = new JoinThrottler(client);

//Read Event Directory
fs.readdir("./events", (err, files) => {
    if (err) {
        Sentry.captureException(err);
        return console.error(err)
    }
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let eventName = file.split(".")[0];
        let Handler = require(`./events/${file}`);
        console.log(`Event "${file}" loaded.`);
        client.on(eventName, Handler.bind(client))
    });
});

//Initialize command handler
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
//If a dm is sent, it does nothing

const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
    warnThreshold: 4,
    kickThreshold: 8,
    banThreshold: 12,
    muteThreshold: 6,
    maxInterval: 5000,
    maxDuplicatesInterval: 5000,
    muteRoleName: "Muted",
    warnMessage: "{@user} has been flagged for spamming. [ALERT]",
    muteMessage: '**{user_tag}** has been muted for spamming. [MUTE]',
    kickMessage: '**{user_tag}** has been kicked for spamming. [KICK]',
    banMessage: '**{user_tag}** has been banned for spamming. [BAN]',
    errorMessages: true,
    kickErrorMessage: "Could not kick **{user_tag}** because of improper permissions.",
    banErrorMessage: "Could not ban **{user_tag}** because of improper permissions.",
    muteErrorMessage: "Could not mute **{user_tag}** because of improper permissions or the mute role couldn't be found.",
    maxDuplicatesWarning: 7,
    maxDuplicatesKick: 10,
    maxDuplicatesBan: 10,
    maxDuplicatesMute: 9,
    ignoredPermissions: ["MANAGE_MESSAGES"],
    ignoreBots: true,
    warnEnabled: true,
    kickEnabled: true,
    muteEnabled: false,
    banEnabled: false
});

// Trigger antispam
client.on("messageCreate", async function (message) {

    // discord-anti-spam check
    antiSpam.message(message);

    // important return for some servers
    if (message.author.bot) return;

    //  client prefixes and reading them

    let prefixes = ['$', '🐾', 'paw'];
    //  if the guild has a prefix set, add that to the prefixes array
    try {
        if (client.dataStorage.serverData[message.guild.id]) {
            if (client.dataStorage.serverData[message.guild.id]["prefix"]) prefixes.push(client.dataStorage.serverData[message.guild.id]["prefix"])
        }
    } catch (e) {
    }
    let foundPrefix = '';
    prefixes.forEach((prefix) => {
        if (message.content.startsWith(prefix)) foundPrefix = prefix;
    })
    if (foundPrefix === '') return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let cmdFile = client.chatCommands.get(cmd.slice(foundPrefix.length));
    if (cmdFile) cmdFile.run(client, message, args);

});
``
//Catch errors so they don't break the client
process.on(`uncaughtException`, (err) => {
    const errMsg = err.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`);

    Sentry.captureException(err);
    console.error(`Uncaught Exception: `, errMsg);

});
process.on(`unhandledRejection`, err => {

    Sentry.captureException(err);
    console.error(`Uncaught Promise Error: `, err);

});

//Bot login token
client.login(process.env.TOKEN);

//Terminate on SIGTERM
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('close', () => {
    console.info('Bot shutdown command received. Shutting down!');
    process.kill(process.pid, 'SIGTERM')
})

process.on('SIGTERM', () => {
    client.destroy();
})