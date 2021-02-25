const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction
module.exports = class WarnsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warns',
            aliases: ['warnlist'],
            group: 'moderator',
            userPermissions: ["KICK_MEMBERS"],
            memberName: 'warns',
            description: 'Shows a list of all the users warnings',
            examples: ['warns TestSubject#1234'],
            format: 'warns <@User/UserID>',
            guildOnly: true,
            args: [{
                key: 'user',
                lable: 'user',
                prompt: 'Which users warnings would you like to view?',
                type: 'user',
            }]
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        const user = args.user;
        const result = await msg.client.provider.fetchWarns(msg.guild.id, user.id)
            .catch(err => this.client.logger.error(err.stack))

        let warnings = [];
        for (let warn in result) {
            let values = result[warn].dataValues
            values.mod_id = await msg.guild.members.fetch(await values.mod_id)
            warnings.push(values)
        }

        let embed = new MessageEmbed()
            .setAuthor(`Warnings for: ${user.tag}`)
            .setColor(embedColor)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp()
            .setFooter(user.id)

        for (let warn in warnings) {
            embed.addField(`Warn id: ${warnings[warn].id}`, `Warned by: ${warnings[warn].mod_id}\nReason: ${warnings[warn].reason}`)
        }

        await msg.channel.send({embed: embed})

    }
}