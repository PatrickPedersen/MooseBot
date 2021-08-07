const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction
module.exports = class WarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            aliases: [],
            group: 'moderator',
            userPermissions: ["KICK_MEMBERS"],
            memberName: 'warn',
            description: 'Warn the user. Requires a reason',
            examples: ['warn TestSubject#1234 Broke the rules'],
            format: 'warn <@User/UserID> <Reason>',
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        await msg.delete()
        if (!args) return msg.channel.send('You have to provide a @User/Userid and a reason!')
            .then(m => m.delete({timeout: 3000}));
        const argsArray = args.split(' ');
        const reason = argsArray.slice(1).join(' ');
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

        if (user === msg.author) return msg.channel.send(`You can't warn yourself!`)
            .then(m => m.delete({timeout: 3000}));
        if (!reason) return msg.reply(`You have to provide a reason for the warning!`)
            .then(m => m.delete({timeout: 3000}));

        await msg.client.botProvider.createWarning(msg.guild.id, user.id, reason, msg.author.id)
            .catch(err => this.client.logger.error(err.stack))

        const embed = new MessageEmbed()
            .setAuthor(`Warned by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setColor(embedColor)
            .setTimestamp()
            .setDescription(`**Action**: Warning \n**User**: ${user.tag} (${user.id}) \n**Reason**: ${reason}`)

        await user.send({ embed })
            .catch(err => this.client.logger.error(err.stack))

        if (await msg.client.botProvider.fetchGuild(msg.guild.id, 'log') === true) {
            const log_channel = msg.client.channels.cache.get(await msg.client.botProvider.fetchGuild(msg.guild.id, 'log_channel'));
            log_channel.send({ embed })
        }

        const warnembed = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`✅ ${user} Has been warned`)
        msg.channel.send({embed: warnembed})
            .then(m => m.delete({timeout: 5000}));

    }
}