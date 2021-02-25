const { Command } = require('discord.js-commando');
const { developers, embedColor } = require('../../settings.json');
const { MessageEmbed } = require('discord.js');

// noinspection EqualityComparisonWithCoercionJS
module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['h'],
            group: 'util',
            memberName: 'help',
            description: 'Help command to show the commands',
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        const embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(`${this.client.user.username} Help`, msg.guild.iconURL())
            .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(msg.client.user.avatarURL())
            .setTimestamp();

        if (args) {
            const commands = this.client.registry.findCommands(args, false, msg);
            if (!commands.toString())
                return msg.channel.send(embed
                .setTitle("Invalid Command.")
                .setDescription(`Do ${msg.anyUsage(
                'help',
                msg.guild ? undefined : null,
                msg.guild ? undefined : null)}
                 for the list of the commands.`));
            if (commands.map(cmd => cmd.groupID === 'developer') && !developers.some(dev => dev === msg.author.id)) return msg.channel.send(embed.setTitle('Denied!').setDescription('Your not a developer!'));
            embed.setTitle(`${commands[0].name.slice(0, 1).toUpperCase() + commands[0].name.slice(1)} command help`)
            embed.setDescription([
                `❯ **Command:** ${commands[0].name.slice(0, 1).toUpperCase() + commands[0].name.slice(1)}`,
                `❯ **Description:** ${commands[0].description ? commands[0].description : "No Description provided."}`,
                `❯ **Format:** \`${commands[0].format}\``,
                `❯ **Examples:** \`${commands[0].examples ? commands[0].examples.join(", ") : "No Examples provided."}\``,
                `❯ **Aliases:** ${commands[0].aliases.length > 0 ? commands[0].aliases.join(", ") : "None"}`,
                `❯ **Group:** ${commands[0].group.name}`,
                `❯ **Guild Only:** ${commands[0].guildOnly}`,
                ``,
                `❯ **Details:** ${commands[0].details || "No Details provided."}`,
            ].join("\n"))
            return msg.channel.send({embed: embed});
        }
        embed.setDescription([
            `To run a command in ${msg.guild.name}, use \`${this.client.commandPrefix}command\` or \`@${this.client.user.tag} command\`. For example, \`${this.client.commandPrefix}prefix\` or \`@${this.client.user.tag} prefix\``,
            ``,
            `Use \`help <\command>\` to view detailed information about a specific command`,
            ``,
            `__**Available commands in BWC DEV**__`,
            ``
        ].join("\n"));

        /* Write all commands into the help dialog*/
        const allGroups = this.client.registry.groups.map(grp => grp)
        if ((this.client.registry.findGroups('owner', false)[0].commands.size > 0) && this.client.owners.map(user => user.id).includes(msg.author.id)) {
            embed.addField(`__${allGroups[0].name}__`, `${allGroups[0].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }
        if ((this.client.registry.findGroups('developer', false)[0].commands.size > 0) && developers.includes(msg.author.id)) {
            embed.addField(`__${allGroups[1].name}__`, `${allGroups[1].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }
        if ((this.client.registry.findGroups('administrator', false)[0].commands.size > 0) && msg.member.hasPermission("ADMINISTRATOR")) {
            embed.addField(`__${allGroups[2].name}__`, `${allGroups[2].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }
        if ((this.client.registry.findGroups('moderator', false)[0].commands.size > 0) && msg.member.hasPermission("MANAGE_ROLES" || "MANAGE_CHANNELS")) {
            embed.addField(`__${allGroups[3].name}__`, `${allGroups[3].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }
        if (this.client.registry.findGroups('utility', false)[0].commands.size > 0) {
            embed.addField(`__${allGroups[4].name}__`, `${allGroups[4].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }
        if (this.client.registry.findGroups('miscellaneous', false)[0].commands.size > 0) {
            embed.addField(`__${allGroups[5].name}__`, `${allGroups[5].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }
        if ((this.client.registry.findGroups('commands', false)[0].commands.size > 0)  && msg.member.hasPermission("ADMINISTRATOR")) {
            embed.addField(`__${allGroups[6].name}__`, `${allGroups[6].commands.map(cmd => `**${cmd.name.slice(0,1).toUpperCase()}${cmd.name.slice(1)}**: ${cmd.description}`).join(`\n`)}`,false)
        }

        return msg.channel.send({embed: embed})
    }
}