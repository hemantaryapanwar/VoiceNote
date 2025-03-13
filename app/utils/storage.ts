import { Note } from '../components/NoteList';

const STORAGE_KEY = 'voice_notes';

export const saveNotes = (notes: Note[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }
};

export const getNotes = (): Note[] => {
  if (typeof window !== 'undefined') {
    const notes = localStorage.getItem(STORAGE_KEY);
    if (notes) {
      try {
        return JSON.parse(notes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
      }
    }
  }
  return [];
}; 