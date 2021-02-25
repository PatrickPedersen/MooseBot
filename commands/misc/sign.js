const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

module.exports = class SignCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sign',
            aliases: [],
            group: 'misc',
            memberName: 'sign',
            description: 'Gives the Guest role upon signing the SOP!',
            examples: ['sign'],
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {
        await msg.delete();
        let guestRole = msg.guild.roles.cache.find(r => r.name === 'Guest')
        if (msg.member.roles.cache.some(r => r === guestRole)) {
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription(`${msg.author}, You already have ${guestRole} assigned`)
            await msg.channel.send({ embed: embed, disableMentions: true}).then(m => m.delete({timeout: 5000}))
            return;
        }
        await msg.member.roles.add(guestRole)
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`${msg.author}, Role ${guestRole} has been added`)
        await msg.channel.send({ embed: embed, disableMentions: true}).then(m => m.delete({timeout: 5000}))

    }
}