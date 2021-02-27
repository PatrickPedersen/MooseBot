const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Guild = sequelize.define('guild', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    prefix: {
        type: Sequelize.CHAR(10),
        defaultValue: ".",
        allowNull: false
    },
    log: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    log_channel: {
        type: Sequelize.STRING,
        allowNull: true
    },
    muterole: {
        type: Sequelize.STRING,
        allowNull: true
    },
    spam_time: {
        type: Sequelize.INTEGER,
        defaultValue: 3600000,
        allowNull: false
    },
    badwords_time: {
        type: Sequelize.INTEGER,
        defaultValue: 3600000,
        allowNull: false
    },
    dupmsg_time: {
        type: Sequelize.INTEGER,
        defaultValue: 3600000,
        allowNull: false
    }
});

module.exports = Guild;