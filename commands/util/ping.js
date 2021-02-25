const Command = require('discord.js-commando').Command;
const { MessageEmbed } = require('discord.js');
const { server_location, embedColor } = require('../../settings.json');

// noinspection JSUnresolvedVariable
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'util',
            memberName: 'ping',
            description: `Checks the bots ping to the Discord server.`,
            throttling: {
                usages: 5,
                duration: 10
            }
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {
        const pingMsg = await msg.reply('Pinging...');
        // noinspection JSUnresolvedFunction
        let ping = pingMsg.createdTimestamp - msg.createdTimestamp;
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('Pong!')
            .addField(`**Bot Latency:**`, `${ping}ms`, true)
            .addField(`**API Latency:**`, `${this.client.ws.ping}ms`, true)
            .addField(`**Bot Region:**`, server_location, true)
            .addField(`**Guild Region:**`, msg.guild.region, true)
        return pingMsg.edit(embed);
    }
};
