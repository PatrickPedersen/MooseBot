const { Command } = require('discord.js-commando');

module.exports = class EmitCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emit',
            aliases: [],
            group: 'administrator',
            memberName: 'emit',
            description: 'Emits a special event!',
            examples: ['emit'],
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {
        this.client.emit('guildMemberRemove', msg.member)
    }
}