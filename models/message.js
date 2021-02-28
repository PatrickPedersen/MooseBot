const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Stat_message = sequelize.define('stat_message', {
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