'use client';

import React, { useState, useEffect } from 'react';

const quotes = [
  {
    text: "Speak in such a way that others love to listen to you. Listen in such a way that others love to speak to you.",
    author: "Anonymous"
  },
  {
    text: "The human voice is the most perfect instrument of all.",
    author: "Arvo Pärt"
  },
  {
    text: "Words mean more than what is set down on paper. It takes the human voice to infuse them with deeper meaning.",
    author: "Maya Angelou"
  },
  {
    text: "Your voice can change the world.",
    author: "Barack Obama"
  },
  {
    text: "The most important thing in communication is hearing what isn't said.",
    author: "Peter Drucker"
  },
  {
    text: "The voice is a second face.",
    author: "Gérard Bauër"
  },
  {
    text: "Take notes. Capture what you hear. Document what you learn.",
    author: "Anonymous"
  },
  {
    text: "The spoken word belongs half to him who speaks, and half to him who listens.",
    author: "French Proverb"
  }
];

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Change quote every 30 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }, 30000);

    // Initial random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quote-card">
      <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>"{quote.text}"</p>
      <p style={{ fontSize: '0.875rem', color: '#FFEB3B', textAlign: 'right' }}>— {quote.author}</p>
    </div>
  );
};

export default QuoteDisplay; 