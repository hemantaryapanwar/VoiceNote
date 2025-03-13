'use client';
import { useState } from 'react';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>VoiceNote</div>
        
        <button 
          className={styles.menuButton} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <div className={`${styles.menu} ${isOpen ? styles.active : ''}`}>
          <a href="/">Home</a>
          <a href="/notes">Notes</a>
          <a href="/profile">Profile</a>
        </div>
      </div>
    </nav>
  );
} 