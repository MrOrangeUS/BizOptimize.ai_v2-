import React, { useEffect, useState } from 'react';
import { AlienCursor } from './AlienCard';

const AlienThemeProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize theme
    setIsLoaded(true);
    
    // Add body class for theme
    document.body.classList.add('alien-theme');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('alien-theme');
    };
  }, []);

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-alien-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="alien-title text-4xl mb-4">BIZOPTIMIZE.AI</h1>
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-alien-green rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="alien-theme-container">
      {/* Custom cursor */}
      <AlienCursor />
      
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Random hexagons */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="floating-hexagon"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              opacity: 0.1 + Math.random() * 0.2
            }}
          />
        ))}
        
        {/* Circuit patterns */}
        <div className="absolute top-0 left-0 w-full h-full circuit-bg" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Global glitch effects */}
      <GlitchEffects />
    </div>
  );
};

// Random glitch effects component
const GlitchEffects = () => {
  const [glitches, setGlitches] = useState([]);

  useEffect(() => {
    const createGlitch = () => {
      const glitch = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: 200 + Math.random() * 300
      };

      setGlitches(prev => [...prev, glitch]);

      setTimeout(() => {
        setGlitches(prev => prev.filter(g => g.id !== glitch.id));
      }, glitch.duration);
    };

    // Create random glitches
    const interval = setInterval(createGlitch, 5000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {glitches.map((glitch) => (
        <div
          key={glitch.id}
          className="fixed w-4 h-4 bg-alien-green opacity-30 animate-static-flicker pointer-events-none"
          style={{
            left: glitch.x,
            top: glitch.y,
            animationDuration: `${glitch.duration}ms`
          }}
        />
      ))}
    </>
  );
};

// Hook for theme utilities
export const useAlienTheme = () => {
  const [theme, setTheme] = useState('default');

  const setThemeVariant = (variant) => {
    setTheme(variant);
    document.documentElement.setAttribute('data-theme', variant);
  };

  return { theme, setThemeVariant };
};

// Theme variants
export const themeVariants = {
  default: {
    primary: 'alien-green',
    secondary: 'alien-cyan',
    accent: 'alien-purple'
  },
  plasma: {
    primary: 'alien-plasma',
    secondary: 'alien-cyan',
    accent: 'alien-purple'
  },
  void: {
    primary: 'alien-void',
    secondary: 'alien-green',
    accent: 'alien-cyan'
  }
};

export default AlienThemeProvider; 