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

        if (message.deletable) await message.delete();

        let roles = {
            "241268522792124416": "444518133018132480", // FoxedIn
            "588127059700613120": "693168060294496366", // Testing Server
            "866825824966541332": "866827238842171403", // Glitch's New Server
            "708087852449136801": "717120288760004628" // Âµ - juan
        };


        let memberrole = message.guild.roles.cache.get(roles[message.guild.id]); //null/undefined if there's no member role.

        if(message.member.roles.cache.find(x => x.name === "Member")) {
            return message.channel.send("You are already verified!");
        }

        let genchat = utils.findTextChannel(message.guild, "general-chat");
        if (!genchat) return message.channel.send({content: "Couldn't find general-chat channel."});

        let verifychat = utils.findTextChannel(message.guild, "verify-members");
        if (!verifychat) return message.channel.send({content: "Couldn't find verify-members channel."});

        let restricted = message.guild.roles.cache.find(b => b.name === "Server Restricted");
        if (!restricted) {
            return message.channel.send({content: `There isn't a "Server Restricted" role!`});
        }


        const questions = [                    // ------------------------------------
            "1) How old are you?",                  //
            "2) Where did you find us?",                  // Define the questions you'd like the
            "3) Why do you want to join our server?"  // application to have in this array.//
        ];

        const newthread = await message.channel.threads.create({
            name: `verify-${message.author.id}`,
            autoArchiveDuration: 60,
            reason: `Verification for user ${message.author.tag}`
        });

        const message1 = new Discord.MessageEmbed()
            .setTitle(`Verification received for user \`${message.author.tag}\``)
        try {
            await message.channel.send("Verification started. Please check the new thread I just opened as to how to verify!")
                .then(m => setTimeout(() => m.delete(), 5000));
            newthread.send(`Hello, and welcome <@${message.author.id}>! In order to get verified, please respond to these 3 questions, __each in a new message__!`)
            questions.forEach((q) => {
                newthread.send(q)
            })
            const filter = m => m.author.id === message.author.id
            const collector = newthread.createMessageCollector({filter, time: 60000, max: 3});

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

                //Close thread & return if nothing was sent
                if (collected.size === 0) {
                    await newthread.delete();
                    return message.channel.send(`Verification timeout due to reason \`time runout\`. Verify again by typing $verify, <@${message.author.id}>!`).then(m => setTimeout(() => m.delete(), 10000));
                }

                //Close thread & return if there wasn't 3 responses
                if (collected.size !== 3) {
                    await newthread.delete();
                    return message.channel.send(`Verification timeout due to reason \`not 3 responses\`. Make sure you put each answer on a separate line, and then verify by typing $verify, <@${message.author.id}>!`).then(m => setTimeout(() => m.delete(), 10000));
                }

                //Form responses
                collected.forEach((col) => {
                    message1.addField(`Response -`, `${col.content}`)
                })

                //Set up delete variable for buttons, successfully send verification, and delete thread
                const del = await verifychat.send({embeds: [message1], components: [row]})
                await message.channel.send(`Your verification has been sent, ${message.author}!`)
                    .then(m => setTimeout(() => m.delete(), 5000));
                await newthread.delete();

                //Button items, 7 days to respond
                const collectore = verifychat.createMessageComponentCollector({time: 604800000});

                //Do X thing on Y button
                    collectore.on('collect', async i => {
                        if (!i.member.permissions.has("MANAGE_MESSAGES")) {
                            await i.reply(`Member \`${i.user.username}\` missing permissions.`);
                            await i.editReply({embeds: [message1], components: [row]});
                            try { return del.delete(); } catch (e) {}
                        }

                    if (i.customId === 'approve') {
                        await (message.member.roles.add(memberrole));
                        await genchat.send({content: `${responses[Math.round(Math.random() * (responses.length - 1))]} ${message.author}!`});
                        await verifychat.send(`Approved user with parameters \`none\`.`).then(m => setTimeout(() => m.delete(), 5000));
                        await i.message.edit({content: `Success`, components: []});
                        await collectore.stop();
                        try { return del.delete(); } catch (e) {}
                    }

                    if (i.customId === 'restrict') {
                        await message.member.roles.add(restricted.id);
                        await (message.member.roles.add(memberrole));
                        await genchat.send({content: `${responses[Math.round(Math.random() * (responses.length - 1))]} ${message.author}!`});
                        await verifychat.send(`Approved user with parameters \`restrict\`.`).then(m => setTimeout(() => m.delete(), 5000));
                        await i.message.edit({content: `Success`, components: []});
                        await collectore.stop();
                        try { return del.delete(); } catch (e) {}
                    }
                    if (i.customId === 'kick') {
                        await message.member.kick();
                        await verifychat.send(`Declined user.`).then(m => setTimeout(() => m.delete(), 5000));
                        await i.message.edit({content: `Success`, components: []});
                        await collectore.stop();
                        try { return del.delete(); } catch (e) {}
                    }
                });
            });
        } catch (e) {
        }
    }
}