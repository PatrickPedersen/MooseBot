const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor, gameRoles } = require('../../settings.json');

module.exports = class GiveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'give',
            aliases: [],
            group: 'misc',
            memberName: 'give',
            description: 'Gives a specified game role',
            clientPermissions: ['MANAGE_ROLES'],
            format: '<role>',
            examples: ['give <role>'],
            guildOnly: true,
            args: [{
                key: "role",
                label: "role",
                prompt: 'What Game Role would you like?',
                type: 'role'
            }]
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, { role }) {
        await msg.delete();
        if (gameRoles[role.name] && !msg.member.roles.cache.some(r => r.id === role.id)) {
            let roleId = gameRoles[role.name];
            let gameRole = msg.guild.roles.cache.get(roleId)
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`Game Role has been added`)
            await msg.member.roles.add(gameRole)
                .then(msg.channel.send({ embed: embed })
                    .then(m => m.delete({timeout: 5000}))
                    .catch(err => this.client.logger.error(err.stack)))
                .catch(err => this.client.logger.error(err.stack))
        } else if (gameRoles[role.name] && msg.member.roles.cache.some(r => r.id === role.id)) {
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`Game Role has been removed`)
            await msg.member.roles.remove(role)
                .then(msg.channel.send({ embed: embed })
                    .then(m => m.delete({timeout: 5000}))
                    .catch(err => this.client.logger.error(err.stack)))
                .catch(err => this.client.logger.error(err.stack))
        } else {
            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setDescription(`That Role is not a Game Role`)
            await msg.channel.send({ embed: embed }).then(m => m.delete({timeout: 5000}))
        }
    }
}
