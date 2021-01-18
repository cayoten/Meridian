module.exports = {
    name: "obliterate",
    usage: "< id / mention >",
    run: async function (client, message, args) {

        if(message.deletable) message.delete();

        let obUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!obUser) return message.reply("user not found.");
        if (message.mentions.members.first().user === message.author) return message.reply("you can't roleplay with yourself!");

        let array = ["used ZA WARUDO", "exploded", "used magic", "did an OwO", "died", "did a thing"];
        await message.channel.send(`${message.author} ${array[Math.round(Math.random() * (array.length - 1))]} so that they could OBLITERATE ${obUser} from existence!`);
    }

};