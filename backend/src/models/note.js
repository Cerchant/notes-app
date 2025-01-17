const { DataTypes } = require('sequelize');
const db = require('../../database.js');
const Users = require('./user.js');

// Получение экземпляра Sequelize для работы с моделями
const sequelize = db.getSequelizeInstance();


const Note = sequelize.define(
  'note', // Используйте единственное число для имени модели
  {
    note_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: 'user_id',
      },
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);


module.exports = Note;
