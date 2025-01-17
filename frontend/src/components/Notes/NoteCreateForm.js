import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './NoteForm.css';

const NoteCreateForm = ({ onAddNote, onClose }) => {
  const [note, setNote] = useState({ title: '', content: '' });
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      const { data: newNote } = await api.post('/notes', note, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAddNote(newNote); // Передать новую заметку в родительский компонент
      setNote({ title: '', content: '' }); // Очистить форму
      onClose(); // Закрыть модальное окно
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>Create Note</h3>
      <input
        type="text"
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      ></textarea>
      <div className="form-actions">
        <button type="submit">Create Note</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteCreateForm;
