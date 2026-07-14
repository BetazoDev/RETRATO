import { NextRequest, NextResponse } from 'next/server';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://retratowp.halonso.digital';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required.' },
        { status: 400 }
      );
    }

    // Generate confirmation token in Next.js
    const token = crypto.randomUUID();
    const origin = request.nextUrl.origin;
    const magicLink = `${origin}/api/confirm?token=${token}`;

    // Proxy to WordPress REST API
    const wpResponse = await fetch(`${WP_URL}/wp-json/retrato/v1/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        email,
        confirmation_token: token,
        status: 'pending'
      }),
    });

    const data = await wpResponse.json();

    if (!wpResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Subscription failed.',
        },
        { status: wpResponse.status }
      );
    }

    // Trigger n8n welcome/drip email workflow asynchronously (non-blocking)
    fetch('https://n8n.diabolicalservices.tech/webhook/retrato-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        email, 
        magicLink 
      }),
    }).catch((err) => console.error('Failed to trigger n8n subscribe:', err));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
