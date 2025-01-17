const { Sequelize } = require('sequelize');

class Database {
  constructor() {
    // Инициализация экземпляра Sequelize с настройками подключения
    this.sequelize = new Sequelize(
      process.env.DB_NAME, // Имя базы данных
      process.env.DB_USER, // Пользователь базы данных
      process.env.DB_PASSWORD, // Пароль для базы данных
      {
        host: process.env.DB_HOST, // Хост базы данных
        dialect: process.env.DB_DIALECT, // Указание на использование PostgreSQL
        logging: false, // Отключение логирования SQL-запросов
        pool: {
          max: 5, // Максимальное количество соединений в пуле
          min: 0, // Минимальное количество соединений в пуле
          acquire: 3000, // Максимальное время ожидания соединения (мс)
          idle: 10000, // Время ожидания перед отключением неиспользуемого соединения (мс)
        },
      }
    );
  }

  /**
   * Проверяет подключение к базе данных.
   * Выводит сообщение в консоль при успешном подключении.
   * Если подключение не удалось, выводит сообщение об ошибке.
   */
  async authenticate() {
    try {
      await this.sequelize.authenticate();
      console.log('Database connected!');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  /**
   * Синхронизирует все модели с базой данных.
   * Параметр `force: true` удаляет все существующие таблицы и создаёт их заново.
   */
  async sync({ force = false } = {}) {
    try {
      await this.sequelize.sync({ force });
      console.log(`Database synced! Force mode: ${force}`);
    } catch (error) {
      console.error('Error syncing the database:', error);
    }
  }

  /**
   * Запускает процесс подключения и синхронизации базы данных.
   * Используется как основной метод для инициализации базы.
   */
  async init({ force = false } = {}) {
    await this.authenticate(); // Проверяем соединение
    await this.sync({ force }); // Синхронизируем таблицы
  }

  /**
   * Возвращает экземпляр Sequelize для использования в приложении.
   * Это позволяет подключать модели и выполнять запросы.
   */
  getSequelizeInstance() {
    return this.sequelize;
  }
}

module.exports = new Database();
