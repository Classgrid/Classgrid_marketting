import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { connectMongo } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const escalationId = req.nextUrl.searchParams.get("escalationId");
  const adminEmail = req.nextUrl.searchParams.get("adminEmail"); // Optional

  if (!escalationId) {
    return NextResponse.json({ error: "Missing escalationId parameter" }, { status: 400 });
  }

  try {
    // 1. Fetch Sanity doc
    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    const doc = await writeClient.getDocument(escalationId);
    if (!doc) {
      return new NextResponse("Escalation not found", { status: 404 });
    }

    if (doc.enquiryId) {
      // Already created an enquiry, redirect to it
      return NextResponse.redirect(`https://classgrid.in/dashboard/admin/support/view/${doc.enquiryId}`);
    }

    const isEmail = doc.deviceInfo?.includes("Email Client");
    const institutionSource = isEmail ? "Email Inquiry" : "Website Visitor";
    
    // 2. Create Platform Support Ticket (Classgrid Talk)
    const formData = new FormData();
    formData.append("name", doc.userName || "Unknown Visitor");
    formData.append("email", doc.userEmail || "anonymous@classgrid.in");
    formData.append("subject", doc.subject || "AI Escalation");
    formData.append("message", `AI Problem Summary:\n${doc.aiSummary}\n\nOriginal Transcript Context:\n${JSON.stringify(doc.chatTranscript, null, 2)}`);
    formData.append("institution", institutionSource); // Triggers Classgrid Talk fallback

    const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
    const ticketRes = await fetch(`${backendUrl}/api/support/public/tickets`, {
      method: "POST",
      body: formData,
      headers: {
        "x-proxy-auth-email": doc.userEmail,
        "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
      },
    });

    if (!ticketRes.ok) {
      const err = await ticketRes.text();
      return new NextResponse(`Failed to create inquiry in platform: ${err}`, { status: 500 });
    }

    const ticketResponse = await ticketRes.json();
    const ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
      || ticketResponse?.data?._id || ticketResponse?.data?.id
      || ticketResponse?._id || ticketResponse?.id;

    if (!ticketId) {
      return new NextResponse("Inquiry created but no ID returned from platform", { status: 500 });
    }

    // 3. Update Sanity
    await writeClient.patch(escalationId).set({
      status: "handled",
      enquiryId: ticketId,
      ticketCreated: true
    }).commit();

    // 4. Generate AI Draft response using standard fetch to avoid extra dependencies
    const draftPrompt = `
      You are an expert customer success manager for Classgrid (an educational SaaS platform).
      An AI support agent escalated this conversation to you. 
      Write a highly professional, empathetic, and concise first response to the user.
      
      User Email: ${doc.userEmail}
      AI Summary of Issue: ${doc.aiSummary}
      Transcript:
      ${doc.chatTranscript?.map((t: any) => `${t.role}: ${t.content}`).join("\n") || ""}

      Requirements:
      - Start with "Hi," or "Hello [name],"
      - Acknowledge their issue clearly based on the summary.
      - Ask for any missing information or propose the next step.
      - Tone: Professional, helpful, concise.
      - Output ONLY the email body text. Do not include subject lines or extra commentary.
    `;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        temperature: 0.2,
        messages: [{ role: "user", content: draftPrompt }]
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      throw new Error(`Groq API Error: ${err}`);
    }

    const groqData = await groqRes.json();
    const draftContent = groqData.choices?.[0]?.message?.content || "";

    // 5. Save to MessageDrafts in MongoDB
    await connectMongo();
    const db = mongoose.connection.db;
    if (db) {
      await db.collection("messagedrafts").updateOne(
        { ticketId: new mongoose.Types.ObjectId(ticketId) },
        { 
          $set: { 
            draftContent: draftContent,
            source: "ai_generated",
            aiContext: doc.aiSummary,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    // 6. Redirect Admin to Dashboard
    return NextResponse.redirect(`https://classgrid.in/dashboard/admin/support/view/${ticketId}`);
    
  } catch (err: any) {
    console.error("Create enquiry error:", err);
    return new NextResponse(`Server error: ${err.message}`, { status: 500 });
  }
}
