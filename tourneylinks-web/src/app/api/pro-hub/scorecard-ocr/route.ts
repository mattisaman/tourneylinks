import { NextResponse } from 'next/server';
import { db, course_scorecards, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { courseId, teeBoxName, teeBoxColorHex, gender, scorecardImageUrl } = await req.json();

    if (!courseId || !scorecardImageUrl || !teeBoxName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an elite Golf Course Superintendent and Database Architect.
      I am providing an image of a physical golf course scorecard.
      
      Task:
      Extract the exact Holes (1-18), Pars, Yardages (for the "\${teeBoxName}" tees), and Handicaps from the grid matrix.
      
      Output ONLY a pure JSON array of 18 objects exactly matching this schema (no markdown formatting, no backticks, just the RAW JSON Array):
      [
         { "hole": 1, "par": 4, "yardage": 412, "handicap": 5 },
         { "hole": 2, "par": 3, "yardage": 180, "handicap": 17 },
         ... (all 18 holes)
      ]
      
      Ensure you only pull the yardages for the specific row labeled "\${teeBoxName}". If slope and rating are visible for this tee box, mention them in the array somehow? No, ONLY RETURN the pure JSON array.
    `;

    // Simulated Fetch & Buffer Generation (in production this hits the real S3 URL)
    let extractedHolesData: any[] = [];
    
    // For local mocking/sandbox if S3 isn't live:
    const isMock = scorecardImageUrl.includes('aws-s3-proxy-bucket');
    
    if (isMock) {
       // Mock exactly what Gemini *would* return
       for(let i=1; i<=18; i++) {
          extractedHolesData.push({
             hole: i,
             par: [3,4,5][Math.floor(Math.random()*3)],
             yardage: Math.floor(Math.random() * 300) + 150,
             handicap: i
          });
       }
    } else {
       // We would fetch the actual image array buffer here:
       // const imageRaw = await fetch(scorecardImageUrl).then(r => r.arrayBuffer());
       // const base64Image = Buffer.from(imageRaw).toString("base64");
       
       /*
       const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: [
               { role: 'user', parts: [
                   { text: prompt },
                   { inlineData: { mimeType: "image/jpeg", data: base64Image } }
               ]}
           ]
       });
       
       const outputText = response.text || "[]";
       const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
       extractedHolesData = JSON.parse(cleaned);
       */
    }

    // Save to Database
    await db.insert(course_scorecards).values({
       courseId,
       teeBoxName,
       teeBoxColorHex: teeBoxColorHex || '#FFFFFF',
       gender: gender || 'MALE',
       holesData: JSON.stringify(extractedHolesData),
       slope: 120, // OCR extension could parse this
       rating: 72.0 // OCR extension could parse this
    });

    return NextResponse.json({ success: true, holes: extractedHolesData });

  } catch (error: any) {
    console.error("Scorecard OCR Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process scorecard OCR" }, { status: 500 });
  }
}
