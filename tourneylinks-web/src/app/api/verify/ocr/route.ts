import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-util';
import { db, users, ghin_history } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

// Instantiate the Official Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    // 1. Authenticate the User
    const { userId } = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the Multimodal Image Payload
    const { base64Image } = await request.json();
    if (!base64Image) {
      return NextResponse.json({ error: 'Missing image payload' }, { status: 400 });
    }

    // The frontend sends something like: data:image/png;base64,iVBORw0KGgo...
    const mimeType = base64Image.split(';')[0].split(':')[1];
    const base64Data = base64Image.split(',')[1];

    // 3. Command the Google Gemini 2.5 Flash Vision Engine
    const prompt = `
      You are an expert Golf Tournament Director and OCR engine.
      Analyze this image. It should be a USGA GHIN Handicap app screenshot or physical card.
      Find the following three exact data points:
      1. GHIN Number (usually 6 to 8 digits)
      2. Player Last Name
      3. Handicap Index (a decimal number, e.g., 12.4, +1.2, or 0.0. "NH" means No Handicap)

      Return EXACTLY AND STRICTLY a valid JSON object with NO markdown formatting, NO backticks, and NO wrapping text. Format:
      {
        "ghin": "1234567",
        "lastName": "Smith",
        "handicapIndex": 12.4,
        "isValid": true
      }
      If the image is completely unreadable or clearly NOT a golf handicap card, return { "isValid": false }.
    `;

    if (!process.env.GEMINI_API_KEY) {
      console.error('CRITICAL: GEMINI_API_KEY missing from .env.local');
      return NextResponse.json({ error: 'System architecture missing GEMINI_API_KEY in .env.local' }, { status: 500 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ],
      config: {
        temperature: 0.1, // Near-zero temperature for absolute OCR determinism
      }
    });

    const outputText = response.text || '';
    
    // 4. Parse the AI JSON Output
    let aiData;
    try {
      // Strip any accidental markdown injection just in case
      const cleanJson = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      aiData = JSON.parse(cleanJson);
    } catch (e) {
      console.error('Gemini JSON Parse Error:', outputText);
      return NextResponse.json({ error: 'AI encountered an error parsing the image. Please try a clearer screenshot.' }, { status: 500 });
    }

    if (!aiData.isValid || typeof aiData.handicapIndex !== 'number') {
      return NextResponse.json({ error: 'Could not verify a valid USGA Handicap in this image. Ensure it is a clear screenshot of the GHIN app.' }, { status: 400 });
    }

    // 5. Database Commit Strategy
    // Find internal User ID
    const dbUser = await db.select().from(users).where(eq(users.clerkId, userId)).then(res => res[0]);
    
    if (!dbUser) {
      return NextResponse.json({ error: 'Database mismatch. Re-login to sync profile.' }, { status: 401 });
    }

    // Update their primary Master Profile
    await db.update(users)
      .set({ 
        verifiedGhin: aiData.ghin,
        handicapIndex: aiData.handicapIndex
      })
      .where(eq(users.id, dbUser.id));

    // Inject into the deeply-audited GHIN History Ledger
    await db.insert(ghin_history).values({
      userId: dbUser.id,
      handicapIndex: aiData.handicapIndex,
      proofImageUrl: 'base64_blob_placeholder' // In enterprise deployment, pipe the base64 to an S3 bucket here
    });

    // 6. Return Victory Response to Client UI
    return NextResponse.json({ 
      success: true, 
      ghin: aiData.ghin,
      lastName: aiData.lastName,
      handicapIndex: aiData.handicapIndex 
    });

  } catch (error: any) {
    console.error('OCR Verification Fatal Crash:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
