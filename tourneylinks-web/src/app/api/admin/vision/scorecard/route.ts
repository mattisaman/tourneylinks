import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db, course_holes } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const maxDuration = 60; // AI parsing can take longer

export async function POST(request: Request) {
  try {
     const formData = await request.formData();
     const file = formData.get('file') as File;
     const courseId = parseInt(formData.get('courseId') as string) || 1; // Fallback to course 1 for demo
     
     if (!file) return NextResponse.json({ error: 'Missing scorecard image' }, { status: 400 });

     const bytes = await file.arrayBuffer();
     const buffer = Buffer.from(bytes);
     const base64Image = buffer.toString('base64');

     // Initialize Gemini Vision Engine
     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

     const promptText = `
        You are a golf course architect AI. Analyze this image of a golf scorecard.
        Extract the Pars, Yardages (use the longest/Championship tees if multiple exist), and Handicap ratings for all 18 individual holes.
        Return EXACTLY a raw, minified JSON array in this exact structural format with no markdown blocks or surrounding text whatsoever:
        [
          {"holeNumber": 1, "par": 4, "yardage": 420, "handicapData": 5},
          ...
          {"holeNumber": 18, "par": 5, "yardage": 530, "handicapData": 12}
        ]
     `;

     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            promptText,
            { inlineData: { data: base64Image, mimeType: file.type } }
        ]
     });

     const aiText = response.text || '[]';
     const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
     const parsedGrid = JSON.parse(cleanJson);

     if (!Array.isArray(parsedGrid) || parsedGrid.length !== 18) {
         throw new Error("AI failed to extract exactly 18 structured holes.");
     }

     // Destroy old course logic if any existed
     await db.delete(course_holes).where(eq(course_holes.courseId, courseId));

     // Persist the AI model natively into Postgres sequentially
     const dbInserts = parsedGrid.map((h: any) => ({
         courseId: courseId,
         holeNumber: h.holeNumber,
         par: h.par,
         yardage: h.yardage,
         handicapData: h.handicapData
     }));

     await db.insert(course_holes).values(dbInserts);

     return NextResponse.json({ success: true, holes: dbInserts });

  } catch(err: any) {
     console.error("Vision Error:", err);
     return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
