'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on desktop devices with mouse
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      const isClickable = target.closest('a, button, input, select, textarea, [role="button"], .clickable');
      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    // Apply custom cursor css class to html/body
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  // Smooth trail effect using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Ease factor (0.15 for smooth trailing lag)
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`custom-cursor-dot ${isHovered ? 'cursor-hover' : ''}`}
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`
        }}
      />
      <div
        className={`custom-cursor-circle ${isHovered ? 'cursor-hover' : ''}`}
        style={{
          transform: `translate3d(${trail.x - 16}px, ${trail.y - 16}px, 0)`
        }}
      />
    </>
  );
}
