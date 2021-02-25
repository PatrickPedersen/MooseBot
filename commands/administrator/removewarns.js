const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction
module.exports = class RemoveWarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'removewarns',
            aliases: [],
            group: 'administrator',
            userPermissions: ["ADMINISTRATOR"],
            memberName: 'removewarns',
            description: 'Removes all warnings from specified user',
            examples: ['removewarns TestSubject#1234'],
            format: 'removewarns <@User/UserId>',
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures,DuplicatedCode
    async run(msg, args) {
        await msg.delete()
        if (!args) return msg.channel.send('You have to provide a @User/Userid and id of the warning!')
            .then(m => m.delete({timeout: 3000}));
        const argsArray = args.split(' ');
        let user = msg.mentions.users.first();

        if (!user) {
            try {
                user = await msg.guild.members.fetch(argsArray[0]);
                user = user.user;
            } catch (e) {
                return msg.reply('Could not find this user')
                    .then(m => m.delete({timeout: 3000}));
            }
        }

        if (user === msg.author) return msg.channel.send(`You can't remove your own warnings!`)
            .then(m => m.delete({timeout: 3000}));

        await this.client.provider.removeWarnings(msg.guild.id, user.id)
            .catch(err => this.client.logger.error(err.stack))

        const warnRemove = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`**ALL** Warnings Removed from user ${user}`)
        msg.channel.send({embed: warnRemove})
            .then(m => m.delete({timeout: 5000}));
    }
}