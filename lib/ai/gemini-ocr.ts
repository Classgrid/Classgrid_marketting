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
