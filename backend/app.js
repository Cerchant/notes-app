require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const tagRoutes = require('./src/routes/tagRoutes');
const db = require('./database');


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Фронтенд-адрес
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Убедитесь, что 'Authorization' разрешен
    credentials: true,
}));


// Инициализация базы данных с созданием таблиц
db.init({ force: true })
  .then(() => console.log('Database initialized successfully!'))
  .catch((error) => console.error('Failed to initialize database:', error));

// Подключение маршрутов
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
app.use('/tags', tagRoutes);

// запуск порта
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
