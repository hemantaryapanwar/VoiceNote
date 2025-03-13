'use client';

import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaStop, FaSave, FaTrash, FaHistory } from 'react-icons/fa';
// Import regenerator-runtime
import 'regenerator-runtime/runtime';
import MicrophonePermission from './MicrophonePermission';

interface VoiceRecorderProps {
  onSave: (text: string) => void;
  lastNote?: string; // Add prop for last saved note
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSave, lastNote }) => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState<string>('');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [showLastNote, setShowLastNote] = useState(false);

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      try {
        // Check if the browser supports speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || 
                                 (window as any).webkitSpeechRecognition || 
                                 (window as any).mozSpeechRecognition || 
                                 (window as any).msSpeechRecognition;
        
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          
          recognition.onstart = () => {
            console.log('Voice recognition started');
            setIsListening(true);
          };
          
          recognition.onresult = (event: any) => {
            console.log('Voice recognition result received', event);
            
            let finalTranscript = '';
            let interimTranscript = '';
            
            // Process all results
            for (let i = 0; i < event.results.length; i++) {
              const result = event.results[i];
              
              // Check if this is a final result
              if (result.isFinal) {
                finalTranscript += result[0].transcript;
              } else {
                interimTranscript += result[0].transcript;
              }
            }
            
            console.log('Final transcript:', finalTranscript);
            console.log('Interim transcript:', interimTranscript);
            
            // Only update the transcript with final results
            if (finalTranscript) {
              setTranscript(prev => {
                const newTranscript = prev ? `${prev} ${finalTranscript}` : finalTranscript;
                return newTranscript.trim();
              });
            }
            
            // Update interim transcript for visual feedback
            setInterimTranscript(interimTranscript);
          };
          
          recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
              setMicrophonePermission(false);
            }
          };
          
          recognition.onend = () => {
            console.log('Voice recognition ended');
            setIsListening(false);
            setInterimTranscript('');
            
            // Restart recognition if we're still in listening mode
            // This helps with continuous listening
            if (isListening) {
              try {
                recognition.start();
              } catch (error) {
                console.error('Error restarting speech recognition:', error);
              }
            }
          };
          
          setRecognitionInstance(recognition);
          return true;
        } else {
          console.error('Speech Recognition API not supported in this browser');
          setBrowserSupported(false);
          return false;
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setBrowserSupported(false);
        return false;
      }
    }
    return false;
  };

  const handleMicrophonePermissionGranted = () => {
    setMicrophonePermission(true);
    const success = initializeSpeechRecognition();
    if (success) {
      // Automatically start listening after permission is granted
      setTimeout(() => {
        if (recognitionInstance) {
          try {
            recognitionInstance.start();
          } catch (error) {
            console.error('Error starting speech recognition after permission granted:', error);
          }
        }
      }, 1000);
    }
  };

  useEffect(() => {
    // Check if the browser supports the MediaDevices API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Check if we already have microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Stop all tracks to release the microphone
          stream.getTracks().forEach(track => track.stop());
          
          setMicrophonePermission(true);
          initializeSpeechRecognition();
        })
        .catch(err => {
          console.error('Error checking microphone permission:', err);
          setMicrophonePermission(false);
        });
    } else {
      console.error('MediaDevices API not supported in this browser');
      setBrowserSupported(false);
    }
    
    // Cleanup function
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (error) {
          console.error('Error stopping speech recognition during cleanup:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      setNote(transcript);
    }
  }, [transcript]);

  const handleListen = () => {
    if (!recognitionInstance) {
      console.error('Speech recognition not initialized');
      return;
    }
    
    if (!isListening) {
      // Clear previous transcripts
      setTranscript('');
      setInterimTranscript('');
      setNote('');
      
      try {
        console.log('Starting speech recognition...');
        recognitionInstance.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        
        // Try to recreate the recognition instance if it fails
        if (error instanceof DOMException && error.name === 'InvalidStateError') {
          console.log('Recognition instance was already running, stopping and restarting...');
          recognitionInstance.stop();
          setTimeout(() => {
            recognitionInstance.start();
          }, 100);
        }
      }
    } else {
      console.log('Stopping speech recognition...');
      recognitionInstance.stop();
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  const handleSave = () => {
    if (note.trim() !== '') {
      onSave(note);
      setNote('');
      setTranscript('');
      setInterimTranscript('');
    }
  };

  const handleClear = () => {
    setNote('');
    setTranscript('');
    setInterimTranscript('');
  };

  if (!browserSupported) {
    return <div style={{ padding: '1rem', backgroundColor: '#FFCDD2', color: '#B71C1C', borderRadius: '0.375rem' }}>Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.</div>;
  }

  if (microphonePermission === false) {
    return <MicrophonePermission onPermissionGranted={handleMicrophonePermissionGranted} />;
  }

  // Combine transcript and interim transcript for display
  const displayText = note || (transcript + (interimTranscript ? ` ${interimTranscript}` : ''));

  return (
    <div style={{ 
      backgroundColor: '#111827', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '1.5rem' 
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FFA500' }}>Voice Recorder</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {lastNote && (
              <button
                onClick={() => setShowLastNote(!showLastNote)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: showLastNote ? '#FFA500' : '#1F2937',
                  color: showLastNote ? 'black' : '#FFA500',
                  cursor: 'pointer',
                  border: 'none',
                }}
                title="Show/Hide Last Note"
              >
                <FaHistory />
              </button>
            )}
            <button
              onClick={handleListen}
              style={{
                padding: '0.75rem',
                borderRadius: '9999px',
                backgroundColor: isListening ? '#F44336' : '#F44336',
                color: isListening ? 'white' : 'black',
                cursor: 'pointer',
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              title={isListening ? 'Stop Recording' : 'Start Recording'}
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
              {isListening ? <FaStop /> : <FaMicrophone />}
            </button>
          </div>
        </div>
        
        {showLastNote && lastNote && (
          <div style={{ 
            backgroundColor: 'rgba(244, 67, 54, 0.1)', 
            padding: '0.75rem', 
            borderRadius: '0.375rem',
            border: '1px dashed #F44336',
            marginBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#F44336', fontWeight: 'bold' }}>Last Saved Note:</span>
              <button 
                onClick={() => setNote(lastNote)}
                style={{
                  backgroundColor: '#1F2937',
                  color: '#F44336',
                  border: '1px solid #F44336',
                  borderRadius: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                Use as Template
              </button>
            </div>
            <p style={{ color: '#E0E0E0', fontSize: '0.875rem', margin: 0 }}>{lastNote}</p>
          </div>
        )}
        
        <div style={{ position: 'relative' }}>
          <textarea
            value={displayText}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: '100%',
              height: '10rem',
              padding: '1rem',
              backgroundColor: '#1F2937',
              color: 'white',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '1rem',
            }}
            placeholder="Your voice note will appear here..."
          />
          {interimTranscript && (
            <div style={{ 
              position: 'absolute', 
              bottom: '3rem', 
              right: '1rem',
              backgroundColor: 'rgba(244, 67, 54, 0.2)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              color: '#F44336'
            }}>
              Processing...
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleClear}
              style={{
                padding: '0.5rem',
                backgroundColor: '#374151',
                color: '#E0E0E0',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                border: 'none',
              }}
              title="Clear"
            >
              <FaTrash />
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '0.5rem',
                backgroundColor: '#FFA500',
                color: 'black',
                borderRadius: '0.375rem',
                opacity: note.trim() === '' ? 0.5 : 1,
                cursor: note.trim() === '' ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
              title="Save"
              disabled={note.trim() === ''}
            >
              <FaSave />
            </button>
          </div>
        </div>
        
        <div style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>
          {isListening ? 'Listening... (speak now)' : 'Click the microphone to start recording'}
        </div>
        
        {isListening && (
          <div style={{ 
            backgroundColor: 'rgba(255, 165, 0, 0.1)', 
            padding: '0.5rem', 
            borderRadius: '0.25rem',
            marginTop: '0.5rem'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#FFA500' }}>
              <strong>Tip:</strong> Speak clearly into your microphone. Make sure your browser has permission to access your microphone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder; 