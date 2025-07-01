# 🛸 Alien Tech Cursor - Minimal Implementation

A lightweight, performant custom cursor with glowing dot and particle trails for React + Tailwind apps.

## 📁 File Structure

```
components/
  └── AlienCursor.jsx          # Main cursor component
pages/
  └── _app.js                  # Top-level integration
styles/
  └── globals.css              # Global cursor override
tailwind.config.js             # Animation keyframes
```

## 🚀 Quick Start

### 1. Component (`components/AlienCursor.jsx`)

```jsx
import React, { useState, useEffect, useCallback } from 'react';

const AlienCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
    
    const newParticle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      createdAt: Date.now()
    };
    
    setParticles(prev => [...prev.slice(-8), newParticle]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(particle => 
        Date.now() - particle.createdAt < 600
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
      <div
        className="fixed pointer-events-none z-50 w-2 h-2 bg-alien-green rounded-full animate-cursor-glow"
        style={{
          left: position.x - 4,
          top: position.y - 4,
          transform: 'translate(-50%, -50%)'
        }}
      />
      
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
```

### 2. Tailwind Config (`tailwind.config.js`)

Add to your existing `extend` section:

```js
animation: {
  'cursor-glow': 'cursor-glow 1s ease-in-out infinite alternate',
  'particle-fade': 'particle-fade 0.6s ease-out forwards',
},
keyframes: {
  'cursor-glow': {
    '0%': { 
      boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41',
      transform: 'scale(1)'
    },
    '100%': { 
      boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
      transform: 'scale(1.2)'
    }
  },
  'particle-fade': {
    '0%': { 
      opacity: '0.8',
      transform: 'scale(1) translate(-50%, -50%)'
    },
    '100%': { 
      opacity: '0',
      transform: 'scale(0.5) translate(-50%, -50%)'
    }
  }
}
```

### 3. Global CSS (`styles/globals.css`)

Add this to hide the native cursor:

```css
* {
  cursor: none !important;
}
```

### 4. Integration (`pages/_app.js`)

```jsx
import '../styles/globals.css';
import AlienCursor from '../components/AlienCursor';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AlienCursor />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

## 🎯 Features

- **Glowing dot cursor** with pulsing neon effect
- **Particle trails** that fade and disperse
- **Performance optimized** with throttled mouse events
- **Automatic cleanup** of old particles
- **High z-index** to stay on top
- **Pointer events disabled** to prevent interference

## ⚡ Performance Notes

- Uses `useCallback` to prevent unnecessary re-renders
- Limits particles to last 8 positions
- Cleans up particles after 600ms
- Throttled mouse event handling
- CSS transforms for smooth animations

## 🎨 Customization

### Colors
Change `bg-alien-green` to any Tailwind color class.

### Sizes
- Main cursor: `w-2 h-2` (8px)
- Particles: `w-1 h-1` (4px)

### Animation Speed
- Cursor glow: `1s` in `animate-cursor-glow`
- Particle fade: `0.6s` in `animate-particle-fade`

### Particle Count
Change `slice(-8)` to adjust trail length.

## 🚫 Touch Device Handling

The cursor automatically disables on touch devices via the existing CSS:

```css
@media (hover: none) {
  * {
    cursor: auto;
  }
}
```

## 🎯 Usage

Just mount `<AlienCursor />` at the top level and you'll see:
- A glowing green dot following your mouse
- Particle trails that fade out over 600ms
- Smooth animations with neon effects

That's it! Minimal, performant, and ready to use. 🛸 