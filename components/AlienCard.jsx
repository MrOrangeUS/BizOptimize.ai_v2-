"use client";
import React, { useState, useEffect } from 'react';

const AlienCard = ({ title, subtitle, children, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate random floating hexagons
  useEffect(() => {
    const hexagons = [];
    for (let i = 0; i < 5; i++) {
      hexagons.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        size: 30 + Math.random() * 40
      });
    }
    setParticles(hexagons);
  }, []);

  const handleMouseMove = (e) => {
    if (isHovered) {
      // Create particle trail effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add particle to trail (this would be handled by a global cursor system)
      console.log('Particle at:', x, y);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'glitch':
        return 'glitch';
      case 'neon':
        return 'border-glow';
      case 'plasma':
        return 'bg-gradient-neon';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`alien-card ${getVariantStyles()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      data-text={title}
    >
      {/* Floating hexagons background */}
      {particles.map((hex) => (
        <div
          key={hex.id}
          className="floating-hexagon"
          style={{
            left: `${hex.left}%`,
            animationDelay: `${hex.delay}s`,
            width: `${hex.size}px`,
            height: `${hex.size}px`
          }}
        />
      ))}

      {/* Circuit pattern overlay */}
      <div className="circuit-bg absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {title && (
          <h3 className="alien-title text-2xl mb-2">
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className="alien-subtitle text-sm mb-4">
            {subtitle}
          </p>
        )}
        
        <div className="text-alien-green font-mono">
          {children}
        </div>
      </div>

      {/* Glitch effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-alien-green opacity-5 animate-static-flicker pointer-events-none" />
      )}
    </div>
  );
};

// Example usage components
export const AlienButton = ({ children, onClick, variant = 'default' }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick?.();
  };

  return (
    <button
      className={`alien-btn ${isClicked ? 'animate-glitch-flicker' : ''}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const AlienInput = ({ placeholder, value, onChange, type = 'text' }) => {
  return (
    <input
      type={type}
      className="alien-input w-full"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export const AlienSection = ({ title, children }) => {
  return (
    <section className="min-h-screen bg-gradient-alien relative overflow-hidden">
      {/* Background hexagons */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="floating-hexagon"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {title && (
          <h1 className="alien-title text-center mb-12">
            {title}
          </h1>
        )}
        {children}
      </div>
    </section>
  );
};

// Custom cursor component
export const AlienCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add trail particle
      const newTrail = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      };
      
      setTrails(prev => [...prev.slice(-5), newTrail]);
      
      // Remove old trails
      setTimeout(() => {
        setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: position.x - 2,
          top: position.y - 2
        }}
      />
      {trails.map((trail) => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: trail.x - 1,
            top: trail.y - 1
          }}
        />
      ))}
    </>
  );
};

export default AlienCard; 