import React, { useState, useEffect } from 'react';
import { useVoice } from '../lib/voice';

export default function VoiceButton({ 
  onTranscript, 
  onError, 
  textToSpeak, 
  onSpeakComplete,
  className = "",
  size = "medium",
  variant = "primary"
}) {
  // Voice functionality disabled
  // const { 
  //   startListening, 
  //   stopListening, 
  //   speak, 
  //   stopSpeaking,
  //   isListening, 
  //   isSpeaking, 
  //   isSupported 
  // } = useVoice();

  // const [showTooltip, setShowTooltip] = useState(false);

  // // Auto-speak when textToSpeak changes
  // useEffect(() => {
  //   if (textToSpeak && isSupported) {
  //     speak(textToSpeak, onSpeakComplete);
  //   }
  // }, [textToSpeak, speak, onSpeakComplete, isSupported]);

  // const handleVoiceInput = () => {
  //   if (isListening) {
  //     stopListening();
  //   } else {
  //     startListening(onTranscript, onError);
  //   }
  // };

  // const handleStopSpeaking = () => {
  //   stopSpeaking();
  // };

  // if (!isSupported) {
  //   return null; // Don't show voice button if not supported
  // }

  // Voice button disabled - return null
  return null;

  // const sizeClasses = {
  //   small: "w-8 h-8",
  //   medium: "w-12 h-12",
  //   large: "w-16 h-16"
  // };

  // const variantClasses = {
  //   primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
  //   secondary: "bg-gray-600 hover:bg-gray-700",
  //   success: "bg-green-600 hover:bg-green-700",
  //   danger: "bg-red-600 hover:bg-red-700"
  // };

  // const getIcon = () => {
  //   if (isListening) {
  //     return (
  //       <div className="relative">
  //         <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
  //         <div className="absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping"></div>
  //       </div>
  //     );
  //   }
  //   if (isSpeaking) {
  //     return (
  //       <div className="relative">
  //         <div className="w-4 h-4 bg-white rounded-full"></div>
  //         <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
  //       </div>
  //     );
  //   }
  //   return (
  //     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
  //       <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
  //     </svg>
  //   );
  // };

  // const getTooltipText = () => {
  //   if (isListening) return "Click to stop listening";
  //   if (isSpeaking) return "Click to stop speaking";
  //   return "Click to speak";
  // };

  // return (
  //   <div className="relative inline-block">
  //     <button
  //       className={`
  //         ${sizeClasses[size]} 
  //         ${variantClasses[variant]}
  //         text-white rounded-full flex items-center justify-center 
  //         transition-all duration-200 shadow-lg hover:shadow-xl
  //         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  //         ${className}
  //       `}
  //       onClick={isSpeaking ? handleStopSpeaking : handleVoiceInput}
  //       onMouseEnter={() => setShowTooltip(true)}
  //       onMouseLeave={() => setShowTooltip(false)}
  //       title={getTooltipText()}
  //     >
  //       {getIcon()}
  //     </button>
      
  //     {showTooltip && (
  //       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
  //         {getTooltipText()}
  //         <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
  //       </div>
  //     )}
  //   </div>
  // );
} 