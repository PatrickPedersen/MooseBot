const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js')
const { chunkArray } = require('../../functions/chunk');
const Table = require("cli-table");

// noinspection FunctionTooLongJS
module.exports = class RoleCallCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rolecall',
            aliases: ["rc", "roles"],
            group: 'misc',
            memberName: 'rolecall',
            description: 'Displays all roles and the member count in each!',
            examples: ['rolecall'],
            guildOnly: true,
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {

        let roles = msg.guild.roles.cache.sort((a,b) => b.position - a.position).map(r => [r.name, r.members.size]);
        const table = new Table({
            chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
                'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
                'left': '' ,'left-mid': '' ,'mid': '' ,'mid-mid': '',
                'right': '' ,'right-mid': '' ,'middle': ''},
            colWidths: [25, 3]
        });
        for (let role in roles) {
            table.push(roles[role])
        }
        console.log(table.toString())
        await msg.channel.send(`\`\`\`${table.toString()}\`\`\``)
    }
}