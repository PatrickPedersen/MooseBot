const { Command } = require('discord.js-commando');
const { developers } = require('../../settings.json')

// noinspection JSCheckFunctionSignatures
module.exports = class ShutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            aliases: ["botstop"],
            group: 'developer',
            memberName: 'shutdown',
            description: 'Shuts down bot!',
            examples: ['shutdown'],
            guildOnly: false,
        });
    }

    async run(msg) {
        if (!developers.includes(msg.author.id))
            return msg.channel.send("You are not a developer!");
        msg.channel.send('Shutting down...').then(m => {
            process.exit(0);
        });
    }
};