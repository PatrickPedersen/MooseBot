const Commando = require('discord.js-commando')
const Sequelize = require('sequelize');
const { bot } = require('../database');
const Guild = require('./guild');
const Warn = require('./warn');
const Duncecap = require('./duncecap');
const Locked_channel = require('./locked_channel');
const Omit_channel_lock = require('./omit_channel_lock');
const Omit_channel_lock_role = require('./omit_channel_lock_role');
const Assignable_roles = require('./assignable_roles');
const Badwords = require('./badword');
const Stat_member = require('./member');
const Stat_message = require('./message');

// noinspection JSUnresolvedFunction
class BotSettingsProvider extends Commando.SettingProvider {
    async init(client) {
        this.client = client;

        Guild.hasMany(Warn);
        Guild.hasMany(Duncecap);
        Guild.hasMany(Locked_channel);
        Guild.hasMany(Omit_channel_lock);
        Guild.hasMany(Omit_channel_lock_role);
        Guild.hasMany(Assignable_roles);
        Guild.hasMany(Stat_member);
        Guild.hasMany(Stat_message);
        Guild.hasOne(Badwords);

        //bot.sync({force: true}).catch(err => console.log(err))
        //bot.sync().catch(err => console.log(err))

        try {
            await bot.authenticate();
            this.client.logger.info('Successfully connected to the DB');
        } catch (e) {
            this.client.logger.error(e.stack);
            process.exit(-1);
        }


        for (const guild in this.client.guilds.cache.array()) {
            try {
                const result = await Guild.findByPk(this.client.guilds.cache.array()[guild].id)

                if (!result) {
                    // Insert guild into guild table
                    await Guild.create({id: this.client.guilds.cache.array()[guild].id})
                }
            } catch (e) {
                this.client.logger.error(e.stack);
            }
        }
    }

    // Fetches id, prefix, log, log-channel
    async fetchGuild(guildId, key) {
        if (!key) {
            return Guild.findByPk(guildId)
                .catch(err => this.client.logger.error(err.stack))
        } else {
            return Guild.findByPk(guildId)
                .then(result => result.getDataValue(key))
                .catch(err => this.client.logger.error(err.stack))
        }
    };

    // Fetches id, user_id, reason, guildId - Comes from the guild table
    async fetchWarns(guildId, userId, warnId) {
        if (guildId && !userId && !warnId) {
            return Warn.findAll({
                where: {guildId: guildId}
            }).catch(err => this.client.logger.error(err.stack))
        } else if (guildId && userId && !warnId) {
            return Guild.findByPk(guildId)
                .then(guild => {
                    return guild.getWarns({where: { user_id: userId } })
                }).catch(err => this.client.logger.error(err.stack))
        } else {
            return Guild.findByPk(guildId)
                .then(guild => {
                    return guild.getWarns({where: { user_id: userId, id: warnId}})
                }).catch(err => this.client.logger.error(err.stack))
        }
    };

    async createWarning(guildId, userId, reason, modId) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createWarn({user_id: userId, reason: reason, mod_id: modId})
            }).catch(err => this.client.logger.error(err.stack))
    }

    async removeWarning(guildId, warning) {
        return Guild.findByPk(guildId)
            .then(guild => {
                guild.removeWarn(warning)
            })
            .catch(err => this.client.logger.error(err.stack))
    }

    async removeWarnings(guildId, userId) {
        return Guild.findByPk(guildId)
            .then(async guild => {
                let warns = await guild.getWarns({where: {user_id: userId}});
                for (let warn in warns) {
                    guild.removeWarn(warns[warn].dataValues.id)
                }
            })
            .catch(err => this.client.logger.error(err.stack))
    }

    // Fetches id, user_id, user_roles, time, reason, guildId - Comes from the guild table
    // Possible optimization.
    async fetchDunceCaps(guildId, userId) {
        if (guildId && !userId) {
            return Duncecap.findAll({
                where: {guildId: guildId}
            }).catch(err => this.client.logger.error(err.stack))
        } else {
            return Duncecap.findAll({
                where: {guildId: guildId, user_id: userId}
            }).catch(err => this.client.logger.error(err.stack))
        }
    };

    async createDunce(guildId, userId, userRoles, time, reason) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createDuncecap({user_id: userId, user_roles: userRoles, time: time, reason: reason})
            }).catch(err => this.client.logger.error(err.stack))
    }

    async removeDuncecap(guildId, dunce) {
        await Guild.findByPk(guildId)
            .then(guild => {
                guild.removeDunce(dunce)
            })
            .catch(err => this.client.logger.error(err.stack))
    }

    // Fetches id, role_id, guildId - Comes from the guild table
    async fetchAssignableRoles(guildId) {
        return Assignable_roles.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, channel_id, reason, message_id, guildId - Comes from the guild table
    async fetchLockedChannels(guildId) {
        return Locked_channel.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, channel_id, guildId - Comes from the guild table
    async fetchOmitLockedChannels(guildId) {
        return Omit_channel_lock.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    // Fetches id, role_id, guildId - Comes from the guild table
    async fetchOmitLockedChannelsRoles(guildId) {
        return Omit_channel_lock_role.findAll({
            where: {guildId: guildId}
        }).catch(err => this.client.logger.error(err.stack))
    };

    async createMessageStat(guildId, msgId, timestamp) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createStat_message({message_id: msgId, timestamp: timestamp})
            }).catch(err => this.client.logger.error(err.stack))
    }

    // Fetches id, message_id, timestamp, guildId - Comes from the guild table
    async fetchMessageStat(guildId, startTime) {
        return Stat_message.findAll({
            where: {
                guildId: guildId,
                timestamp: {
                    [Sequelize.Op.gte]: startTime
                }
            }
        }).catch(err => this.client.logger.error(err.stack))
    }

    async createMemberJoinStat(guildId, memId, joinTimestamp) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createStat_member({member_id: memId, join_timestamp: joinTimestamp})
            }).catch(err => this.client.logger.error(err.stack))
    }

    async createMemberLeaveStat(guildId, memId, leaveTimestamp) {
        await Guild.findByPk(guildId)
            .then(guild => {
                return guild.createStat_member({member_id: memId, leave_timestamp: leaveTimestamp})
            }).catch(err => this.client.logger.error(err.stack))
    }

}

module.exports = BotSettingsProvider;