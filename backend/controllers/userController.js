const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateUser = (req) => {
    try {
      const authHeader = req.headers.authorization;
      // console.log('Authorization header:', authHeader); // Добавлено для отладки
  
      const token = authHeader?.split(' ')[1];
      if (!token) throw new Error('Token missing');
      
      // console.log('Extracted token:', token); // Для отладки
  
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Decoded payload:', payload); // Для отладки
      
      if (!payload.id) throw new Error('Invalid token: user ID missing');
      return payload.id;
    } catch (err) {
      console.error('Authentication error:', err.message);
      throw new Error('Unauthorized');
    }
  };

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Проверка на существующего пользователя
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Создание нового пользователя
        const user = await User.create({
            username,
            password: await bcrypt.hash(password, 10),
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.user_id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn:'1h', // Укажите время жизни токена
        });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const refreshToken = async (req, res) => {
    
    try {
         
        // Получаем токен из заголовка Authorization
        // const authHeader = ;
        // if (!authHeader) {
        //     return res.status(401).json({ error: 'Authorization header missing' });
        // }

        const oldToken = req.headers.authorization.split(' ')[1];
        if (!oldToken) {
            return res.status(401).json({ error: 'Token missing' });
        }
        
        // Проверяем и декодируем старый токен
        let payload;
        try {
            payload = jwt.verify(oldToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        // Проверяем наличие пользователя
        const user = await User.findByPk(payload.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Генерируем новый токен
        const newToken = jwt.sign({ id: user.user_id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn:'1h', // Укажите время жизни токена
        });
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { register, login, refreshToken, authenticateUser };
