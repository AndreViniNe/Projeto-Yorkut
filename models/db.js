const Sequelize = require('sequelize')
// const sequelize = new Sequelize('YorkutDB', 'root', 'Fb07517131',
const sequelize = new Sequelize('YorkutDB', 'root', '12345678',
    {
        host: "localhost",
        dialect: "mysql"
    }
)

module.exports = {Sequelize: Sequelize, sequelize: sequelize}