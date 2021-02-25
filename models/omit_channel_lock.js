const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Omit_channel_lock = sequelize.define('omit_channel_lock', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    channel_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Omit_channel_lock;