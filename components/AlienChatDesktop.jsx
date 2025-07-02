"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useAvatar } from '../lib/d-id';
import { getAvatarConfig } from '../lib/d-id-config';

export default function AlienChatDesktop() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    generateAvatar,
    generateAvatarWithAudio,
    error,
    clearVideo,
    availableAvatars,
    updateStoredImageIds
  } = useAvatar();

  const avatarKey = 'business';
  const avatarConfig = getAvatarConfig(avatarKey);
  
  // Debug: Log the avatar config
  console.log('Avatar config:', avatarConfig);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle video playback when ready
  useEffect(() => {
    if (currentVideo && videoRef.current) {
      videoRef.current.src = currentVideo;
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (error) {
          // Autoplay policy
        }
      };
      playVideo();
    }
  }, [currentVideo]);

  // Initial welcome message and avatar
  useEffect(() => {
    if (messages.length === 0 && !isGenerating && !currentVideo) {
      (async () => {
        setIsGenerating(true);
        // Force use the new image ID from config
        const imageId = avatarConfig.imageId || 'img_WfKNPP92VLukJrJyoSZtt';
        // Clear any cached old image ID
        if (typeof window !== 'undefined') {
          localStorage.removeItem('d-id-image-id');
        }
        const voiceId = avatarConfig.voiceId;
        const welcome = "Welcome! To help optimize your business, could you tell me what your company does and your biggest current challenge?";
        const res = await fetch('/api/did/chatgpt-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: welcome,
            imageId,
            voiceId,
            conversationHistory: []
          })
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentVideo(data.videoUrl);
          setMessages([{ id: Date.now(), text: data.aiReply, sender: 'ai', timestamp: new Date() }]);
        }
        setIsGenerating(false);
      })();
    }
  }, []);

  // Strong business system prompt
  const systemPrompt = `You are an expert business optimization consultant. Your job is to ask one targeted, actionable business question at a time, and provide concise, expert advice. Always focus on business growth, operational efficiency, and actionable next steps. Keep responses short and professional.`;

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
    setIsGenerating(true);
    try {
      // Build conversation history for OpenAI
      const conversationHistory = [
        { user: systemPrompt, ai: null },
        ...messages.map(msg => ({ user: msg.sender === 'user' ? msg.text : null, ai: msg.sender === 'ai' ? msg.text : null })).filter(e => e.user || e.ai),
        { user: inputText, ai: null }
      ];
      // Always use the current image ID from config
      const imageId = avatarConfig.imageId || 'img_WfKNPP92VLukJrJyoSZtt';
      const voiceId = avatarConfig.voiceId;
      const res = await fetch('/api/did/chatgpt-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText,
          imageId,
          voiceId,
          conversationHistory
        })
      });
      const data = await res.json();
      if (!res.ok || !data.videoUrl) {
        throw new Error(data.error || 'Failed to generate avatar video');
      }
      setCurrentVideo(data.videoUrl);
      const aiMessage = {
        id: Date.now() + 1,
        text: data.aiReply || 'AI response unavailable.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I apologize, but I encountered an issue processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-alien-black flex items-center justify-center font-orbitron px-4 py-4">
      <div className="w-full max-w-5xl bg-alien-black rounded-2xl shadow-neon flex flex-col lg:flex-row border-2 border-alien-green relative overflow-hidden" style={{ boxShadow: '0 0 32px #00ff41' }}>
        {/* Avatar Panel (left on desktop) */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-alien-green relative" style={{ minHeight: 300 }}>
          <div className="relative w-48 h-64 flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-40 h-52 max-w-xs max-h-80 rounded-lg object-cover border-2 border-alien-green shadow-neon cursor-pointer"
              style={{ display: currentVideo ? 'block' : 'none' }}
              controls={false}
              autoPlay
              onClick={() => {
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(err => {});
                }
              }}
              onError={(e) => {}}
            />
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-alien-black bg-opacity-75 rounded-lg">
                <div className="text-alien-green text-sm font-orbitron animate-pulse">Generating Avatar...</div>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-alien-green" style={{ boxShadow: '0 0 24px #00ff41', borderColor: '#00ff41' }} />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-alien-green font-bold text-lg">{avatarConfig.name}</h3>
            <p className="text-alien-cyan text-sm opacity-80">{avatarConfig.description}</p>
          </div>
        </div>
        {/* Chat Panel (right on desktop) */}
        <div className="flex-1 flex flex-col justify-between p-6 min-w-0">
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4" style={{ minHeight: 300 }}>
            {messages.length === 0 ? (
              <div className="text-center text-alien-cyan opacity-60 mt-8">
                <p>Welcome to BizOptimize.ai</p>
                <p className="text-sm mt-2">Start a conversation with your AI Business Consultant</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`px-4 py-3 rounded-2xl max-w-[80%] border border-alien-green text-alien-green shadow-neon ${message.sender === 'user' ? 'self-end bg-alien-dark' : 'self-start bg-glass-dark'}`}
                  style={{ boxShadow: '0 0 8px #00ff41' }}
                >
                  <div className="text-sm opacity-80 mb-1">{message.sender === 'user' ? 'You' : avatarConfig.name}</div>
                  <div>{message.text}</div>
                  <div className="text-xs opacity-60 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-lg border border-alien-green bg-alien-dark text-alien-green focus:outline-none focus:ring-2 focus:ring-alien-green"
              placeholder="Type your message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping || isGenerating}
            />
            <button
              className="px-6 py-3 bg-gradient-to-r from-alien-green to-alien-cyan text-white font-semibold rounded-lg hover:from-alien-cyan hover:to-alien-green transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={handleSendMessage}
              disabled={isTyping || isGenerating || !inputText.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 