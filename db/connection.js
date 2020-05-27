const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/index.db',
})

// o Module.exports é usado para criação de modulos externos a da sua app(no caso o index.js).
module.exports = sequelize