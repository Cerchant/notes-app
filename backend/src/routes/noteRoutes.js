const express = require('express');
const NoteController = require('../controllers/noteController');

const router = express.Router();

// Получить все заметки
router.get('/', NoteController.getAllNotes);

// Создать заметку
router.post('/', NoteController.createNote);

// Обновить заметку
router.put('/:id', NoteController.updateNote);

// Удалить заметку
router.delete('/:id', NoteController.deleteNote);

module.exports = router;


