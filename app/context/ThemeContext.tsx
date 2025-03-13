'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Load theme preference from localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme ? savedTheme === 'dark' : true);
  }, []);

  useEffect(() => {
    // Update localStorage and apply theme when darkMode changes
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.style.backgroundColor = darkMode ? '#000000' : '#ffffff';
    document.documentElement.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 