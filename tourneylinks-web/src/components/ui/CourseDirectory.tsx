'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CourseDirectory() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [states, setStates] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const [appliedFilters, setAppliedFilters] = useState({
    q: '',
    state: '',
    type: 'All',
  });

  useEffect(() => {
    fetchCourses();
  }, [page, appliedFilters]);

  async function fetchCourses() {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set('page', page.toString());
      p.set('limit', '24');
      if (appliedFilters.q) p.set('q', appliedFilters.q);
      if (appliedFilters.state) p.set('state', appliedFilters.state);
      if (appliedFilters.type !== 'All') p.set('type', appliedFilters.type);

      const res = await fetch(`/api/courses?${p.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data);
        setTotalCount(json.totalCount);
        if (json.states) setStates(json.states);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({ q: searchQuery, state: stateFilter, type: typeFilter });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStateFilter('');
    setTypeFilter('All');
    setPage(1);
    setAppliedFilters({ q: '', state: '', type: 'All' });
  };

  const getGradient = (index: number) => {
    const gradients = [
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(135deg, #1a4a1a 0%, #2d6b2d 50%, #3d8b3d 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(0deg, #2d4a2d 0%, #5a8c3a 50%, #8fbc5a 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(45deg, #1a2e1a 0%, #2c3e50 50%, #3498db 100%)",
      "linear-gradient(to top, rgba(26,46,26,0.9) 0%, transparent 60%), linear-gradient(180deg, #1a2e1a 0%, #000 100%)"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="section-wrapper" id="explore" style={{ padding: '4rem 3rem' }}>
      <div className="section-header" style={{ marginBottom: '3rem' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '3rem' }}>Course Directory</h1>
          <p className="section-sub" style={{ maxWidth: '600px' }}>
            Browse our comprehensive database of over 16,000 public and private golf courses nationwide. Log in to claim and manage your course's profile.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Filter Sidebar */}
        <div style={{ background: 'var(--white)', border: '1px solid rgba(26,46,26,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)', marginBottom: '1.5rem' }}>Filters</h3>
            
            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>🔍 Name or Zip</label>
              <input 
                type="text" 
                placeholder="Course name, city, zip..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleApplyFilters()}
              />
            </div>
            
            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>State</label>
              <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
                <option value="">All States</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="wfield" style={{ marginBottom: '1.25rem' }}>
              <label>Course Access</label>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Semi-Private">Semi-Private</option>
                <option value="Resort">Resort</option>
                <option value="Municipal">Municipal</option>
              </select>
            </div>
            
            <button onClick={handleApplyFilters} className="btn-primary" style={{ width: '100%', padding: '0.9rem', textAlign: 'center', display: 'block', fontSize: '0.95rem' }}>
              Apply Filters
            </button>
          </div>
          
          <div style={{ marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(26,46,26,0.06)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--mist)', textAlign: 'center' }}>
              {totalCount.toLocaleString()} courses match
            </div>
            {(appliedFilters.q || appliedFilters.state || appliedFilters.type !== 'All') && (
              <button 
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', color: 'var(--mist)', fontSize: '0.8rem', textDecoration: 'underline', marginTop: '0.75rem', cursor: 'pointer', fontWeight: 500, padding: 0, width: '100%', textAlign: 'center' }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', opacity: 0.5 }}>
               <span style={{ fontSize: '2rem' }}>⛳ Loading courses...</span>
            </div>
          ) : (
            <>
              <div className="tournaments-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {courses.map((c, i) => (
                  <div key={c.id} className="t-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div className="t-card-cover" style={{ height: '140px' }}>
                      <div className="cover-bg" style={{ background: getGradient(i) }}></div>
                      <div className="cover-overlay"></div>
                      <div className="cover-badges">
                        <span className="badge badge-format" style={{ background: 'var(--gold)', color: '#fff', border: 'none' }}>{c.type || 'Undefined'}</span>
                         {c.holes ? <span className="badge badge-soon" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>{c.holes} Holes</span> : null}
                      </div>
                    </div>
                    
                    <div className="t-card-body">
                      <h3 className="t-card-title">{c.name}</h3>
                      <div className="t-card-location">
                        <span role="img" aria-label="location">📍</span> {c.city}, {c.state} {c.zip}
                      </div>
                      
                      <div className="t-card-details">
                        <div>
                          <div className="t-detail-label">Par</div>
                          <div className="t-detail-val">{c.par || '72'}</div>
                        </div>
                        {c.phone && (
                          <div>
                            <div className="t-detail-label">Phone</div>
                            <div className="t-detail-val">{c.phone}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Removed empty buttons per user request */}
                  </div>
                ))}
              </div>
              
              {courses.length === 0 && (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(26,46,26,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(26,46,26,0.1)' }}>
                   <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>⛳</span>
                   <h3 style={{ fontSize: '1.2rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>No courses found</h3>
                   <p style={{ color: 'var(--mist)' }}>Try adjusting your filters or search query.</p>
                </div>
              )}

              {/* Pagination Controls */}
              {totalCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                    style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: '1px solid var(--forest)', background: page === 1 ? 'transparent' : 'var(--forest)', color: page === 1 ? 'var(--forest)' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>
                  <span style={{ color: 'var(--forest)', fontWeight: 600 }}>Page {page} of {Math.ceil(totalCount / 24)}</span>
                  <button 
                    disabled={page >= Math.ceil(totalCount / 24)} 
                    onClick={() => setPage(page + 1)}
                    style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: '1px solid var(--forest)', background: page >= Math.ceil(totalCount / 24) ? 'transparent' : 'var(--forest)', color: page >= Math.ceil(totalCount / 24) ? 'var(--forest)' : '#fff', cursor: page >= Math.ceil(totalCount / 24) ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(totalCount / 24) ? 0.5 : 1 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
