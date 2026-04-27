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
