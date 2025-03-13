'use client';

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export interface Note {
  id: string;
  text: string;
  createdAt: Date;
}

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDelete, onEdit }) => {
  if (notes.length === 0) {
    return (
      <div className="card">
        <p style={{ color: '#9E9E9E', textAlign: 'center' }}>No notes yet. Start recording to create your first note!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F44336', marginBottom: '1rem' }}>Your Notes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notes.map((note) => (
          <div key={note.id} style={{ 
            border: '1px solid #616161', 
            backgroundColor: '#212121', 
            borderRadius: '0.375rem', 
            padding: '1rem',
            transition: 'background-color 0.2s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#E0E0E0', whiteSpace: 'pre-wrap' }}>{note.text}</p>
                <p style={{ fontSize: '0.75rem', color: '#F44336', marginTop: '0.5rem' }}>
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <button
                  onClick={() => onEdit(note)}
                  style={{ padding: '0.5rem', color: '#F44336' }}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  style={{ padding: '0.5rem', color: '#F44336' }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList; 