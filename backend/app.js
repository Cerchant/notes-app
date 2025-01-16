require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const tagRoutes = require('./routes/tagRoutes');


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Фронтенд-адрес
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Убедитесь, что 'Authorization' разрешен
    credentials: true,
}));


// Подключение маршрутов
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
app.use('/tags', tagRoutes);

// Тест соединения с базой данных

db.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        app.listen(5000, () => {
            console.log('Server is running on http://localhost:5000');
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
