import { elevenLabsSpeak } from './voice';

// D-ID Avatar Integration with Backend API
class DIDAvatarManager {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_DID_API_KEY;
    this.baseUrl = 'https://api.d-id.com';
    this.currentVideo = null;
    this.isGenerating = false;
    this.onVideoReady = null;
    this.onError = null;
  }

  /**
   * Create a talking avatar using stored image ID
   * @param {string} text - Text to convert to speech
   * @param {string} avatarKey - Key for avatar (defaults to 'business')
   * @returns {Promise<string|null>} - D-ID talk ID
   */
  async createTalkingAvatarWithStoredImage(text, avatarKey = 'business') {
    try {
      // Try to get the most recent imageUrl and imageId from localStorage
      let imageId = null;
      let imageUrl = null;
      if (typeof window !== 'undefined') {
        imageId = localStorage.getItem('d-id-image-id');
        imageUrl = localStorage.getItem('d-id-image-url');
      }
      const body = { text, avatarKey };
      if (imageUrl && imageUrl.startsWith('http')) body.imageUrl = imageUrl;
      else if (imageId) body.imageId = imageId;
      console.log('Calling /api/did/talk with body:', body);
      const response = await fetch('/api/did/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      
      console.log('Backend API response:', data);
      
      if (!response.ok) {
        console.error('D-ID API error details:', data);
        if (this.onError) this.onError(data.error || 'Unknown error');
        return null;
      }
      
      console.log(`Successfully created talk with ID: ${data.id}`);
      return data.id;
    } catch (error) {
      console.error('Error creating talking avatar:', error);
      if (this.onError) this.onError(error.message);
      return null;
    }
  }

  /**
   * Create a talking avatar with custom audio
   * @param {string} text - Text for display
   * @param {string} audio - Audio URL or base64
   * @param {string} avatarKey - Key for avatar (defaults to 'business')
   */
  async createTalkingAvatarWithStoredImageAndAudio(text, audio, avatarKey = 'business') {
    try {
      console.log(`Creating talking avatar with audio for text: "${text}" and avatarKey: "${avatarKey}"`);
      
      // Check if ElevenLabs API key is available
      const elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
      if (!elevenLabsApiKey) {
        console.warn('ElevenLabs API key not found, falling back to text-to-speech only');
        return this.createTalkingAvatarWithStoredImage(text, avatarKey);
      }
      
      const response = await fetch('/api/did/talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, avatarKey, audio })
      });
      const data = await response.json();
      
      console.log('Backend API response (with audio):', data);
      
      if (!response.ok) {
        console.error('D-ID API error details (with audio):', data);
        if (this.onError) this.onError(data.error || 'Unknown error');
        return null;
      }
      
      console.log(`Successfully created talk with audio, ID: ${data.id}`);
      return data.id;
    } catch (error) {
      console.error('Error creating talking avatar with audio:', error);
      if (this.onError) this.onError(error.message);
      return null;
    }
  }

  async getVideoStatus(talkId) {
    if (!talkId) return null;
    try {
      const response = await fetch(`${this.baseUrl}/talks/${talkId}`, {
        headers: {
          'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
        }
      });
      if (!response.ok) {
        console.error(`D-ID status API error: ${response.status} - ${response.statusText}`);
        throw new Error(`D-ID API error: ${response.status}`);
      }
      const data = await response.json();
      console.log(`D-ID status for ${talkId}:`, data);
      return data;
    } catch (error) {
      console.error('Error getting video status:', error);
      return null;
    }
  }

  async waitForVideoReady(talkId, maxAttempts = 30) {
    let attempts = 0;
    console.log(`Starting video status polling for talk ID: ${talkId}`);
    
    while (attempts < maxAttempts) {
      const status = await this.getVideoStatus(talkId);
      
      if (!status) {
        console.error(`Failed to get status for talk ID: ${talkId}`);
        throw new Error('Failed to get video status');
      }
      
      console.log(`Attempt ${attempts + 1}/${maxAttempts} - Status: ${status.status}`);
      
      if (status?.status === 'done') {
        console.log(`Video generation completed successfully: ${status.result_url}`);
        return status.result_url;
      } else if (status?.status === 'error') {
        console.error(`Video generation failed for talk ID ${talkId}:`, JSON.stringify(status, null, 2));
        const errorMessage = status.error?.message || status.error?.description || status.error?.details || 'Unknown error';
        throw new Error(`Video generation failed: ${errorMessage}`);
      } else if (status?.status === 'rejected') {
        console.error(`Video generation rejected for talk ID ${talkId}:`, JSON.stringify(status, null, 2));
        const errorMessage = status.error?.message || status.error?.description || status.error?.details || 'Unknown reason';
        throw new Error(`Video generation rejected: ${errorMessage}`);
      }
      
      // Wait 2 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    console.error(`Video generation timeout after ${maxAttempts} attempts for talk ID: ${talkId}`);
    throw new Error('Video generation timeout');
  }

  /**
   * Generate avatar video using backend API (recommended method)
   */
  async generateAvatarVideoWithStoredImage(text, avatarKey = 'business') {
    try {
      const talkId = await this.createTalkingAvatarWithStoredImage(text, avatarKey);
      if (talkId) {
        return await this.waitForVideoReady(talkId);
      }
      return null;
    } catch (error) {
      console.error('Error generating avatar video:', error);
      return null;
    }
  }

  /**
   * Generate avatar video using backend API with custom audio
   */
  async generateAvatarVideoWithStoredImageAndAudio(text, avatarKey = 'business') {
    try {
      console.log(`Generating avatar video with audio for text: "${text}"`);
      
      // Check if ElevenLabs API key is available
      const elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
      if (!elevenLabsApiKey) {
        console.warn('ElevenLabs API key not found, falling back to text-to-speech only');
        return this.generateAvatarVideoWithStoredImage(text, avatarKey);
      }
      
      const talkId = await this.createTalkingAvatarWithStoredImageAndAudio(text, null, avatarKey);
      if (!talkId) {
        console.error('Failed to create talking avatar with audio');
        return null;
      }
      
      return await this.waitForVideoReady(talkId);
    } catch (error) {
      console.error('Error generating avatar video with audio:', error);
      if (this.onError) this.onError(error.message);
      return null;
    }
  }

  // Available avatars
  getAvailableAvatars() {
    return [
      {
        key: 'business',
        name: 'AI Business Consultant',
        description: 'Professional Business Optimization Assistant'
      }
    ];
  }
}

