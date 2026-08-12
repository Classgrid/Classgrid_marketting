import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy-project-id',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2026-03-30',
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    const { slug, appendContent } = await req.json();

    if (!slug || !appendContent) {
      return NextResponse.json({ error: 'Missing slug or appendContent' }, { status: 400 });
    }

    const doc = await writeClient.fetch(
      `*[_type == "apiDoc" && slug.current == $slug][0]`,
      { slug }
    );

    if (!doc) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }

    const newContent = doc.content + '\n\n' + appendContent;

    await writeClient
      .patch(doc._id)
      .set({ content: newContent })
      .commit();

    return NextResponse.json({ success: true, message: 'Content appended' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
