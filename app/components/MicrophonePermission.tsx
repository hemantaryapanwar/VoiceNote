'use client';

import React, { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

interface MicrophonePermissionProps {
  onPermissionGranted: () => void;
}

const MicrophonePermission: React.FC<MicrophonePermissionProps> = ({ onPermissionGranted }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestMicrophoneAccess = async () => {
    setIsRequesting(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted', stream);
      
      // Stop all tracks to release the microphone
      stream.getTracks().forEach(track => track.stop());
      
      onPermissionGranted();
    } catch (err) {
      console.error('Error requesting microphone permission:', err);
      setError('Could not access your microphone. Please check your browser settings and try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#111827',
      borderRadius: '1rem',
      padding: '1.5rem',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ color: '#F44336', marginBottom: '1rem', fontSize: '1.25rem' }}>
        Microphone Access Required
      </h3>
      
      <p style={{ color: '#D1D5DB', marginBottom: '1.5rem' }}>
        To use voice recording, we need permission to access your microphone.
      </p>
      
      {error && (
        <div style={{ 
          backgroundColor: '#FFCDD2', 
          color: '#B71C1C', 
          padding: '0.75rem', 
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      <button
        onClick={requestMicrophoneAccess}
        disabled={isRequesting}
        style={{
          backgroundColor: '#F44336',
          color: 'black',
          border: 'none',
          borderRadius: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          margin: '0 auto',
          cursor: isRequesting ? 'wait' : 'pointer',
          opacity: isRequesting ? 0.7 : 1,
          fontWeight: 'bold'
        }}
      >
        <FaMicrophone />
        {isRequesting ? 'Requesting Access...' : 'Allow Microphone Access'}
      </button>
    </div>
  );
};

export default MicrophonePermission; 