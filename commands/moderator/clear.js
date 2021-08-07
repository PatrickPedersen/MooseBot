const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js')
const { embedColor } = require('../../settings.json')
const moment = require('moment')
const ms = require('ms');

// noinspection JSUnresolvedFunction
module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            aliases: [],
            group: 'moderator',
            userPermissions: ["MANAGE_MESSAGES"],
            memberName: 'clear',
            description: 'Clears a channel for messages',
            format: 'amount <number> | time <timeframe>',
            examples: ['clear amount 50', 'clear time 5m'],
            guildOnly: true,
            details: `To clear a channel for messages, you will need to either specify the amount you want deleted or the timeframe that you want messages deleted for.
                To specify a timeframe please provide the timeframe as \"30s (Seconds), 5m (Minutes), 1h (Hours), 14d (Days)\".
                Please keep in mind that discord bots are not allowed to cache messages beyond 14 days, therefore a 14 days timeframe is the maximum.
                If you want to delete any messages older than 14 days, you will have to do it manually.`
        });
    }

    async log(msg, amount) {
        let logChannel;
        if (await msg.client.botProvider.fetchGuild(msg.guild.id, "log") === true) {
            logChannel = await msg.client.botProvider.fetchGuild(msg.guild.id, "log_channel")
        }
        if (!logChannel) return;
        if (msg.client.channels.cache.some(c => c.id === logChannel)) {
            const guildChannel = msg.client.channels.cache.find(c => c.id === logChannel);

            let embed = new MessageEmbed()
                .setColor(embedColor)
                .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL({format: "png", dynamic: true, size: 128}))
                .setDescription(`**Batch Delete**`)
                .addField(`Amount:`, amount, true)
                .addField(`Deleted By:`, `<@${msg.author.id}>`, true)

            embed.setFooter(`Author: ${msg.author.id} | Message ID: ${msg.id} • ${moment().format('[Today at] hh:mma')}`)
            return guildChannel.send({ embed: embed, disableMentions: "all" })
        }
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {

        let argsArray = args.split(" ");

        if (argsArray[0].toUpperCase() === "AMOUNT") {
            if (argsArray[1]) {
                if (isNaN(parseInt(argsArray[1]))) return msg.channel.send('**Please supply a valid amount of message to purge**');
                if (parseInt(argsArray[1]) > 100) return msg.channel.send('**Please supply a number less than 100**');
                await msg.channel.bulkDelete(argsArray[1]).catch(err => this.client.logger.error(err.stack));
                await this.log(msg, argsArray[1])
                return msg.channel.send(`Messages Cleared`)
                    .then(m => m.delete({timeout: 5000}))
                    .catch(err => this.client.logger.error(err.stack))
            }
        }


        if (argsArray[0].toUpperCase() === "TIME") {

            if (argsArray[1]) {
                let time = argsArray[1];
                if (ms(time) === undefined) return msg.channel.send(`**Please supply a valid timeframe**`);
                if (ms(time) > 1209600000) return msg.channel.send(`**Please supply a timeframe that is within 14 days**`);
                if (ms(time) < 1000) return msg.channel.send(`**Please supply a timeframe that is greater than 1 second**`);
                const cmdDate = msg.createdTimestamp - ms(time);

                let messagesDeletedTotal = 0;
                await deleteMessages();

                // noinspection FunctionWithMultipleLoopsJS,NestedFunctionJS
                async function deleteMessages() {
                    let messageArray = await msg.channel.messages.fetch({ limit: 100 }).catch(err => this.client.logger.error(err.stack))
                    let messageTimeArray = [];
                    // noinspection JSUnresolvedFunction
                    await messageArray.map(result => {
                        messageTimeArray.push(result.createdTimestamp)
                    })

                    let lastMessageFound = false;
                    // Holds all messages that are older than the specified time
                    let sortedMessageTimeArray = [];
                    if (lastMessageFound === false) {
                        for (let message in messageTimeArray) {
                            if (messageTimeArray[message] <= cmdDate) {
                                // If message is older, set found to true.
                                lastMessageFound = true;
                                break;
                            } else {
                                sortedMessageTimeArray.push(messageTimeArray[message])
                            }
                        }
                    }
                    let messageCount = sortedMessageTimeArray.length;

                    if (lastMessageFound === false) {
                        await msg.channel.bulkDelete(messageCount).catch(err => this.client.logger.error(err.stack));
                        messagesDeletedTotal += messageCount;
                        await deleteMessages();
                    } else {
                        msg.channel.bulkDelete(messageCount).catch(err => this.client.logger.error(err.stack));
                        messagesDeletedTotal += messageCount;
                    }
                }

                await this.log(msg, messagesDeletedTotal)
                return msg.channel.send(`**${messagesDeletedTotal} Messages have been deleted**`)
                    .then(m => m.delete({timeout: 5000}))
                    .catch(err => this.client.logger.error(err.stack))
            }
        }

        return msg.channel.send(`**Please specify to delete messages by amount or time\nIf you don't know what that means please check\n${msg.anyUsage(
            'help clear',
            msg.guild ? undefined : null,
            msg.guild ? undefined : null)}**`)
    }
}