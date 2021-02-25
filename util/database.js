const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = require('../settings.json');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    define: {
        timestamps: false
    }
})

module.exports = sequelize;