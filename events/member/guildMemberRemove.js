const { logChannel, embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, member) => {

    // Member Stats.
    await client.botProvider.createMemberLeaveStat(member.guild.id, member.id, String(Date.now()))

    let logChannel;

    if (await client.botProvider.fetchGuild(member.guild.id, "log") === true) {
        logChannel = await client.botProvider.fetchGuild(member.guild.id, "log_channel")
    }

    if (!logChannel) return;

    if (await client.channels.cache.some(c => c.id === logChannel)) {
        const guildChannel = await client.channels.cache.find(c => c.id === logChannel);
        const role = member.roles.cache
            .filter(role => role.id !== member.guild.id)
            .map(role => role)
            .join(" ") || "none";

        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setAuthor(`Member Left`, member.user.displayAvatarURL({format: "png", dynamic: true, size: 128}))
            .setDescription(`${member} ${member.user.tag}`)
            .addField('**Roles**', role)
            .setFooter(`User ID: ${member.user.id} • ${moment().format('[Today at] h:ma')}`)

        return guildChannel.send({ embed: embed, disableMentions: "all"})
    }
    client.logger.info(`Could not find the specified log channel. Please check that the right id is in the config file`)
}