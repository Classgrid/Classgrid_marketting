import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Proxy to the platform backend
const PLATFORM_API = process.env.NEXT_PUBLIC_PLATFORM_API_URL || process.env.PLATFORM_API_URL || 'https://api.classgrid.in';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, module, priority, description, collegeName } = body;

    // Validate required fields
    if (!name || !email || !subject || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build form data to match the backend expectations
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("category", module || "general");
    formData.append("priority", priority || "low");
    formData.append("message", description);
    formData.append("institution", collegeName || "");

    // Forward to the backend Support API
    const response = await fetch(`${PLATFORM_API}/api/support/public/tickets`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend support API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to create ticket' }, { status: response.status });
    }

    return NextResponse.json({ success: true, ticket: data.ticket }, { status: 201 });
  } catch (error: any) {
    console.error('Ticket API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
