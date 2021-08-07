const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction,DuplicatedCode
module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            aliases: [],
            group: 'moderator',
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            memberName: 'unban',
            description: 'Unban member from Guild',
            examples: ['Unban <UserID> <Reason>'],
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        await msg.delete()
        const argsArray = args.split(' ');
        const user = argsArray.slice(0, 1);
        const reason = argsArray.slice(1).join(' ');

        if (user[0] === msg.author.id) return msg.channel.send(`You are already unbanned!`)
            .then(m => m.delete({timeout: 3000}));
        if (!reason) return msg.reply(`You have to provide a reason for the unban!`)
            .then(m => m.delete({timeout: 3000}));

        const ban = await msg.guild.fetchBan(user[0])
            .catch(err => this.client.logger.error(err.stack));

        console.log(ban.user)

        await msg.guild.members.unban(ban.user, reason)
            .catch(err => this.client.logger.error(err.stack));

        const embed = new MessageEmbed()
            .setAuthor(`Unbanned by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(msg.guild.iconURL({ dynamic: true }))
            .setColor(embedColor)
            .setTimestamp()
            .setDescription(`**Action**: Unbanned \n**User**: ${ban.user.username} ${ban.user.id} \n**Reason**: ${reason}`)

        if (await msg.client.botProvider.fetchGuild(msg.guild.id, 'log') === true) {
            const log_channel = msg.client.channels.cache.get(await msg.client.botProvider.fetchGuild(msg.guild.id, 'log_channel'));
            log_channel.send({ embed })
        }

        const unbanembed = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`✅ ${ban.username} Has been banned`)
        msg.channel.send({embed: unbanembed})
            .then(m => m.delete({timeout: 5000}));
    }
}