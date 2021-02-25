const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Warn = sequelize.define('warn', {
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