const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { omitLockdownChannels, omitLockdownRoles, embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction
module.exports = class LockdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lockdown',
            aliases: [],
            group: 'moderator',
            userPermissions: ["MANAGE_ROLES"],
            memberName: 'lockdown',
            description: 'Lockdowns the server',
            examples: ['lockdown'],
            guildOnly: true
        });
    }

    lockdown = false;
    message = [];

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        await msg.delete()
        const role = msg.guild.roles.cache.map(role => role);
        const textChannels = msg.guild.channels.cache
            .filter(c => c.type === "text")
            .filter((channel) => !omitLockdownChannels.includes(channel.id))
            .array()

        if (this.lockdown === false) {
            const embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle('Channel Locked')
                .setDescription(`🔒 ⛔ **Server Lockdown** ⛔
            
            This server has been put into lockdown.
            Please await further info from C&S.
            
            ***This channel will remain locked until the issue has been dealt with***`)
            for (let channel in textChannels) {
                await textChannels[channel].updateOverwrite(role.find(r => r.name === '@everyone'), { SEND_MESSAGES: false })
                for (let i = 0; i < omitLockdownRoles.length; i++) {
                    await textChannels[channel].updateOverwrite(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: true })
                }
                await textChannels[channel].send({ embed: embed }).then(m => this.message.push(m))
            }

            this.lockdown = true;
            return;
        }
        if (this.lockdown === true) {
            for (let channel in textChannels) {
                await textChannels[channel].updateOverwrite(role.find(r => r.name === '@everyone'), { SEND_MESSAGES: null })
                for (let i = 0; i < omitLockdownRoles.length; i++) {
                    await textChannels[channel].updateOverwrite(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: null })
                }
                textChannels[channel].send('**Lockdown Lifted**').then(m => m.delete({timeout: 5000}))
            }
            for (let i = 0; i < this.message.length; i++) {
                await this.message[i].delete()
            }
            this.message = []
            this.lockdown = false;
        }
    }
}