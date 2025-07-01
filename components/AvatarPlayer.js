import React, { useState, useEffect } from 'react';
import { useAvatar } from '../lib/d-id';

export default function AvatarPlayer({ 
  text, 
  presenterId = 'amy-Aq6OmG2Xc9',
  autoPlay = true,
  className = "",
  size = "medium",
  showControls = true
}) {
  const { generateAvatar, clearVideo, isGenerating, currentVideo, error } = useAvatar();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  // Auto-generate avatar when text changes
  useEffect(() => {
    if (text && autoPlay) {
      generateAvatar(text, presenterId);
      setShowAvatar(true);
    }
  }, [text, presenterId, autoPlay, generateAvatar]);

  // Clear video when component unmounts
  useEffect(() => {
    return () => {
      clearVideo();
    };
  }, [clearVideo]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleRetry = () => {
    if (text) {
      generateAvatar(text, presenterId);
    }
  };

  const sizeClasses = {
    small: "w-64 h-48",
    medium: "w-80 h-60",
    large: "w-96 h-72",
    full: "w-full h-96"
  };

  const getPresenterInfo = () => {
    const presenters = [
      { id: 'amy-Aq6OmG2Xc9', name: 'Amy', role: 'Business Consultant' },
      { id: 'john-doe-123', name: 'John', role: 'Business Advisor' },
      { id: 'sarah-smith-456', name: 'Sarah', role: 'Business Analyst' }
    ];
    return presenters.find(p => p.id === presenterId) || presenters[0];
  };

  const presenter = getPresenterInfo();

  if (!text) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Avatar Video Container */}
      <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-blue-50 to-indigo-100`}>
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Generating avatar...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <p className="text-gray-600 text-sm mb-4">Avatar generation failed</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {currentVideo && !isGenerating && !error && (
          <video
            className="w-full h-full object-cover"
            controls={showControls}
            autoPlay={autoPlay}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
          >
            <source src={currentVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Presenter Info Overlay */}
        {currentVideo && !isGenerating && !error && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="text-white">
              <h3 className="font-semibold">{presenter.name}</h3>
              <p className="text-sm opacity-90">{presenter.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {presenter.name} - {presenter.role}
              </span>
              {isPlaying && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Speaking
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {!currentVideo && !isGenerating && !error && (
                <button
                  onClick={() => generateAvatar(text, presenterId)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Generate Avatar
                </button>
              )}
              
              {currentVideo && (
                <button
                  onClick={clearVideo}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 