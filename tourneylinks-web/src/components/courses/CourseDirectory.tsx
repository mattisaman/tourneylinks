"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Flag, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CourseDirectory() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(query);
    }, query ? 300 : 0); // 300ms debounce on active typing
    return () => clearTimeout(timer);
  }, [query]);

  const fetchCourses = async (searchStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/search?q=${encodeURIComponent(searchStr)}`);
      const data = await res.json();
      setResults(data.courses || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', paddingBottom: '6rem' }}>
      
      {/* Search Console */}
      <div className="animated-gold-border" style={{ background: 'rgba(20,35,20,0.6)', backdropFilter: 'blur(16px)', borderRadius: '16px', padding: '1.5rem', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
             <style>{`.search-input::placeholder { color: var(--forest); opacity: 0.65; }`}</style>
             <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--forest)' }} />
             <input 
               className="search-input"
               type="text" 
               placeholder="search by name, city, state, or zip" 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', background: '#FDFBF7', border: '2px solid rgba(201,168,76,0.3)', borderRadius: '12px', fontSize: '1.1rem', color: 'var(--forest)', fontWeight: 600, outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}
               onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 4px rgba(201,168,76,0.1)'; }}
               onBlur={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.3)'; e.target.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.05)'; }}
             />
          </div>
          <button className="btn-primary" style={{ flex: '0 0 auto', padding: '0 2rem', background: 'var(--gold)', color: 'var(--ink)' }}>
            Search Database
          </button>
        </div>
      </div>

      {/* Registry Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
         <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
           {loading ? 'Searching registry...' : `Found ${total.toLocaleString()} courses matching your criteria`}
         </div>
         <Link href="/system/ingest-course" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', textShadow: '0 0 12px rgba(201,168,76,0.2)' }}>
            Missing a course? Ingest it now <ChevronRight size={16} />
         </Link>
      </div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {results.map(course => (
          <Link href={`/courses/${course.id}`} key={course.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="course-card gold-foil-hover" style={{
                 background: 'var(--ink)',
                 borderRadius: '16px',
                 border: '1px solid rgba(201,168,76,0.15)',
                 position: 'relative',
                 overflow: 'hidden',
                 display: 'flex',
                 flexDirection: 'column',
                 height: '100%',
                 transition: 'all 0.3s ease'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-6px)';
                 e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
              
              <div style={{ background: 'linear-gradient(180deg, rgba(26,46,26,0.9) 0%, var(--ink) 100%)', borderRadius: '15px', padding: '1px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ padding: '1.5rem', flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                     <h3 style={{ fontSize: '1.25rem', fontFamily: "'Clash Display', sans-serif", color: 'var(--white)', margin: 0, lineHeight: 1.2 }}>
                       {course.name}
                     </h3>
                     {course.isActive && <CheckCircle2 size={20} color="var(--gold)" />}
                   </div>

                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                     <MapPin size={16} />
                     <span>{course.city}, {course.state} {course.zip}</span>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div>
                       <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem' }}>Holes</div>
                       <div style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '1.1rem' }}>{course.holes || '18'}</div>
                     </div>
                     <div>
                       <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem' }}>Par</div>
                       <div style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '1.1rem' }}>{course.par || '72'}</div>
                     </div>
                   </div>
                 </div>

                 <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{course.type || 'Public Golf Course'}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>Host an Event &rarr;</span>
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
