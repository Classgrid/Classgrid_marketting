import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, isHelpful, feedbackId, title, comment } = body

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 })
    }

    const query = `*[_type == "apiDoc" && slug.current == $slug][0]._id`
    const docId = await sanityWriteClient.fetch(query, { slug })

    if (!docId) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 })
    }

    // If providing a comment to an existing feedback entry
    if (feedbackId && (comment || title)) {
      const updates: any = {}
      if (title) updates[`feedbackHistory[_key=="${feedbackId}"].title`] = title
      if (comment) updates[`feedbackHistory[_key=="${feedbackId}"].comment`] = comment

      await sanityWriteClient
        .patch(docId)
        .set(updates)
        .commit()
      return NextResponse.json({ success: true })
    }

    const userAgent = req.headers.get('user-agent') || 'unknown'
    const field = isHelpful ? 'helpfulCount' : 'notHelpfulCount'

    // Get authenticated user securely from the server
    const session = await getServerSession(authOptions)

    // Create the feedback object to append to the array
    const feedbackEntry: any = {
      _key: Math.random().toString(36).substring(2, 9), // Generate a random key for Sanity array item
      reaction: isHelpful ? 'helpful' : 'not_helpful',
      pageUrl: req.headers.get('referer') || '',
      userAgent,
      submittedAt: new Date().toISOString(),
    }

    if (session?.user?.email) {
      feedbackEntry.userEmail = session.user.email
    }

    await sanityWriteClient
      .patch(docId)
      .setIfMissing({ [field]: 0, feedbackHistory: [] })
      .inc({ [field]: 1 })
      .append('feedbackHistory', [feedbackEntry])
      .commit()

    return NextResponse.json({ success: true, id: docId, feedbackId: feedbackEntry._key })
  } catch (error) {
    console.error('[Docs Feedback API] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 })
  }
}
