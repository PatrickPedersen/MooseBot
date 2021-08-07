const { embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, message) => {
    if (message.author === null || undefined) return;
    if (message.author.bot === true || null || undefined) return;

    let logChannel;
    if (await client.botProvider.fetchGuild(message.guild.id, "log") === true) {
        logChannel = await client.botProvider.fetchGuild(message.guild.id, "log_channel")
    }
    if (!logChannel) return;

    if (client.channels.cache.some(c => c.id === logChannel)) {
        const guildChannel = client.channels.cache.find(c => c.id === logChannel);

        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setDescription(`**Message sent by <@${message.author.id}> deleted in <#${message.channel.id}>**
            ${message.content ? message.content : null}`)

        embed.setFooter(`Author: ${message.author.id} | Message ID: ${message.id} • ${moment().format('[Today at] hh:mma')}`)
        guildChannel.send({ embed: embed, disableMentions: "all" })
        return;
    }
    client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
}