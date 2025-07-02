import { NextResponse } from 'next/server';
import { getOpenAIChatCompletion, getOpenAIChatCompletionWithHistory } from '../../../../lib/openai';
import { elevenLabsSpeak } from '../../../../lib/voice';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    console.log('=== ChatGPT Avatar API Called ===');
    const { message, imageId, voiceId, conversationHistory = [] } = await req.json();
    console.log('Request body:', { message, imageId, voiceId, conversationHistoryLength: conversationHistory.length });
    
    if (!message || !imageId || !voiceId) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields: message, imageId, or voiceId' }, { status: 400 });
    }

    // 1. Get ChatGPT reply with conversation context
    console.log('Calling ChatGPT...');
    const aiReply = await getOpenAIChatCompletionWithHistory(message, conversationHistory);
    console.log('ChatGPT reply:', aiReply);
    if (!aiReply) {
      console.log('ChatGPT failed');
      return NextResponse.json({ error: 'Failed to get response from ChatGPT' }, { status: 500 });
    }

    // 2. Call D-ID to generate avatar video with built-in TTS
    console.log('Calling D-ID...');
    const didApiKey = process.env.DID_API_KEY || process.env.NEXT_PUBLIC_DID_API_KEY;
    console.log('D-ID API Key exists:', !!didApiKey);
    
    // For now, let's use D-ID's built-in text-to-speech instead of ElevenLabs
    // This will be simpler and avoid the audio URL issue
    const payload = {
      script: {
        type: 'text',
        input: aiReply,
        provider: {
          type: 'microsoft',
          voice_id: 'en-US-JennyNeural'
        }
      },
      config: { fluent: true, pad_audio: 0.0 },
      source_image: imageId
    };
    console.log('D-ID payload:', payload);
    
    const didRes = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${didApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    const didData = await didRes.json();
    console.log('D-ID response status:', didRes.status);
    console.log('D-ID response data:', didData);
    
    if (!didRes.ok || !didData.id) {
      console.log('D-ID initial call failed');
      return NextResponse.json({ error: 'Failed to generate D-ID video', details: didData }, { status: 500 });
    }

    // Poll for video ready
    console.log('Polling for D-ID video...');
    let videoUrl = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://api.d-id.com/talks/${didData.id}`, {
        headers: { 'Authorization': `Basic ${didApiKey}` }
      });
      const statusData = await statusRes.json();
      console.log(`Poll ${i + 1}:`, statusData.status);
      
      if (statusData.status === 'done' && statusData.result_url) {
        videoUrl = statusData.result_url;
        console.log('Video ready:', videoUrl);
        break;
      }
      if (statusData.status === 'error' || statusData.status === 'rejected') {
        console.log('D-ID video generation failed');
        return NextResponse.json({ error: 'D-ID video generation failed', details: statusData }, { status: 500 });
      }
    }
    if (!videoUrl) {
      console.log('D-ID video generation timed out');
      return NextResponse.json({ error: 'D-ID video generation timed out' }, { status: 504 });
    }

    console.log('Success! Returning video URL and AI reply');
    return NextResponse.json({ videoUrl, aiReply });
  } catch (err) {
    console.error('ChatGPT Avatar API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 