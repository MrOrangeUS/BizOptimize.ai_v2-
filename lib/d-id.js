import { elevenLabsSpeak } from './voice';
// D-ID Avatar Integration
class DIDAvatarManager {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_DID_API_KEY;
    this.baseUrl = 'https://api.d-id.com';
    this.currentVideo = null;
    this.isGenerating = false;
    this.onVideoReady = null;
    this.onError = null;
  }

  async createTalkingAvatar(text, presenterId = 'amy-Aq6OmG2Xc9') {
    if (!this.apiKey) {
      console.error('D-ID API key not configured');
      if (this.onError) this.onError('Avatar service not configured');
      return null;
    }
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
          source_url: `https://create-images-results.d-id.com/DefaultPresenters/${presenterId}/image`
        })
      });
      if (!response.ok) throw new Error(`D-ID API error: ${response.status}`);
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating talking avatar:', error);
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

  async generateAvatarVideo(text, presenterId = 'amy-Aq6OmG2Xc9') {
    try {
      const talkId = await this.createTalkingAvatar(text, presenterId);
      if (!talkId) return null;
      const videoUrl = await this.waitForVideoReady(talkId);
      if (this.onVideoReady) {
        this.onVideoReady(videoUrl);
      }
      return videoUrl;
    } catch (error) {
      console.error('Error generating avatar video:', error);
      if (this.onError) this.onError(error.message);
      return null;
    }
  }

  /**
   * Generate a talking avatar using custom audio (e.g., from ElevenLabs)
   * @param {string} text - The text to synthesize
   * @param {string} presenterId - The presenter/avatar ID
   * @param {string} voiceId - ElevenLabs voice ID (optional)
   * @returns {Promise<string|null>} - D-ID talk ID
   */
  async createTalkingAvatarWithAudio(text, presenterId = 'amy-Aq6OmG2Xc9', voiceId = 'EXAVITQu4vr4xnSDxMaL') {
    if (!this.apiKey) {
      console.error('D-ID API key not configured');
      if (this.onError) this.onError('Avatar service not configured');
      return null;
    }
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
      // 4. Send to D-ID as audio
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
          source_url: `https://create-images-results.d-id.com/DefaultPresenters/${presenterId}/image`
        })
      });
      if (!response.ok) throw new Error('D-ID API error');
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating talking avatar with audio:', error);
      if (this.onError) this.onError(error.message);
      return null;
    } finally {
      this.isGenerating = false;
    }
  }

  // Get available presenters
  getAvailablePresenters() {
    return [
      { id: 'amy-Aq6OmG2Xc9', name: 'Amy', description: 'Professional Business Consultant' },
      { id: 'john-doe-123', name: 'John', description: 'Executive Business Advisor' },
      { id: 'sarah-smith-456', name: 'Sarah', description: 'Strategic Business Analyst' }
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

  const generateAvatar = React.useCallback(async (text, presenterId) => {
    setIsGenerating(true);
    setError(null);
    try {
      const videoUrl = await avatarManager.generateAvatarVideo(text, presenterId);
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
    clearVideo,
    isGenerating,
    currentVideo,
    error,
    availablePresenters: avatarManager.getAvailablePresenters()
  };
}

export default DIDAvatarManager; 