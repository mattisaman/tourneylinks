import React from 'react';
import { db, tournaments, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-util';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function TournamentSecurityLayout({ 
    children, 
    params 
}: { 
    children: React.ReactNode, 
    params: Promise<{ id: string }> 
}) {
    // 1. Ensure active Clerk Session
    const clerkUser = await getCurrentUser();
    if (!clerkUser) redirect('/sign-in');

    // 2. Resolve to PostgreSQL User Identity
    const dbUserRow = await db.select().from(users).where(eq(users.clerkId, clerkUser.id)).limit(1);
    const dbUser = dbUserRow[0];
    if (!dbUser) redirect('/sign-in');

    // 3. Resolve requested Tournament ID string
    const { id } = await params;
    const tId = parseInt(id, 10);
    if (isNaN(tId)) redirect('/admin');

    // 4. Fetch the requested Tournament
    const tRow = await db.select().from(tournaments).where(eq(tournaments.id, tId)).limit(1);
    const tourney = tRow[0];

    // If tournament doesn't exist, kick out gracefully
    if (!tourney) redirect('/admin');

    // 5. SECURITY AUDIT: ** IDOR Authorization Check **
    // Prevent malicious URL mutation from accessing other tenants' data
    if (process.env.NODE_ENV === 'production' && tourney.hostUserId !== dbUser.id) {
       console.error(`[SECURITY ALERT] User ${dbUser.id} attempted to access unauthorized tournament ${tId}`);
       redirect('/admin');
    }

    // 6. Security clearance granted, render the actual dashboard page underneath
    const mockTournaments = [{ id: tId, name: tourney.name }];
    
    return (
        <div className="flex h-screen bg-[#050b08] relative overflow-hidden" style={{ paddingTop: '90px' }}>
           <AdminSidebar tournamentId={tId} mockTournaments={mockTournaments} />
           <div className="flex-1 flex flex-col relative h-full overflow-y-auto bg-[#FDFBF7] rounded-tl-3xl shadow-[-10px_0_40px_rgba(0,0,0,0.5)]">
               {children}
           </div>
        </div>
    );
}
