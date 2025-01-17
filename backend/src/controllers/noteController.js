const NoteService = require('../services/noteService');
const UserController = require('./userController');

class NoteController {
  async getAllNotes(req, res) {
    try {
      const user_id = UserController.authenticateUser(req);
      const notes = await NoteService.getAllNotes(user_id);
      const result = notes.map(note => ({
        note_id: note.note_id,
        title: note.title,
        content: note.content,
        user_id: note.user_id,
        tags: note.tags.map(tag => ({
          tag_id: tag.tag_id,
          name: tag.name,
        })),
      }));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createNote(req, res) {
    try {
      const user_id = UserController.authenticateUser(req);
      const note = await NoteService.createNote({ ...req.body, user_id });
      res.status(201).json(note);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async updateNote(req, res) {
    try {
      const user_id = UserController.authenticateUser(req);
      const note = await NoteService.updateNote(req.params.id, req.body);
      res.json(note);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async deleteNote(req, res) {
    try {
      const user_id = UserController.authenticateUser(req);
      await NoteService.deleteNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new NoteController();
