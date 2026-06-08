import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, articleSlug, articleTitle } = body;

    if (!question || !articleSlug) {
      return NextResponse.json(
        { error: "Question and article details are required." },
        { status: 400 }
      );
    }

    // Write token is required to create documents from the frontend
    const writeToken = process.env.SANITY_API_WRITE_TOKEN;
    if (!writeToken) {
      console.error("Missing SANITY_API_WRITE_TOKEN");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const writeClient = client.withConfig({
      token: writeToken,
      useCdn: false,
    });

    const doc = {
      _type: "articleQuestion",
      question: question.trim(),
      articleSlug: articleSlug,
      articleTitle: articleTitle || "Unknown Article",
      status: "new",
    };

    const response = await writeClient.create(doc);

    return NextResponse.json({ success: true, id: response._id });
  } catch (error: any) {
    console.error("Error creating article question:", error);
    return NextResponse.json(
      { error: "Failed to submit question." },
      { status: 500 }
    );
  }
}
