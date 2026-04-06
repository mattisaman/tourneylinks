import { NextResponse } from 'next/server';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
   try {
      const url = new URL(req.url);
      const token = url.searchParams.get('token');
      
      // Secure the route with the environment secret
      if (!process.env.ADMIN_SECRET_KEY || token !== process.env.ADMIN_SECRET_KEY) {
         return new NextResponse(`
            <html><body style="font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #fafafa;">
               <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
                  <h1 style="color: #d32f2f; margin-top: 0;">Access Denied 🔒</h1>
                  <p style="color: #666;">Invalid or missing authentication token.</p>
               </div>
            </body></html>
         `, { status: 401, headers: { 'Content-Type': 'text/html' } });
      }

      const { id } = await context.params;
      const tournamentId = parseInt(id, 10);
      if (isNaN(tournamentId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

      // Morph the GOLF applicant to approved! 
      // (Optionally in the future, automatically provision the Foundation's Stripe Account ID here into the DB)
      await db.update(tournaments)
         .set({ 
            golfApplicationStatus: 'approved',
            charityType: 'golf_sponsored'
         })
         .where(eq(tournaments.id, tournamentId));

      return new NextResponse(`
         <html><body style="font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #e0f2f1;">
            <div style="background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,100,50,0.1); text-align: center; max-width: 400px;">
               <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
               <h1 style="color: #2e7d32; margin-top: 0;">Treasury Attached!</h1>
               <p style="color: #555; line-height: 1.5;">Tournament <strong>#${tournamentId}</strong> has been successfully approved for Gateway Links Foundation Sponsorship.</p>
               <p style="color: #777; font-size: 0.85rem; margin-top: 1.5rem;">The Host can now process Registrations directly into the Foundation's treasury. You may close this window.</p>
            </div>
         </body></html>
      `, { status: 200, headers: { 'Content-Type': 'text/html' } });
      
   } catch (error: any) {
      console.error('Approve Workflow Error:', error);
      return new NextResponse("Internal Server Error", { status: 500 });
   }
}
