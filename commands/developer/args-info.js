const { Command } = require('discord.js-commando');

module.exports = class ArgsInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'args-info',
            aliases: [],
            group: 'developer',
            memberName: 'args-info',
            description: 'Information about the arguments provided.',
            examples: ['args-info'],
            guildOnly: true,
        });
    }

    async run(message, args) {
        await message.channel.send(
            `Arguments: ${args}\nArguments length: ${args.split(' ').length}`)
    }
};