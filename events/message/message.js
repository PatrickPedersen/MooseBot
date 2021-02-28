const { MessageEmbed } = require("discord.js")
const ms = require("ms");
const { embedColor, SPAM_LIMIT, SPAM_TRACK_TIME, SPAM_TIME, SPAM_MUTE_TIME, DUPMSG_LIMIT, DUPMSG_TRACK_TIME, DUPMSG_TIME, DUPMSG_MUTE_TIME } = require("../../settings.json");

// Spam Maps, holds the messages/users, when it is required.
const SPAM_usersMap = new Map();
const DUPMSG_usersMap = new Map();

module.exports = async (client, message) => {
    if (message.author.bot) return;

    //TODO Automod
    // - Spam - 5 messages in 5 seconds, give dunce cap for 60 minutes
    // - Bad Words - give automatic warning, dunce cap for 60 minutes
    // - Duplicate Messages - 3 messages 10 seconds, give dunce cap for 60 minutes

    // Spam
    if (SPAM_usersMap.has(message.author.id)) {
        const userData = SPAM_usersMap.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;

        if (difference > SPAM_TIME) {
            clearTimeout(timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                SPAM_usersMap.delete(message.author.id);
            }, SPAM_TRACK_TIME);

            SPAM_usersMap.set(message.author.id, userData);

        } else {
            ++msgCount;

            if (parseInt(msgCount) === SPAM_LIMIT) {

                const muterole = await client.provider.fetchGuild(message.guild.id, "muterole")
                const role = message.guild.roles.cache.get(muterole)
                message.member.roles.add(role)
                    .catch(err => client.logger.error(err.stack));
                message.channel.send(`${message.author.tag} have been muted for ${ms(SPAM_MUTE_TIME, { long: true })}. Due to Spamming`)
                    .then(async () => {
                        if (await client.provider.fetchGuild(message.guild.id, 'log') === true) {
                            const log_channel = message.client.channels.cache.get(await message.client.provider.fetchGuild(message.guild.id, 'log_channel'));
                            const embed = new MessageEmbed()
                                .setAuthor(`DunceCapped by ${client.user.username}`, client.user.displayAvatarURL())
                                .setThumbnail(message.author.displayAvatarURL())
                                .setColor(embedColor)
                                .setTimestamp()
                                .setDescription(`**Action**: DunceCap \n**User**: ${message.author.tag} (${message.author.id}) \n **Time**: ${ms(SPAM_MUTE_TIME, { long: true })} \n**Reason**: Spamming in channel <#${message.channel.id}>`)
                            log_channel.send({embed: embed, disableMentions: "all"});
                        }
                    })
                    .catch(err => client.logger.error(err.stack));

                setTimeout(() => {
                    message.member.roles.remove(role)
                        .catch(err => client.logger.error(err.stack));
                    message.channel.send(`${message.author.tag} have been un-muted`)
                        .catch(err => client.logger.error(err.stack));
                }, SPAM_MUTE_TIME)

            } else {
                userData.msgCount = msgCount;
                SPAM_usersMap.set(message.author.id, userData);
            }
        }
    } else {
        let fn = setTimeout(() => {
            SPAM_usersMap.delete(message.author.id);
        }, SPAM_TRACK_TIME);

        SPAM_usersMap.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        });
    }

    // Duplicate Messages
    if (DUPMSG_usersMap.has(message.author.id)) {
        const userData = DUPMSG_usersMap.get(message.author.id);
        const { messageObject, timer } = userData;
        const difference = message.createdTimestamp - messageObject[0].lastMessageTime.createdTimestamp;
        let msgCount = userData.msgCount;

        if (difference > DUPMSG_TIME) {
            clearTimeout(timer);

            userData.messageObject[0].msgCount = 0;
            userData.messageObject[0].lastMessageTime = message.createdTimestamp;
            userData.messageObject[0].lastMessageContent = message.content.toLowerCase();
            userData.timer = setTimeout(() => {
                DUPMSG_usersMap.delete(message.author.id);
            }, DUPMSG_TRACK_TIME);

            DUPMSG_usersMap.set(message.author.id, userData);

        } else {
            if (userData.messageObject.find(m => m.lastMessageContent.toLowerCase() === message.content.toLowerCase())) {
                ++userData.messageObject.find(m => m.lastMessageContent.toLowerCase() === message.content.toLowerCase()).msgCount;
            } else {
                userData.messageObject.push({lastMessageContent: message.content.toLowerCase(), lastMessageTime: message.createdTimestamp, msgCount: 1})
            }

            if (userData.messageObject.find(m => m.msgCount === DUPMSG_LIMIT)) {
                // noinspection SpellCheckingInspection
                const muterole = await client.provider.fetchGuild(message.guild.id, "muterole")
                const role = message.guild.roles.cache.get(muterole)
                message.member.roles.add(role)
                    .catch(err => client.logger.error(err.stack));
                message.channel.send(`${message.author.tag} have been muted for ${ms(DUPMSG_MUTE_TIME, { long: true })}. Due to Duplicate Message Spam`)
                    .then(async () => {
                        if (await client.provider.fetchGuild(message.guild.id, 'log') === true) {
                            const log_channel = message.client.channels.cache.get(await message.client.provider.fetchGuild(message.guild.id, 'log_channel'));
                            const embed = new MessageEmbed()
                                .setAuthor(`DunceCapped by ${client.user.username}`, client.user.displayAvatarURL())
                                .setThumbnail(message.author.displayAvatarURL())
                                .setColor(embedColor)
                                .setTimestamp()
                                .setDescription(`**Action**: DunceCap \n**User**: ${message.author.tag} (${message.author.id}) \n **Time**: ${ms(DUPMSG_MUTE_TIME, { long: true })} \n**Reason**: Duplicate Message spamming in channel <#${message.channel.id}>`)
                            log_channel.send({embed: embed, disableMentions: "all"});
                        }
                   })
                    .catch(err => client.logger.error(err.stack));

                setTimeout(() => {
                    message.member.roles.remove(role)
                        .catch(err => client.logger.error(err.stack));
                    message.channel.send(`${message.author.tag} have been un-muted`)
                        .catch(err => client.logger.error(err.stack));
                }, DUPMSG_MUTE_TIME)

            } else {
                userData.msgCount = msgCount;
                DUPMSG_usersMap.set(message.author.id, userData);
            }
        }
    } else {
        let fn = setTimeout(() => {
            DUPMSG_usersMap.delete(message.author.id);
        }, DUPMSG_TRACK_TIME);

        DUPMSG_usersMap.set(message.author.id, {
            messageObject: [{
                lastMessageTime: message.createdTimestamp,
                lastMessageContent: message.content.toLowerCase(),
                msgCount: 1
            }],
            timer: fn
        });
    }

    // Bad Words
    // Coming at a later date.


    // Message Stats.
    await client.provider.createMessageStat(message.guild.id, message.id, message.createdTimestamp)

}