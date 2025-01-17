const TagService = require('../services/tagService');
const UserController = require('./userController');

class TagController {
  async createTag(req, res) {
    try {
      UserController.authenticateUser(req);
      const tag = await TagService.createTag(req.body);
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTag(req, res) {
    try {
      UserController.authenticateUser(req);
      await TagService.deleteTag(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new TagController();
