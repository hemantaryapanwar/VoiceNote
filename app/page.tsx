'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import VoiceRecorder from './components/VoiceRecorder';
import NoteList, { Note } from './components/NoteList';
import { saveNotes, getNotes } from './utils/storage';
import { FaMicrophone, FaPlay, FaEdit, FaTrash, FaFileAlt, FaFolder, FaUser, FaBell } from 'react-icons/fa';
import Link from 'next/link';
import { useTheme } from './context/ThemeContext';
import styles from './styles/EditButton.module.css';

export default function Home() {
  const { darkMode } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [playingNoteId, setPlayingNoteId] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    // Load notes from localStorage on component mount
    const savedNotes = getNotes();
    setNotes(savedNotes);
  }, []);

  const handleSaveNote = (text: string) => {
    if (editingNote) {
      // Update existing note
      const updatedNotes = notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, text, createdAt: new Date() } 
          : note
      );
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setEditingNote(null);
    } else {
      // Create new note
      const newNote: Note = {
        id: uuidv4(),
        text,
        createdAt: new Date()
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
    }
    setShowRecorder(false);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    
    // If we're editing the note that was deleted, clear the editing state
    if (editingNote && editingNote.id === id) {
      setEditingNote(null);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowRecorder(true);
  };

  const handlePlayNote = (noteId: string) => {
    // Toggle playing state
    if (playingNoteId === noteId) {
      setPlayingNoteId(null);
    } else {
      setPlayingNoteId(noteId);
      
      // Simulate speech synthesis
      const noteText = notes.find(note => note.id === noteId)?.text || '';
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create a new speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(noteText);
        utterance.onend = () => {
          setPlayingNoteId(null);
        };
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Speech synthesis is not supported in your browser.');
        setPlayingNoteId(null);
      }
    }
  };

  // Get the last saved note (the most recent one that's not currently being edited)
  const getLastNote = (): string | undefined => {
    if (notes.length === 0) return undefined;
    
    // If we're editing a note, return the text of the note being edited
    if (editingNote) {
      return editingNote.text;
    }
    
    // Otherwise return the most recent note
    return notes[0]?.text;
  };

  // Format date to display relative time (today, yesterday, or date)
  const formatDate = (date: Date): string => {
    const now = new Date();
    const noteDate = new Date(date);
    
    // Check if it's today
    if (noteDate.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (noteDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Return the date in a readable format
    return noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format duration in minutes
  const formatDuration = (text: string): string => {
    // Estimate reading time based on word count (average person reads ~200 words per minute)
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} mins`;
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: darkMode ? '#000000' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: darkMode ? '#000000' : '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMicrophone style={{ color: '#F44336', marginRight: '0.5rem' }} />
          <span style={{ color: '#F44336', fontWeight: 'bold', fontSize: '1.25rem' }}>VoiceNote</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowDescription(!showDescription)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: darkMode ? 'white' : 'black',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              About <span style={{ fontSize: '0.8rem' }}>▼</span>
            </button>
            
            {showDescription && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                width: '320px',
                backgroundColor: darkMode ? '#111827' : '#ffffff',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 10,
                marginTop: '0.5rem',
                padding: '1.5rem'
              }}>
                <h3 style={{ color: '#F44336', fontSize: '1.25rem', marginBottom: '1rem' }}>
                  Why VoiceNote?
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      🎯 Perfect For
                    </h4>
                    <ul style={{ 
                      color: darkMode ? '#CCCCCC' : '#666666', 
                      fontSize: '0.875rem',
                      paddingLeft: '1.25rem',
                      lineHeight: '1.5'
                    }}>
                      <li>Students taking lecture notes</li>
                      <li>Professionals recording meetings</li>
                      <li>Writers capturing ideas on-the-go</li>
                      <li>Quick thoughts and reminders</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      ✨ Key Benefits
                    </h4>
                    <ul style={{ 
                      color: darkMode ? '#CCCCCC' : '#666666', 
                      fontSize: '0.875rem',
                      paddingLeft: '1.25rem',
                      lineHeight: '1.5'
                    }}>
                      <li>Instant speech-to-text conversion</li>
                      <li>Organized note management</li>
                      <li>Easy editing and playback</li>
                      <li>Dark mode support</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 style={{ color: darkMode ? 'white' : 'black', fontSize: '1rem', marginBottom: '0.5rem' }}>
                      🚀 Features
                    </h4>
                    <ul style={{ 
                      color: darkMode ? '#CCCCCC' : '#666666', 
                      fontSize: '0.875rem',
                      paddingLeft: '1.25rem',
                      lineHeight: '1.5'
                    }}>
                      <li>High-quality voice recording</li>
                      <li>Real-time transcription</li>
                      <li>Secure local storage</li>
                      <li>Cross-platform compatibility</li>
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowDescription(false)}
                  style={{ 
                    backgroundColor: 'transparent',
                    color: '#F44336',
                    border: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
          
          <Link href="/profile" style={{ 
            background: 'none', 
            border: 'none', 
            color: darkMode ? 'white' : 'black',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none'
          }}>
            <FaUser size={20} />
          </Link>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaBell size={20} />
            </button>
            
            {showNotifications && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                width: '300px',
                backgroundColor: '#111827',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 10,
                marginTop: '0.5rem',
                padding: '1rem'
              }}>
                <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1rem' }}>Notifications</h3>
                {notes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 165, 0, 0.1)',
                      borderRadius: '0.375rem',
                      borderLeft: '3px solid #FFA500'
                    }}>
                      <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        New recording saved
                      </p>
                      <p style={{ color: '#AAAAAA', fontSize: '0.75rem' }}>
                        {notes[0].text.substring(0, 30)}...
                      </p>
                      <p style={{ color: '#AAAAAA', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {formatDate(new Date(notes[0].createdAt))}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.375rem'
                    }}>
                      <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        Welcome to VoiceNote!
                      </p>
                      <p style={{ color: '#AAAAAA', fontSize: '0.75rem' }}>
                        Start recording your thoughts today.
                      </p>
                      <p style={{ color: '#AAAAAA', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        Just now
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#AAAAAA', fontSize: '0.875rem' }}>No notifications yet.</p>
                )}
                <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    style={{ 
                      backgroundColor: 'transparent',
                      color: '#F44336',
                      border: 'none',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowRecorder(true)}
            style={{ 
              backgroundColor: '#F44336', 
              color: 'black', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.5) 50%, transparent 55%)',
              transform: 'translateX(-100%)',
              animation: 'glare 2s infinite'
            }} />
            <style jsx>{`
              @keyframes glare {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(100%);
                }
              }
            `}</style>
            New Recording
          </button>
        </div>
      </nav>

      {showRecorder ? (
        <div style={{ 
          maxWidth: '48rem', 
          margin: '2rem auto', 
          padding: '0 1rem',
          backgroundColor: darkMode ? '#111827' : '#f3f4f6',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <VoiceRecorder 
            onSave={handleSaveNote} 
            lastNote={getLastNote()}
          />
          
          <button 
            onClick={() => setShowRecorder(false)}
            style={{ 
              backgroundColor: darkMode ? '#333' : '#e5e7eb', 
              color: darkMode ? 'white' : 'black', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              border: 'none',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section style={{ 
            textAlign: 'center', 
            padding: '4rem 1rem', 
            maxWidth: '64rem', 
            margin: '0 auto'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: '#F44336', 
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              Capture Your Voice,<br />Transform Your Ideas
            </h1>
            <p style={{ 
              color: darkMode ? '#CCCCCC' : '#666666', 
              fontSize: '1.25rem', 
              marginBottom: '2.5rem' 
            }}>
              Record, transcribe, and organize your thoughts effortlessly
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowRecorder(true)}
                style={{ 
                  backgroundColor: '#F44336', 
                  color: 'black', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '2rem', 
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.5) 50%, transparent 55%)',
                  transform: 'translateX(-100%)',
                  animation: 'glare 2s infinite'
                }} />
                <style jsx>{`
                  @keyframes glare {
                    0% {
                      transform: translateX(-100%);
                    }
                    100% {
                      transform: translateX(100%);
                    }
                  }
                `}</style>
                <FaMicrophone /> Start Recording
              </button>
              <button 
                onClick={() => setShowLearnMore(!showLearnMore)}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#F44336', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '2rem', 
                  border: '1px solid #F44336',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Learn More
              </button>
            </div>
            
            {showLearnMore && (
              <div style={{ 
                backgroundColor: '#111827',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginTop: '2rem',
                textAlign: 'left',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{ color: '#F44336', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  About VoiceNote
                </h2>
                <p style={{ color: '#CCCCCC', marginBottom: '1rem', lineHeight: '1.6' }}>
                  VoiceNote is a powerful voice recording application that helps you capture your thoughts, ideas, and notes using just your voice. Our advanced speech-to-text technology converts your spoken words into text in real-time, making it easy to review and edit your recordings.
                </p>
                <p style={{ color: '#CCCCCC', marginBottom: '1rem', lineHeight: '1.6' }}>
                  Whether you're a student taking lecture notes, a professional recording meeting minutes, or someone who prefers speaking over typing, VoiceNote is designed to make your life easier.
                </p>
                <h3 style={{ color: 'white', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                  Key Features:
                </h3>
                <ul style={{ color: '#CCCCCC', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>High-quality voice recording with noise reduction</li>
                  <li style={{ marginBottom: '0.5rem' }}>Real-time speech-to-text conversion</li>
                  <li style={{ marginBottom: '0.5rem' }}>Organized library to manage all your recordings</li>
                  <li style={{ marginBottom: '0.5rem' }}>Playback functionality to listen to your recordings</li>
                  <li style={{ marginBottom: '0.5rem' }}>Edit and delete options for complete control</li>
                </ul>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button 
                    onClick={() => setShowLearnMore(false)}
                    style={{ 
                      backgroundColor: '#F44336',
                      color: 'black',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Got it!
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Features Section */}
          <section style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '2rem', 
            padding: '2rem 1rem',
            maxWidth: '64rem',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              backgroundColor: darkMode ? '#111827' : '#f3f4f6', 
              borderRadius: '1rem', 
              padding: '2rem', 
              width: '18rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ 
                color: '#F44336', 
                marginBottom: '1rem',
                display: 'inline-flex',
                padding: '0.75rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ color: '#F44336', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Crystal Clear Recording
              </h3>
              <p style={{ color: '#CCCCCC' }}>
                High-quality audio capture with noise reduction technology
              </p>
            </div>

            <div style={{ 
              backgroundColor: darkMode ? '#111827' : '#f3f4f6', 
              borderRadius: '1rem', 
              padding: '2rem', 
              width: '18rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ 
                color: '#F44336', 
                marginBottom: '1rem',
                display: 'inline-flex',
                padding: '0.75rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
              }}>
                <FaFileAlt size={24} />
              </div>
              <h3 style={{ color: '#F44336', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Smart Transcription
              </h3>
              <p style={{ color: '#CCCCCC' }}>
                Automatic speech-to-text conversion with high accuracy
              </p>
            </div>

            <div style={{ 
              backgroundColor: darkMode ? '#111827' : '#f3f4f6', 
              borderRadius: '1rem', 
              padding: '2rem', 
              width: '18rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ 
                color: '#F44336', 
                marginBottom: '1rem',
                display: 'inline-flex',
                padding: '0.75rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
              }}>
                <FaFolder size={24} />
              </div>
              <h3 style={{ color: '#F44336', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Organized Library
              </h3>
              <p style={{ color: '#CCCCCC' }}>
                Keep your recordings categorized and easily accessible
              </p>
            </div>
          </section>

          {/* Recent Recordings Section */}
          {notes.length > 0 && (
            <section style={{ 
              padding: '2rem 1rem',
              maxWidth: '64rem',
              margin: '2rem auto'
            }}>
              <h2 style={{ 
                color: '#F44336', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem' 
              }}>
                Recent Recordings
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notes.slice(0, 5).map(note => (
                  <div key={note.id} style={{ 
                    backgroundColor: darkMode ? '#111827' : '#f3f4f6', 
                    borderRadius: '0.75rem', 
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button 
                        onClick={() => handlePlayNote(note.id)}
                        style={{ 
                          backgroundColor: playingNoteId === note.id ? '#F44336' : '#FFA500', 
                          color: 'black', 
                          width: '2.5rem', 
                          height: '2.5rem', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <FaPlay />
                      </button>
                      <div>
                        <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {note.text.length > 30 ? `${note.text.substring(0, 30)}...` : note.text}
                        </h3>
                        <p style={{ color: '#AAAAAA', fontSize: '0.875rem' }}>
                          {formatDuration(note.text)} • {formatDate(new Date(note.createdAt))}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        onClick={() => handleEditNote(note)}
                        className={styles.actionButton + ' ' + styles.editButton}
                        title="Edit Note"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this note?')) {
                            handleDeleteNote(note.id);
                          }
                        }}
                        className={styles.actionButton + ' ' + styles.deleteButton}
                        title="Delete Note"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        color: darkMode ? '#777777' : '#666666',
        backgroundColor: darkMode ? '#000000' : '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaMicrophone style={{ color: '#F44336', marginRight: '0.5rem' }} />
          <span style={{ color: '#F44336', fontWeight: 'bold' }}>VoiceNote</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </main>
  );
}
