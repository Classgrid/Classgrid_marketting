import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: You must add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured in environment variables.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { name, email, subject, module, priority, description, collegeName } = body;

    // Validate required fields
    if (!name || !email || !subject || !module || !description || !collegeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          requester_name: name,
          requester_email: email,
          subject,
          module,
          priority: priority || 'low',
          description,
          college_name: collegeName,
          status: 'Open'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insertion error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ticket: data }, { status: 201 });
  } catch (error: any) {
    console.error('Ticket API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
