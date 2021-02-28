const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Stat_member = sequelize.define('stat_member', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    member_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    join_timestamp: {
        type: Sequelize.STRING,
        allowNull: true
    },
    leave_timestamp: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Stat_member;