import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { RagChunk } from "@/lib/models/RagChunk";
import { embedText } from "@/lib/ai/embedding";

export async function GET(req: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI as string);
    }
    
    // 1. Delete fake chunks
    const delResult1 = await RagChunk.deleteMany({ documentType: "fake-test-document" });
    const delResult2 = await RagChunk.deleteMany({ documentId: "test_document_001" });
    const delResult3 = await RagChunk.deleteMany({ pageSlug: "about-us" });
    
    // 2. Add real about-us chunks
    const realContent = `
About Us
We build the infrastructure that lets educators focus on education.

Our Story
The journey started during my first semester of engineering college when I experienced how difficult and outdated educational management systems still were in many institutions. Assignments were submitted completely offline, attendance tracking was unclear, and there was no proper all-in-one platform for students, teachers, and administration. Different departments worked separately without a connected system, making communication and management inefficient. Seeing these everyday problems inspired me to build a better digital solution for educational institutions.

What began as a simple idea to improve classroom management gradually evolved into a complete platform for schools, colleges, coaching institutes, and engineering campuses. The goal is to create a secure and modern ecosystem where attendance, assignments, communication, and administration can all be managed in one place through an AI-integrated ERP and CMS platform.

— Nikhil Shinde, Founder of Classgrid

What is ClassGrid?
ClassGrid is a complete management software (ERP) for schools, junior colleges, and coaching centers. Instead of using paper, ClassGrid puts your entire institution on one easy website and mobile app. We offer many powerful modules to handle everything from student attendance and fees to exams, parent messages, and managing staff hierarchy across different branches.

What We Do
We make running a school, coaching center, or junior college very easy. Our software and mobile apps automatically do the hard work for you. We collect fees online, track who came to class, send instant messages to parents, and create beautiful report cards. If you have multiple branches, our smart hierarchy system lets you manage them all from a single dashboard.

Why Choose Us?
Most educational software is old, slow, and hard to use. ClassGrid is different. It is super fast, has dedicated mobile apps for parents and teachers, and is as easy to use as your favorite social media app. Whether you run a single coaching center, a junior college, or a massive network of 25 branches, ClassGrid works perfectly for you and keeps all your data safe.

Mission & Vision
Our Mission
To help schools, colleges, coaching institutes, and engineering institutions transition from outdated manual systems to smart digital management through secure, AI-powered technology.

Our Vision
To make modern digital education management accessible to every institution in India, especially in Maharashtra, by creating intelligent, secure, and connected systems for the future of education.

Core Values
What We Stand For
Trust Before Everything
Student data, institutional workflows, and operational reliability are handled with security, responsibility, and long-term trust at the core of every system.
    `.trim();

    const chunk1 = realContent.substring(0, realContent.indexOf("Mission & Vision")).trim();
    const chunk2 = realContent.substring(realContent.indexOf("Mission & Vision")).trim();

    const emb1 = await embedText(chunk1);
    const emb2 = await embedText(chunk2);

    const docId = `about-us-${Date.now()}`;

    await RagChunk.create({
      documentId: docId,
      documentType: "page",
      chunkIndex: 0,
      chunkText: chunk1,
      pageSlug: "about-us",
      pageTitle: "About Us",
      section: "Our Story & What is Classgrid",
      contentType: "markdown",
      embedding: emb1,
      embeddingModel: "Xenova/all-MiniLM-L6-v2",
      embeddingDimensions: 384,
    });

    await RagChunk.create({
      documentId: docId,
      documentType: "page",
      chunkIndex: 1,
      chunkText: chunk2,
      pageSlug: "about-us",
      pageTitle: "About Us",
      section: "Mission, Vision, Values",
      contentType: "markdown",
      embedding: emb2,
      embeddingModel: "Xenova/all-MiniLM-L6-v2",
      embeddingDimensions: 384,
    });

    const forumChunks = await RagChunk.find({ chunkText: { $regex: /forum is not yet launched/i } });
    let updatedForumChunks = 0;
    for (const chunk of forumChunks) {
      chunk.chunkText = chunk.chunkText.replace(/The ClassGrid Forum is not yet launched.*?\./gi, "The ClassGrid Forum is officially launched and live at https://forum.classgrid.in!");
      chunk.chunkText = chunk.chunkText.replace(/ClassGrid Forum is not yet launched/gi, "ClassGrid Forum is officially launched and live at https://forum.classgrid.in!");
      await chunk.save();
      updatedForumChunks++;
    }
    
    // Also try finding it by just 'upcoming community forum'
    const forumChunks2 = await RagChunk.find({ chunkText: { $regex: /upcoming community forum/i } });
    for (const chunk of forumChunks2) {
      chunk.chunkText = chunk.chunkText.replace(/not yet launched.*?\./gi, "officially launched and live at https://forum.classgrid.in!");
      chunk.chunkText = chunk.chunkText.replace(/upcoming community forum/gi, "live community forum");
      await chunk.save();
      updatedForumChunks++;
    }

    return NextResponse.json({
      success: true,
      deletedFakes: delResult1.deletedCount + delResult2.deletedCount,
      deletedOldAbout: delResult3.deletedCount,
      updatedForumChunks,
      message: "Fake history removed, real About Us content injected, and Forum launch status updated."
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
