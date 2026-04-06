import { redirect } from 'next/navigation';
import { db, tournaments } from '@/lib/db';
import { eq } from 'drizzle-orm';

export default async function AdminPortalPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ token: string }> }) {
   const params = await props.params;
   const searchParams = await props.searchParams;
   const tournamentId = parseInt(params.id, 10);
   const token = searchParams.token;

   // 1. Secure the interface
   if (!process.env.ADMIN_SECRET_KEY || token !== process.env.ADMIN_SECRET_KEY) {
      return (
         <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fafafa' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
               <h1 style={{ color: '#d32f2f', marginTop: 0 }}>Access Denied 🔒</h1>
               <p style={{ color: '#666' }}>Invalid or missing authentication token.</p>
            </div>
         </div>
      );
   }

   // 2. Fetch tournament
   if (isNaN(tournamentId)) return <div>Invalid ID</div>;
   const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, tournamentId));
   
   if (!tournament) {
      return <div>Tournament Not Found</div>;
   }

   // Helper for parsing application data
   let applicationData = { cause: 'None provided', payoutInfo: 'None provided' };
   try {
      if (tournament.golfApplicationData) {
         applicationData = JSON.parse(tournament.golfApplicationData);
      }
   } catch(e) {}

   const approveUrl = `/api/admin/tournaments/${tournament.id}/approve?token=${token}`;
   const denyUrl = `/api/admin/tournaments/${tournament.id}/deny?token=${token}`;

   return (
      <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: '4rem auto', color: '#1a1a1a', background: '#fff', borderRadius: '12px', padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
         <div style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Fiscal Sponsorship Application</div>
               <h1 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem' }}>{tournament.name}</h1>
            </div>
            <div style={{ background: tournament.golfApplicationStatus === 'pending' ? '#fef3c7' : '#f3f4f6', color: tournament.golfApplicationStatus === 'pending' ? '#92400e' : '#374151', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize' }}>
               {tournament.golfApplicationStatus || 'Standard'}
            </div>
         </div>

         <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1a1a1a' }}>Application Details</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
               <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>Declared Charitable Cause:</div>
               <div style={{ background: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid #eaeaea', lineHeight: 1.5 }}>
                  {applicationData.cause}
               </div>
            </div>

            <div>
               <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', marginBottom: '0.4rem' }}>Disbursement Path / Entity Info:</div>
               <div style={{ background: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid #eaeaea', lineHeight: 1.5 }}>
                  {applicationData.payoutInfo}
               </div>
            </div>
         </div>

         {tournament.golfApplicationStatus === 'pending' ? (
            <div style={{ textAlign: 'center', background: '#fdfbf7', padding: '2rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
               <h3 style={{ marginTop: 0, fontSize: '1.2rem' }}>Take Action</h3>
               <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>Please review the details above. You must explicitly approve or deny this application to unlock the host's campaign.</p>
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <a href={approveUrl} style={{ background: '#10b981', color: 'white', padding: '14px 28px', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s' }}>✅ Confirm Approval</a>
                  <a href={denyUrl} style={{ background: '#ef4444', color: 'white', padding: '14px 28px', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s' }}>❌ Reject Application</a>
               </div>
            </div>
         ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
               This application has already been processed and its status is frozen.
            </div>
         )}
      </div>
   );
}
