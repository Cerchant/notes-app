const Tag = require('../models/tag');
const { authenticateUser } = require('./userController');

const createTag = async (req, res) => {
    try {
        authenticateUser(req); // Проверка токена

        // Извлекаем name и note_id из тела запроса
        const { name, note_id } = req.body;

        // Проверяем, что все обязательные поля присутствуют
        if (!name || !note_id) {
            throw new Error('Both name and note_id are required');
        }

        console.log(`Creating tag: name=${name}, note_id=${note_id}`);

        // Создаем тег с указанным note_id
        const tag = await Tag.create({ name, note_id });
        res.status(201).json(tag);
    } catch (error) {
        console.error('Error creating tag:', error.message);
        res.status(500).json({ error: error.message });
    }
};


const deleteTag = async (req, res) => {
    try {
        authenticateUser(req); // Проверка токена
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) return res.status(404).json({ error: 'Tag not found' });

        await tag.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { createTag, deleteTag };
