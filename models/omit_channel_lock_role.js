const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Omit_channel_lock_role = sequelize.define('omit_channel_lock_role', {
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