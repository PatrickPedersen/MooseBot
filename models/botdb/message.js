const Sequelize = require('sequelize');
const { bot } = require('../database');

const Stat_message = bot.define('stat_message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    timestamp: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Stat_message;