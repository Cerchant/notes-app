const { DataTypes } = require('sequelize');
const db = require('../db.js');
const Note = require('./note');

const Tag = db.define(
  'tag', // Используйте единственное число для имени модели
  {
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Note,
        key: 'note_id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'tags',
    timestamps: false,
  }
);

// Определяем ассоциацию
Note.hasMany(Tag, { foreignKey: 'note_id' });
Tag.belongsTo(Note, { foreignKey: 'note_id' });


module.exports = Tag;
