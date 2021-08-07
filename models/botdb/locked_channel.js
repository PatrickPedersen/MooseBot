const Sequelize = require('sequelize');
const { bot } = require('../database');

const Locked_channel = bot.define('locked_channel', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    channel_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reason: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    message_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Locked_channel;