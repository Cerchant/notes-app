const express = require('express');
const { createTag, deleteTag } = require('../controllers/tagController');

const router = express.Router();

// Создать тег
router.post('/', createTag);

// Удалить тег
router.delete('/:id', deleteTag);

module.exports = router;
