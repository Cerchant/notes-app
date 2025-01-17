const Note = require('../models/note');
const Tag = require('../models/tag');

class NoteService {
  async getAllNotes(user_id) {
    return Note.findAll({
      where: { user_id },
      include: [
        {
          model: Tag,
          attributes: ['tag_id', 'name'],
        },
      ],
    });
  }

  async createNote({ title, content, tag_id, user_id }) {
    return Note.create({ title, content, tag_id, user_id });
  }

  async updateNote(note_id, { title, content }) {
    const note = await Note.findOne({ where: { note_id } });
    if (!note) throw new Error('Note not found');

    note.title = title;
    note.content = content;
    await note.save();

    return note;
  }

  async deleteNote(note_id) {
    const note = await Note.findOne({ where: { note_id } });
    if (!note) throw new Error('Note not found');

    await Tag.destroy({ where: { note_id: note.note_id } });
    await note.destroy();
  }
}

module.exports = new NoteService();
