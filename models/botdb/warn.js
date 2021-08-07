const Sequelize = require('sequelize');
const { bot } = require('../database');

const Warn = bot.define('warn', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reason: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mod_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Warn;