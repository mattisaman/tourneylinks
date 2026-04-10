import React from 'react';
import { db, tournaments, courses, missing_links } from '@/lib/db';
import { sql, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Tooltip } from '@/components/ui/Tooltip';

export const dynamic = 'force-dynamic';

async function acceptMissingLink(formData: FormData) {
  'use server';
  const idStr = formData.get('linkId') as string;
  if (!idStr) return;
  const linkId = parseInt(idStr, 10);
  
  const links = await db.select().from(missing_links).where(eq(missing_links.id, linkId));
  const linkRecord = links[0];
  if (!linkRecord) return;

  if (linkRecord.tournamentId) {
    await db.update(tournaments)
      .set({ registrationUrl: linkRecord.submittedUrl })
      .where(eq(tournaments.id, linkRecord.tournamentId));
  } else if (linkRecord.courseId) {
    await db.update(courses)
      .set({ website: linkRecord.submittedUrl })
      .where(eq(courses.id, linkRecord.courseId));
  }

  await db.update(missing_links)
    .set({ status: 'APPROVED' })
    .where(eq(missing_links.id, linkId));
  
  revalidatePath('/system/dashboard/quality');
}

async function approveGolfApplication(formData: FormData) {
  'use server';
  const idStr = formData.get('tournamentId') as string;
  if (!idStr) return;
  const tId = parseInt(idStr, 10);

  const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, tId));
  if (!tournament) return;

  if (tournament.hostUserId) {
     const { stripe_accounts } = await import('@/lib/db');
     await db.delete(stripe_accounts).where(eq(stripe_accounts.userId, tournament.hostUserId));
  }

  await db.update(tournaments)
    .set({ 
       golfApplicationStatus: 'approved',
       isCharity: true,
       charityName: 'G.O.L.F. Foundation'
    })
    .where(eq(tournaments.id, tId));
  
  revalidatePath('/system/dashboard/quality');
}

export default async function QualityControlDashboard() {
  
  const pendingLinks = await db.select().from(missing_links).where(sql`${missing_links.status} = 'PENDING'`).orderBy(desc(missing_links.createdAt));
  const pendingApplications = await db.select().from(tournaments).where(eq(tournaments.golfApplicationStatus, 'pending')).orderBy(desc(tournaments.createdAt));

  return (
    <div>
        <style dangerouslySetInnerHTML={{__html: `
          .lux-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
          .lux-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) !important; }
          .lux-btn { transition: transform 0.2s; }
          .lux-btn:hover { transform: translateY(-2px); }
        `}} />
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--forest)' }}>Quality Control</h1>
          <p style={{ color: 'var(--mist)', margin: 0 }}>Human-in-the-Loop AI Corrections & Compliance Offloading</p>
        </div>

        {/* Pending Crowdsourced Links */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)' }}>Action Required: Submitted URLs</h2>
             <span style={{ background: pendingLinks.length > 0 ? 'rgba(230, 194, 122, 0.2)' : 'rgba(0,0,0,0.05)', color: pendingLinks.length > 0 ? 'var(--gold-dark)' : 'var(--mist)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
               {pendingLinks.length} Pending
             </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {pendingLinks.map(link => (
                <div key={link.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', padding: '1.25rem 1.5rem', borderRadius: '8px', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--shadow-sm)' }}>
                   
                   <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Submitted</div>
                      <div style={{ color: 'var(--forest)', fontWeight: 600 }}>{new Date(link.createdAt || '').toLocaleDateString()}</div>
                   </div>

                   <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Entity Target</div>
                      <div style={{ color: 'var(--forest)', fontWeight: 600 }}>
                         {link.tournamentId ? `Tournament ID: ${link.tournamentId}` : ''}
                         {link.courseId ? `Course ID: ${link.courseId}` : ''}
                      </div>
                   </div>

                   <div style={{ flex: 2 }}>
                      <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Proposed URL</div>
                      <a href={link.submittedUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dark)', textDecoration: 'underline', fontWeight: 600 }}>{link.submittedUrl}</a>
                   </div>

                   <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <form action={acceptMissingLink}>
                        <input type="hidden" name="linkId" value={link.id} />
                        <button type="submit" style={{ background: 'var(--green-soft)', color: 'var(--white)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 4px 10px rgba(91, 123, 97, 0.2)' }}>Accept & Publish</button>
                      </form>
                   </div>
                </div>
             ))}
             {pendingLinks.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--mist)', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                   Inbox zero. No pending URLs to review.
                </div>
             )}
          </div>
        </div>

        {/* Pending 501(c)(3) Applications */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <Tooltip content={
                <div>
                   <strong style={{ color: 'var(--admin-gold-light)' }}>What is this?</strong> Approving this application instantly routes processing volume through the G.O.L.F. Foundation holding account, bypassing the host&apos;s standard Stripe connect requirement.
                </div>
             }>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--forest)', borderBottom: '1px dotted var(--mist)', cursor: 'help', display: 'inline-block' }}>Action Required: 501(c)(3) Fiscal Sponsorship Apps</h2>
             </Tooltip>
             <span style={{ background: pendingApplications.length > 0 ? 'rgba(230, 194, 122, 0.2)' : 'rgba(0,0,0,0.05)', color: pendingApplications.length > 0 ? 'var(--gold-dark)' : 'var(--mist)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
               {pendingApplications.length} Pending
             </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {pendingApplications.map(app => {
                let parsedData = null;
                try {
                   if(app.golfApplicationData) parsedData = JSON.parse(app.golfApplicationData);
                } catch(e) {}
                
                return (
                   <div key={app.id} className="lux-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', padding: '1.25rem 1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                      
                      <div style={{ flex: 1 }}>
                         <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Submitted</div>
                         <div style={{ color: 'var(--forest)', fontWeight: 600 }}>{new Date(app.createdAt || '').toLocaleDateString()}</div>
                      </div>

                      <div style={{ flex: 1.5 }}>
                         <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Campaign / ID</div>
                         <div style={{ fontWeight: 700, color: 'var(--forest)' }}>{app.name}</div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>ID: {app.id}</div>
                      </div>

                      <div style={{ flex: 2 }}>
                         <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Tax / Payout Data</div>
                         <div style={{ color: 'var(--forest)', fontSize: '0.9rem' }}>
                            <div style={{ marginBottom: '0.2rem' }}><strong style={{ color: 'var(--ink)' }}>Cause:</strong> {parsedData?.cause || 'N/A'}</div>
                            <div><strong style={{ color: 'var(--ink)' }}>Disbursement:</strong> {parsedData?.payoutInfo || 'N/A'}</div>
                         </div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                         <form action={approveGolfApplication}>
                           <input type="hidden" name="tournamentId" value={app.id} />
                           <button type="submit" className="lux-btn" style={{ background: 'var(--gold-foil)', color: 'var(--ink)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, boxShadow: 'var(--metallic-shadow)' }}>Approve & Route</button>
                         </form>
                      </div>
                   </div>
                );
             })}
             {pendingApplications.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--mist)', background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                   Queue empty. All hosts are compliant and approved!
                </div>
             )}
          </div>
        </div>

    </div>
  );
}
