import React, { useState, useRef, useEffect } from 'react';
import { useAvatar } from '../lib/d-id';
import { DID_CONFIG, getAvatarConfig } from '../lib/d-id-config';

export default function AlienChatDesktop() {
  const [selectedAvatar, setSelectedAvatar] = useState('amy');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    generateAvatar,
    generateAvatarWithAudio,
    isGenerating,
    currentVideo,
    error,
    availableAvatars,
    updateStoredImageIds
  } = useAvatar();

  // Initialize with your actual stored image IDs
  useEffect(() => {
    // Update with your actual D-ID stored image IDs
    updateStoredImageIds(DID_CONFIG.STORED_IMAGE_IDS);
  }, [updateStoredImageIds]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle video playback when ready
  useEffect(() => {
    if (currentVideo && videoRef.current) {
      videoRef.current.src = currentVideo;
      videoRef.current.play();
    }
  }, [currentVideo]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get avatar configuration
      const avatarConfig = getAvatarConfig(selectedAvatar);
      
      // Generate avatar response with custom audio
      await generateAvatarWithAudio(
        `Thank you for your message: "${inputText}". I'm ${avatarConfig.name}, your ${avatarConfig.description.toLowerCase()}. How can I assist you with your business optimization needs today?`,
        selectedAvatar,
        avatarConfig.voiceId
      );

      const aiMessage = {
        id: Date.now() + 1,
        text: `I'm ${avatarConfig.name}, your ${avatarConfig.description.toLowerCase()}. How can I assist you with your business optimization needs today?`,
        sender: 'ai',
        avatar: selectedAvatar,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error generating avatar response:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I apologize, but I encountered an issue processing your request. Please try again.',
        sender: 'ai',
        avatar: selectedAvatar,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentAvatarConfig = () => {
    return getAvatarConfig(selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-alien-black flex items-center justify-center font-orbitron px-2 py-8">
      <div className="w-full max-w-6xl h-[700px] bg-alien-black rounded-2xl shadow-neon flex flex-col md:flex-row border-2 border-alien-green relative overflow-hidden"
           style={{ boxShadow: '0 0 32px #00ff41' }}>
        
        {/* Avatar Panel */}
        <div className="md:w-2/5 w-full flex flex-col items-center justify-center p-6 border-b-2 md:border-b-0 md:border-r-2 border-alien-green relative"
             style={{ minHeight: 300 }}>
          
          {/* Avatar Selection */}
          <div className="mb-4 w-full">
            <label className="text-alien-green text-sm mb-2 block">Select Avatar:</label>
            <select
              value={selectedAvatar}
              onChange={(e) => setSelectedAvatar(e.target.value)}
              className="w-full bg-alien-dark border border-alien-green text-alien-green px-3 py-2 rounded-lg font-orbitron text-sm"
            >
              {availableAvatars.map(avatar => (
                <option key={avatar.key} value={avatar.key}>
                  {avatar.name} - {avatar.description}
                </option>
              ))}
            </select>
          </div>

          {/* Avatar Display */}
          <div className="relative w-48 h-64 flex items-center justify-center">
            {/* Video Player */}
            <video
              ref={videoRef}
              className="w-40 h-52 rounded-lg object-cover border-2 border-alien-green shadow-neon"
              style={{ display: currentVideo ? 'block' : 'none' }}
              controls={false}
              autoPlay
              muted
              loop
            />
            
            {/* Static Image (fallback) */}
            <img
              src="/avatar.png"
              alt={getCurrentAvatarConfig().name}
              className="w-40 h-52 rounded-lg object-cover border-2 border-alien-green shadow-neon"
              style={{ display: currentVideo ? 'none' : 'block' }}
            />
            
            {/* Loading Indicator */}
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-alien-black bg-opacity-75 rounded-lg">
                <div className="text-alien-green text-sm font-orbitron animate-pulse">
                  Generating Avatar...
                </div>
              </div>
            )}

            {/* Neon Circuit Frame */}
            <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-alien-green"
                 style={{ boxShadow: '0 0 24px #00ff41', borderColor: '#00ff41' }} />
          </div>

          {/* Avatar Info */}
          <div className="mt-4 text-center">
            <h3 className="text-alien-green font-bold text-lg">
              {getCurrentAvatarConfig().name}
            </h3>
            <p className="text-alien-cyan text-sm opacity-80">
              {getCurrentAvatarConfig().description}
            </p>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col justify-between p-6">
          {/* Messages */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-alien-cyan opacity-60 mt-8">
                <p>Welcome to BizOptimize.ai</p>
                <p className="text-sm mt-2">Start a conversation with your AI business consultant</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`
                    px-4 py-3 rounded-2xl max-w-[80%] border border-alien-green text-alien-green shadow-neon
                    ${message.sender === 'user' ? 'self-end bg-alien-dark' : 'self-start bg-glass-dark'}
                  `}
                  style={{ boxShadow: '0 0 8px #00ff41' }}
                >
                  <div className="text-sm opacity-80 mb-1">
                    {message.sender === 'user' ? 'You' : getCurrentAvatarConfig().name}
                  </div>
                  <div>{message.text}</div>
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="self-start px-4 py-3 rounded-2xl border border-alien-green bg-glass-dark">
                <div className="flex items-center space-x-2">
                  <div className="text-alien-green text-sm">Typing</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-alien-green rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-alien-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-alien-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 text-red-200 rounded-lg text-sm">
              Error: {error}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center mt-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border border-alien-green rounded-full px-4 py-3 text-alien-green placeholder-alien-green placeholder-opacity-50 outline-none font-orbitron shadow-neon"
              placeholder="Type your message..."
              style={{ boxShadow: '0 0 8px #00ff41' }}
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="ml-2 p-3 rounded-full border-2 border-alien-green shadow-neon disabled:opacity-50 disabled:cursor-not-allowed hover:bg-alien-green hover:text-alien-black transition-colors"
              style={{ boxShadow: '0 0 12px #00ff41' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Neon circuit border corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-alien-green" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-alien-green" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-alien-green" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-alien-green" />
      </div>
    </div>
  );
} 