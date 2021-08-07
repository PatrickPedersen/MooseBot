const Commando = require('discord.js-commando')
const Sequelize = require('sequelize');
const { xenforo } = require('../database');

// noinspection JSUnresolvedFunction
class XenforoSettingProvider extends Commando.SettingProvider {
    async init(client) {
        this.client = client;

        //xenforo.sync({force: true}).catch(err => console.log(err))
        //xenforo.sync().catch(err => console.log(err))

        try {
            await xenforo.authenticate();
            this.client.logger.info('Successfully connected to the DB');
        } catch (e) {
            this.client.logger.error(e.stack);
            process.exit(-1);
        }
    }

    async fetchOps() {
        return await xenforo.query("SELECT username, secondary_group_ids ", { type: Sequelize.QueryTypes.SELECT})
    }

}

module.exports = XenforoSettingProvider;