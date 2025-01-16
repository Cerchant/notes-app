import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import NoteCreateForm from './NoteCreateForm';
import NoteUpdateForm from './NoteUpdateForm';
import TagForm from '../Tags/TagForm';
import './NoteList.css';

const NoteList = () => {
    const [notes, setNotes] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [showNoteCreateForm, setShowNoteCreateForm] = useState(false);
    const [showNoteUpdateForm, setShowNoteUpdateForm] = useState(null); // ID заметки для обновления
    const [showTagForm, setShowTagForm] = useState(null); // ID заметки для добавления тега
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const { data } = await api.get('/notes', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotes(data);

                const tags = Array.from(
                    new Set(
                        data.flatMap((note) => (note.tags || []).map((tag) => tag.name))
                    )
                );
                setAllTags(tags);
            } catch (error) {
                console.error('Error fetching notes:', error);
                alert('Failed to fetch notes');
            }
        };

        if (token) fetchNotes();
    }, [token]);

    const toggleTagFilter = (tag) => {
        setFilteredTags((prevTags) =>
            prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    const filteredNotes = filteredTags.length
        ? notes.filter((note) =>
            (note.tags || []).some((tag) => filteredTags.includes(tag.name))
        )
        : notes;

    const handleAddNote = (newNote) => {
        setNotes((prevNotes) => [...prevNotes, newNote]);
    };

    const handleUpdateNote = (updatedNote) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.note_id === updatedNote.note_id ? updatedNote : note
            )
        );
        setShowNoteUpdateForm(null); // Закрыть форму обновления
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const noteToDelete = notes.find((note) => note.note_id === noteId);
            await api.delete(`/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note.note_id !== noteId));

            // Удаляем теги, которые больше не связаны с другими заметками
            const remainingTags = Array.from(
                new Set(
                    notes
                        .filter((note) => note.note_id !== noteId)
                        .flatMap((note) => (note.tags || []).map((tag) => tag.name))
                )
            );
            setAllTags(remainingTags);
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    };

    const handleDeleteTag = async (tagId, noteId) => {
        try {
            await api.delete(`/tags/${tagId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.note_id === noteId
                        ? { ...note, tags: note.tags.filter((tag) => tag.tag_id !== tagId) }
                        : note
                )
            );

            // Удаляем теги, которые больше не связаны с заметками
            const remainingTags = Array.from(
                new Set(
                    notes.flatMap((note) =>
                        note.note_id === noteId
                            ? note.tags.filter((tag) => tag.tag_id !== tagId).map((tag) => tag.name)
                            : (note.tags || []).map((tag) => tag.name)
                    )
                )
            );
            setAllTags(remainingTags);
        } catch (error) {
            console.error('Error deleting tag:', error);
            alert('Failed to delete tag');
        }
    };

    return (
        <div>
            <div className="header">
                <h2>Notes</h2>
                <button className="add-note-button" onClick={() => setShowNoteCreateForm(true)}>
                    +
                </button>
            </div>

            <div className="tag-filters">
                {allTags.map((tag) => (
                    <span
                        key={tag}
                        className={`tag ${filteredTags.includes(tag) ? 'active' : ''}`}
                        onClick={() => toggleTagFilter(tag)}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {showNoteCreateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowNoteCreateForm(false)}>
                            &times;
                        </button>
                        <NoteCreateForm onAddNote={handleAddNote} onClose={() => setShowNoteCreateForm(false)} />
                    </div>
                </div>
            )}

            {showNoteUpdateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowNoteUpdateForm(null)}>
                            &times;
                        </button>
                        <NoteUpdateForm
                            note={notes.find((note) => note.note_id === showNoteUpdateForm)}
                            onUpdateNote={handleUpdateNote}
                            onClose={() => setShowNoteUpdateForm(null)}
                        />
                    </div>
                </div>
            )}


            <div className="notes-list">
                {filteredNotes.map((note) => (
                    <div key={note.note_id} className="note-item">
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <div className="note-tags">
                            {(note.tags || []).map((tag) => (
                                <span key={tag.tag_id} className="tag">
                                    {tag.name}
                                    <button
                                        className="delete-tag-button"
                                        onClick={() => handleDeleteTag(tag.tag_id, note.note_id)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="note-actions">
                            <button onClick={() => setShowNoteUpdateForm(note.note_id)}>
                                Update Note
                            </button>
                            <button onClick={() => handleDeleteNote(note.note_id)}>
                                Delete Note
                            </button>
                            <button onClick={() => setShowTagForm(note.note_id)}>
                                Add Tag
                            </button>
                        </div>

                        {showTagForm === note.note_id && (
                            <div className="modal">
                                <div className="modal-content">
                                    <button className="close-button" onClick={() => setShowTagForm(null)}>
                                        &times;
                                    </button>
                                    <TagForm
                                        noteId={note.note_id}
                                        onAddTag={(newTag) => {
                                            setNotes((prevNotes) =>
                                                prevNotes.map((n) =>
                                                    n.note_id === note.note_id
                                                        ? { ...n, tags: [...(n.tags || []), newTag] }
                                                        : n
                                                )
                                            );

                                            // Добавляем новый тег в список всех тегов
                                            if (!allTags.includes(newTag.name)) {
                                                setAllTags((prevTags) => [...prevTags, newTag.name]);
                                            }
                                            setShowTagForm(null);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoteList;
