'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrollPercent = (window.scrollY / totalHeight) * 100;
        setProgress(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="progress-container">
      <div 
        className="progress-fill"
        style={{ height: `${progress}%` }} 
      />
      <div className="progress-label">
        Reading
      </div>
    </div>
  );
}
