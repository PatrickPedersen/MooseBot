const { embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, oldMember, newMember) => {
    let logChannel;

    if (await client.provider.fetchGuild(newMember.guild.id, "log") === true) {
        logChannel = await client.provider.fetchGuild(newMember.guild.id, "log_channel")
    }

    if (!logChannel) return;

    if (client.channels.cache.some(c => c.id === logChannel)) {
        const guildChannel = client.channels.cache.find(c => c.id === logChannel);

        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${newMember.user.tag}`, newMember.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))

        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
            embed.setDescription(`**The roles ${removedRoles.map(r => r)} were removed from ${oldMember}.**`)
        }
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size > 0) {
            embed.setDescription(`**The roles ${addedRoles.map(r => r)} were added to ${oldMember}.**`)
        }

        const nicknameChanged = oldMember.nickname !== newMember.nickname;
        if (nicknameChanged !== false) {
            embed.addField('Old Nickname', oldMember.nickname ? oldMember.nickname : 'None');
            embed.addField('New Nickname', newMember.nickname ? newMember.nickname : newMember);
        }

        embed.setFooter(`User ID: ${oldMember.user.id} • ${moment().format('[Today at] hh:mma')}`)
        return guildChannel.send({ embed: embed, disableMentions: "all"})

    }
    client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
}