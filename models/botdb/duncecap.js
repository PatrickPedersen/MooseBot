const Sequelize = require('sequelize');
const { bot } = require('../database');

const Duncecap = bot.define('duncecap', {
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
    user_roles: {
        type: Sequelize.STRING,
        allowNull: true
    },
    time: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    reason: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = Duncecap;