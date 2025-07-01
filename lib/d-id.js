import { elevenLabsSpeak } from './voice';

// D-ID Avatar Integration with Stored Images
class DIDAvatarManager {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_DID_API_KEY;
    this.baseUrl = 'https://api.d-id.com';
    this.currentVideo = null;
    this.isGenerating = false;
    this.onVideoReady = null;
    this.onError = null;
    // Only the 'alien' avatar is available
    this.storedImages = {
      'alien': 'd6a7ec53_e537_44c4_9606_1a53e4424d55',
      'default': 'd6a7ec53_e537_44c4_9606_1a53e4424d55'
    };
  }

  /**
   * Create a talking avatar using stored image ID (most efficient method)
   * @param {string} text - Text to synthesize
   * @param {string} avatarKey - Key for stored image (always 'alien')
   * @returns {Promise<string|null>} - D-ID talk ID
   */
  async createTalkingAvatarWithStoredImage(text, avatarKey = 'alien') {
    if (!this.apiKey) {
      console.error('D-ID API key not configured');
      if (this.onError) this.onError('Avatar service not configured');
      return null;
    }
    const imageId = this.storedImages[avatarKey] || this.storedImages.alien;
    this.isGenerating = true;
    try {
      const response = await fetch(`${this.baseUrl}/talks`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            input: text,
            provider: {
              type: 'microsoft',
              voice_id: 'en-US-JennyNeural'
            }
          },
          config: {
            fluent: true,
            pad_audio: 0.0
          },
          source_url: `https://api.d-id.com/images/${imageId}`
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`D-ID API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating talking avatar with stored image:', error);
      if (this.onError) this.onError(error.message);
      return null;
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * Create a talking avatar using stored image ID with custom audio (ElevenLabs)
   * @param {string} text - Text to synthesize
   * @param {string} avatarKey - Key for stored image (always 'alien')
   * @param {string} voiceId - ElevenLabs voice ID
   * @returns {Promise<string|null>} - D-ID talk ID
   */
  async createTalkingAvatarWithStoredImageAndAudio(text, avatarKey = 'alien', voiceId = 'EXAVITQu4vr4xnSDxMaL') {
    if (!this.apiKey) {
      console.error('D-ID API key not configured');
      if (this.onError) this.onError('Avatar service not configured');
      return null;
    }
    const imageId = this.storedImages[avatarKey] || this.storedImages.alien;
    this.isGenerating = true;
    try {
      // 1. Get ElevenLabs audio URL
      const audioUrl = await elevenLabsSpeak(text, voiceId);
      // 2. Fetch audio as ArrayBuffer
      const audioRes = await fetch(audioUrl);
      const audioBuffer = await audioRes.arrayBuffer();
      // 3. Convert to base64
      const audioBase64 = typeof window === 'undefined'
        ? Buffer.from(audioBuffer).toString('base64')
        : btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
      // 4. Send to D-ID with stored image ID
      const response = await fetch(`${this.baseUrl}/talks`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'audio',
            audio: audioBase64,
          },
          config: {
            fluent: true,
            pad_audio: 0.0
          },
          source_url: `https://api.d-id.com/images/${imageId}`
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`D-ID API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating talking avatar with stored image and audio:', error);
      if (this.onError) this.onError(error.message);
      return null;
    } finally {
      this.isGenerating = false;
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
      if (!response.ok) throw new Error(`D-ID API error: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting video status:', error);
      return null;
    }
  }

  async waitForVideoReady(talkId, maxAttempts = 30) {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const status = await this.getVideoStatus(talkId);
      if (status?.status === 'done') {
        return status.result_url;
      } else if (status?.status === 'error') {
        throw new Error('Video generation failed');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    throw new Error('Video generation timeout');
  }

  /**
   * Generate avatar video using stored image (recommended method)
   */
  async generateAvatarVideoWithStoredImage(text, avatarKey = 'alien') {
    try {
      const talkId = await this.createTalkingAvatarWithStoredImage(text, avatarKey);
      if (!talkId) return null;
      const videoUrl = await this.waitForVideoReady(talkId);
      if (this.onVideoReady) {
        this.onVideoReady(videoUrl);
      }
      return videoUrl;
    } catch (error) {
      console.error('Error generating avatar video with stored image:', error);
      if (this.onError) this.onError(error.message);
      return null;
    }
  }

  /**
   * Generate avatar video using stored image with custom audio
   */
  async generateAvatarVideoWithStoredImageAndAudio(text, avatarKey = 'alien', voiceId = 'EXAVITQu4vr4xnSDxMaL') {
    try {
      const talkId = await this.createTalkingAvatarWithStoredImageAndAudio(text, avatarKey, voiceId);
      if (!talkId) return null;
      const videoUrl = await this.waitForVideoReady(talkId);
      if (this.onVideoReady) {
        this.onVideoReady(videoUrl);
      }
      return videoUrl;
    } catch (error) {
      console.error('Error generating avatar video with stored image and audio:', error);
      if (this.onError) this.onError(error.message);
      return null;
    }
  }

  // Only one avatar available
  getAvailableAvatars() {
    return [
      {
        key: 'alien',
        name: 'Alien',
        description: 'Alien Tech AI Avatar',
        imageId: this.storedImages.alien
      }
    ];
  }

  // Update stored image IDs (useful for configuration)
  updateStoredImageIds(newImageIds) {
    this.storedImages = { ...this.storedImages, ...newImageIds };
    console.log('Updated stored image IDs:', this.storedImages);
  }
}

// React hook for avatar functionality
import React from 'react';
export function useAvatar() {
  const [avatarManager] = React.useState(() => new DIDAvatarManager());
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState(null);
  const [error, setError] = React.useState(null);

  const generateAvatar = React.useCallback(async (text, avatarKey = 'alien') => {
    setIsGenerating(true);
    setError(null);
    try {
      const videoUrl = await avatarManager.generateAvatarVideoWithStoredImage(text, avatarKey);
      if (videoUrl) {
        setCurrentVideo(videoUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [avatarManager]);

  const generateAvatarWithAudio = React.useCallback(async (text, avatarKey = 'alien', voiceId) => {
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
    availableAvatars: avatarManager.getAvailableAvatars(),
    updateStoredImageIds: avatarManager.updateStoredImageIds.bind(avatarManager)
  };
}

export default DIDAvatarManager; 