// React hook for avatar functionality
import React from 'react';
export function useAvatar() {
  const [avatarManager] = React.useState(() => new DIDAvatarManager());
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState(null);
  const [error, setError] = React.useState(null);

  const generateAvatar = React.useCallback(async (text, avatarKey = 'business') => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const videoUrl = await avatarManager.generateAvatarVideoWithStoredImage(text, avatarKey);
      if (videoUrl) {
        setCurrentVideo(videoUrl);
      } else {
        setError('Failed to generate avatar video');
      }
    } catch (err) {
      console.error('Error generating avatar:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [avatarManager]);

  const generateAvatarWithAudio = React.useCallback(async (text, avatarKey = 'business', voiceId) => {
    setIsGenerating(true);
    setError(null);
    try {
      const videoUrl = await avatarManager.generateAvatarVideoWithStoredImageAndAudio(text, avatarKey, voiceId);
      if (videoUrl) {
        setCurrentVideo(videoUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [avatarManager]);

  const clearVideo = React.useCallback(() => {
    setCurrentVideo(null);
    setError(null);
  }, []);

  return {
    generateAvatar,
    generateAvatarWithAudio,
    clearVideo,
    isGenerating,
    currentVideo,
    error,
    availableAvatars: avatarManager.getAvailableAvatars()
  };
}

export default DIDAvatarManager; 