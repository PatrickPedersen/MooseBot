const { Command } = require('discord.js-commando');
const { MessageEmbed, version: djVersion } = require('discord.js');
const { version } = require('../../package.json');
const { Creator, embedColor } = require('../../settings.json');
const { duration } = require('../../functions/duration')
const moment = require('moment')

module.exports = class BotInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            aliases: ["info","binfo","b-info"],
            group: 'misc',
            memberName: 'botinfo',
            description: 'Displays info about the bot!',
            examples: ['botinfo'],
            guildOnly: true
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg) {
        moment.locale(msg.guild.id)
        let embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(this.client.user.username, this.client.user.avatarURL({ format: "png", dynamic: true, size: 1024}))

            .addField(`**❯ Bot:**`, `${this.client.user.tag}`, true)
            .addField(`**❯ Creation Date:**`, `${moment(this.client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`, true)
            .addField(`**❯ Creator**`, `${Creator}`, true)

            .addField(`**❯ Node.js:**`, `${process.version}`, true)
            .addField(`**❯ Bot Version:**`, `v${version}`, true)
            .addField(`**❯ Discord.js:**`,`v${djVersion}`,true)

            .setFooter(`Uptime: ${duration(this.client.uptime)}`);
        await msg.replyEmbed(embed)
    }
}