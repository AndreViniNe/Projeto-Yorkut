const Sequelize = require('sequelize')

const logging = process.env.NODE_ENV === 'test' ? false : console.log;

// const sequelize = new Sequelize('YorkutDB', 'root', 'Fb07517131',
const sequelize = new Sequelize('YorkutDB', 'root', '12345678',
    {
        host: "localhost",
        dialect: "mysql",
        logging: logging // Adiciona a opção de logging
    }
)

module.exports = {Sequelize: Sequelize, sequelize: sequelize}