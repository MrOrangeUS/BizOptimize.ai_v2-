import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Required for FormData parsing

export async function POST(req) {
  try {
    const apiKey = process.env.DID_API_KEY || process.env.NEXT_PUBLIC_DID_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'D-ID API key not configured' }, { status: 500 });
    }
    const formData = await req.formData();
    const file = formData.get('image');
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }
    // Prepare form data for D-ID
    const didForm = new FormData();
    didForm.append('image', file, file.name || 'avatar.png');
    // Upload to D-ID
    const response = await fetch('https://api.d-id.com/images', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
      },
      body: didForm
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('D-ID image upload error:', data);
      return NextResponse.json({ error: data.message || 'Unknown error', details: data }, { status: response.status });
    }
    return NextResponse.json({ id: data.id, url: data.url });
  } catch (error) {
    console.error('D-ID image upload route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 