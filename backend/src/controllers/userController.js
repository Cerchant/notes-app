const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');

class UserController {
  authenticateUser(req) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      if (!token) throw new Error('Token missing');

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload.id) throw new Error('Invalid token: user ID missing');

      return payload.id;
    } catch (err) {
      throw new Error('Unauthorized');
    }
  }

  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const token = await UserService.login(req.body);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async refreshToken(req, res) {
    try {
      const oldToken = req.headers.authorization?.split(' ')[1];
      const newToken = await UserService.refreshToken(oldToken);
      res.status(200).json({ token: newToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
