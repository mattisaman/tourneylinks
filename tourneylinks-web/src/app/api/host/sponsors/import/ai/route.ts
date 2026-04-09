import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@clerk/nextjs/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { base64Data, mimeType } = body;

    if (!base64Data || !mimeType) {
      return NextResponse.json({ error: 'Missing document data' }, { status: 400 });
    }

    const prompt = `You are a strict data extraction OCR intelligence engine for a Golf Tournament Sponsorship CRM. 
You have been provided with an image of a spreadsheet, handwritten list, or raw text document containing potential sponsors.
Your ONLY job is to extract the company names, potential expected sponsorship values (if they exist), and any contact names.

Return a STRICT, RAW JSON array matching this exact schema:
[
  { 
    "companyName": "string",
    "expectedValue": number (in cents! e.g., $5,000 = 500000. Use 0 if not provided),
    "contactName": "string" (or null if not provided)
  }
]

Do not include any string wrappers like \`\`\`json or explanation text. Just the raw array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    const outputText = response.text || "[]";
    // Sanitize any accidental markdown codeblock wrappers
    const sanitizedOutput = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData = [];
    try {
      parsedData = JSON.parse(sanitizedOutput);
    } catch (parseError) {
      console.error('Failed to parse Gemini output:', sanitizedOutput);
      return NextResponse.json({ error: 'Failed to parse AI output into JSON' }, { status: 500 });
    }

    return NextResponse.json({ leads: parsedData });

  } catch (error) {
    console.error('Failed to intelligently parse document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
