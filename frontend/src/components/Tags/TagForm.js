import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './TagForm.css';

const TagForm = ({ noteId, onAddTag, onClose }) => {
    const [tag, setTag] = useState({ name: '' });
    const { token } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: newTag } = await api.post(
                `/tags`,
                { ...tag, note_id: noteId }, // Передаем noteId вместе с остальными данными
                {
                    headers: { Authorization: `Bearer ${token}` }, // Передаем токен авторизации
                }
            );
            onAddTag(newTag);
            setTag({ name: '' });
        } catch (error) {
            console.error('Error creating tag:', error);
            alert('Failed to create tag');
        }

    };

    return (
        <form className="tag-form" onSubmit={handleSubmit}>
            <h3>Add Tag</h3>
            <input
                type="text"
                placeholder="Tag Name"
                value={tag.name}
                onChange={(e) => setTag({ ...tag, name: e.target.value })}
            />
            <div className="form-actions">
                <button type="submit">Add Tag</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default TagForm;
