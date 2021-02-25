const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Assignable_roles = sequelize.define('Assignable_roles', {
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