import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client'; // Adjust path if needed

// Note: Ensure you have a write-enabled token in your environment variables.
// You might need to use a dedicated client instance with the token if the default
// client only has read permissions.
// const writeClient = client.withConfig({ token: process.env.SANITY_API_WRITE_TOKEN });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, institution, reviewText, rating, suggestion, moduleName } = body;

    // Basic Validation
    if (!name || !institution || !reviewText || !rating) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare Sanity Document
    const reviewDoc = {
      _type: 'communityReview',
      name,
      email,
      institution,
      reviewText,
      rating: Number(rating),
      suggestion: suggestion || '',
      moduleName: moduleName || 'Overall',
      status: 'pending', // Always default to pending for moderation
    };

    // Use a client configured with a write token
    // If your default client doesn't have a token, you must import createClient
    // and initialize it with process.env.SANITY_API_WRITE_TOKEN
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false, // Must be false for mutations
    });

    const result = await writeClient.create(reviewDoc);

    return NextResponse.json(
      { message: 'Review submitted successfully', id: result._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting review to Sanity:', error);
    return NextResponse.json(
      { message: 'Failed to submit review', error: error.message },
      { status: 500 }
    );
  }
}
