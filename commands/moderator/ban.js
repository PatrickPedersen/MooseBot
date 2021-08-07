const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction,DuplicatedCode
module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: [],
            group: 'moderator',
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            memberName: 'ban',
            description: 'Bans member from Guild',
            examples: ['ban <@User/UserID> <Reason>'],
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

        if (user === msg.author) return msg.channel.send(`You can't ban yourself!`)
            .then(m => m.delete({timeout: 3000}));
        if (!reason) return msg.reply(`You have to provide a reason for the ban!`)
            .then(m => m.delete({timeout: 3000}));

        const embed = new MessageEmbed()
            .setAuthor(`Banned by ${msg.author.tag} from guild ${msg.guild.name}`, msg.author.displayAvatarURL())
            .setThumbnail(msg.guild.iconURL({ dynamic: true }))
            .setColor(embedColor)
            .setTimestamp()
            .setDescription(`**Action**: Banned \n**User**: ${user.tag} (${user.id}) \n**Reason**: ${reason}`)

        if (user.bot === false)
        await user.send({ embed })
            .catch(err => this.client.logger.error(err.stack))

        await msg.guild.members.ban(user, {reason: reason})
            .catch(err => this.client.logger.error(err.stack));

        if (await msg.client.botProvider.fetchGuild(msg.guild.id, 'log') === true) {
            const log_channel = msg.client.channels.cache.get(await msg.client.botProvider.fetchGuild(msg.guild.id, 'log_channel'));
            log_channel.send({ embed })
        }

        const banembed = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`✅ ${user} Has been banned`)
        msg.channel.send({embed: banembed})
            .then(m => m.delete({timeout: 5000}));

    }
}