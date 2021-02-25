const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');
const { duration } = require('../../functions/duration');

// noinspection JSCheckFunctionSignatures
module.exports = class UptimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            aliases: ['up'],
            group: 'misc',
            memberName: 'uptime',
            description: 'Displays the bots uptime!',
            examples: ['uptime'],
            guildOnly: true,
            throttling: {
                usages: 5,
                duration: 10
            }
        });
    }

    async run(msg) {
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('Uptime!')
            .setDescription(`I have been online for: ${duration(this.client.uptime)}`)
        await msg.replyEmbed(embed)
    }
}