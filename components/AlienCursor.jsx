"use client";
import React, { useState, useEffect, useCallback } from 'react';

const AlienCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Throttled mouse move handler for performance
  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
    
    // Spawn new particle
    const newParticle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      createdAt: Date.now()
    };
    
    setParticles(prev => [...prev.slice(-8), newParticle]); // Keep last 8 particles
  }, []);

  useEffect(() => {
    // Clean up old particles
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(particle => 
        Date.now() - particle.createdAt < 600 // Remove after 600ms
      ));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed pointer-events-none z-50 w-2 h-2 bg-alien-green rounded-full animate-cursor-glow"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Particle trails */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-40 w-1 h-1 bg-alien-green rounded-full animate-particle-fade"
          style={{
            left: particle.x,
            top: particle.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </>
  );
};

export default AlienCursor; 