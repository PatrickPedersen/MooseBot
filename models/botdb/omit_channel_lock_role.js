const Sequelize = require('sequelize');
const { bot } = require('../database');

const Omit_channel_lock_role = bot.define('omit_channel_lock_role', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    role_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Omit_channel_lock_role;