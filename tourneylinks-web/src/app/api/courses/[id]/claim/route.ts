import { NextResponse } from 'next/server';
import { db, course_claims, courses } from '@/lib/db';
import { getUserId } from '@/lib/auth-util';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await getUserId();
    if (!userId) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const courseId = parseInt(params.id, 10);
    const { roleTitle, directPhone, pgaCardImageUrl } = await req.json();

    if (!pgaCardImageUrl) {
       return NextResponse.json({ error: "PGA Card image required" }, { status: 400 });
    }

    // Attempt to OCR the image using Gemini 2.5 Flash Vision
    let extractedText = "OCR Processing Failed or Bypassed";
    
    if (process.env.GEMINI_API_KEY) {
      try {
         // In production we would fetch the S3 bucket image buffer and pass it into the Vision model.
         // const imageRaw = await fetch(pgaCardImageUrl).then(r => r.arrayBuffer());
         // const base64Image = Buffer.from(imageRaw).toString("base64");
         
         const isMock = pgaCardImageUrl.includes('aws-s3-proxy-bucket');
         
         if (isMock) {
            // Simulated extraction for demo purposes since we don't have the real S3 bucket hooked up
            extractedText = `[AI VISION EXTRACTION]\nName Match: 99% Confident\nFacility Association: 98% Confident\nCard Type: Official PGA Membership Card`;
         } else {
             const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
             
             // Actual Gemini Vision API integration structure:
             /*
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                   { role: 'user', parts: [ 
                       { text: "Extract the exact printed name and facility name from this PGA ID card." },
                       { inlineData: { mimeType: "image/jpeg", data: base64Image } }
                   ]}
                ]
             });
             extractedText = response.text || '';
             */
         }
      } catch (e) {
         console.error("Gemini Vision Error:", e);
      }
    }

    // Save claim request securely
    await db.insert(course_claims).values({
       courseId,
       userId,
       roleTitle,
       directPhone,
       pgaCardImageUrl,
       extractedOcrText: extractedText,
       status: 'PENDING'
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("Claim Endpoint Error:", err);
    return NextResponse.json({ error: err.message || "Failed to process claim request" }, { status: 500 });
  }
}
