import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIChatCompletionWithHistory } from '@/lib/openai';
import { elevenLabsSpeak } from '@/lib/voice';
import { avatarRequestSchema } from '@/lib/schemas';
import { validationError, serverError } from '@/lib/apiError';

export async function POST(request: NextRequest) {
  try {
    console.log('=== ChatGPT Avatar API Called ===');
    
    const body = avatarRequestSchema.parse(await request.json());
    console.log('Request body:', body);
    
    console.log('Calling ChatGPT...');
    const aiReply = await getOpenAIChatCompletionWithHistory(
      body.message,
      body.conversationHistory || []
    );
    console.log('ChatGPT reply:', aiReply);
    
    console.log('Calling D-ID...');
    const audioUrl = await elevenLabsSpeak(aiReply);
    
    if (!audioUrl) {
      throw new Error('Failed to generate audio');
    }
    
    const dIdPayload = {
      script: {
        type: 'text',
        input: aiReply,
        provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' }
      },
      config: { fluent: true, pad_audio: 0 },
      source_image: body.imageId || 'img_WfKNPP92VLukJrJyoSZtt'
    };
    
    console.log('D-ID payload:', dIdPayload);
    
    const dIdResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dIdPayload),
    });
    
    console.log('D-ID response status:', dIdResponse.status);
    const dIdData = await dIdResponse.json();
    console.log('D-ID response data:', dIdData);
    
    if (!dIdResponse.ok) {
      throw new Error(`D-ID API error: ${dIdData.error || 'Unknown error'}`);
    }
    
    console.log('Polling for D-ID video...');
    let videoUrl = null;
    let pollCount = 0;
    const maxPolls = 30;
    
    while (pollCount < maxPolls) {
      pollCount++;
      console.log(`Poll ${pollCount}: ${dIdData.status}`);
      
      if (dIdData.status === 'done') {
        videoUrl = dIdData.result_url;
        console.log('Video ready:', videoUrl);
        break;
      } else if (dIdData.status === 'error') {
        throw new Error('D-ID video generation failed');
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pollResponse = await fetch(`https://api.d-id.com/talks/${dIdData.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DID_API_KEY}`,
        },
      });
      
      if (!pollResponse.ok) {
        throw new Error('Failed to poll D-ID status');
      }
      
      const pollData = await pollResponse.json();
      dIdData.status = pollData.status;
      dIdData.result_url = pollData.result_url;
    }
    
    if (!videoUrl) {
      throw new Error('D-ID video generation timeout');
    }
    
    console.log('Success! Returning video URL and AI reply');
    return NextResponse.json({
      videoUrl,
      aiReply,
      audioUrl
    });
    
  } catch (error) {
    console.error('Avatar API error:', error);
    
    if (error instanceof Error && error.message.includes('ZodError')) {
      return validationError('Invalid request data', { details: error.message });
    }
    
    return serverError('Failed to generate avatar video');
  }
} 