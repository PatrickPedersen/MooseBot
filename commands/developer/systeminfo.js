const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { formatBytes } = require('../../functions/formatBytes')
const os = require('os');
const ms = require('ms');

// noinspection JSCheckFunctionSignatures
module.exports = class SystemInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'systeminfo',
            aliases: ["system"],
            group: 'developer',
            memberName: 'systeminfo',
            description: 'Shows details about the system the bot operates on!',
            examples: ['systeminfo'],
            guildOnly: false,
        });
    }

    async run(message) {
        const core = os.cpus()[0];
        const embed = new MessageEmbed()
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor([200,0,0])
            .addField(`**❯ Platform:**`, process.platform,true)
            .addField(`**❯ Uptime:**`, ms(os.uptime() * 1000, { long: true }),true)
            .addField('\u200B','\u200B',true)
            .addField(`**❯ CPU:**`, [
                `\u3000 Cores: ${os.cpus().length}`,
                `\u3000 Model: ${core.model}`,
                `\u3000 Speed: ${core.speed}Mhz`])
            .addField(`**❯ Memory:**`,[
                `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
                `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`])
            .setTimestamp()
        await message.channel.send(embed)
    }
};