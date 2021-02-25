const Commando = require('discord.js-commando')
const { Sequelize } = require('sequelize')
const settings = require('../settings.json')
const sequelize = require('./database');
const Guild = require('../models/guild');
const Warn = require('../models/warn');
const Duncecap = require('../models/duncecap');
const Locked_channel = require('../models/locked_channel');
const Omit_channel_lock = require('../models/omit_channel_lock');
const Omit_channel_lock_role = require('../models/omit_channel_lock_role');
const Assignable_roles = require('../models/assignable_roles');

// noinspection JSUnresolvedFunction
class MooseBotSettingsProvider extends Commando.SettingProvider {
    constructor(settings) {
        super();
    }

    async init(client) {

        Guild.hasMany(Warn);
        Guild.hasMany(Duncecap);
        Guild.hasMany(Locked_channel);
        Guild.hasMany(Omit_channel_lock);
        Guild.hasMany(Omit_channel_lock_role);
        Guild.hasMany(Assignable_roles);

        //sequelize.sync({force: true}).catch(err => console.log(err))
        //sequelize.sync().catch(err => console.log(err))

        try {
            await sequelize.authenticate();
            client.logger.info('Successfully connected to the DB');
        } catch (e) {
            client.logger.error(e.stack);
            process.exit(-1);
        }

        this.client = client;
        for (const guild in client.guilds.cache.array()) {
            try {
                const result = await Guild.findByPk(client.guilds.cache.array()[guild].id)

                if (!result) {
                    // Insert guild into guild table
                    await Guild.create({id: client.guilds.cache.array()[guild].id})
                }
            } catch (e) {
                client.logger.error(e.stack);
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

}

module.exports = MooseBotSettingsProvider;