import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // Must be a token with write access
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reaction, message, pageUrl, pageTitle, pageType } = body

    if (!reaction || !pageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: reaction, pageUrl' },
        { status: 400 }
      )
    }

    // Map emoji to reaction value
    const emojiToReaction: Record<string, string> = {
      '😭': 'terrible',
      '😞': 'bad',
      '😐': 'okay',
      '🤩': 'great',
    }

    const reactionValue = emojiToReaction[reaction] || reaction

    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Valid page types
    const validPageTypes = ['compare', 'blog', 'module', 'solution', 'case-study', 'use-case', 'help-article', 'docs', 'general']
    const resolvedPageType = validPageTypes.includes(pageType) ? pageType : 'general'

    // Create a new websiteFeedback document in Sanity
    const doc = await sanityWriteClient.create({
      _type: 'websiteFeedback',
      pageType: resolvedPageType,
      pageUrl,
      pageTitle: pageTitle || '',
      reaction: reactionValue,
      message: message || '',
      status: 'new',
      userAgent,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (error: any) {
    console.error('[Feedback API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}
