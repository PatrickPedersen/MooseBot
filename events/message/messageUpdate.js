const { logChannel, embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, oldMessage, newMessage) => {
    if (!logChannel) return;

    if (client.channels.cache.some(c => c.id === logChannel)) {
        const guildChannel = client.channels.cache.find(c => c.id === logChannel);
        if (oldMessage.content === undefined || null) return;
        if (oldMessage.author.bot === true) return;

        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${oldMessage.author.tag}`)
            .setDescription(`**Message edited in ${oldMessage.channel}**`)
            .addField('**Before**', oldMessage.content)
            .addField('**After**', newMessage.content)

        embed.setFooter(`User ID: ${oldMessage.author.id} • ${moment().format('[Today at] hh:mma')}`)
        return guildChannel.send({ embed: embed, disableMentions: "all"})

    }
    client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
}