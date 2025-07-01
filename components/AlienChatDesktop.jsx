import React from 'react';

export default function AlienChatDesktop() {
  return (
    <div className="min-h-screen bg-alien-black flex items-center justify-center font-orbitron px-2 py-8">
      <div className="w-full max-w-5xl h-[600px] bg-alien-black rounded-2xl shadow-neon flex flex-col md:flex-row border-2 border-alien-green relative overflow-hidden"
           style={{ boxShadow: '0 0 32px #00ff41' }}>
        {/* Avatar Panel */}
        <div className="md:w-1/3 w-full flex flex-col items-center justify-center p-6 border-b-2 md:border-b-0 md:border-r-2 border-alien-green relative"
             style={{ minHeight: 300 }}>
          <div className="relative w-48 h-64 flex items-center justify-center">
            <img
              src="/avatar.png" // Replace with your avatar image
              alt="AI Avatar"
              className="w-40 h-52 rounded-lg object-cover border-2 border-alien-green shadow-neon"
            />
            {/* Neon Circuit Frame */}
            <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-alien-green"
                 style={{ boxShadow: '0 0 24px #00ff41', borderColor: '#00ff41' }} />
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col justify-between p-6">
          {/* Messages (empty bubbles) */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`
                  px-4 py-2 rounded-2xl max-w-[80%] border border-alien-green text-alien-green shadow-neon
                  ${i % 2 === 0 ? 'self-start' : 'self-end'}
                `}
                style={{ boxShadow: '0 0 8px #00ff41', minHeight: '2.5rem' }}
              >
                {/* No text, empty bubble */}
              </div>
            ))}
          </div>
          {/* Input (empty) */}
          <div className="flex items-center mt-2">
            <input
              className="flex-1 bg-transparent border border-alien-green rounded-full px-4 py-2 text-alien-green placeholder-alien-green outline-none font-orbitron shadow-neon"
              placeholder=""
              style={{ boxShadow: '0 0 8px #00ff41' }}
              disabled
            />
            <button className="ml-2 p-3 rounded-full border-2 border-alien-green shadow-neon"
                    style={{ boxShadow: '0 0 12px #00ff41' }}
                    disabled>
              {/* Mic Icon SVG */}
              <svg width="20" height="20" fill="none" stroke="#00ff41" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="11" r="4" />
                <path d="M19 11v2a7 7 0 01-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          </div>
        </div>
        {/* Neon circuit border corners (optional, for extra polish) */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-alien-green" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-alien-green" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-alien-green" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-alien-green" />
      </div>
    </div>
  );
} 