const express = require('express');
const TagController = require('../controllers/tagController');

const router = express.Router();

// Создать тег
router.post('/', TagController.createTag);

// Удалить тег
router.delete('/:id', TagController.deleteTag);

module.exports = router;
