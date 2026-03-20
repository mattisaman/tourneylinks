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
    <div className="container" style={{ paddingBottom: '6rem' }}>
      
      {/* Search Console */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(26,46,26,0.05)', marginBottom: '3rem', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input 
              type="text" 
              placeholder="Search by course name, city, or zip..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: '#f4f7f5', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          <button className="btn-primary" style={{ flex: '0 0 auto', padding: '0 2rem' }}>
            Search Database
          </button>
        </div>
      </div>

      {/* Registry Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
         <div style={{ fontSize: '0.9rem', color: 'var(--mist)', fontWeight: 500 }}>
           {loading ? 'Searching registry...' : `Found ${total.toLocaleString()} courses matching your criteria`}
         </div>
         <Link href="/system/ingest-course" style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Missing a course? Ingest it now <ChevronRight size={16} />
         </Link>
      </div>

      {/* Course Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {results.map(course => (
          <Link href={`/courses/${course.id}`} key={course.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(26,46,26,0.08)', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-4px)';
                   e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                   e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = 'none';
                   e.currentTarget.style.borderColor = 'rgba(26,46,26,0.08)';
                 }}>
              
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: "'Clash Display', sans-serif", color: 'var(--forest)', margin: 0, lineHeight: 1.2 }}>
                    {course.name}
                  </h3>
                  {course.isActive && <CheckCircle2 size={20} color="var(--gold)" />}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--mist)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <MapPin size={16} />
                  <span>{course.city}, {course.state} {course.zip}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: '#fafaf5', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.2rem' }}>Holes</div>
                    <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '1.1rem' }}>{course.holes || '18'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.2rem' }}>Par</div>
                    <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '1.1rem' }}>{course.par || '72'}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(26,46,26,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfdfb' }}>
                 <span style={{ fontSize: '0.85rem', color: 'var(--mist)' }}>{course.type || 'Public Golf Course'}</span>
                 <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>Host an Event &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
