const { Sequelize } = require('sequelize');
require('dotenv').config()

const xenforo = new Sequelize(process.env.DB_NAME1, process.env.DB_USER1, process.env.DB_PASS1, {
    host: process.env.DB_HOST1,
    port: process.env.DB_PORT1,
    dialect: "mysql",
    define: {
        timestamps: false
    }
})

const bot = new Sequelize(process.env.DB_NAME2, process.env.DB_USER2, process.env.DB_PASS2, {
    host: process.env.DB_HOST2,
    port: process.env.DB_PORT2,
    dialect: "mysql",
    define: {
        timestamps: false
    }
})

module.exports = {
    xenforo: xenforo,
    bot: bot
};