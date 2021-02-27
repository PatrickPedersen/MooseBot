const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Badwords = sequelize.define('badword', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    badwords: {
        type: Sequelize.TEXT("medium"),
        allowNull: true
    }
});

module.exports = Badwords;