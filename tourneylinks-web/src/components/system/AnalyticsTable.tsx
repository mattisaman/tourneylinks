import React from 'react';
import Link from 'next/link';

interface TournamentRow {
  id: string;
  name: string | null;
  dateStart: string | null;
  courseCity: string | null;
  courseState: string | null;
  format: string | null;
  entryFee: number | null;
  formatDetails?: string | null;
}

function getTierBadge(formatDetailsStr: string | null | undefined) {
  let tier = 'Unknown';
  if (formatDetailsStr) {
    try {
      const parsed = JSON.parse(formatDetailsStr);
      if (parsed && parsed.eventTier) {
        tier = parsed.eventTier;
      }
    } catch(e) {}
  }
  
  if (tier === 'Sanctioned/Pro') {
    return <span style={{ background: 'rgba(244,67,54,0.1)', color: 'var(--admin-pin-red)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>Sanctioned</span>;
  }
  if (tier === 'Charity/Fundraiser') {
    return <span style={{ background: 'rgba(76,175,80,0.1)', color: 'var(--grass)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>Charity</span>;
  }
  if (tier === 'Corporate/Private') {
    return <span style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--ink)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>Private</span>;
  }
  if (tier === 'Local Amateur') {
    return <span style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-dark)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>Local</span>;
  }
  return <span style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--mist)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Unclassified</span>;
}

export default function AnalyticsTable({ tournaments }: { tournaments: TournamentRow[] }) {
  if (!tournaments || tournaments.length === 0) {
    return (
      <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: 'var(--mist)' }}>
        No tournaments match the selected filters.
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--forest)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--forest)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tournament Name</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--forest)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tier</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--forest)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--forest)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Format</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--forest)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Entry Fee</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map((t, idx) => (
              <tr key={t.id} style={{ borderBottom: idx === tournaments.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.03)' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--mist)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {t.dateStart ? new Date(t.dateStart).toLocaleDateString() : 'TBD'}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  <Link href={`/tournaments/${t.id}`} target="_blank" style={{ color: 'var(--forest)', textDecoration: 'none' }}>
                    {t.name || 'Unnamed Event'}
                  </Link>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {getTierBadge(t.formatDetails)}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--ink)' }}>
                  {t.courseCity ? `${t.courseCity}, ` : ''}{t.courseState || 'N/A'}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--ink)', textTransform: 'capitalize' }}>
                  {t.format || 'Unknown'}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--grass)', fontWeight: 700 }}>
                  {t.entryFee ? `$${t.entryFee}` : 'TBD'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.01)', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.85rem', color: 'var(--mist)', textAlign: 'right', fontWeight: 500 }}>
        Showing {tournaments.length} results
      </div>
    </div>
  );
}
