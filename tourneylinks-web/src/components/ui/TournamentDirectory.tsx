'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { Bell, Search } from 'lucide-react';

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
  const { userId } = useAuth();
  
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(50);
  const [format, setFormat] = useState('All');
  const [maxFee, setMaxFee] = useState<number | ''>('');
  const [accessType, setAccessType] = useState('All');
  const [isCharity, setIsCharity] = useState(false);
  const [requireSpots, setRequireSpots] = useState(false);
  const [requireOpenReg, setRequireOpenReg] = useState(true);

  // Derive unique courses for the dropdown
  const uniqueCourses = useMemo(() => {
    const courses = new Set<string>();
    initialTournaments.forEach(t => {
      if (t.courseName) courses.add(t.courseName);
    });
    return Array.from(courses).sort();
  }, [initialTournaments]);

  // The explicitly applied filters that drive the actual results
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
    courseFilter: 'All',
    zipCode: '',
    radius: 50,
    format: 'All',
    maxFee: '' as number | '',
    accessType: 'All',
    isCharity: false,
    requireSpots: false,
    requireOpenReg: true
  });

  const handleApplyFilters = () => {
    setAppliedFilters({ keyword, startDate, endDate, courseFilter, zipCode, radius, format, maxFee, accessType, isCharity, requireSpots, requireOpenReg });
  };

  const handleClearFilters = () => {
    setKeyword(''); setStartDate(''); setEndDate(''); setCourseFilter('All');
    setZipCode(''); setRadius(50); setFormat('All'); setMaxFee(''); setAccessType('All'); 
    setIsCharity(false); setRequireSpots(false); setRequireOpenReg(false);
    setAppliedFilters({ 
       keyword: '', startDate: '', endDate: '', courseFilter: 'All', zipCode: '', radius: 50, format: 'All', maxFee: '', accessType: 'All', isCharity: false, requireSpots: false, requireOpenReg: false 
    });
  };

  const getGradient = (index: number) => {
    const images = [
      "url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800')", // Existing sunrise
      "url('https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80&w=800')", // Existing swing
      "url('https://images.unsplash.com/photo-1538648759472-7251f7cb2c2f?auto=format&fit=crop&q=80&w=800')", // Pinehurst style
      "url('https://images.unsplash.com/photo-1500932334442-8761ee4810a7?auto=format&fit=crop&q=80&w=800')", // Beautiful fairway
      "url('https://images.unsplash.com/photo-1605144884374-ecbb643615f6?auto=format&fit=crop&q=80&w=800')", // Golf club green
      "url('https://images.unsplash.com/photo-1532508583690-538a1436f423?auto=format&fit=crop&q=80&w=800')", // Putting green
    ];
    const image = images[index % images.length];
    return `linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), ${image} center/cover no-repeat`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
  };

  const getStatus = (t: any) => {
    if (!t.registrationDeadline) return "OPEN";
    const deadline = new Date(t.registrationDeadline);
    if (deadline < new Date()) return "CLOSED";
    return "OPEN";
  };

  const filteredTournaments = useMemo(() => {
    return initialTournaments.filter(t => {
      // 0. Keyword Custom Search
      if (appliedFilters.keyword) {
        const lowerKeyword = appliedFilters.keyword.toLowerCase();
        const titleMatch = t.name && t.name.toLowerCase().includes(lowerKeyword);
        const formatDetailsMatch = t.formatDetail && t.formatDetail.toLowerCase().includes(lowerKeyword);
        const includesMatch = t.includes && t.includes.toLowerCase().includes(lowerKeyword);
        
        if (!titleMatch && !formatDetailsMatch && !includesMatch) return false;
      }

      // 0.1 Date Range Bounding
      if (appliedFilters.startDate && t.dateStart) {
        if (new Date(t.dateStart) < new Date(appliedFilters.startDate)) return false;
      }
      if (appliedFilters.endDate && t.dateStart) {
        if (new Date(t.dateStart) > new Date(appliedFilters.endDate)) return false;
      }

      // 0.2 Course Filter
      if (appliedFilters.courseFilter !== 'All' && appliedFilters.courseFilter !== '') {
        if (!t.courseName || !t.courseName.toLowerCase().includes(appliedFilters.courseFilter.toLowerCase())) return false;
      }

      // 1. Fee Filter
      if (appliedFilters.maxFee !== '' && t.entryFee && t.entryFee > appliedFilters.maxFee) {
        return false;
      }

      // 2. Format Filter
      if (appliedFilters.format !== 'All') {
        if (!t.format || !t.format.toLowerCase().includes(appliedFilters.format.toLowerCase())) {
           return false;
        }
      }

      // 3. Access Filter
      if (appliedFilters.accessType === 'Public' && t.isPrivate) return false;
      if (appliedFilters.accessType === 'Private' && !t.isPrivate) return false;

      // 4. Charity Filter
      if (appliedFilters.isCharity && !t.isCharity) return false;

      // 5. Spots Remaining Filter
      if (appliedFilters.requireSpots && t.spotsRemaining === 0) return false;

      // 6. Registration Open Filter
      if (appliedFilters.requireOpenReg && getStatus(t) === 'CLOSED') return false;

      // 7. ZIP/City Search Filter
      if (appliedFilters.zipCode.length >= 3) {
        const matchLength = appliedFilters.radius <= 20 ? 5 : 3;
        const searchVal = appliedFilters.zipCode.toLowerCase();
        
        const zipMatches = t.courseZip && t.courseZip.startsWith(searchVal.substring(0, matchLength));
        const cityMatches = t.courseCity && t.courseCity.toLowerCase().includes(searchVal);
        
        if (!zipMatches && !cityMatches) {
            return false;
        }
      }

      return true;
    });
  }, [initialTournaments, appliedFilters]);

  return (
    <>
      <div style={{ 
        position: 'relative', 
        padding: '1.5rem 3rem 1.5rem 3rem', 
        background: 'linear-gradient(135deg, #0a1f0f 0%, #153a1d 50%, #0a1f0f 100%)', 
        overflow: 'hidden',
        textAlign: 'center',
        borderBottom: '2px solid rgba(212,175,55,0.7)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Subtle background overlay for "foil/lighting" */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at top, rgba(212,175,55,0.15) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,1), transparent)', opacity: 0.9 }}></div>
        
         <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '3.5rem', 
              marginBottom: '0.1rem', 
              background: 'linear-gradient(to right, #d4af37, #fff9e6, #d4af37)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(212,175,55,0.3)'
            }}>
              Tournament Directory
            </h1>
            <p className="hidden md:block" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: 0, fontWeight: 300 }}>
              Browse the complete schedule of upcoming amateur championships, competitive leagues, and high-end charity scrambles.
            </p>
        </div>
      </div>

      {/* Sticky Secondary Header (The Filter Matrix) */}
      <div className="sticky-filter-matrix" style={{ 
        position: 'sticky', top: '0', zIndex: 40,
        background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(212,175,55,0.4)',
        borderTop: '2px solid rgba(212,175,55,0.8)',
        padding: '1.25rem 0',
        boxShadow: '0 4px 30px rgba(0,0,0,0.06)'
      }}>
        <form onSubmit={e => { e.preventDefault(); handleApplyFilters(); }} style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         {/* Top Row: Primary Search & Actions */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 500px', flexWrap: 'wrap' }}>
               <div style={{ flex: '2 1 300px' }}>
                  <input type="text" placeholder="Search by event name, details, or swag..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{ padding: '0.75rem 1rem', background: '#f4f7f5', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', width: '100%' }}/>
               </div>
               <div style={{ flex: '1.5 1 200px' }}>
                 <input 
                   list="course-list" 
                   placeholder="All Courses" 
                   value={courseFilter === 'All' ? '' : courseFilter}
                   onChange={e => setCourseFilter(e.target.value || 'All')}
                   style={{ padding: '0.75rem 1rem', background: '#f4f7f5', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', width: '100%' }}
                 />
                 <datalist id="course-list">
                   {uniqueCourses.map(c => <option key={c} value={c} />)}
                 </datalist>
               </div>
               <div style={{ flex: '1.5 1 200px', display: 'flex', gap: '0.5rem' }}>
                 <input type="text" placeholder="Zip or City" value={zipCode} onChange={e => setZipCode(e.target.value)} style={{ padding: '0.75rem 1rem', background: '#f4f7f5', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', flex: 1, minWidth: '80px' }}/>
                 <select value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ padding: '0.75rem 1rem', background: '#f4f7f5', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', width: '90px' }}>
                   <option value={5}>5 mi</option>
                   <option value={20}>20 mi</option>
                   <option value={50}>50 mi</option>
                   <option value={100}>100 mi</option>
                   <option value={500}>State</option>
                 </select>
               </div>
            </div>

            {/* Radar Button Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
               {userId ? (
                 <button type="button" className="btn-hero-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', borderWidth: '2px' }} onClick={() => alert('Radar saved! Email notifications enabled.')}>
                    <Bell size={16} /> Save Radar Notification 
                 </button>
               ) : (
                 <SignInButton mode="modal" fallbackRedirectUrl="/tournaments">
                   <button type="button" className="btn-hero-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', borderWidth: '2px' }}>
                      <Bell size={16} /> Log In to Save Radar
                   </button>
                 </SignInButton>
               )}
            </div>
         </div>
         
         {/* Bottom Row: Secondary Nuanced Filters */}
         <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid rgba(26,46,26,0.05)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Search size={14} /> Refine:
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.8rem', background: '#fff' }} />
               <span style={{ color: 'var(--mist)', fontSize: '0.8rem' }}>to</span>
               <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.8rem', background: '#fff' }} />
             </div>

             <select value={format} onChange={e => setFormat(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.8rem', background: '#fff' }}>
                <option value="All">All Formats</option>
                <option value="Stroke Play">Stroke Play</option>
                <option value="Scramble">Scramble</option>
                <option value="Match Play">Match Play</option>
                <option value="Best Ball">Best Ball</option>
             </select>

             <select value={accessType} onChange={e => setAccessType(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.8rem', background: '#fff' }}>
                <option value="All">Public + Private</option>
                <option value="Public">Public Only</option>
                <option value="Private">Private Only</option>
             </select>

             <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mist)', fontSize: '0.85rem' }}>$</span>
                <input type="number" placeholder="Max Fee" value={maxFee} onChange={e => setMaxFee(e.target.value ? Number(e.target.value) : '')} style={{ padding: '0.4rem 0.8rem 0.4rem 1.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.8rem', width: '100px', background: '#fff' }} />
             </div>

             <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--forest)', cursor: 'pointer', fontWeight: 500 }}>
                <input type="checkbox" checked={requireOpenReg} onChange={e => setRequireOpenReg(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--grass)' }} /> Reg Open
             </label>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--forest)', cursor: 'pointer', fontWeight: 500 }}>
                <input type="checkbox" checked={requireSpots} onChange={e => setRequireSpots(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--grass)' }} /> Has Spots
             </label>

             <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
               <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--forest)', padding: '0.4rem 1rem', background: 'rgba(26,46,26,0.06)', borderRadius: '6px' }}>
                  {filteredTournaments.length} Matches Found
               </span>
               <button type="submit" className="btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', borderRadius: '6px' }}>Apply Filters</button>
               <button onClick={handleClearFilters} type="button" style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '0.8rem', cursor: 'pointer', padding: '0.4rem 0.5rem', fontWeight: 600 }}>Clear</button>
             </div>
         </div>
        </form>
      </div>

      {/* Main Results Grid (1400px Width) */}
      <div style={{ padding: '4rem 2rem', background: '#f8faf9', minHeight: '60vh' }}>
          <div className="tournaments-grid" style={{ maxWidth: '1400px', margin: '0 auto', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
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
            <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(26,46,26,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
               <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>⛳</span>
               <h3 style={{ fontSize: '1.4rem', color: 'var(--forest)', marginBottom: '0.5rem', fontWeight: 600 }}>No tournaments found in database</h3>
               <p style={{ color: 'var(--mist)' }}>Dial back your CSV filters or search a wider proximity to locate events.</p>
               <button onClick={handleClearFilters} className="btn-hero-outline" style={{ marginTop: '1.5rem' }}>Reset All Filters</button>
            </div>
          )}
      </div>
    </>
  );
}
