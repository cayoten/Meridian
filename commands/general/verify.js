const Discord = require("discord.js");
const utils = require("../../lib/utils");
const responses = ["Welcome, glad to have you here", "Welcome to the server,", "NEW MEMBER INCOMING WELCOME TO", "Welcome on in,", "Greetings and welcome", "Welcome to the fur zone", "Drumroll for the new member"]
module.exports = {
    name: "verify",
    usage: "< id / mention >",
    category: "general",
    description: `Threaded verification system for new members.\nMod-only portion is button controlled.`,

    run: async function (client, message) {

        //Delete command
        if (message.deletable) await message.delete();

        // Roles for servers
        let roles = {
            "241268522792124416": "444518133018132480", // FoxedIn
            "588127059700613120": "693168060294496366", // Testing Server
            "866825824966541332": "866827238842171403", // Glitch's New Server
            "708087852449136801": "717120288760004628" // Âµ - juan
        };


        let memberRole = message.guild.roles.cache.get(roles[message.guild.id]); //null/undefined if there's no member role.

        // Verified? Go away.
        if (message.member.roles.cache.find(x => x.name === "Member")) {
            return message.channel.send("You are already verified!");
        }

        // Define chats & roles
        let genChat = utils.findTextChannel(message.guild, "general-chat");
        if (!genChat) return message.channel.send({content: "Couldn't find general-chat channel."});

        let verifyChat = utils.findTextChannel(message.guild, "verify-members");
        if (!verifyChat) return message.channel.send({content: "Couldn't find verify-members channel."});

        let restrictRole = message.guild.roles.cache.find(b => b.name === "Server Restricted");
        if (!restrictRole) {
            return message.channel.send({content: `There isn't a "Server Restricted" role!`});
        }


        //Questions
        const questions = [
            "1) How old are you?",
            "2) Where did you find us?",
            "3) Why do you want to join our server?"
        ];

        //Thread creator
        const newThread = await message.channel.threads.create({
            name: `verify-${message.author.id}`,
            autoArchiveDuration: 60,
            reason: `Verification for user ${message.author.tag}`
        });

        //Create embed

        const merge = "https://images.google.com/searchbyimage?image_url=";

        const message1 = new Discord.MessageEmbed()
            .setTitle(`New Verification Received!`)
            .setDescription(`[**Avatar Reverse Image Search**](${merge + message.member.displayAvatarURL()})`)
            .addField(`Username`, `<@${message.author.id}> - ${message.author.tag}`)
            .setThumbnail(message.member.displayAvatarURL())
            .setFooter(`User account created at: ${message.member.user.createdAt}`)
        await message.channel.send("Your verification has been started! Please join the thread I just created to continue.")
            .then(m => setTimeout(() => m.delete(), 5000));

        //Send messages to thread and then send questions
        await newThread.send(`Hello, and welcome <@${message.author.id}>! All you have to do to get verified is reply to all 3 questions __individually__!`)

        //Async send all questions
        for (const q of questions) {
            await newThread.send(q)
        }

        //Create filter and give 5 minutes for questions
        const filter = m => m.author.id === message.author.id
        const messageCollector = newThread.createMessageCollector({filter, time: 300000, max: 3});

        //Button assembly
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
                new Discord.MessageButton()
                    .setCustomId('left')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY'),
            );

        //End the question collector, log everything
        messageCollector.on('end', async collected => {

            //Close thread & return if nothing was sent
            if (collected.size === 0) {
                await newThread.delete();
                return message.channel.send(`Verification timeout due to reason \`time runout\`. Verify again by typing $verify, <@${message.author.id}>!`).then(m => setTimeout(() => m.delete(), 30000));
            }

            //Close thread & return if there wasn't 3 responses
            if (collected.size !== 3) {
                await newThread.delete();
                return message.channel.send(`Verification timeout due to reason \`not 3 responses\`. Make sure you put each answer on a separate line, and then verify by typing $verify, <@${message.author.id}>!`).then(m => setTimeout(() => m.delete(), 30000));
            }

            //Form responses
            collected.forEach((col) => {
                message1.addField(`Response -`, `${col.content}`)
            })

            //Set up delete variable for buttons, successfully send verification, and delete thread
            const del = await verifyChat.send({embeds: [message1], components: [row]})
            await message.channel.send(`Your verification has been sent, ${message.author}!`)
                .then(m => setTimeout(() => m.delete(), 30000));
            await newThread.delete();

            //Button items, 7 days to respond
            const buttonCollector = del.createMessageComponentCollector({time: 604800000});

            //Do X thing on Y button
            buttonCollector.on('collect', async i => {

                //No perms? Get outta here. (Decline perms)
                if (!i.member.permissions.has("MANAGE_MESSAGES")) {
                    await i.reply(`Member \`${i.user.username}\` missing permissions.`).then(m => setTimeout(() => m.delete(), 5000));
                    return;
                }

                //Approve a member
                if (i.customId === 'approve') {
                    await (message.member.roles.add(memberRole));
                    await genChat.send({content: `${responses[Math.round(Math.random() * (responses.length - 1))]} ${message.author}!`});
                    await verifyChat.send(`Approved user with parameters \`none\`.`).then(m => setTimeout(() => m.delete(), 5000));
                    await i.message.edit({content: `Success`, components: []});
                    await buttonCollector.stop();
                    try {
                        return del.delete();
                    } catch (e) {
                    }
                }

                //Restrict them and approve
                if (i.customId === 'restrict') {
                    await message.member.roles.add(restrictRole.id);
                    await (message.member.roles.add(memberRole));
                    await genChat.send({content: `${responses[Math.round(Math.random() * (responses.length - 1))]} ${message.author}!`});
                    await verifyChat.send(`Approved user with parameters \`restrict\`.`).then(m => setTimeout(() => m.delete(), 5000));
                    await i.message.edit({content: `Success`, components: []});
                    await buttonCollector.stop();
                    try {
                        return del.delete();
                    } catch (e) {
                    }
                }

                //Get the heck outta here (kick them)
                if (i.customId === 'kick') {
                    await message.member.kick();
                    await verifyChat.send(`Declined user.`).then(m => setTimeout(() => m.delete(), 5000));
                    await i.message.edit({content: `Success`, components: []});
                    await buttonCollector.stop();
                    try {
                        return del.delete();
                    } catch (e) {
                    }
                }

                //Cancel the embed
                if (i.customId === 'left') {
                    try {
                        await del.delete();
                    } catch (e) {
                    }
                    await verifyChat.send(`Cancelled with reason \`member left\`.`).then(m => setTimeout(() => m.delete(), 5000));
                    return buttonCollector.stop();
                }
            });
        });
    }
}