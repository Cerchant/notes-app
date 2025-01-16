import React, { useState, useContext, useEffect } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './NoteForm.css';

const NoteUpdateForm = ({ note, onUpdateNote, onClose }) => {
  const [updatedNote, setUpdatedNote] = useState({ title: '', content: '' });
  const { token } = useContext(AuthContext);

  // Инициализация состояния при загрузке данных заметки
  useEffect(() => {
    if (note) {
      setUpdatedNote({ title: note.title, content: note.content });
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!updatedNote.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      const { data: updatedNoteResponse } = await api.put(
        `/notes/${note.note_id}`,
        updatedNote,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdateNote(updatedNoteResponse); // Передать обновленную заметку в родительский компонент
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note');
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>Update Note</h3>
      <input
        type="text"
        placeholder="Title"
        value={updatedNote.title}
        onChange={(e) => setUpdatedNote({ ...updatedNote, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={updatedNote.content}
        onChange={(e) => setUpdatedNote({ ...updatedNote, content: e.target.value })}
      ></textarea>
      <div className="form-actions">
        <button type="submit">Update Note</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteUpdateForm;
