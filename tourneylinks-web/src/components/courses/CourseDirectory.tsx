"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Flag, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CourseDirectory({ 
  initialCourses = [], 
  initialTotal = 0 
}: { 
  initialCourses?: any[], 
  initialTotal?: number 
}) {
  const [query, setQuery] = useState('');
  const [zip, setZip] = useState('');
  const [radius, setRadius] = useState(50);
  const [stateFilter, setStateFilter] = useState('All');
  
  const [results, setResults] = useState<any[]>(initialCourses);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(initialCourses.length === 0);
  const [page, setPage] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);

  // Debounced search trigger (skips initial mount if server rendered)
  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      if (initialCourses.length > 0) return; // Skip fetch on first load if we have SSR data
    }
    const timer = setTimeout(() => {
      setPage(1);
      fetchCourses(query, zip, radius, stateFilter, 1, true);
    }, 300); 
    return () => clearTimeout(timer);
  }, [query, zip, radius, stateFilter]);

  const fetchCourses = async (searchStr: string, z: string, r: number, s: string, pageNum: number = 1, isNewSearch: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/search?q=${encodeURIComponent(searchStr)}&zip=${encodeURIComponent(z)}&radius=${r}&state=${encodeURIComponent(s)}&page=${pageNum}`);
      const data = await res.json();
      
      if (isNewSearch) {
         setResults(data.courses || []);
      } else {
         setResults(prev => [...prev, ...(data.courses || [])]);
      }
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const US_STATES = ['All', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  return (
    <div style={{ width: '100%', maxWidth: '96%', margin: '0 auto', padding: '0', paddingBottom: '6rem' }}>
      
      {/* Search Console */}
      <div className="animated-gold-border" style={{ background: 'rgba(20,35,20,0.6)', backdropFilter: 'blur(16px)', borderRadius: '16px', padding: '1.5rem', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: '2 1 300px', position: 'relative' }}>
             <style>{`.search-input::placeholder { color: var(--forest); opacity: 0.65; }`}</style>
             <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--forest)' }} />
             <input 
               className="search-input"
               type="text" 
               placeholder="Keyword search..." 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#FDFBF7', border: '2px solid rgba(201,168,76,0.3)', borderRadius: '12px', fontSize: '1rem', color: 'var(--forest)', fontWeight: 600, outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}
             />
          </div>

          <div style={{ flex: '1 1 120px' }}>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ padding: '1rem', background: '#FDFBF7', border: '2px solid rgba(201,168,76,0.3)', borderRadius: '12px', width: '100%', fontSize: '1rem', color: 'var(--forest)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
               {US_STATES.map(state => <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>)}
            </select>
          </div>

          <div style={{ flex: '1.5 1 200px', display: 'flex', gap: '0.5rem' }}>
             <input type="text" placeholder="Zip or City" value={zip} onChange={e => setZip(e.target.value)} style={{ padding: '1rem', background: '#FDFBF7', border: '2px solid rgba(201,168,76,0.3)', borderRadius: '12px', flex: 1, minWidth: '100px', fontSize: '1rem', color: 'var(--forest)', fontWeight: 600, outline: 'none' }}/>
             <select value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ padding: '1rem', background: '#FDFBF7', border: '2px solid rgba(201,168,76,0.3)', borderRadius: '12px', width: '120px', fontSize: '1rem', color: 'var(--forest)', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
               <option value={5}>5 mi</option>
               <option value={20}>20 mi</option>
               <option value={50}>50 mi</option>
               <option value={100}>100 mi</option>
               <option value={500}>Anywhere</option>
             </select>
          </div>

        </div>
      </div>

      {/* Registry Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
         <div style={{ fontSize: '1.2rem', color: '#fffdf2', fontWeight: 700, textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.3)', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold)', display: loading ? 'none' : 'block' }}></span>
           {loading ? 'Searching registry...' : `Found ${total.toLocaleString()} courses matching your criteria`}
         </div>
         <Link href="/system/ingest-course" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', textShadow: '0 2px 8px rgba(0,0,0,0.8)', background: 'rgba(0,0,0,0.4)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.3)', backdropFilter: 'blur(8px)' }} className="hover:bg-[rgba(212,175,55,0.1)] transition-all">
            Missing a course? <span style={{ color: 'white' }}>Ingest it now</span> <ChevronRight size={16} color="var(--gold)" />
         </Link>
      </div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
        {results.map(course => (
          <Link href={`/courses/${course.id}`} key={course.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
                 background: 'var(--white)',
                 borderRadius: '16px',
                 border: '1px solid rgba(0,0,0,0.05)',
                 position: 'relative',
                 display: 'flex',
                 flexDirection: 'column',
                 height: '100%',
                 transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                 boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-6px)';
                 e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
               }}>
              
              {/* Top Hero Image Layer */}
              <div style={{ 
                   height: '220px',
                   backgroundImage: course.heroImageUrl && course.heroImageUrl !== "DEFAULT_GRADIENT" 
                      ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%), url(${course.heroImageUrl})` 
                      : `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%), url('https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80&w=800')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   borderTopLeftRadius: '16px',
                   borderTopRightRadius: '16px',
                   position: 'relative'
                 }}>
                 
                 {course.rating && (
                   <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', color: 'var(--forest)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                     ⭐ {course.rating.toFixed(1)}
                   </div>
                 )}
              </div>

              {/* Bottom Info Layer */}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                   <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-sans)', color: 'var(--forest)', margin: 0, lineHeight: 1.2, fontWeight: 800 }}>
                     {course.name}
                   </h3>
                   {course.isActive && <CheckCircle2 size={18} color="var(--grass)" style={{ flexShrink: 0, marginLeft: '0.5rem' }} />}
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                   <MapPin size={14} color="var(--gold-dark)" />
                   <span>{course.city}, {course.state} {course.zip}</span>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.6rem 0.8rem', background: 'var(--admin-golf-white)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)', marginTop: 'auto', marginBottom: '1rem' }}>
                   <div>
                     <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.1rem', fontWeight: 700 }}>Holes</div>
                     <div style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1rem' }}>{course.holes || '18'}</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.1rem', fontWeight: 700 }}>Par</div>
                     <div style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1rem' }}>{course.par || '72'}</div>
                   </div>
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 600, padding: '0.2rem 0.6rem', background: 'rgba(0,0,0,0.04)', borderRadius: '20px' }}>
                       {course.type || 'Public Golf Course'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gold-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                       Host Event <ChevronRight size={14} />
                    </span>
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {results.length > 0 && results.length < total && (
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <button 
               onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchCourses(query, zip, radius, stateFilter, nextPage, false);
               }}
               disabled={loading}
               className="btn-hero-outline" 
               style={{ padding: '0.8rem 3rem', background: loading ? 'rgba(0,0,0,0.05)' : 'transparent', border: '2px solid var(--gold)', color: 'var(--gold)', borderRadius: '25px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
            >
               {loading ? 'Loading...' : 'Load More Courses'}
            </button>
         </div>
      )}

    </div>
  );
}
