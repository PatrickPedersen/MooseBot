const Sequelize = require('sequelize');
const { bot } = require('../database');

const Badwords = bot.define('badword', {
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