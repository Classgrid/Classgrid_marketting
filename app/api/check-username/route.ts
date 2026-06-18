export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import ForumUser from '@/lib/models/ForumUser';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Basic Validation: 3-20 characters, only letters, numbers, and underscores (matches Discourse rules)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ 
        available: false, 
        message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores.' 
      }, { status: 200 }); // We return 200 so the UI can easily read the message without throwing a crash error
    }

    // Connect to MongoDB
    await connectMongo();

    // Check if the username already exists in the database (case-insensitive)
    const existingUser = await ForumUser.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (existingUser) {
      return NextResponse.json({ 
        available: false, 
        message: 'Username is already taken.' 
      }, { status: 200 });
    }

    // If it passes the regex and doesn't exist in the DB, it's available!
    return NextResponse.json({ 
      available: true, 
      message: '✓ Your username is available' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
