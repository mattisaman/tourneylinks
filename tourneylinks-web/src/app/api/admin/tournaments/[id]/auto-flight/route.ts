import { NextResponse } from 'next/server';
import { db, registrations } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const rawParams = await props.params;
    const tournamentId = parseInt(rawParams.id, 10);
    
    // Fetch all registrations for this tournament
    const allRegs = await db.select().from(registrations).where(eq(registrations.tournamentId, tournamentId));
    
    const playersPayload = allRegs.map(r => ({
      id: r.id,
      name: r.name,
      handicap: r.handicap,
      pairingRequest: r.pairingRequest,
    }));

    if (playersPayload.length === 0) {
      return NextResponse.json({ error: 'No registrations found' }, { status: 400 });
    }

    const prompt = `
You are an expert Math/Golf Director. Create groups of exactly 4 players. 
Constraint 1: Anyone with matching 'pairingRequest' names must be grouped together in the same foursome. Look closely at mutual requests.
Constraint 2: Distribute the remaining singles so that the average total 'handicap' of every Foursome is as close to mathematically equal as possible across all teams.

Here are the players:
${JSON.stringify(playersPayload, null, 2)}

Return a JSON object containing a "teams" array. Each team must be an array of EXACTLY 4 player IDs.
Example Format:
{
  "teams": [
    [1, 2, 8, 9],
    [3, 4, 5, 10]
  ]
}
Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonStr = (response.text || '')
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(jsonStr);

    // Update database
    if (parsed.teams && Array.isArray(parsed.teams)) {
      for (let teamIndex = 0; teamIndex < parsed.teams.length; teamIndex++) {
        const playerIds = parsed.teams[teamIndex];
        // Team Index is 1-based (Flight 1, 2, 3...)
        for (const playerId of playerIds) {
          await db.update(registrations)
            .set({ assignedTeam: teamIndex + 1 })
            .where(eq(registrations.id, playerId));
        }
      }
    }

    return NextResponse.json({ success: true, teams: parsed.teams });

  } catch (error) {
    console.error('Auto-flight error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
