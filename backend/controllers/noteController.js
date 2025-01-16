const Note = require('../models/note');
const Tag = require('../models/tag');
const { authenticateUser } = require('./userController');

const getAllNotes = async (req, res) => {
  try {
    const user_id = authenticateUser(req); // Аутентификация пользователя

    // Извлекаем заметки с их тегами
    const notes = await Note.findAll({
      where: { user_id },
      include: [
        {
          model: Tag,
          attributes: ['tag_id', 'name'], // Получаем только нужные поля из тегов
        },
      ],
    });

    // Преобразуем данные в удобный формат
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
};

module.exports = { getAllNotes };


const createNote = async (req, res) => {
  try {
    const user_id = authenticateUser(req);
    const { title, content, tag_id } = req.body;
    const note = await Note.create({ title, content, tag_id, user_id });
    res.status(201).json(note);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const user_id = authenticateUser(req);
    const { title, content } = req.body;
    console.log(req.params.note_id);
    const note = await Note.findOne({ where: { note_id: req.params.id } });
    
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.title = title;
    note.content = content;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const deleteNote = async (req, res) => {
  try {
    const user_id = authenticateUser(req); // Аутентификация пользователя

    // Найти заметку
    const note = await Note.findOne({ where: { note_id: req.params.id } });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Проверить, что пользователь владеет заметкой
    if (note.user_id !== user_id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this note' });
    }

    // Удалить связанные теги
    await Tag.destroy({ where: { note_id: note.note_id } });

    // Удалить заметку
    await note.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
};


module.exports = { getAllNotes, createNote, updateNote, deleteNote };
