
const Discord = require("discord.js");
const utils = require("../../lib/utils");
const responses = ["Welcome, glad to have you here", "Welcome to the server,", "NEW MEMBER INCOMING WELCOME TO", "Welcome on in,", "Greetings and welcome", "Welcome to the fur zone", "Drumroll for the new member"]
module.exports = {
    name: "verify",
    usage: "< id / mention >",
    category: "general",
    description: `Verifies the @'ed user and sends them to the main lobby.\nAvailable flags: -sr, -c`,
    /**
     * @param client {Discord.Client}
     * @param message {Discord.Message}
     * @return {Promise<?>}

     */
    run: async function (client, message) {

        let roles = {
            "241268522792124416": "444518133018132480", // FoxedIn
            "588127059700613120": "693168060294496366", // Testing Server
            "866825824966541332": "866827238842171403", // Glitch's New Server
            "708087852449136801": "717120288760004628" // Âµ - juan
        };


        let memberrole = message.guild.roles.cache.get(roles[message.guild.id]); //null/undefined if there's no member role.

        let log = utils.findTextChannel(message.guild, "join-approval-logs");
        if (!log) return message.channel.send({content:`Couldn't find "join-approval-logs" channel.`});

        let genchat = utils.findTextChannel(message.guild, "general-chat");
        if (!genchat) return message.channel.send({content:"Couldn't find general-chat channel."});

        let verifychat = utils.findTextChannel(message.guild, "verify-members");
        if (!verifychat) return message.channel.send({content:"Couldn't find verify-members channel."});

        let restricted = message.guild.roles.cache.find(b => b.name === "Server Restricted");
        if (!restricted) {
            return message.channel.send({content:`There isn't a "Server Restricted" role!`});
        }



        const questions = [                    // ------------------------------------
            "1) How old are you?",                  //
            "2) Where did you find us?",                  // Define the questions you'd like the
            "3) Why do you want to join our server?"  // application to have in this array.//
        ];

        const newthread = await message.channel.threads.create({
            name: `verify-${message.author.username}`,
            autoArchiveDuration: 60,
            reason: `Verification for new user`
        });

        const message1 = new Discord.MessageEmbed()
            .setTitle(`New Verification for user ${message.author.username}`)
        try {
            await message.channel.send("Verification started. Please check the new thread I just opened as to how to verify!");
            newthread.send(`Hello <@${message.author.id}>! In order to get verified, please respond to these 3 questions.`)
            questions.forEach((q) => {
                newthread.send(q)
            })
            const filter = m => m.author.id === message.author.id
            const collector = newthread.createMessageCollector({filter, time: 15000, max: 3});

            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('approve')
                        .setLabel('Approve')
                        .setStyle('SUCCESS'),
                    new Discord.MessageButton()
                        .setCustomId('restrict')
                        .setLabel('Restrict')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId('kick')
                        .setLabel('Kick')
                        .setStyle('DANGER'),
                );

            collector.on('end', async collected => {
                collected.forEach((col) => {
                    message1.addField(`Response -`, `${col.content}`)
                })
                const del = await verifychat.send({embeds: [message1], components: [row]})
                await message.channel.send(`Your verification has been sent, ${message.author}!`)
                await newthread.delete();

                const collectore = verifychat.createMessageComponentCollector({time: 15000});

                collectore.on('collect', async i => {
                    if (i.customId === 'approve') {
                        await log.send({content: `\`[${utils.epochToHour(Date.now())}]\` :cloud: **${message.author.tag}** (*${message.author.id}*) has been approved by **${message.author.tag}**.`});
                        await (message.member.roles.add(memberrole));
                        await genchat.send({content: `${responses[Math.round(Math.random() * (responses.length - 1))]} ${message.author}!`});
                        await i.update({content: `Approved user.`, components: []});
                    }

                    if (i.customId === 'restrict') {
                        await message.member.roles.add(restricted.id);
                        await (message.member.roles.add(memberrole));
                        await log.send({content: `\`[${utils.epochToHour(Date.now())}]\` :lock: **${message.author.tag}** *(${message.author.id})* has been __**Server Restricted**__ by **${message.author.tag}**.`});
                        await genchat.send({content: `${responses[Math.round(Math.random() * (responses.length - 1))]} ${message.author}!`});
                        await i.update({content: `Approved user with parameters \`restrict\`.`, components: []});
                    }
                    if(i.customId === 'kick') {
                        await message.member.kick();
                        await log.send({content: `\`[${utils.epochToHour(Date.now())}]\` :boot: **${message.author.tag}** *(${message.author.id})* has been __**denied entry**__ by **${message.author.tag}**.`});
                        await i.update({content: `Declined user.`, components: []});
                    }
                    collectore.on("end", async ()=>{
                        await del.delete();
                    })
                });
            });
        } catch(e) {}
    }
}