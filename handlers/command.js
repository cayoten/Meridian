const {readdirSync} = require("fs");

const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Load status");

module.exports = (client) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));

        for (let file of commands) {
            /** @type{{name: string, usage: string, permLevel: string, category: string, description: string, aliases?:string[], run: function}}*/
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.chatCommands.set(pull.name, pull);
                table.addRow(file, '✅ -> Command Loaded!');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    console.log(table.toString());
};