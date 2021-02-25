const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

module.exports = class YellowNameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yellowname',
            aliases: [],
            group: 'misc',
            memberName: 'yellowname',
            description: 'Displays info on how get the BWC tags!',
            examples: ['yellowname'],
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('How to get the BWC role')
            .setDescription(`Reach out to someone in C&S on Teamspeak, or the forums.
            Send them a message with your Discord Tag \`TestSubject#1234\` and they will give you your ${msg.guild.roles.cache.find(r => r.name === 'BWC')} perms.
            Your Discord Tag can be found down in the bottom left of the Discord application`)
        await msg.channel.send({embed: embed, disableMentions: "all"})
    }
}