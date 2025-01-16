const express = require('express');
const { register, login, refreshToken } = require('../controllers/userController');

const router = express.Router();

// Регистрация пользователя
router.post('/register', register);

// Логин пользователя
router.post('/login', login);

// Обновление токена
router.post('/refresh-token', refreshToken);

module.exports = router;
