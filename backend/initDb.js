const sequelize = require('./db');
const User = require('./models/user');
const Note = require('./models/note');
const Tag = require('./models/tag');

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    
    // Синхронизация всех моделей с базой данных
    await sequelize.sync({ force: true });
    console.log('Database synced!');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};

initDb();
