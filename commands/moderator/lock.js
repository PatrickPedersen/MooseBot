const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { omitLockdownRoles, embedColor } = require('../../settings.json');

// noinspection JSUnresolvedFunction
module.exports = class LockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lock',
            aliases: [],
            group: 'moderator',
            userPermissions: ["MANAGE_ROLES"],
            memberName: 'lock',
            description: 'Locks the channel the command is used in. Lock list gives a list of all locked channels. If used on a locked channel, unlocks it.',
            examples: ['lock', 'lock list'],
            guildOnly: true
        });
    }

    channelsLocked = [];
    message = [];

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {
        await msg.delete();
        const role = msg.guild.roles.cache.map(role => role);
        const channel = msg.guild.channels.cache
            .filter(c => c.type === "text")
            .filter(c => c.id === msg.channel.id)
            .array();

        if ((!this.channelsLocked.includes(channel[0].id)) && !args) {
            const embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle('Channel Locked')
                .setDescription(`🔒 ⛔ **Channel Locked** ⛔

            This channel has been locked by C&S.`)
            await channel[0].updateOverwrite(role.find(r => r.name === '@everyone'), { SEND_MESSAGES: false })
            for (let i = 0; i < omitLockdownRoles.length; i++) {
                await channel[0].updateOverwrite(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: true });
            }

            this.channelsLocked.push(channel[0].id);
            await msg.channel.send({ embed: embed }).then(m => this.message.push([channel[0].id,m]));

            return;
        }
        if ((this.channelsLocked.includes(channel[0].id)) && !args) {
            await channel[0].updateOverwrite(role.find(r => r.name === '@everyone'), { SEND_MESSAGES: null })
            for (let i = 0; i < omitLockdownRoles.length; i++) {
                await channel[0].updateOverwrite(role.find(r => r.id === omitLockdownRoles[i]), { SEND_MESSAGES: null })
            }
            for (let i = 0; i < this.message.length; i++) {
                if (this.message[i][0] === channel[0].id) {
                    this.message[i][1].delete()
                    this.message.splice(i,1);
                    break;
                }
            }
            for (let i = 0; i < this.channelsLocked.length; i++) {
                if (this.channelsLocked[i] === channel[0].id) {
                    this.channelsLocked.splice(i,1);
                    break;
                }
            }
            msg.channel.send('**Channel Unlocked**').then(m => m.delete({timeout: 3000}))
        }
        if (args === 'list') {
            if (this.channelsLocked.length === 0) {
                await msg.channel.send('**No Channels currently locked**').then(m => m.delete({timeout: 3000}))
                return;
            }
            // Lock the name of the channels that are still locked.
            await msg.channel.send(this.channelsLocked)
        }
    }
}