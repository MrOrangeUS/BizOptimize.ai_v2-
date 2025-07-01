import React from 'react';

// Voice interaction utilities - DISABLED
// export class VoiceManager {
//   constructor() {
//     this.synthesis = window.speechSynthesis;
//     this.recognition = null;
//     this.isListening = false;
//     this.isSpeaking = false;
//     this.onTranscript = null;
//     this.onError = null;
    
//     this.initSpeechRecognition();
//   }

//   initSpeechRecognition() {
//     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       this.recognition = new SpeechRecognition();
      
//       this.recognition.continuous = false;
//       this.recognition.interimResults = false;
//       this.recognition.lang = 'en-US';
      
//       this.recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         if (this.onTranscript) {
//           this.onTranscript(transcript);
//         }
//         this.isListening = false;
//       };
      
//       this.recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         if (this.onError) {
//           this.onError(event.error);
//         }
//         this.isListening = false;
//       };
      
//       this.recognition.onend = () => {
//         this.isListening = false;
//       };
//     }
//   }

//   startListening(onTranscript, onError) {
//     if (!this.recognition) {
//       if (onError) onError('Speech recognition not supported');
//       return false;
//     }
    
//     if (this.isListening) {
//       this.stopListening();
//     }
    
//     this.onTranscript = onTranscript;
//     this.onError = onError;
    
//     try {
//       this.recognition.start();
//       this.isListening = true;
//       return true;
//     } catch (error) {
//       console.error('Error starting speech recognition:', error);
//       if (onError) onError('Failed to start listening');
//       return false;
//     }
//   }

//   stopListening() {
//     if (this.recognition && this.isListening) {
//       this.recognition.stop();
//       this.isListening = false;
//     }
//   }

//   speak(text, onEnd) {
//     if (!this.synthesis) {
//       console.error('Speech synthesis not supported');
//       return false;
//     }
    
//     // Stop any current speech
//     this.synthesis.cancel();
    
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.9; // Slightly slower for better comprehension
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;
    
//     // Try to use a professional-sounding voice
//     const voices = this.synthesis.getVoices();
//     const preferredVoice = voices.find(voice => 
//       voice.name.includes('Google') || 
//       voice.name.includes('Samantha') || 
//       voice.name.includes('Alex')
//     );
//     if (preferredVoice) {
//       utterance.voice = preferredVoice;
//     }
    
//     utterance.onend = () => {
//       this.isSpeaking = false;
//       if (onEnd) onEnd();
//     };
    
//     utterance.onerror = (event) => {
//       console.error('Speech synthesis error:', event.error);
//       this.isSpeaking = false;
//     };
    
//     this.isSpeaking = true;
//     this.synthesis.speak(utterance);
//     return true;
//   }

//   stopSpeaking() {
//     if (this.synthesis) {
//       this.synthesis.cancel();
//       this.isSpeaking = false;
//     }
//   }

//   isSupported() {
//     return !!(this.synthesis && this.recognition);
//   }

//   getStatus() {
//     return {
//       isListening: this.isListening,
//       isSpeaking: this.isSpeaking,
//       isSupported: this.isSupported()
//     };
//   }
// }

// Hook for React components - DISABLED
export function useVoice() {
  // const [voiceManager] = React.useState(() => new VoiceManager());
  // const [isListening, setIsListening] = React.useState(false);
  // const [isSpeaking, setIsSpeaking] = React.useState(false);
  // const [isSupported, setIsSupported] = React.useState(false);

  // React.useEffect(() => {
  //   setIsSupported(voiceManager.isSupported());
  // }, [voiceManager]);

  // const startListening = React.useCallback((onTranscript, onError) => {
  //   const success = voiceManager.startListening(
  //     (transcript) => {
  //       setIsListening(false);
  //       if (onTranscript) onTranscript(transcript);
  //     },
  //     (error) => {
  //       setIsListening(false);
  //       if (onError) onError(error);
  //     }
  //   );
  //   if (success) {
  //     setIsListening(true);
  //   }
  //   return success;
  // }, [voiceManager]);

  // const stopListening = React.useCallback(() => {
  //   voiceManager.stopListening();
  //   setIsListening(false);
  // }, [voiceManager]);

  // const speak = React.useCallback((text, onEnd) => {
  //   const success = voiceManager.speak(text, () => {
  //     setIsSpeaking(false);
  //     if (onEnd) onEnd();
  //   });
  //   if (success) {
  //     setIsSpeaking(true);
  //   }
  //   return success;
  // }, [voiceManager]);

  // const stopSpeaking = React.useCallback(() => {
  //   voiceManager.stopSpeaking();
  //   setIsSpeaking(false);
  // }, [voiceManager]);

  // Return disabled voice functionality
  return {
    startListening: () => false,
    stopListening: () => {},
    speak: () => false,
    stopSpeaking: () => {},
    isListening: false,
    isSpeaking: false,
    isSupported: false
  };
}

// ElevenLabs TTS API integration
export async function elevenLabsSpeak(text, voiceId = 'EXAVITQu4vr4xnSDxMaL') {
  // voiceId: default is "Rachel" (replace with your preferred voice)
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });
  if (!response.ok) throw new Error('Failed to fetch ElevenLabs audio');
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob); // Play with <audio src={...} />
} 