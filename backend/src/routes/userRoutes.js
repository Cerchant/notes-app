const express = require('express');
const UserController = require('../controllers/userController');


const router = express.Router();

// Регистрация пользователя
router.post('/register', UserController.register);

// Логин пользователя
router.post('/login', UserController.login);

// Обновление токена
router.post('/refresh-token', UserController.refreshToken);

module.exports = router;
