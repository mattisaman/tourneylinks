import { NextResponse } from 'next/server';
import { db, tournaments, users } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth-util';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
   try {
      const { id } = await context.params;
      const tournamentId = parseInt(id, 10);
      if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

      const clerkUser = await getCurrentUser();
      if (!clerkUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      // Verify the user owns the tournament
      const dbUsers = await db.select().from(users).where(eq(users.clerkId, clerkUser.id));
      if (!dbUsers.length) return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
      const hostDbUserId = dbUsers[0].id;

      const [tournament] = await db.select().from(tournaments).where(
         and(eq(tournaments.id, tournamentId), eq(tournaments.hostUserId, hostDbUserId))
      );

      if (!tournament) return NextResponse.json({ error: 'Tournament not found or unowned' }, { status: 404 });

      // Parse payload
      const body = await req.json();
      const { cause, payoutInfo } = body;

      if (!cause || !payoutInfo) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

      // Update tournament to pending status
      await db.update(tournaments)
         .set({ 
            golfApplicationStatus: 'pending',
            golfApplicationData: JSON.stringify({ cause, payoutInfo: payoutInfo }),
         })
         .where(eq(tournaments.id, tournamentId));

      // 1. Perform a pre-flight AI Check on the application details
      let aiVerdictHTML = `<div style="background: #f0f0f0; padding: 1rem; border-left: 4px solid #999; color: #555;"><i>AI Pre-screening System Unavailable or Failed.</i></div>`;
      
      try {
         const { GoogleGenAI } = await import('@google/genai');
         const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
         const prompt = `You are a compliance pre-screener for a 501(c)(3) Fiscal Sponsorship foundation. 
A tournament host is applying to use our treasury to collect funds.
Cause Provided: "${cause}"
Disbursement Details Provided: "${payoutInfo}"
Please provide a 1-to-2 sentence verdict analyzing if this looks like a legitimate charitable endeavor or if it raises red flags (fraud, vague, for-profit phrasing, etc.). Start your sentence with "VERDICT: ".`;

         const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
         let verdict = response.text || "No AI logic returned.";
         
         const isFlagged = verdict.toLowerCase().includes('red flag') || verdict.toLowerCase().includes('caution');
         aiVerdictHTML = `<div style="padding: 1rem; border-left: 4px solid ${isFlagged ? '#ef4444' : '#10b981'}; background: ${isFlagged ? '#fef2f2' : '#ecfdf5'}; color: #1f2937; border-radius: 4px;">
            <p style="margin:0; font-size: 0.9rem; font-weight: 700; color: ${isFlagged ? '#ef4444' : '#10b981'}">AI Pre-Flight Analysis</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; line-height: 1.5;">${verdict.replace('VERDICT: ', '')}</p>
         </div>`;
      } catch (err) {
         console.error('AI Check failed:', err);
      }

      // 2. Dispatch email securely to info@tourneylinks.com with the AI verdict & Inline Action Buttons!
      if (process.env.RESEND_API_KEY) {
         // Construct Secure Action URLs
         const adminToken = process.env.ADMIN_SECRET_KEY || 'MISSING_TOKEN';
         // In local dev, use localhost. In prod, use the window origin (hardcoded production domain)
         const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://tourneylinks.com';
         
         const approveUrl = `${baseUrl}/api/admin/tournaments/${tournament.id}/approve?token=${adminToken}`;
         const denyUrl = `${baseUrl}/api/admin/tournaments/${tournament.id}/deny?token=${adminToken}`;

         await resend.emails.send({
            to: 'info@tourneylinks.com',
            from: 'noreply@tourneylinks.com',
            subject: `[ACTION REQUIRED] New 501(c)(3) App: "${tournament.name}"`,
            html: `
               <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                  <h2 style="color: #1a1a1a;">Sponsorship Application Pending</h2>
                  <p><strong>Host:</strong> ${clerkUser.firstName} ${clerkUser.lastName}</p>
                  <p><strong>Tournament ID:</strong> #${tournament.id}</p>
                  <p><strong>Tournament Name:</strong> ${tournament.name}</p>
                  
                  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 1.5rem 0;" />
                  
                  ${aiVerdictHTML}

                  <h4 style="margin-top: 2rem; margin-bottom: 0.5rem; color: #1a1a1a;">Declared Charitable Cause:</h4>
                  <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 6px;">${cause}</div>

                  <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #1a1a1a;">Disbursement Path / Entity Info:</h4>
                  <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 6px;">${payoutInfo}</div>
                  
                  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 2rem 0;" />
                  
                  <div style="text-align: center; background: #f0f0f0; padding: 2rem; border-radius: 8px;">
                     <h3 style="margin-top: 0;">1-Click Administrative Action</h3>
                     <p style="font-size: 0.85rem; color: #666; margin-bottom: 1.5rem;">Clicking these buttons will instantly mutate the database and send the Host down the corresponding flow.</p>
                     
                     <div style="display: flex; justify-content: center; gap: 1rem;">
                        <a href="${approveUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">✅ APPROVE (Connect Treasury)</a>
                        <a href="${denyUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">❌ DENY (Revert to Standard)</a>
                     </div>
                  </div>
               </div>
            `
         }).catch(console.error);
      } else {
         console.warn("RESEND_API_KEY not found. Email not dispatched to info@tourneylinks.com.");
      }

      return NextResponse.json({ success: true });
   } catch (error: any) {
      console.error('Apply GOLF API Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
}
