// Db
const { DataTypes } = require('sequelize')
const db = require('../db.js')

const User = db.define('users',
  // Описание таблиц
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  // Опции
  {
    timestamps: false
  }
)

module.exports = User