'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaymentLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    params.then(p => {
       const id = parseInt(p.id);
       setTournamentId(id);
       // We would fetch registrations for this tourney here...
       // Mocking some data for the ledger
       setRegistrations([
         { id: 101, name: 'Tom Harrington', status: 'PAID', amount: 150, method: 'Stripe', date: '2026-03-30T14:22:00Z' },
         { id: 102, name: 'Sarah Chen', status: 'PAID', amount: 150, method: 'Check/Offline', date: '2026-03-31T09:12:00Z' },
         { id: 103, name: 'Michael Jordan', status: 'PENDING', amount: 0, method: 'Awaiting', date: '2026-04-01T11:45:00Z' }
       ]);
    });
  }, [params]);

  if (!tournamentId) return null;

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#f4f3ef', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ paddingBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>Financial Ledger & Payouts</h1>
              <div style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
                Track payment states, issue full/partial refunds, and configure direct bank deposits.
              </div>
            </div>
            
            <Link href={`/admin`} className="btn-ghost" style={{ color: 'var(--forest)', border: '1px solid rgba(26,46,26,0.2)' }}>
              ← Return to Main Dashboard
            </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
           
           {/* Placeholder for Stripe Onboarding Widget, which we'll import if it were deeply integrated */}
           <div className="dash-card">
              <div className="dash-card-header">
                 <div className="dash-card-title">💳 Gateway Config (Stripe)</div>
                 <span className="status-pill status-ready">Connected</span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                 <p style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Your Stripe Connect account is successfully routing ticket revenues to your connected bank account. Payouts arrive on a 2-day rolling basis.
                 </p>
                 <button className="btn-ghost" style={{ border: '1px solid var(--forest)', color: 'var(--forest)' }}>View Stripe Express Dashboard ↗</button>
              </div>
           </div>

           {/* Registrant Payment Table */}
           <div className="dash-card">
              <div className="dash-card-header">
                 <div className="dash-card-title">🧾 Transaction History</div>
              </div>
              <div style={{ padding: '1.25rem' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.02)', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                         <th style={{ padding: '0.75rem 1rem' }}>Player</th>
                         <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                         <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                         <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                         <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                           <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--forest)' }}>{r.name}</td>
                           <td style={{ padding: '0.85rem 1rem' }}>${r.amount}</td>
                           <td style={{ padding: '0.85rem 1rem', color: 'var(--mist)' }}>{r.method}</td>
                           <td style={{ padding: '0.85rem 1rem' }}>
                              <span className={`status-pill ${r.status === 'PAID' ? 'status-ready' : 'status-pending'}`} style={{ fontSize: '0.7rem' }}>{r.status}</span>
                           </td>
                           <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                              {r.status === 'PAID' && r.method === 'Stripe' && (
                                <button className="btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', color: '#c0392b', border: '1px solid rgba(192,57,43,0.3)' }}>Issue Refund</button>
                              )}
                           </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
