import React, { useEffect, useState } from 'react';
import { useParticleCursor } from '../hooks/useAnimations';

const CursorParticles = ({ enabled = true, particleColor = 'rgba(102, 126, 234, 0.6)' }) => {
  const particles = useParticleCursor();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add hover detection to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .btn, .card, input, select, textarea');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [enabled]);

  if (!enabled || particles.length === 0) return null;

  return (
    <div className="cursor-particles" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle ${isHovering ? 'particle-hover' : ''}`}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            background: particleColor,
            borderRadius: '50%',
            opacity: particle.opacity,
            transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
            transition: 'transform 0.2s ease',
            boxShadow: isHovering ? `0 0 10px ${particleColor}` : 'none',
            animation: 'particleFloat 0.8s ease-out forwards'
          }}
        />
      ))}
    </div>
  );
};

export default CursorParticles;
