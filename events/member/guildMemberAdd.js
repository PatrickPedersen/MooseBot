const { logChannel, embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, member) => {
    if (!logChannel) return;
    if (await client.channels.cache.some(c => c.id === logChannel)) {
        const guildChannel = await client.channels.cache.find(c => c.id === logChannel);

        const currentTime = moment();
        const memberTimestamp = moment(member.user.createdTimestamp);
        const years = currentTime.diff(memberTimestamp, 'years');
              memberTimestamp.add(years, 'years');
        const months = currentTime.diff(memberTimestamp, 'months');
              memberTimestamp.add(months, "months");
        const days = currentTime.diff(memberTimestamp, 'days');

        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setAuthor(`Member Joined`, member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setDescription(`<@${member.user.id}> ${member.user.tag}`)
            .addField('**Account Age**', `${years} years, ${months} months, ${days} days`)
            .setFooter(`ID: ${member.user.id} • ${moment(member.joinedTimestamp).format('D/M/Y')}`)

        return guildChannel.send({ embed: embed, disableMentions: "all"})
    }
    client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
}