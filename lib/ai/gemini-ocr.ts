import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Uses Gemini 1.5 Flash as an advanced Vision and OCR preprocessor for PDF documents.
 * It extracts text and describes charts/images flawlessly.
 */
export async function extractPdfWithGemini(pdfBuffer: Buffer, mimeType: string = "application/pdf"): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Falling back to officeparser for PDF.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a highly advanced Document OCR and Vision Preprocessor.
Your job is to read this document and convert it into clean, structured Markdown text.
CRITICAL INSTRUCTIONS:
1. Extract all text perfectly, maintaining headings and lists.
2. Whenever you encounter a chart, diagram, photograph, or image, insert a block like:
   [IMAGE/CHART DESCRIPTION: <highly detailed description of what the image shows, including all data points if it is a graph>]
3. Do not add conversational filler. Just return the extracted document content.`;

    const pdfPart = {
      inlineData: {
        data: pdfBuffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, pdfPart]);
    const text = result.response.text();
    return text?.trim() || null;
  } catch (error) {
    console.error("[gemini-ocr] Failed to parse PDF with Gemini:", error);
    return null; // Fallback to officeparser if Gemini fails
  }
}

/**
 * Uses Gemini 1.5 Flash Vision to describe an uploaded image.
 * Downloads the image from URL, sends it to Gemini, and returns a text description.
 */
export async function describeImageWithGemini(imageUrl: string, mimeType: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Cannot describe image.");
    return null;
  }

  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`[gemini-ocr] Failed to fetch image from URL: ${imageUrl}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an advanced image analysis assistant. 
Describe EXACTLY what you see in this image in detail. Be accurate and factual.
CRITICAL RULES:
1. Describe ONLY what is actually visible in the image. Do NOT guess or assume anything that is not clearly shown.
2. If it's a screenshot of a website or app, describe the actual UI elements, text, and layout you can see.
3. If it's a photograph, describe the scene, objects, people, buildings, colors, and setting.
4. If it contains text, extract that text accurately.
5. Keep your description concise but thorough (max 300 words).
6. Do NOT invent or fabricate any details that are not visible in the image.`;

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    return text?.trim() || null;
  } catch (error) {
    console.error("[gemini-ocr] Failed to describe image with Gemini:", error);
    return null;
  }
}
