'use client';

import React, { useState, useMemo } from 'react';

// Sample data ported from prototype
const ALL_COURSES = [
  { id:1, name:"Bethpage State Park — Black Course", city:"Farmingdale", state:"NY", region:"Long Island", type:"Public", holes:18, par:71, rating:75.4, slope:148, stars:5.0, reviews:412, icon:"⛳", featured:true, desc:"One of America's most iconic public courses and host of two US Opens. The Black Course is a true test for serious golfers. Dramatic fairways, deep rough, and a storied history.", amenities:["Range","Caddies","Tournament Packages","Catering"] },
  { id:2, name:"Bethpage State Park — Red Course", city:"Farmingdale", state:"NY", region:"Long Island", type:"Public", holes:18, par:70, rating:70.1, slope:121, stars:4.5, reviews:218, icon:"🌿", featured:false, desc:"The most popular of Bethpage's five courses. The Red offers a fair but engaging layout suitable for a wide range of handicaps.", amenities:["Range","Tournament Packages"] },
  { id:4, name:"Shinnecock Hills Golf Club", city:"Southampton", state:"NY", region:"Long Island", type:"Private", holes:18, par:70, rating:74.9, slope:143, stars:5.0, reviews:88, icon:"🏆", featured:true, desc:"A legendary links-style course and perennial US Open host. Shinnecock Hills sits among the most revered golf courses in the world, with sweeping views of the Peconic Bay.", amenities:["Caddies","Tournament Packages","Catering"] },
  { id:19, name:"Saratoga Spa Golf Course", city:"Saratoga Springs", state:"NY", region:"Capital Region", type:"Public", holes:18, par:72, rating:70.9, slope:124, stars:4.5, reviews:178, icon:"💧", featured:true, desc:"Nestled in Saratoga Spa State Park, this historic course offers stunning natural surroundings and excellent facilities. A must-play in the Capital Region.", amenities:["Range","Tournament Packages","Catering","Practice Facility"] },
  { id:30, name:"Ravenwood Golf Club", city:"Victor", state:"NY", region:"Rochester & Victor", type:"Public", holes:18, par:72, rating:73.2, slope:136, stars:4.8, reviews:201, icon:"🦅", featured:true, desc:"Ranked among the top public courses in New York State, Ravenwood is a links-style masterpiece carved through a wetlands nature preserve with dramatic elevation changes, wide-open vistas, and superb conditioning. One of the premier tournament venues in the Rochester area.", amenities:["Range","Tournament Packages","Catering","Practice Facility"] },
  { id:41, name:"Cog Hill Golf & Country Club", city:"Lemont", state:"IL", region:"Chicagoland", type:"Public", holes:72, par:72, rating:74.1, slope:142, stars:4.9, reviews:387, icon:"🌿", featured:true, desc:"Home to four championship courses including the legendary Dubsdread. Cog Hill has hosted the PGA Tour's BMW Championship.", amenities:["Range","Caddies","Tournament Packages","Catering","Practice Facility"] },
  { id:44, name:"Ballyowen Golf Club", city:"Hamburg", state:"NJ", region:"North Jersey", type:"Public", holes:18, par:72, rating:73.2, slope:139, stars:4.8, reviews:213, icon:"☘️", featured:true, desc:"A links-style masterpiece in the New Jersey Highlands designed to evoke the heather-covered courses of Ireland. Consistently rated among the top 10 public courses in NJ.", amenities:["Range","Tournament Packages","Catering","Practice Facility"] }
];

