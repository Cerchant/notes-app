const express = require('express');
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

const router = express.Router();

// Получить все заметки
router.get('/', getAllNotes);

// Создать заметку
router.post('/', createNote);

// Обновить заметку
router.put('/:id', updateNote);

// Удалить заметку
router.delete('/:id', deleteNote);

module.exports = router;


