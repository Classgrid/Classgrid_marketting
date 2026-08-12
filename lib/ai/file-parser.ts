import officeParser from 'officeparser';

/**
 * Downloads a file from a URL and extracts its text content if it's a supported format (PDF, PPTX, DOCX, XLSX).
 */
export async function extractTextFromAttachment(url: string, mimeType: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch attachment from URL: ${url}, status: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // OfficeParser supports PDF, DOCX, PPTX, XLSX, ODT, ODP, ODS
    const text = await officeParser.parseOfficeAsync(buffer);
    return text?.trim() || null;
  } catch (error) {
    console.error("Error parsing attachment:", error);
    return null;
  }
}
