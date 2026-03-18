'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FlightBuilder({ 
  tournamentId, 
  teamsMap 
}: { 
  tournamentId: number, 
  teamsMap: Record<number, any[]> 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuildFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tournaments/${tournamentId}/auto-flight`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        router.refresh(); // Refresh the server component to pull newly assigned teams
      } else {
        alert('Failed to auto-flight: ' + data.error);
      }
    } catch (err) {
      alert('Error triggering AI.');
    }
    setLoading(false);
  };

  const activeTeams = Object.keys(teamsMap).sort((a,b) => parseInt(a) - parseInt(b));

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-card-title">🏌️ Auto Flight Builder</div>
        <button 
          onClick={handleBuildFlights} 
          disabled={loading}
          className="btn-primary" 
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          {loading ? '🧠 AI Calculating...' : '✨ Auto-Build Flights'}
        </button>
      </div>
      <div style={{ padding: '1.25rem' }}>
        {activeTeams.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--mist)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            No flights have been assigned yet. Click "Auto-Build Flights" to mathematically balance the registrants.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeTeams.map((teamId, idx) => {
              const players = teamsMap[parseInt(teamId, 10)];
              const avgHcp = players.reduce((sum, p) => sum + (p.handicap || 0), 0) / players.length;
              
              // Colors logic based on flight rotation
              const colors = [
                { bg: 'rgba(90,140,58,0.08)', border: 'rgba(90,140,58,0.2)' },
                { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)' },
                { bg: 'rgba(45,74,45,0.08)', border: 'rgba(45,74,45,0.2)' },
              ];
              const theme = colors[idx % colors.length];

              return (
                <div key={teamId} style={{ background: theme.bg, border: `1px solid ${theme.border}`, padding: '0.85rem', borderRadius: '2px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--forest)', marginBottom: '0.25rem' }}>
                    Flight GRP-{teamId} <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: '0.5rem' }}>(Avg HCP: {avgHcp.toFixed(1)})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>
                    {players.map(p => p.name).join(' · ')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
