import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import ForumUser from '@/lib/models/ForumUser';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, name } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Validate username again just to be safe (never trust the client)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
    }

    await connectMongo();

    // Make sure no one else claimed this username in the last 2 seconds
    const existingUsername = await ForumUser.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (existingUsername && existingUsername.email !== session.user.email) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // SECURITY: Check if the current user ALREADY has a username. 
    // If they do, they are permanently locked and cannot change it.
    const currentUser = await ForumUser.findOne({ 
      email: { $regex: new RegExp(`^${session.user.email}$`, 'i') } 
    });
    if (!currentUser) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    if (currentUser.username) {
      return NextResponse.json({ error: 'Your username is permanently locked and cannot be changed' }, { status: 403 });
    }

    // Update the current user
    const updatedUser = await ForumUser.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${session.user.email}$`, 'i') } },
      { 
        $set: { 
          username: username,
          ...(name && { name: name }) // Only update name if they provided it
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
