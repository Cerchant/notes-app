const Tag = require('../models/tag');

class TagService {
  async createTag({ name, note_id }) {
    if (!name || !note_id) throw new Error('Both name and note_id are required');
    return Tag.create({ name, note_id });
  }

  async deleteTag(tag_id) {
    const tag = await Tag.findByPk(tag_id);
    if (!tag) throw new Error('Tag not found');
    await tag.destroy();
  }
}

module.exports = new TagService();
