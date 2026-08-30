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

    // Get authenticated user securely from the server
    const session = await getServerSession(authOptions)

    // If providing a comment to an existing feedback entry
    if (feedbackId && (comment || title)) {
      // Check if this feedbackId already exists in the array (for backwards compatibility)
      const doc = await sanityWriteClient.fetch(`*[_id == $docId][0]{ feedbackHistory }`, { docId })
      const exists = doc.feedbackHistory?.some((item: any) => item._key === feedbackId)

      if (exists) {
        const updates: any = {}
        if (title) updates[`feedbackHistory[_key=="${feedbackId}"].title`] = title
        if (comment) updates[`feedbackHistory[_key=="${feedbackId}"].comment`] = comment

        await sanityWriteClient
          .patch(docId)
          .set(updates)
          .commit()
      } else {
        const feedbackEntry: any = {
          _key: feedbackId,
          reaction: isHelpful !== undefined ? (isHelpful ? 'helpful' : 'not_helpful') : 'unknown',
          title,
          comment,
          pageUrl: req.headers.get('referer') || '',
          userAgent: req.headers.get('user-agent') || 'unknown',
          submittedAt: new Date().toISOString(),
        }

        if (session?.user?.email) {
          feedbackEntry.userEmail = session.user.email
        }

        await sanityWriteClient
          .patch(docId)
          .setIfMissing({ feedbackHistory: [] })
          .append('feedbackHistory', [feedbackEntry])
          .commit()
      }
      return NextResponse.json({ success: true })
    }

    const field = isHelpful ? 'helpfulCount' : 'notHelpfulCount'
    const newFeedbackId = Math.random().toString(36).substring(2, 9)

    await sanityWriteClient
      .patch(docId)
      .setIfMissing({ [field]: 0 })
      .inc({ [field]: 1 })
      .commit()

    return NextResponse.json({ success: true, id: docId, feedbackId: newFeedbackId })
  } catch (error) {
    console.error('[Docs Feedback API] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 })
  }
}
