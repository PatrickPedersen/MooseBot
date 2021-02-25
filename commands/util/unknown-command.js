const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json')

module.exports = class UnknownCommandCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unknown-command',
            group: 'util',
            memberName: 'unknown-command',
            description: 'Displays help information for when an unknown command is used.',
            unknown: true,
            hidden: true
        });
    }

    run(msg) {
        if (msg.content.charAt(0) === msg.content.charAt(1)) return;
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${this.client.user.username} Help`, msg.guild.iconURL())
            .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(msg.client.user.avatarURL())
            .setTimestamp()
            .setTitle('Unknown Command')
            .setDescription(`Use ${msg.anyUsage(
                'help',
                msg.guild ? undefined : null,
                msg.guild ? undefined : null)}
                  to view the command list`)

        return msg.replyEmbed(embed)
    }
};