export default function CourseDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('NY');
  const [typeFilter, setTypeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  
  const [modalCourse, setModalCourse] = useState<typeof ALL_COURSES[0] | null>(null);

  const filteredCourses = useMemo(() => {
    let result = ALL_COURSES;
    if (stateFilter) result = result.filter(c => c.state === stateFilter);
    if (typeFilter) result = result.filter(c => c.type === typeFilter);
    if (regionFilter) result = result.filter(c => c.region === regionFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q) || 
        c.region.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, stateFilter, typeFilter, regionFilter]);

  // Group by region
  const coursesByRegion = useMemo(() => {
    const map: Record<string, typeof ALL_COURSES> = {};
    filteredCourses.forEach(c => {
      if (!map[c.region]) map[c.region] = [];
      map[c.region].push(c);
    });
    return map;
  }, [filteredCourses]);

  const colorForType = (t: string) => {
    return t === 'Public' ? 'rgba(90,140,58,0.12)' : 
           t === 'Semi-Private' ? 'rgba(201,168,76,0.12)' : 
           t === 'Resort' ? 'rgba(45,74,135,0.12)' : 'rgba(192,57,43,0.1)';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Hero Search */}
      <div className="course-db-hero">
        <div className="course-db-hero-inner">
          <div className="course-db-title">⛳ Golf Course Database</div>
          <div className="course-db-sub">2,800+ courses nationwide · Contact any course to schedule your tournament</div>
          <div className="course-search-bar">
            <span style={{ fontSize: '1.1rem' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search by course name, city, or ZIP..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="course-search-divider"></div>
            <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setRegionFilter(''); }}>
              <option value="">All States</option>
              <option value="NY">New York</option>
              <option value="IL">Illinois</option>
              <option value="CA">California</option>
              <option value="FL">Florida</option>
              <option value="TX">Texas</option>
              <option value="AZ">Arizona</option>
              <option value="NJ">New Jersey</option>
            </select>
            <div className="course-search-divider"></div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">Any Type</option>
              <option value="Public">Public</option>
              <option value="Semi-Private">Semi-Private</option>
              <option value="Private">Private</option>
              <option value="Resort">Resort</option>
            </select>
            <div className="course-search-divider"></div>
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
              <option value="">All Regions</option>
              <option value="New York City">New York City</option>
              <option value="Long Island">Long Island</option>
              <option value="Hudson Valley">Hudson Valley</option>
              <option value="Rochester & Victor">Rochester & Victor</option>
              <option value="Capital Region">Capital Region</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
          <div className="state-pills">
            <div className={`state-pill ${stateFilter === 'NY' ? 'active' : ''}`} onClick={() => {setStateFilter('NY'); setRegionFilter('');}}>🗽 New York</div>
            <div className={`state-pill ${stateFilter === 'NJ' ? 'active' : ''}`} onClick={() => {setStateFilter('NJ'); setRegionFilter('');}}>New Jersey</div>
            <div className={`state-pill ${stateFilter === 'FL' ? 'active' : ''}`} onClick={() => {setStateFilter('FL'); setRegionFilter('');}}>Florida</div>
            <div className={`state-pill ${stateFilter === '' ? 'active' : ''}`} onClick={() => {setStateFilter(''); setRegionFilter('');}}>🌎 All States</div>
          </div>
        </div>
      </div>

      {/* Body: sidebar + results */}
      <div className="course-db-body">
        {/* Sidebar Filters */}
        <div className="course-sidebar">
          <div className="course-filter-group">
            <div className="course-filter-label">Course Type</div>
            <label className="filter-check"><input type="checkbox" defaultChecked /> <span>Public</span> <em>1,840</em></label>
            <label className="filter-check"><input type="checkbox" defaultChecked /> <span>Semi-Private</span> <em>620</em></label>
            <label className="filter-check"><input type="checkbox" /> <span>Private</span> <em>290</em></label>
            <label className="filter-check"><input type="checkbox" defaultChecked /> <span>Resort</span> <em>50</em></label>
          </div>
          <div className="course-filter-group">
            <div className="course-filter-label">Holes</div>
            <label className="filter-check"><input type="checkbox" defaultChecked /> <span>18 Holes</span></label>
            <label className="filter-check"><input type="checkbox" defaultChecked /> <span>27 Holes</span></label>
            <label className="filter-check"><input type="checkbox" defaultChecked /> <span>36+ Holes</span></label>
            <label className="filter-check"><input type="checkbox" /> <span>9 Holes</span></label>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.4rem' }}>📮 Add a Course</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5, marginBottom: '0.75rem' }}>Don't see your course? Submit it to our database.</div>
            <button className="btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.78rem' }}>Submit Course</button>
          </div>
        </div>

        {/* Results */}
        <div className="course-results">
          <div className="course-results-header">
            <div className="course-count">Showing <strong>{filteredCourses.length}</strong> courses in <strong>{stateFilter === 'NY' ? 'New York' : stateFilter || 'All States'}</strong></div>
            <select className="sort-select">
              <option>Sort: Rating (High–Low)</option>
              <option>Sort: Name A–Z</option>
              <option>Sort: Closest First</option>
            </select>
          </div>

          <div className="course-cards-list">
            {Object.keys(coursesByRegion).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)', fontSize: '0.875rem' }}>
                No courses match your filters. Try expanding your search.
              </div>
            ) : null}

            {Object.entries(coursesByRegion).map(([region, courses]) => (
              <React.Fragment key={region}>
                <div className="region-divider">📍 {region} &nbsp;·&nbsp; {courses.length} courses</div>
                {courses.map(c => (
                  <div key={c.id} className={`course-row ${c.featured ? 'featured' : ''}`} onClick={() => setModalCourse(c)}>
                    <div className="course-badge-icon" style={{ background: colorForType(c.type) }}>{c.icon}</div>
                    <div className="course-info">
                      <div className="course-row-name">
                        {c.name} {c.featured && <span className="course-tag course-tag-featured">⭐ Featured</span>}
                      </div>
                      <div className="course-row-loc">📍 {c.city}, {c.state} &nbsp;·&nbsp; {c.region}</div>
                      <div className="course-row-tags">
                        <span className={`course-tag ${c.type === 'Public' ? 'course-tag-public' : c.type === 'Semi-Private' ? 'course-tag-semi' : c.type === 'Private' ? 'course-tag-private' : ''}`}>{c.type}</span>
                        <span className="course-tag">{c.holes} Holes</span>
                        <span className="course-tag">Par {c.par}</span>
                        <span className="course-tag">Rating {c.rating} / Slope {c.slope}</span>
                      </div>
                    </div>
                    <div className="course-row-actions">
                      <div className="course-row-rating">{c.stars.toFixed(1)}★ <span style={{ fontSize: '0.75rem', color: 'var(--mist)', fontWeight: 400 }}>({c.reviews})</span></div>
                      <button className="btn-contact" onClick={(e) => { e.stopPropagation(); setModalCourse(c); }}>Contact Course</button>
                      <button className="btn-details" onClick={(e) => { e.stopPropagation(); setModalCourse(c); }}>Details →</button>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {modalCourse && (
        <div className="course-modal-overlay open" onClick={() => setModalCourse(null)}>
          <div className="course-modal" onClick={e => e.stopPropagation()}>
            <div className="course-modal-header">
              <button className="course-modal-close" onClick={() => setModalCourse(null)}>✕</button>
              <div className="course-modal-name">{modalCourse.name}</div>
              <div className="course-modal-loc">📍 {modalCourse.city}, {modalCourse.state} · {modalCourse.region} · {modalCourse.type}</div>
            </div>
            <div className="course-modal-body">
              <div className="course-stat-grid">
                <div className="course-stat"><div className="course-stat-val">{modalCourse.holes}</div><div className="course-stat-lbl">Holes</div></div>
                <div className="course-stat"><div className="course-stat-val">Par {modalCourse.par}</div><div className="course-stat-lbl">Par</div></div>
                <div className="course-stat"><div className="course-stat-val">{modalCourse.rating}</div><div className="course-stat-lbl">Course Rating</div></div>
                <div className="course-stat"><div className="course-stat-val">{modalCourse.slope}</div><div className="course-stat-lbl">Slope Rating</div></div>
                <div className="course-stat"><div className="course-stat-val">{modalCourse.stars}★</div><div className="course-stat-lbl">Player Rating</div></div>
                <div className="course-stat"><div className="course-stat-val">{modalCourse.reviews}</div><div className="course-stat-lbl">Reviews</div></div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '0.6rem' }}>About This Course</div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--mist)' }}>{modalCourse.desc}</p>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem' }}>📬 Contact This Course</div>
              <div className="contact-form-grid">
                <div className="contact-field"><label>Your Name</label><input type="text" placeholder="John Smith" /></div>
                <div className="contact-field"><label>Organization</label><input type="text" placeholder="Your Golf Club" /></div>
                <div className="contact-field"><label>Email</label><input type="email" placeholder="you@email.com" /></div>
                <div className="contact-field"><label>Phone</label><input type="tel" placeholder="+1 (555) 000-0000" /></div>
                <div className="contact-field full"><label>Message</label><textarea rows={3} placeholder="Inquire about availability..."></textarea></div>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }} onClick={() => setModalCourse(null)}>Send Inquiry →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
