const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction,DuplicatedCode
module.exports = class UnDunceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'undunce',
            aliases: [],
            group: 'moderator',
            userPermissions: ["MANAGE_ROLES"],
            memberName: 'undunce',
            description: 'Removes the DunceCap from the given user and restores the roles.',
            examples: ['undunce TestSubject#1234'],
            format: 'dunce <@User/UserID>)',
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        await msg.delete();

        if (!args) return msg.channel.send('You have to provide a @User/Userid!')
            .then(m => m.delete({timeout: 3000}));

        const argsArray = args.split(' ');
        let user = msg.mentions.users.first();

        const muteRole = msg.guild.roles.cache.find(r => r.name === "DunceCap");

        if (!user) {
            try {
                user = await msg.guild.members.fetch(argsArray[0]);
                user = user.user;
            } catch (e) {
                return msg.reply('Could not find this user')
                    .then(m => m.delete({timeout: 3000}));
            }
        }

        if (user === msg.author) return msg.channel.send(`You can't undunce yourself!`)
            .then(m => m.delete({timeout: 3000}));

        let avatarURL = user.displayAvatarURL();
        let usertag = user.tag;

        user = await msg.guild.members.fetch(user.id);

        if (!user.roles.cache.some(role => role.id === muteRole.id))
            return msg.channel.send(`**<@${user.id}> is not DunceCapped.**`)
                .then(m => m.delete({timeout: 5000}))

        const dunce = await this.client.provider.fetchDunceCaps(msg.guild.id, user.id);
        const dunceValues = dunce[0].dataValues;
        const dunceRoles = JSON.parse(dunceValues.user_roles)

        let userRoles = [];

        for (let i = 0; i < dunceRoles.length; i++) {
            let role = await msg.guild.roles.cache.find(role => role.id === dunceRoles[i].id)
            userRoles.push(role.id)
        }

        await user.roles.set(userRoles)
            .catch(err => {
                this.client.logger.error(err.stack)
                return msg.channel.send(`Error setting users roles. Please try again. If issues persist please contact S-1.`)
                    .then(m => m.delete({timeout: 10000}))
            })

        await this.client.provider.removeDuncecap(msg.guild.id, dunce)
            .catch(err => this.client.logger.error(err.stack))

        const embed = new MessageEmbed()
            .setAuthor(`DunceCap removed by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(avatarURL)
            .setColor(embedColor)
            .setTimestamp()
            .setDescription(`**Action**: DunceCap Removed \n**User**: ${usertag} (${user.id})`)

        if (await msg.client.provider.fetchGuild(msg.guild.id, 'log') === true) {
            const log_channel = msg.client.channels.cache.get(await msg.client.provider.fetchGuild(msg.guild.id, 'log_channel'));
            log_channel.send({ embed })
        }

        embed.setDescription(`**Action**: DunceCap Removed \n**User**: ${usertag} (${user.id}) \n**Server**: ${msg.guild}`)

        await user.send({ embed })
            .catch(err => this.client.logger.error(err.stack))

        const dunceEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`✅ DunceCap removed for ${user}`)
        msg.channel.send({embed: dunceEmbed})
            .then(m => m.delete({timeout: 5000}));
    }
}