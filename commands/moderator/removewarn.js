const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction
module.exports = class RemoveWarnCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'removewarn',
            aliases: [],
            group: 'moderator',
            userPermissions: ["KICK_MEMBERS"],
            memberName: 'removewarn',
            description: 'Removes a warning from the user by warn id',
            examples: ['removewarn TestSubject#1234 44'],
            format: 'removewarn <@User/UserId> <warningId>',
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures,DuplicatedCode
    async run(msg, args) {
        await msg.delete()
        if (!args) return msg.channel.send('You have to provide a @User/Userid and id of the warning!')
            .then(m => m.delete({timeout: 3000}));
        const argsArray = args.split(' ');
        if (argsArray > 1) return msg.channel.send(`You can only delete one warning at a time!`)
        const warningId = argsArray.slice(1);
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
        if (!warningId) return msg.reply(`You have to provide a id for the warning you are trying to remove!`)
            .then(m => m.delete({timeout: 3000}));

        const warning = await this.client.provider.fetchWarns(msg.guild.id, user.id, warningId[0])
        await this.client.provider.removeWarning(msg.guild.id, warning)
            .catch(err => this.client.logger.error(err.stack))

        const warnUser = await msg.guild.members.fetch(await warning[0].user_id);

        const embed = new MessageEmbed()
            .setAuthor(`Warned removed by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setColor(embedColor)
            .setTimestamp()
            .setDescription(`**Action**: Warning Removed! \n**User**: ${warnUser.user.tag} (${warnUser.user.id}) \n**Reason**: ${warning[0].reason}`)

        if (await msg.client.provider.fetchGuild(msg.guild.id, 'log') === true) {
            const log_channel = msg.client.channels.cache.get(await msg.client.provider.fetchGuild(msg.guild.id, 'log_channel'));
            log_channel.send({ embed })
        }

        await msg.channel.send({embed: embed})
    }
}