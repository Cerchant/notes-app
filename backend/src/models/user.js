// Db
const { DataTypes } = require('sequelize')
const db = require('../../database.js')

// Получение экземпляра Sequelize для работы с моделями
const sequelize = db.getSequelizeInstance();

const User = sequelize.define('users',
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