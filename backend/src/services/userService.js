const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  async register({ username, password }) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) throw new Error('User already exists');

    return User.create({
      username,
      password: await bcrypt.hash(password, 10),
    });
  }

  async login({ username, password }) {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.user_id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  async refreshToken(oldToken) {
    const payload = jwt.verify(oldToken, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user) throw new Error('User not found');

    return jwt.sign({ id: user.user_id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }
}

module.exports = new UserService();
