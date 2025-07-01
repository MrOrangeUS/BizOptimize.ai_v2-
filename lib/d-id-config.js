// D-ID Configuration and Setup Guide
// This file helps you manage stored image IDs for optimal performance

export const DID_CONFIG = {
  // Replace these placeholder IDs with your actual stored image IDs from D-ID
  STORED_IMAGE_IDS: {
    'amy': 'amy-business-consultant-id', // Replace with actual ID
    'john': 'john-executive-advisor-id', // Replace with actual ID
    'sarah': 'sarah-strategic-analyst-id', // Replace with actual ID
    'default': 'amy-business-consultant-id' // Default fallback
  },

  // Available voices for ElevenLabs integration
  ELEVENLABS_VOICES: {
    'amy': 'EXAVITQu4vr4xnSDxMaL', // Bella - Professional female
    'john': 'pNInz6obpgDQGcFmaJgB', // Adam - Professional male
    'sarah': '21m00Tcm4TlvDq8ikWAM', // Rachel - Strategic female
    'default': 'EXAVITQu4vr4xnSDxMaL'
  },

  // Avatar configurations
  AVATARS: {
    'amy': {
      name: 'Amy',
      description: 'Professional Business Consultant',
      voiceId: 'EXAVITQu4vr4xnSDxMaL',
      imageId: 'amy-business-consultant-id' // Replace with actual ID
    },
    'john': {
      name: 'John',
      description: 'Executive Business Advisor',
      voiceId: 'pNInz6obpgDQGcFmaJgB',
      imageId: 'john-executive-advisor-id' // Replace with actual ID
    },
    'sarah': {
      name: 'Sarah',
      description: 'Strategic Business Analyst',
      voiceId: '21m00Tcm4TlvDq8ikWAM',
      imageId: 'sarah-strategic-analyst-id' // Replace with actual ID
    }
  }
};

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. UPLOAD IMAGES TO D-ID:
 *    - Go to https://studio.d-id.com/
 *    - Upload your avatar images (high quality, front-facing, good lighting)
 *    - Note down the image IDs from the URL or API response
 * 
 * 2. UPDATE CONFIGURATION:
 *    - Replace the placeholder image IDs above with your actual IDs
 *    - Update the voice IDs if you want different ElevenLabs voices
 * 
 * 3. TEST THE INTEGRATION:
 *    - Use the test function below to verify your setup
 * 
 * 4. ENVIRONMENT VARIABLES:
 *    - NEXT_PUBLIC_DID_API_KEY: Your D-ID API key
 *    - ELEVENLABS_API_KEY: Your ElevenLabs API key
 */

/**
 * Test function to verify your D-ID setup
 */
export async function testDIDSetup() {
  const avatarManager = new (await import('./d-id.js')).default();
  
  // Update with your actual image IDs
  avatarManager.updateStoredImageIds(DID_CONFIG.STORED_IMAGE_IDS);
  
  console.log('Testing D-ID setup...');
  console.log('Available avatars:', avatarManager.getAvailableAvatars());
  
  // Test with a simple message
  try {
    const videoUrl = await avatarManager.generateAvatarVideoWithStoredImage(
      'Hello! I am your AI business consultant. How can I help you today?',
      'default'
    );
    
    if (videoUrl) {
      console.log('✅ D-ID setup successful! Video URL:', videoUrl);
      return true;
    } else {
      console.log('❌ D-ID setup failed - no video URL returned');
      return false;
    }
  } catch (error) {
    console.error('❌ D-ID setup failed:', error.message);
    return false;
  }
}

/**
 * Get avatar configuration by key
 */
export function getAvatarConfig(avatarKey = 'default') {
  return DID_CONFIG.AVATARS[avatarKey] || DID_CONFIG.AVATARS.default;
}

/**
 * Update stored image IDs (useful for runtime configuration)
 */
export function updateStoredImageIds(newImageIds) {
  Object.assign(DID_CONFIG.STORED_IMAGE_IDS, newImageIds);
  console.log('Updated stored image IDs:', DID_CONFIG.STORED_IMAGE_IDS);
}

export default DID_CONFIG; 