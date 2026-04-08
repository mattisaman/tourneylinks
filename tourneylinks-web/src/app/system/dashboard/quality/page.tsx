import React from 'react';
import { db, tournaments, courses, missing_links } from '@/lib/db';
import { sql, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#fff' }}>Quality Control</h1>
          <p style={{ color: '#888', margin: 0 }}>Human-in-the-Loop AI Corrections & Compliance Offloading</p>
        </div>

        {/* Pending Crowdsourced Links */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Action Required: Submitted URLs</h2>
             <span style={{ background: pendingLinks.length > 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)', color: pendingLinks.length > 0 ? 'var(--gold)' : '#666', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
               {pendingLinks.length} Pending
             </span>
          </div>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>DATE</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>ENTITY ID</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>SUBMITTED URL</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500, textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {pendingLinks.map(link => (
                  <tr key={link.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '1rem', color: '#ccc' }}>{new Date(link.createdAt || '').toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', color: '#ccc' }}>
                      {link.tournamentId ? `Tournament ID: ${link.tournamentId}` : ''}
                      {link.courseId ? `Course ID: ${link.courseId}` : ''}
                    </td>
                    <td style={{ padding: '1rem', color: '#ccc' }}>
                      <a href={link.submittedUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>{link.submittedUrl}</a>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <form action={acceptMissingLink}>
                        <input type="hidden" name="linkId" value={link.id} />
                        <button type="submit" style={{ background: 'var(--grass)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Accept & Publish</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {pendingLinks.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Inbox zero. No pending URLs to review.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending 501(c)(3) Applications */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Action Required: 501(c)(3) Fiscal Sponsorship Apps</h2>
             <span style={{ background: pendingApplications.length > 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)', color: pendingApplications.length > 0 ? 'var(--gold)' : '#666', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
               {pendingApplications.length} Pending
             </span>
          </div>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>DATE</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>CAMPAIGN / ID</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>DATA</th>
                  <th style={{ padding: '1rem', color: '#888', fontWeight: 500, textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map(app => {
                  let parsedData = null;
                  try {
                     if(app.golfApplicationData) parsedData = JSON.parse(app.golfApplicationData);
                  } catch(e) {}
                  return (
                  <tr key={app.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '1rem', color: '#ccc' }}>{new Date(app.createdAt || '').toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', color: '#ccc' }}>
                      <div style={{ fontWeight: 600, color: 'var(--gold)' }}>{app.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {app.id}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#ccc', fontSize: '0.8rem', maxWidth: '400px' }}>
                      <div style={{ marginBottom: '0.5rem' }}><strong>Cause:</strong> {parsedData?.cause || 'N/A'}</div>
                      <div><strong>Disbursement:</strong> {parsedData?.payoutInfo || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <form action={approveGolfApplication}>
                        <input type="hidden" name="tournamentId" value={app.id} />
                        <button type="submit" style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>Approve & Route</button>
                      </form>
                    </td>
                  </tr>
                  );
                })}
                {pendingApplications.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Queue empty. All hosts are compliant and approved!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

    </div>
  );
}
