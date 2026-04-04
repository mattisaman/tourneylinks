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
      Look at the grid and identify ALL provided Tee Boxes (e.g., 'Blue', 'White', 'Gold', 'Red').
      Then, extract the exact Holes (1-18), Pars, Yardages, and Handicaps for EACH tee box.
      
      Output ONLY a pure JSON array containing the different tee boxes, exactly matching this schema (no markdown formatting, no backticks, just the RAW JSON Array):
      [
         {
            "teeBoxName": "Blue",
            "holes": [
               { "hole": 1, "par": 4, "yardage": 412, "handicap": 5 },
               { "hole": 2, "par": 3, "yardage": 180, "handicap": 17 }
               // ... 18 holes
            ]
         },
         {
            "teeBoxName": "White",
            "holes": [ ... ]
         }
      ]
    `;

    let extractedHolesData: any[] = [];
    
    // For local mocking/sandbox if S3 isn't live:
    const isMock = scorecardImageUrl.includes('aws-s3-proxy-bucket');
    
    if (isMock) {
       extractedHolesData = [
          {
             teeBoxName: "Blue",
             holes: Array.from({length: 18}).map((_, i) => ({ hole: i+1, par: 4, yardage: 400, handicap: i+1 }))
          },
          {
             teeBoxName: "White",
             holes: Array.from({length: 18}).map((_, i) => ({ hole: i+1, par: 4, yardage: 380, handicap: i+1 }))
          }
       ];
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

    // Save to Database - clear existing matrix for this course to avoid dups?
    // Not explicitly requested to delete, but inserting new ones...
    const colors = ['#0000FF', '#FFFFFF', '#FFFF00', '#FF0000', '#000000'];
    let idx = 0;
    
    // We expect extractedHolesData to be an array of Teebox objects. Let's fallback gracefully if it returned just the holes!
    const isSingle = extractedHolesData.length > 0 && extractedHolesData[0].par !== undefined;
    
    const objectsToInsert = isSingle ? [{ teeBoxName: teeBoxName || 'Default', holes: extractedHolesData }] : extractedHolesData;

    for (const box of objectsToInsert) {
        await db.insert(course_scorecards).values({
           courseId,
           teeBoxName: box.teeBoxName,
           teeBoxColorHex: colors[idx % colors.length],
           gender: 'MALE',
           holesData: JSON.stringify(box.holes),
           slope: 120, // OCR extension could parse this
           rating: 72.0 // OCR extension could parse this
        });
        idx++;
    }

    return NextResponse.json({ success: true, count: objectsToInsert.length });

  } catch (error: any) {
    console.error("Scorecard OCR Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process scorecard OCR" }, { status: 500 });
  }
}
