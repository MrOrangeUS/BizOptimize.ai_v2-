"use client";
import React, { useState, useRef, useEffect } from 'react';
import { getAvatarConfig } from '../lib/d-id-config';
import AvatarPlayer from './AvatarPlayer'; // Assuming AvatarPlayer handles the D-ID video


export default function AlienChatDesktop() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const videoRef = useRef(null);
  const messagesEndRef = useRef(null);



  const avatarKey = 'business';
  const avatarConfig = getAvatarConfig(avatarKey);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Initial welcome message and avatar
  useEffect(() => {
    if (messages.length === 0 && !isGenerating && !currentVideo) {
      (async () => {
        setIsGenerating(true);
        const welcome = "Welcome! To help optimize your business, could you tell me what your company does and your biggest current challenge?";
        
        try {
          const res = await fetch('/api/did/chatgpt-avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: welcome,
              imageId: avatarConfig.imageId,
              voiceId: avatarConfig.voiceId,
              conversationHistory: []
            })
          });
          
          if (res.ok) {
            const data = await res.json();
            // Assuming setCurrentVideo is used by AvatarPlayer or passed to it
            setCurrentVideo(data.videoUrl);
            setMessages([{ id: Date.now(), text: data.aiReply, sender: 'ai', timestamp: new Date() }]);
          } else {
            // Fallback to static avatar
            setMessages([{ id: Date.now(), text: welcome, sender: 'ai', timestamp: new Date() }]);
          }
        } catch (error) {
          console.error('Avatar generation failed:', error);
          // Fallback to static avatar
          setMessages([{ id: Date.now(), text: welcome, sender: 'ai', timestamp: new Date() }]);
        } finally {
          setIsGenerating(false);
        }
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
          // Try D-ID API first
          const res = await fetch('/api/did/chatgpt-avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: inputText,
              imageId: avatarConfig.imageId,
              voiceId: avatarConfig.voiceId,
              conversationHistory: messages.map(msg => ({ user: msg.sender === 'user' ? msg.text : null, ai: msg.sender === 'ai' ? msg.text : null })).filter(e => e.user || e.ai)
            })
          });
          
          if (res.ok) {
            const data = await res.json();
            // Assuming setCurrentVideo is used by AvatarPlayer or passed to it
            setCurrentVideo(data.videoUrl);
            const aiMessage = {
              id: Date.now() + 1,
              text: data.aiReply,
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
          } else {
            // Fallback to simple responses
            const aiResponses = [
              "That's a great question! To help you optimize your business, I'd like to understand more about your current processes. What specific area are you looking to improve?",
              "Thank you for sharing that information. Based on what you've described, I can suggest several optimization strategies. What's your primary goal right now?",
              "I understand your situation. Many businesses face similar challenges. Let me ask you this: what would success look like for you in the next 3-6 months?",
              "That's an interesting perspective. To provide more targeted advice, could you tell me about your current team size and budget for improvements?",
              "I appreciate you sharing those details. It sounds like you're ready to take your business to the next level. What's the biggest obstacle you're facing right now?"
            ];
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            const aiMessage = {
              id: Date.now() + 1,
              text: randomResponse,
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
          }
        } catch (err) {
          console.error('Chat error:', err);
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
      <div className="w-full max-w-5xl bg-glass-dark border border-glass-border rounded-2xl shadow-neon flex flex-col lg:flex-row relative overflow-hidden">
        {/* Avatar Panel (left on desktop) */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-alien-green relative">
          {/* Integrate AvatarPlayer component */}
          <div className="w-full h-auto max-w-xs mx-auto aspect-w-3 aspect-h-4 rounded-lg border-2 border-alien-green shadow-neon relative">
            <AvatarPlayer
              videoUrl={currentVideo}
              isGenerating={isGenerating}
            />
            <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-alien-green" style={{ boxShadow: '0 0 24px #00ff41', borderColor: '#00ff41' }} />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-alien-green font-bold text-lg">{avatarConfig.name}</h3>
            <p className="text-alien-cyan text-sm opacity-80">{avatarConfig.description}</p>
          </div>
        </div>
        {/* Chat Panel (right on desktop) */}
        <div className="flex-1 flex flex-col justify-between p-6 min-w-0 border-l border-alien-green/50">
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4" style={{ minHeight: 300 }}>
            {messages.length === 0 ? (
              <div className="text-center text-alien-cyan opacity-60 mt-8">
                <p>Welcome to BizOptimize.ai</p>
                <p className="text-sm mt-2">Start a conversation with your AI Business Consultant</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id} // Ensure unique key
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-alien-green shadow-neon ${message.sender === 'user' ? 'self-end bg-alien-dark border border-alien-cyan/50' : 'self-start bg-glass-dark border border-alien-green/50'}`}
                  style={{ boxShadow: message.sender === 'user' ? '0 0 8px #00ffff' : '0 0 8px #00ff41' }}
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
              id="chat-input"
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
              onClick={handleSendMessage} // Keep the original onClick
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