'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

type Tournament = any; // Will use the full Drizzle object

// Simple Haversine distance formula
function getDistanceFromLatLonInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Basic map of common ZIPs to coordinates so we don't need a live API for this MVP.
// In a production app, we would use Mapbox/Google Geocoding.
const MOCK_GEOCODES: Record<string, { lat: number, lng: number }> = {
  // We'll fallback to a generic search if no lat/lng is provided. 
  // For the MVP, if they type a ZIP we'll just try to match the zip string loosely if we don't have coords.
};

export default function TournamentDirectory({ initialTournaments }: { initialTournaments: Tournament[] }) {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(50);
  const [format, setFormat] = useState('All');
  const [maxFee, setMaxFee] = useState<number | ''>('');
  const [accessType, setAccessType] = useState('All');
  const [isCharity, setIsCharity] = useState(false);

  const getGradient = (index: number) => {
    const gradients = [
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(135deg, #1a4a1a 0%, #2d6b2d 50%, #3d8b3d 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(0deg, #2d4a2d 0%, #5a8c3a 50%, #8fbc5a 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(45deg, #1a2e1a 0%, #2c3e50 50%, #3498db 100%)"
    ];
    return gradients[index % gradients.length];
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase();
  };

  const getStatus = (t: any) => {
    if (!t.registrationDeadline) return "OPEN";
    const deadline = new Date(t.registrationDeadline);
    if (deadline < new Date()) return "CLOSED";
    return "OPEN";
  };

  const filteredTournaments = useMemo(() => {
    return initialTournaments.filter(t => {
      // 1. Fee Filter
      if (maxFee !== '' && t.entryFee && t.entryFee > maxFee) {
        return false;
      }

      // 2. Format Filter
      if (format !== 'All') {
        if (!t.format || !t.format.toLowerCase().includes(format.toLowerCase())) {
          return false;
        }
      }

      // 3. Access Filter
      if (accessType === 'Public' && t.isPrivate) return false;
      if (accessType === 'Private' && !t.isPrivate) return false;

      // 4. Charity Filter
      if (isCharity && !t.isCharity) return false;

      // 5. ZIP Radius Filter
      if (zipCode.length >= 3) {
        // If we have a lat/lng for the tournament and mapping for the zip, we'd do Haversine.
        // For MVP frontend fallback without an API call, we can just do a fuzzy string match on courseZip/City if we don't have the explicit radius data.
        // We will try to match the prefix of the zip code since we lack a full backend geocoder.
        if (t.courseZip && !t.courseZip.startsWith(zipCode.substring(0, 3))) {
           // Also check if text matches City broadly
           if (!t.courseCity.toLowerCase().includes(zipCode.toLowerCase())) {
              return false;
           }
        }
      }

      return true;
    });
  }, [initialTournaments, zipCode, maxFee, format, accessType, isCharity]);

  return (
    <div className="section-wrapper" id="explore" style={{ padding: '4rem 3rem' }}>
      <div className="section-header" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '3rem' }}>Tournament Directory</h1>
          <p className="section-sub" style={{ maxWidth: '600px' }}>
            Browse the complete schedule of upcoming amateur championships, competitive leagues, and high-end charity scrambles. Use the filters below to dial in specific events.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Filter Sidebar */}
        <div style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)', marginBottom: '1.5rem' }}>Filters</h3>
            
            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>📍 Location Search</label>
              <input 
                type="text" 
                placeholder="Zip Code or City" 
                value={zipCode} 
                onChange={e => setZipCode(e.target.value)} 
              />
              <span className="wfield-hint" style={{ marginTop: '0.25rem', display: 'block' }}>Shows matches near you</span>
            </div>

            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>Tournament Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}>
                <option value="All">All Formats</option>
                <option value="Stroke Play">Stroke Play</option>
                <option value="Scramble">Scramble</option>
                <option value="Match Play">Match Play</option>
                <option value="Stableford">Stableford</option>
                <option value="Best Ball">Best Ball</option>
              </select>
            </div>

            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>Max Registration Fee</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mist)' }}>$</span>
                <input 
                  type="number" 
                  placeholder="No Limit" 
                  value={maxFee} 
                  onChange={e => setMaxFee(e.target.value ? Number(e.target.value) : '')} 
                  style={{ paddingLeft: '25px' }}
                />
              </div>
            </div>

            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>Course Access</label>
              <select value={accessType} onChange={e => setAccessType(e.target.value)}>
                <option value="All">Public & Private</option>
                <option value="Public">Public Only</option>
                <option value="Private">Private Only</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--forest)', fontWeight: 500 }}>
              <input 
                type="checkbox" 
                checked={isCharity} 
                onChange={e => setIsCharity(e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: 'var(--grass)' }}
              />
              Charity Events Only
            </label>
          </div>
          
          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(26,46,26,0.06)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>
              Showing {filteredTournaments.length} events
            </div>
            {(zipCode || format !== 'All' || maxFee !== '' || accessType !== 'All' || isCharity) && (
              <button 
                onClick={() => { setZipCode(''); setFormat('All'); setMaxFee(''); setAccessType('All'); setIsCharity(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '0.8rem', textDecoration: 'underline', marginTop: '0.5rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div>
          <div className="tournaments-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {filteredTournaments.map((t, i) => (
              <Link href={`/tournaments/${t.id}`} key={t.id} className="t-card" style={{ textDecoration: 'none' }}>
                <div className="t-card-cover">
                  <div 
                    className="cover-bg"
                    style={{ background: getGradient(i) }}
                  ></div>
                  <div className="cover-overlay"></div>
                  <div className="cover-badges">
                    <span className="badge badge-format">{t.format || 'Standard'}</span>
                    {getStatus(t) === 'OPEN' ? (
                      <span className="badge badge-open">Registration Open</span>
                    ) : (
                      <span className="badge badge-soon">Opening Soon</span>
                    )}
                  </div>
                </div>
                
                <div className="t-card-body">
                  <div className="t-card-date">{formatDate(t.dateStart)}</div>
                  <h3 className="t-card-title">{t.name}</h3>
                  <div className="t-card-location">
                    <span role="img" aria-label="location">📍</span> {t.courseCity}, {t.courseState}
                  </div>
                  
                  <div className="t-card-details">
                    <div>
                      <div className="t-detail-label">Entry Fee</div>
                      <div className="t-detail-val">{t.entryFee ? `$${t.entryFee}` : 'TBD'}</div>
                    </div>
                    <div>
                      <div className="t-detail-label">Access</div>
                      <div className="t-detail-val">{t.isPrivate ? 'Private' : 'Public'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="t-card-footer">
                  <div className="t-spots">
                    {t.spotsRemaining !== null && t.maxPlayers !== null ? (
                        <><strong>{t.maxPlayers - t.spotsRemaining}</strong> / {t.maxPlayers}</>
                    ) : (
                        <>Spots Available</>
                    )}
                  </div>
                  <span className="btn-card">View Details</span>
                </div>
              </Link>
            ))}
          </div>
          {filteredTournaments.length === 0 && (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(26,46,26,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(26,46,26,0.1)' }}>
               <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>⛳</span>
               <h3 style={{ fontSize: '1.2rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>No tournaments found</h3>
               <p style={{ color: 'var(--mist)' }}>Try adjusting your filters or expanding your search radius to find events.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
