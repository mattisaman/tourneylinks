import React from 'react';
import { db, tournaments } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Database, Filter, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GlobalDataViewer({ searchParams }: { searchParams: { status?: string } }) {
  const statusFilter = searchParams.status || 'active';
  
  const data = await db.select()
    .from(tournaments)
    .where(eq(tournaments.status, statusFilter))
    .orderBy(desc(tournaments.createdAt))
    .limit(100);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--forest)' }}>Data Integrity Hub</h1>
           <p style={{ color: 'var(--mist)', margin: 0 }}>Global Master Ledger of Crawled Tournaments</p>
        </div>
        
        {/* Status Filters */}
        <div style={{ display: 'flex', background: 'var(--admin-golf-white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', padding: '0.25rem' }}>
          <Link href="/system/tournaments?status=active" style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            textDecoration: 'none',
            color: statusFilter === 'active' ? '#fff' : 'var(--mist)',
            background: statusFilter === 'active' ? 'var(--forest)' : 'transparent',
            transition: 'all 0.2s'
          }}>
            Active
          </Link>
          <Link href="/system/tournaments?status=archived" style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            textDecoration: 'none',
            color: statusFilter === 'archived' ? '#fff' : 'var(--mist)',
            background: statusFilter === 'archived' ? 'var(--mist)' : 'transparent',
            transition: 'all 0.2s'
          }}>
            Archived
          </Link>
          <Link href="/system/tournaments?status=cancelled" style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            textDecoration: 'none',
            color: statusFilter === 'cancelled' ? '#fff' : 'var(--mist)',
            background: statusFilter === 'cancelled' ? 'var(--admin-pin-red)' : 'transparent',
            transition: 'all 0.2s'
          }}>
            Cancelled
          </Link>
        </div>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--admin-golf-white)' }}>
           <Database size={18} color="var(--gold-dark)" />
           <span style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.9rem' }}>Recent Records ({data.length})</span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--admin-golf-white)', borderBottom: '1px solid rgba(0,0,0,0.05)', color: 'var(--mist)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Event Name & Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Format & Pricing</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Extraction Confidence</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(t => (
                <tr key={t.id} className="hover:bg-black/5" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s', fontSize: '0.9rem' }}>
                  
                  {/* Name & Location */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '0.25rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>
                      {t.courseName} • {t.courseCity}, {t.courseState}
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--forest)' }}>
                      {t.dateStart ? new Date(t.dateStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                    </div>
                  </td>
                  
                  {/* Format & Pricing */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--forest)' }}>
                      {t.format || 'Unknown Format'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', fontWeight: 700 }}>
                      {t.entryFee ? `$${t.entryFee}` : 'Price Missing'}
                    </div>
                  </td>

                  {/* Extraction Confidence */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {(t.extractionConfidence ?? 1) >= 0.90 ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(76,175,80,0.1)', color: 'var(--grass)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <CheckCircle2 size={14} /> High
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(244,67,54,0.1)', color: 'var(--admin-pin-red)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <ShieldAlert size={14} /> {(t.extractionConfidence || 0).toFixed(2)} - Review Needed
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <a href={t.sourceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--mist)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.75rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', transition: 'all 0.2s' }}>
                      Source <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--mist)' }}>
                    No {statusFilter} tournaments found in the master ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
