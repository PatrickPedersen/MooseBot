const { logChannel, embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, member) => {
    // Member Stats.
    await client.botProvider.createMemberJoinStat(member.guild.id, member.id, member.joinedTimestamp)

    let logChannel;

    if (await client.botProvider.fetchGuild(member.guild.id, "log") === true) {
        logChannel = await client.botProvider.fetchGuild(member.guild.id, "log_channel")
    }

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

        let embed = await new MessageEmbed()
            .setColor(embedColor)
            .setThumbnail(await member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setAuthor(`Member Joined`, await member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setDescription(`<@${member.user.id}> ${member.user.tag}`)
            .addField('**Account Age**', `${years} years, ${months} months, ${days} days`)
            .setFooter(`ID: ${member.user.id} • ${moment(member.joinedTimestamp).format('D/M/Y')}`)

        await guildChannel.send({ embed: embed, disableMentions: "all"})
    }
    client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
}