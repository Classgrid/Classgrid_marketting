import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { connectMongo } from "@/lib/mongodb";
import mongoose from "mongoose";

// ── Helper: Detect if an ID is a MongoDB ObjectId (24-char hex) ─────────────
function isMongoObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(req: NextRequest) {
  const escalationId = req.nextUrl.searchParams.get("escalationId");
  const adminEmail = req.nextUrl.searchParams.get("adminEmail"); // Optional

  if (!escalationId) {
    return NextResponse.json({ error: "Missing escalationId parameter" }, { status: 400 });
  }

  try {
    // ── Determine source: MongoDB (Email AI) vs Sanity (Chat AI) ────────────
    const isFromMongoDB = isMongoObjectId(escalationId);
    console.log(`[create-enquiry] escalationId=${escalationId}, isMongoObjectId=${isFromMongoDB}`);

    let doc: any = null;
    let updateSource: "mongodb" | "sanity" = "sanity";

    if (isFromMongoDB) {
      // ── EMAIL AI PATH: Fetch from MongoDB EmailConversation ──────────────
      updateSource = "mongodb";
      console.log(`[create-enquiry] Connecting to MongoDB...`);
      try {
        await connectMongo();
      } catch (mongoErr: any) {
        console.error(`[create-enquiry] MongoDB connection FAILED:`, mongoErr.message);
        return new NextResponse(`MongoDB connection failed: ${mongoErr.message}`, { status: 500 });
      }
      const db = mongoose.connection.db;
      if (!db) {
        console.error(`[create-enquiry] mongoose.connection.db is null after connectMongo()`);
        return new NextResponse("Database connection failed - db is null", { status: 500 });
      }
      console.log(`[create-enquiry] MongoDB connected. Querying emailconversations for ${escalationId}...`);

      const conversation = await db.collection("emailconversations").findOne({
        _id: new mongoose.Types.ObjectId(escalationId),
      });

      console.log(`[create-enquiry] Query result: ${conversation ? 'FOUND' : 'NOT FOUND'}`);

      if (!conversation) {
        return new NextResponse(`Escalation not found in MongoDB (id: ${escalationId})`, { status: 404 });
      }

      // If already has a ticket, redirect
      if (conversation.escalatedTicketId) {
        return NextResponse.redirect(`https://superadmin.classgrid.in/superadmin/talk`);
      }

      // Normalize MongoDB EmailConversation to match the shape the rest of the code expects
      doc = {
        _id: conversation._id.toString(),
        userName: conversation.senderName || "",
        userEmail: conversation.senderEmail || "",
        aiSummary: conversation.sessionContext?.aiSummary || "Email escalation (no AI summary available)",
        subject: conversation.sessionContext?.aiSubject || conversation.subject || "AI Email Escalation",
        deviceInfo: "Email Client",
        chatTranscript: (conversation.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      };

      console.log(`[create-enquiry] Source: MongoDB EmailConversation (${escalationId})`);
    } else {
      // ── CHAT AI PATH: Fetch from Sanity (unchanged) ──────────────────────
      updateSource = "sanity";
      const writeClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: "2024-01-01",
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
      });

      doc = await writeClient.getDocument(escalationId);
      if (!doc) {
        return new NextResponse("Escalation not found", { status: 404 });
      }

      if (doc.enquiryId) {
        // Already created an enquiry, redirect to Support Tickets page
        return NextResponse.redirect(`https://superadmin.classgrid.in/superadmin/talk`);
      }

      console.log(`[create-enquiry] Source: Sanity (${escalationId})`);
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

    // 3. Update the source (MongoDB or Sanity) to mark as handled
    if (updateSource === "mongodb") {
      // Update MongoDB EmailConversation
      await connectMongo();
      const db = mongoose.connection.db;
      if (db) {
        await db.collection("emailconversations").updateOne(
          { _id: new mongoose.Types.ObjectId(escalationId) },
          {
            $set: {
              status: "escalated",
              escalatedTicketId: ticketId,
              updatedAt: new Date(),
            },
          }
        );
        console.log(`[create-enquiry] ✅ Updated MongoDB EmailConversation ${escalationId} → ticket ${ticketId}`);
      }
    } else {
      // Update Sanity (existing Chat AI path)
      const writeClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: "2024-01-01",
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
      });
      await writeClient.patch(escalationId).set({
        status: "enquiry_created",
        enquiryId: ticketId,
        enquiryCreated: true
      }).commit();
      console.log(`[create-enquiry] ✅ Updated Sanity ${escalationId} → ticket ${ticketId}`);
    }

    // 4. Generate AI Draft response using Gemini (primary) + Mistral (fallback)
    const formattedTranscript = doc.chatTranscript?.map((t: any) => `${t.role}: ${t.content}`).join("\n") || "";
    const draftPrompt = `
      You are an expert customer success manager and support specialist for Classgrid (an educational SaaS platform for schools, colleges, and coaching institutes).
      A user was just chatting with our AI Support Agent, and their conversation has now been assigned to YOU to officially solve as a human specialist.
      
      User Email: ${doc.userEmail}
      AI Summary of Issue: ${doc.aiSummary}
      Transcript:
      ${formattedTranscript}

      Requirements:
      - Start with "Hi," or "Hello [name],"
      - Introduce yourself using the exact placeholder [ADMIN_NAME] (e.g. "I am [ADMIN_NAME] from Classgrid...").
      - CAREFULLY read the attached Transcript. Our AI agent already retrieved RAG knowledge and platform details to answer the user. Use that exact knowledge and context to formulate your response!
      - Provide the ACTUAL solution/answer to their problem directly in the email. Solve it right now based on the transcript's context.
      - NEVER say "I am forwarding this to our internal team," "I am escalating this," or "I will pass this to a specialist." The ticket is ALREADY escalated, and YOU are the specialist solving it.
      - Do not apologize for the AI or mention the AI handing it over. Just seamlessly pick up the conversation and provide the fix.
      - If you truly need more information to solve it, ask for it clearly.
      - Tone: Professional, highly knowledgeable, empathetic, and concise.
      - Output ONLY the email body text. Do not include subject lines or extra commentary.
      - End the email with "Best regards, [ADMIN_NAME]".
    `;

    const providers = [
      {
        name: "groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: process.env.GROQ_API_KEY?.trim() || "",
        model: "openai/gpt-oss-120b",
      },
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
        model: process.env.MISTRAL_MODEL?.trim() || "open-mistral-nemo",
      },
      {
        name: "mistral-fallback",
        url: "https://api.mistral.ai/v1/chat/completions",
        apiKey: process.env.MISTRAL_API_KEY_2?.trim() || "",
        model: process.env.MISTRAL_MODEL?.trim() || "open-mistral-nemo",
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

    // 6. Redirect to Support Tickets page (where AI draft is pre-loaded in the reply editor)
    return NextResponse.redirect(`https://superadmin.classgrid.in/superadmin/talk?ticketId=${ticketId}&autoAssign=true`);
  } catch (err: any) {
    console.error("Create enquiry error:", err);
    return new NextResponse(`Server error: ${err.message}`, { status: 500 });
  }
}
