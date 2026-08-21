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
      // Already created an enquiry, redirect to Support Tickets page
      return NextResponse.redirect(`https://classgrid.in/superadmin/talk`);
    }

    const isEmail = doc.deviceInfo?.includes("Email Client");
    const institutionSource = isEmail ? "Email Inquiry" : "Website Visitor";
    
    // 2. Create Platform Support Ticket (Classgrid Talk)
    const formData = new FormData();
    formData.append("name", doc.userName || "Unknown Visitor");
    formData.append("email", doc.userEmail || "anonymous@classgrid.in");
    formData.append("subject", doc.subject || "AI Escalation");
    formData.append("message", `This conversation was automatically escalated by the AI Support Agent.\n\nAI Summary of the User's Problem:\n${doc.aiSummary}`);
    formData.append("institution", institutionSource); // Triggers Classgrid Talk fallback
    formData.append("skipEmail", "true");

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

    // 4. Generate AI Draft response using Gemini (primary) + Mistral (fallback)
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
      - Introduce yourself using the exact placeholder [ADMIN_NAME] (e.g. "I am [ADMIN_NAME] from Classgrid...").
      - Acknowledge their issue clearly based on the summary.
      - Ask for any missing information or propose the next step.
      - Tone: Professional, helpful, concise.
      - Output ONLY the email body text. Do not include subject lines or extra commentary.
      - End the email with "Best regards, [ADMIN_NAME]".
    `;

    const providers = [
      {
        name: "gemini",
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        apiKey: process.env.GEMINI_API_KEY?.trim() || "",
        model: "gemini-3.5-flash",
      },
      {
        name: "mistral",
        url: "https://api.mistral.ai/v1/chat/completions",
        apiKey: process.env.MISTRAL_API_KEY?.trim() || "",
        model: process.env.MISTRAL_MODEL?.trim() || "mistral-small-latest",
      },
    ].filter(p => p.apiKey);

    let draftContent = "";
    let llmSuccess = false;

    console.log(`[create-enquiry] Starting AI Draft Generation. Available providers: ${providers.map(p => p.name).join(", ")}`);

    for (const provider of providers) {
      console.log(`[create-enquiry] Attempting AI draft with [${provider.name}] (Model: ${provider.model})...`);
      try {
        const startTime = Date.now();
        const llmRes = await fetch(provider.url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: provider.model,
            temperature: 0.2,
            messages: [{ role: "user", content: draftPrompt }]
          })
        });

        if (!llmRes.ok) {
          const err = await llmRes.text();
          console.error(`[create-enquiry] ❌ [${provider.name}] failed with status ${llmRes.status}: ${err}`);
          console.log(`[create-enquiry] Falling back to next provider...`);
          continue;
        }

        const llmData = await llmRes.json();
        draftContent = llmData.choices?.[0]?.message?.content || "";
        if (draftContent) {
          llmSuccess = true;
          const duration = Date.now() - startTime;
          console.log(`[create-enquiry] ✅ [${provider.name}] successfully generated AI draft in ${duration}ms.`);
          break;
        } else {
          console.warn(`[create-enquiry] ⚠️ [${provider.name}] returned empty content.`);
        }
      } catch (e: any) {
        console.error(`[create-enquiry] ❌ [${provider.name}] network error: ${e.message}`);
        console.log(`[create-enquiry] Falling back to next provider...`);
        continue;
      }
    }

    if (!llmSuccess) {
      console.error("[create-enquiry] ❌ All LLM providers failed. Enquiry created without AI draft.");
    }

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

    // 8. Redirect to Support Tickets page (where AI draft is pre-loaded in the reply editor)
    return NextResponse.redirect(`https://superadmin.classgrid.in/superadmin/talk?ticketId=${ticketId}&autoAssign=true`);
  } catch (err: any) {
    console.error("Create enquiry error:", err);
    return new NextResponse(`Server error: ${err.message}`, { status: 500 });
  }
}
