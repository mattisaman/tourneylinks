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
  const [movingId, setMovingId] = useState<number | null>(null);
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

  const handleMovePlayer = async (regId: number, newTeamId: string) => {
    setMovingId(regId);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTeam: newTeamId === 'none' ? null : newTeamId })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to override flight assignment.');
      }
    } catch(err) {
      alert('Network error moving player.');
    }
    setMovingId(null);
  };

  const findPlayerFlight = (requestName: string) => {
    if (!requestName || requestName.toLowerCase() === 'none') return null;
    const searchName = requestName.toLowerCase().trim();
    for (const [tId, players] of Object.entries(teamsMap)) {
      for (const p of players) {
        if (p.name && p.name.toLowerCase().includes(searchName)) {
           return tId;
        }
      }
    }
    return null;
  };

  const renderPairingInfo = (requestStr: string | null) => {
     if (!requestStr || requestStr === 'None') return <strong style={{ color: 'inherit' }}>None</strong>;
     const names = requestStr.split(',').map(s => s.trim()).filter(Boolean);
     return (
        <span style={{ color: 'var(--gold)' }}>
           {names.map((name, idx) => {
              const fId = findPlayerFlight(name);
              return (
                <span key={idx}>
                  <strong>{name}</strong> {fId ? <span style={{ color: 'var(--grass)', fontSize: '0.65rem', fontWeight: 600, border: '1px solid rgba(15,110,64,0.3)', padding: '0.1rem 0.3rem', borderRadius: '4px', marginLeft: '0.3rem' }}>⇨ Flight {fId}</span> : <span style={{ color: 'var(--mist)', fontSize: '0.65rem', marginLeft: '0.2rem' }}>(Unassigned)</span>}
                  {idx < names.length - 1 ? ', ' : ''}
                </span>
              )
           })}
        </span>
     );
  };

  const activeTeams = Object.keys(teamsMap).sort((a,b) => parseInt(a) - parseInt(b));
  const maxTeamNumber = activeTeams.length > 0 ? Math.max(...activeTeams.map(t => parseInt(t))) : 4;
  
  // Create an array of potential flights (1 through max+1 so they can create a new flight)
  const availableFlights = Array.from({length: maxTeamNumber + 1}, (_, i) => i + 1);

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeTeams.map((teamId, idx) => {
              const players = teamsMap[parseInt(teamId, 10)];
              const avgHcp = players.reduce((sum, p) => sum + (p.handicap || 0), 0) / players.length;
              
              const colors = [
                { bg: 'rgba(90,140,58,0.06)', border: 'rgba(90,140,58,0.2)' },
                { bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.2)' },
                { bg: 'rgba(45,74,45,0.06)', border: 'rgba(45,74,45,0.2)' },
                { bg: 'rgba(46,71,93,0.06)', border: 'rgba(46,71,93,0.2)' },
              ];
              const theme = colors[parseInt(teamId) % colors.length];

              return (
                <div key={teamId} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--forest)', padding: '0.6rem 0.85rem', borderBottom: `1px solid ${theme.border}` }}>
                    Flight GRP-{teamId} <span style={{ opacity: 0.6, fontWeight: 400, marginLeft: '0.5rem' }}>(Avg HCP: {avgHcp.toFixed(1)}) • {players.length} players</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {players.map((p, pIdx) => (
                      <div key={p.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.5rem 0.85rem',
                        borderBottom: pIdx !== players.length - 1 ? `1px solid rgba(0,0,0,0.03)` : 'none',
                        background: 'rgba(255,255,255,0.45)'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#111' }}>{p.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--mist)', marginTop: '0.1rem', display: 'flex', gap: '0.75rem' }}>
                            <span>HCP: <strong>{p.handicap?.toFixed(1) || 'N/A'}</strong></span>
                            <span>Requested: {renderPairingInfo(p.pairingRequest)}</span>
                          </div>
                        </div>
                        <div>
                          <select 
                            defaultValue={teamId}
                            disabled={movingId === p.id}
                            onChange={(e) => handleMovePlayer(p.id, e.target.value)}
                            style={{ 
                              fontSize: '0.7rem', 
                              padding: '0.2rem 0.4rem', 
                              borderRadius: '2px', 
                              border: '1px solid rgba(0,0,0,0.1)', 
                              background: '#fff',
                              cursor: movingId === p.id ? 'wait' : 'pointer',
                              opacity: movingId === p.id ? 0.5 : 1,
                              outline: 'none' 
                            }}
                          >
                            <option value="none">Unassigned</option>
                            {availableFlights.map(f => (
                              <option key={f} value={f}>Move to Flight {f}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
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
