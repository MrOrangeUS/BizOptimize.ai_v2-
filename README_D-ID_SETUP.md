# D-ID Stored Image Integration Setup Guide

## 🚀 Optimized D-ID Avatar Integration

This guide will help you set up the most efficient D-ID integration using **stored images by Image ID** instead of uploading images on every request.

---

## 📋 Prerequisites

1. **D-ID Account**: Sign up at [https://studio.d-id.com/](https://studio.d-id.com/)
2. **D-ID API Key**: Get your API key from the D-ID dashboard
3. **ElevenLabs Account**: For custom voice synthesis (optional)
4. **High-quality avatar images**: Professional headshots with good lighting

---

## 🔧 Step-by-Step Setup

### 1. Upload Images to D-ID Studio

1. **Go to D-ID Studio**: Visit [https://studio.d-id.com/](https://studio.d-id.com/)
2. **Upload Images**: 
   - Click "Upload Image" or "Add Image"
   - Upload high-quality headshots (front-facing, good lighting, professional)
   - Recommended: 512x512px or higher, JPG/PNG format
3. **Note Image IDs**: 
   - After upload, note the image ID from the URL or API response
   - Example: `https://api.d-id.com/images/abc123-def456-ghi789`

### 2. Update Configuration

Edit `lib/d-id-config.js` and replace the placeholder image IDs:

```javascript
export const DID_CONFIG = {
  STORED_IMAGE_IDS: {
    'amy': 'your-actual-amy-image-id', // Replace with real ID
    'john': 'your-actual-john-image-id', // Replace with real ID
    'sarah': 'your-actual-sarah-image-id', // Replace with real ID
    'default': 'your-actual-amy-image-id' // Default fallback
  },
  // ... rest of config
};
```

### 3. Environment Variables

Add these to your `.env.local` file:

```bash
# D-ID API Configuration
NEXT_PUBLIC_DID_API_KEY=your_did_api_key_here

# ElevenLabs (for custom voice)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 4. Test the Integration

Run the test function to verify your setup:

```javascript
import { testDIDSetup } from './lib/d-id-config';

// Test the setup
testDIDSetup().then(success => {
  if (success) {
    console.log('✅ D-ID setup successful!');
  } else {
    console.log('❌ D-ID setup failed - check your configuration');
  }
});
```

---

## 🎯 Key Benefits of Stored Images

### ✅ **Performance**
- **Faster API calls**: No image upload on every request
- **Reduced latency**: Images already hosted on D-ID servers
- **Better user experience**: Quicker avatar generation

### ✅ **Scalability**
- **Centralized management**: All avatars in one place
- **Easy updates**: Change avatars without code changes
- **Cost efficient**: No repeated upload costs

### ✅ **Security**
- **No external URLs**: Images stored securely on D-ID
- **No user uploads**: Prevents security vulnerabilities
- **Controlled access**: Only your approved images

---

## 🔄 API Usage Examples

### Basic Avatar Generation
```javascript
import { useAvatar } from './lib/d-id';

const { generateAvatar } = useAvatar();

// Generate avatar with stored image
await generateAvatar('Hello, how can I help you?', 'amy');
```

### Avatar with Custom Audio
```javascript
import { useAvatar } from './lib/d-id';

const { generateAvatarWithAudio } = useAvatar();

// Generate avatar with ElevenLabs voice
await generateAvatarWithAudio(
  'Hello, how can I help you?', 
  'amy', 
  'EXAVITQu4vr4xnSDxMaL'
);
```

### Multiple Avatars
```javascript
const avatars = ['amy', 'john', 'sarah'];

// Switch between avatars
for (const avatar of avatars) {
  await generateAvatar('Hello!', avatar);
}
```

---

## 🎨 Avatar Configuration

### Available Avatars
- **Amy**: Professional Business Consultant
- **John**: Executive Business Advisor  
- **Sarah**: Strategic Business Analyst

### Voice Options
- **Bella** (EXAVITQu4vr4xnSDxMaL): Professional female voice
- **Adam** (pNInz6obpgDQGcFmaJgB): Professional male voice
- **Rachel** (21m00Tcm4TlvDq8ikWAM): Strategic female voice

### Customization
```javascript
// Add new avatar
const newAvatar = {
  key: 'mike',
  name: 'Mike',
  description: 'Technical Business Analyst',
  voiceId: 'pNInz6obpgDQGcFmaJgB',
  imageId: 'your-mike-image-id'
};

// Update configuration
updateStoredImageIds({
  'mike': 'your-mike-image-id'
});
```

---

## 🛠️ Troubleshooting

### Common Issues

**❌ "Image ID not found"**
- Verify the image ID is correct
- Check that the image is uploaded to your D-ID account
- Ensure the image ID is properly formatted

**❌ "API key invalid"**
- Verify your D-ID API key is correct
- Check that the API key has proper permissions
- Ensure the environment variable is set correctly

**❌ "Video generation failed"**
- Check your internet connection
- Verify the text input is valid
- Check D-ID service status

**❌ "ElevenLabs audio error"**
- Verify your ElevenLabs API key
- Check that the voice ID is valid
- Ensure sufficient ElevenLabs credits

### Debug Mode
```javascript
// Enable detailed logging
const avatarManager = new DIDAvatarManager();
avatarManager.onError = (error) => {
  console.error('D-ID Error:', error);
};
```

---

## 📊 Performance Monitoring

### Key Metrics to Track
- **Generation time**: How long avatar videos take to create
- **Success rate**: Percentage of successful generations
- **API usage**: Track D-ID and ElevenLabs API calls
- **User engagement**: How users interact with avatars

### Logging
```javascript
// Add performance logging
const startTime = Date.now();
const videoUrl = await generateAvatar(text, avatar);
const generationTime = Date.now() - startTime;

console.log(`Avatar generated in ${generationTime}ms`);
```

---

## 🔮 Future Enhancements

### Planned Features
- **Avatar presets**: Pre-configured avatar personalities
- **Voice cloning**: Custom voice training
- **Real-time streaming**: Live avatar conversations
- **Multi-language support**: International avatar voices

### Integration Ideas
- **CRM integration**: Avatar responses based on customer data
- **Analytics dashboard**: Track avatar performance
- **A/B testing**: Test different avatar configurations
- **User preferences**: Let users choose their preferred avatar

---

## 📞 Support

### Resources
- **D-ID Documentation**: [https://docs.d-id.com/](https://docs.d-id.com/)
- **ElevenLabs Documentation**: [https://docs.elevenlabs.io/](https://docs.elevenlabs.io/)
- **GitHub Issues**: Report bugs or request features

### Contact
- **Technical Support**: Check the troubleshooting section above
- **Feature Requests**: Create a GitHub issue
- **Integration Help**: Review the API usage examples

---

## ✅ Checklist

- [ ] D-ID account created
- [ ] API key obtained
- [ ] Avatar images uploaded to D-ID
- [ ] Image IDs noted and configured
- [ ] Environment variables set
- [ ] Integration tested
- [ ] Error handling implemented
- [ ] Performance monitoring added
- [ ] Documentation updated

**🎉 Congratulations!** Your D-ID integration is now optimized for performance and scalability. 