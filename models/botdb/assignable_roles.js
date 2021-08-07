const Sequelize = require('sequelize');
const { bot } = require('../database');

const Assignable_roles = bot.define('Assignable_roles', {
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

module.exports = Assignable_roles;