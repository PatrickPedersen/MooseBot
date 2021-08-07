const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../settings.json');
const ms = require("ms");

// noinspection JSUnresolvedFunction,DuplicatedCode
module.exports = class DunceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dunce',
            aliases: [],
            group: 'moderator',
            userPermissions: ["MANAGE_ROLES"],
            memberName: 'dunce',
            description: 'Duncecaps the user for the specified amount.',
            examples: ['dunce TestSubject#1234 1d','dunce TestSubject#1234'],
            format: 'dunce <@User/UserID> <time>)',
            guildOnly: true,
            details: `When DunceCapping a member, you need to supply a time.
            "-1" = Indefinitely.
            "30s" = 30 Seconds.
            "5m" = 5 Minutes.
            "1h" 1 Hour(s).
            "14d" 14 Days.`
        });
    }

    // noinspection JSCheckFunctionSignatures
    async run(msg, args) {

        if (!args) return msg.channel.send('You have to provide a @User/Userid and a reason!')
            .then(m => m.delete({timeout: 3000}));
        const argsArray = args.split(' ');

        let time = argsArray[1];
        if (ms(time) === undefined) return msg.channel.send(`**Please supply a valid timeframe**`);
        if (ms(parseInt(time)) === -1) time = -1;

        const reason = argsArray.slice(2).join(' ')

        let user = msg.mentions.users.first();
        const muteRole = msg.guild.roles.cache.find(r => r.name === "DunceCap");
        const moderationChannel = msg.guild.channels.cache.find(c => c.name === "moderation");

        if (!user) {
            try {
                user = await msg.guild.members.fetch(argsArray[0]);
                user = user.user;
            } catch (e) {
                return msg.reply('Could not find this user')
                    .then(m => m.delete({timeout: 3000}));
            }
        }

        if (user === msg.author) return msg.channel.send(`You can't dunce yourself!`)
            .then(m => m.delete({timeout: 3000}));

        if (!moderationChannel) {
            return msg.channel.send(`Please create "moderation" channel!`).then(m => m.delete({timeout: 5000}))
        }

        if (!muteRole) {
            await msg.guild.roles.create({
                data: {
                    name: "DunceCap",
                    color: "#ffffff",
                    permissions: []
                }
            }).catch(err => {
                msg.channel.send(`Could not create role. Please ensure I have the correct perms.`)
                    .then(m => m.delete({timeout: 5000}))
                this.client.logger.error(err)
            })

            const muteRole = msg.guild.roles.cache.find(r => r.name === "DunceCap");

            msg.guild.channels.cache.forEach(channel => {
                return channel.overwritePermissions([{
                    id: muteRole.id,
                    deny: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"]
                }]).catch(err => {
                    this.client.logger.error(err)
                    return msg.channel.send(`Could not set/overwrite perms for the DunceCap role. Please ensure I have the correct perms.`)
                        .then(m => m.delete({timeout: 5000}))
                })
            })

            await msg.guild.channels.cache.find(c => c.name === "moderation")
                .overwritePermissions([{
                    id: muteRole.id,
                    allow: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                }]).catch(err => {
                    this.client.logger.error(err.stack)
                    return msg.channel.send(`Could not set/overwrite perms for the DunceCap role. Please ensure I have the correct perms.`)
                        .then(m => m.delete({timeout: 5000}))
                });
        }

        let avatarURL = user.displayAvatarURL();
        let usertag = user.tag;

        user = await msg.guild.members.fetch(user.id);

        if (user.roles.cache.some(role => role.id === muteRole.id))
            return msg.channel.send(`**<@${user.user.id}> already has the role.**`)
                .then(m => m.delete({timeout: 5000}))

        const roles = user.roles.cache.filter(r => r.id !== msg.guild.id)

        if (time) {
            await this.client.botProvider.createDunce(msg.guild.id, user.id, JSON.stringify(roles, ['id']), time, reason ? reason : "No reason provided.");
            await user.roles.set([muteRole]);
        }

        if (time === "-1") time = "Indefinitely"

        const embed = new MessageEmbed()
            .setAuthor(`DunceCapped by ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setThumbnail(avatarURL)
            .setColor(embedColor)
            .setTimestamp()
            .setDescription(`**Action**: DunceCap \n**User**: ${usertag} (${user.id}) \n **Time**: ${time} \n**Reason**: ${reason ? reason : "No reason provided."}`)

        if (await msg.client.botProvider.fetchGuild(msg.guild.id, 'log') === true) {
            const log_channel = msg.client.channels.cache.get(await msg.client.botProvider.fetchGuild(msg.guild.id, 'log_channel'));
            log_channel.send({ embed })
        }

        embed.setDescription(`**Action**: DunceCap \n**User**: ${usertag} (${user.id}) \n **Time**: ${time ? time : "Indefinitely"} \n**Reason**: ${reason ? reason : "No reason provided."} \n**Server**: ${msg.guild}`)

        await user.send({ embed })
            .catch(err => this.client.logger.error(err.stack))

        const dunceEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setDescription(`✅ ${user} Has been DunceCapped`)
        msg.channel.send({embed: dunceEmbed})
            .then(m => m.delete({timeout: 5000}));

        await msg.delete()
    }
}