const { DataTypes } = require('sequelize');
const db = require('../db.js');
const Users = require('./user');
// const Tag = require('./tag');

const Note = db.define(
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
