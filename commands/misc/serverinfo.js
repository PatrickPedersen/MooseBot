const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json')
const { chunkArray } = require('../../functions/chunk');
const moment = require('moment');

// noinspection FunctionTooLongJS
module.exports = class GuildInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            aliases: ["si","serverdesc","server","guild","guildinfo"],
            group: 'misc',
            memberName: 'serverinfo',
            description: 'Displays info about the guild!',
            examples: ['serverinfo'],
            guildOnly: true,
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {
        const filterLevels = {
            DISABLED: 'off',
            MEMBERS_WITHOUT_ROLES: 'No Role',
            ALL_MEMBERS: 'Everyone'
        };

        const verificationLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵ ┻━┻',
            VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        };

        const regions = {
            brazil: 'Brazil',
            europe: 'Europe',
            hongkong: 'Hong Kong',
            india: 'India',
            japan: 'Japan',
            russia: 'Russia',
            singapore: 'Singapore',
            southafrica: 'South Africa',
            sydney: 'Sydney',
            'us-central': 'US Central',
            'us-east': 'US East',
            'us-west': 'US West',
            'us-south': 'US South'
        };

        const roles = msg.guild.roles.cache.sort((a,b) => b.position - a.position).map(role => role);
        const members = msg.guild.members.cache;
        const channels = msg.guild.channels.cache;
        const emojis = msg.guild.emojis.cache;
        const Tonline = this.client.emojis.cache.find(emoji => emoji.name === "Tonline")
        const Tidle = this.client.emojis.cache.find(emoji => emoji.name === "Tidle")
        const Tdnd = this.client.emojis.cache.find(emoji => emoji.name === "Tdnd")
        const Toffline = this.client.emojis.cache.find(emoji => emoji.name === "Toffline")

        //console.log(roles.join(', ').length)

        let embed = new MessageEmbed()
            .setDescription(`**Guild information for __${msg.guild.name}__**`)
            .setColor(embedColor)
            .setThumbnail(msg.guild.iconURL({ dynamic: true }))
            .addField('General',[
                `**❯ Name:** ${msg.guild.name}`,
                `**❯ ID:** ${msg.guild.id}`,
                `**❯ Owner:** ${msg.guild.owner.user.tag} | ID: ${msg.guild.ownerID}`,
                `**❯ Region:** ${regions[msg.guild.region]}`,
                `**❯ Boost Tier:** ${msg.guild.premiumTier ? `Tier ${msg.guild.premiumTier}` : 'None'}`,
                `**❯ Explicit Filter:** ${filterLevels[msg.guild.explicitContentFilter]}`,
                `**❯ Verification Level:** ${verificationLevels[msg.guild.verificationLevel]}`,
                `**❯ Time Created:** ${moment(msg.guild.createdTimestamp).format('LT')} ${moment(msg.guild.createdTimestamp).format('LL')} ${moment(msg.guild.createdTimestamp).fromNow()}`
                ], )
            .addField('Statistics',[
                `**❯ Role Count:** ${roles.length}`,
                `**❯ Emoji Count:** ${emojis.size}`,
                `**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
                `**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
                `**❯ Member Count:** ${msg.guild.memberCount}`,
                `**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
                `**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
                `**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
                `**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
                `**❯ Boost Count:** ${msg.guild.premiumSubscriptionCount || '0'}`
            ], )
            .addField('Presence', [
                `${Tonline} Online: ${members.filter(member => member.presence.status === 'online').size} |${Tidle} Idle: ${members.filter(member => member.presence.status === 'idle').size} | ${Tdnd} Do Not Disturb: ${members.filter(member => member.presence.status === 'dnd').size} | ${Toffline} Offline: ${members.filter(member => member.presence.status === 'offline').size}`
            ], )
            .setTimestamp();

            if (roles.length > 45) {
                let chunkedRoles = chunkArray(roles, 40)
                embed.addField(`Roles [${roles.length -1}]`, chunkedRoles[0].join(" "), )
                for (let i = 1; i < chunkedRoles.length; i++) {
                    embed.addField(`Roles Continued`, chunkedRoles[i].join(" "), )
                }
            } else {
                embed.addField(`Roles [${roles.length -1}]`, roles.length ? roles.join(" ") : 'None', )
            }

        return msg.channel.send({ embed: embed })
    }
}