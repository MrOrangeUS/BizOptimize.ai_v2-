// D-ID Configuration and Setup Guide
// This file helps you manage stored image IDs for optimal performance

export const DID_CONFIG = {
  // Business consultant avatar
  STORED_IMAGE_IDS: {
    'business': 'img_RrS5X5lS6temdRa1dbuZa',
    'default': 'img_RrS5X5lS6temdRa1dbuZa'
  },

  // Available voices for ElevenLabs integration (customize as needed)
  ELEVENLABS_VOICES: {
    'business': 'fCxG8OHm4STbIsWe4aT9', // User's specific ElevenLabs voice ID
    'default': 'fCxG8OHm4STbIsWe4aT9'
  },

  // Avatar configuration
  AVATARS: {
    'business': {
      name: 'AI Business Consultant',
      description: 'Your Professional Business Optimization Assistant',
      voiceId: 'fCxG8OHm4STbIsWe4aT9', // User's specific ElevenLabs voice ID
      imageId: 'img_RrS5X5lS6temdRa1dbuZa'
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
export function getAvatarConfig(avatarKey = 'business') {
  return DID_CONFIG.AVATARS[avatarKey] || DID_CONFIG.AVATARS.business;
}

/**
 * Update stored image IDs (useful for runtime configuration)
 */
export function updateStoredImageIds(newImageIds) {
  Object.assign(DID_CONFIG.STORED_IMAGE_IDS, newImageIds);
  console.log('Updated stored image IDs:', DID_CONFIG.STORED_IMAGE_IDS);
}

export default DID_CONFIG; 