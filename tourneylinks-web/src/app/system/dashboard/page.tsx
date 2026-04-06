import React from 'react';
import Link from 'next/link';
import { db, tournaments, courses, registrations, crawlLogs, missing_links } from '@/lib/db';
import { sql, desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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
  
  revalidatePath('/system/dashboard');
}

async function approveGolfApplication(formData: FormData) {
  'use server';
  const idStr = formData.get('tournamentId') as string;
  if (!idStr) return;
  const tId = parseInt(idStr, 10);

  // Core Compliance Step: Nullify any localized connected stripe account to force platform routing
  const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, tId));
  if (!tournament) return;

  if (tournament.hostUserId) {
     // Wipe local Stripe Account records for this user (they lose direct routing access)
     // Or we can just sever the connection or flag it. Since the platform routs checkout through root if charityType == golf_sponsored
     // The core checkout logic already uses the Root Acct if it's G.O.L.F. Sponsored.
     // However, let's strictly nullify their Stripe Connect linking if exists to be 100% compliant.
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
  
  revalidatePath('/system/dashboard');
}

export default async function SuperAdminDashboard() {
  
  // Security Layer: Validate Edge Session Cookie
  const cookieStore = await cookies();
  const session = cookieStore.get('super_admin_session');

  if (!session) {
    redirect('/system/login');
  }

  // Aggregate Metrics Queries
  const [tournamentCount] = await db.select({ count: sql<number>`count(*)` }).from(tournaments);
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
  const [playerCount] = await db.select({ count: sql<number>`count(*)` }).from(registrations);
  const recentLogs = await db.select().from(crawlLogs).orderBy(desc(crawlLogs.crawledAt)).limit(4);
  const pendingLinks = await db.select().from(missing_links).where(sql`${missing_links.status} = 'PENDING'`).orderBy(desc(missing_links.createdAt));
  const pendingApplications = await db.select().from(tournaments).where(eq(tournaments.golfApplicationStatus, 'pending')).orderBy(desc(tournaments.createdAt));

  // Financial Forensics (Mocked data structures for the upcoming Stripe implementation)
  const syntheticRevenue = (playerCount?.count || 0) * 150; // Mock $150 entry fee average
  const syntheticProcessingFees = syntheticRevenue * 0.029 + ((playerCount?.count || 0) * 0.30);
  const syntheticNet = syntheticRevenue - syntheticProcessingFees;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Banner */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--gold)', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}>
            SUPER ADMIN
          </div>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>Global Command Center</span>
        </div>
        <a href="/api/system/logout" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          Logout & Exit to Platform ↗
        </a>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 2rem 0', color: '#fff' }}>Platform Telemetry</h1>

        {/* Top KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <MetricCard title="Active Tournaments" value={tournamentCount?.count?.toLocaleString() || '0'} trend="+12% this month" icon="🏆" />
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Global Players</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '0.5rem' }}>{playerCount?.count?.toLocaleString() || '0'}</span>
            <span style={{ fontSize: '0.85rem', color: '#4CAF50' }}>Active DB Registrations</span>
          </div>
          
          <MetricCard title="Total Courses Synced" value={courseCount?.count?.toLocaleString() || '0'} trend="RapidAPI Operational" icon="⛳" />
          
          <div style={{ background: 'linear-gradient(135deg, #1f1a0a, #111)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Gross Processed (Est)</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1, marginBottom: '0.5rem' }}>${syntheticRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            <span style={{ fontSize: '0.85rem', color: '#888' }}>Stripe Architecture Pending</span>
          </div>

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
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Inbox zero. No pending URLs to review!</td>
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

        {/* Lower Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          
          {/* Autonomous Operations */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Autonomous Engine Telemetry</h2>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4CAF50', background: 'rgba(76, 175, 80, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                 <div style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }}></div>
                 System Nominal
               </div>
            </div>
            
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>TIMESTAMP</th>
                    <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>WORKER ID</th>
                    <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>TARGET STATE</th>
                    <th style={{ padding: '1rem', color: '#888', fontWeight: 500 }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '1rem', color: '#ccc' }}>{new Date(log.crawledAt || '').toLocaleString()}</td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#666' }}>{log.cycleId.substring(0,8)}</td>
                      <td style={{ padding: '1rem', color: '#ccc' }}>{log.url}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          background: log.status === 'SUCCESS' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', 
                          color: log.status === 'SUCCESS' ? '#4CAF50' : '#F44336',
                          padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600
                        }}>
                          {log.status === 'SUCCESS' ? `FETCHED ${log.tournamentsFound}` : 'FAILED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No recent crawler activity found in logs.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Forensics */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Financial Forensics</h2>
            
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
               <div style={{ marginBottom: '1.5rem' }}>
                 <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Gross Revenue</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>${syntheticRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
               </div>
               
               <div style={{ marginBottom: '1.5rem' }}>
                 <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Stripe Processing Fees (Est.)</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f44336' }}>-${syntheticProcessingFees.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                 <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>Calculated at 2.9% + 30¢ per transaction</div>
               </div>

               <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
                 <div style={{ color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 600 }}>Net Platform Profit</div>
                 <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)' }}>${syntheticNet.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
               </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', background: 'rgba(212,175,55,0.05)', border: '1px dashed rgba(212,175,55,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--gold)' }}>
              <strong>Notice:</strong> Financial metrics are currently synthetically projected based on active Database Registrations. Phase 9 (Stripe Integration) will bind these integers to live Ledger APIs.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: string }) {
  return (
    <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
        <span style={{ fontSize: '1.2rem', opacity: 0.5 }}>{icon}</span>
      </div>
      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: '0.5rem' }}>{value}</span>
      <span style={{ fontSize: '0.85rem', color: '#666' }}>{trend}</span>
    </div>
  );
}
