import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { courseName, players, type } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    // Initialize the official Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Construct the context-heavy super prompt
    const prompt = `
      You are an elite, high-end Golf Tournament Director. 
      The user is organizing a ${type || 'charity'} golf tournament at ${courseName || 'a private country club'} for approximately ${players || 144} players.
      
      Task:
      Estimate the average per-player hardware cost (greens fee + cart + banquet dining) for this specific venue. 
      Then, calculate a recommended primary registration fee that yields at least a 30% net profit margin on the ticket itself before sponsorships.
      
      Output ONLY a pure JSON object (no markdown formatting, no backticks) with the following exactly:
      {
         "rawCost": 120,
         "recommendedPrice": 200,
         "demographicNote": "A 1-sentence analytical explanation of why this price fits this venue's tier."
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const outputText = response.text || '';
    
    // Safely parse the JSON
    let parsed: any = {};
    try {
      const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("AI JSON Parse Error:", outputText);
      return NextResponse.json({ error: "AI output was not valid JSON." }, { status: 500 });
    }

    return NextResponse.json(parsed, { status: 200 });

  } catch (error: any) {
    console.error("Price Engine Error:", error);
    return NextResponse.json({ error: error.message || "Unknown server error" }, { status: 500 });
  }
}
