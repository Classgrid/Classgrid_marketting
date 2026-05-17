import { NextResponse } from 'next/server';

const PLATFORM_API = process.env.PLATFORM_API_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  try {
    // Forward the multipart form data to the platform server
    const formData = await req.formData();

    const response = await fetch(`${PLATFORM_API}/api/support/public/tickets`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[Proxy] Support ticket error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Could not reach platform server. Please try again later.' },
      { status: 502 }
    );
  }
}
