import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import MissingCourseLinkWidget from '@/components/courses/MissingCourseLinkWidget';

export const dynamic = 'force-dynamic';

export default async function CoursePage(props: { params: Promise<{ id: string }> | { id: string } }) {
  const rawParams = await props.params;
  const courseId = parseInt(rawParams.id, 10);

  if (isNaN(courseId)) {
    notFound();
  }

  const courseRows = await db.select().from(courses).where(eq(courses.id, courseId));
  const course = courseRows[0];

  if (!course) {
    notFound();
  }

  // Attempt to parse RapidAPI JSON
  let apiData: any = null;
  if (course.rawMetadata && course.rawMetadata.trim().startsWith('{')) {
    try {
      apiData = JSON.parse(course.rawMetadata);
    } catch (e) {
      console.error('Failed to parse rawMetadata JSON for course', courseId);
    }
  }

  const scorecard = apiData?.scorecard || [];
  const teeBoxes = apiData?.teeBoxes || [];

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Header / Hero */}
      <div style={{ 
        background: 'linear-gradient(to right, #1a2e1a, #2d4a2d)', 
        color: '#fff', 
        padding: '5rem 3rem 3rem 3rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/courses" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
            ← Back to Directory
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: 'var(--gold)', color: '#fff', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '4px' }}>
              {course.type || 'GOLF FACILITY'}
            </span>
            {apiData ? (
              <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                ✨ Verified Data
              </span>
            ) : null}
          </div>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
            {course.name}
          </h1>
          <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>📍 {course.city}, {course.state}</span>
            <span>⛳ {course.holes || (apiData?.holes) || '18'} Holes</span>
            <span>{course.par ? `Par ${course.par}` : ''}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Sidebar Info */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--forest)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>Course Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '0.25rem' }}>Address</div>
              <div style={{ fontWeight: 500 }}>{course.address || (apiData?.address)}</div>
              <div style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>{course.city}, {course.state} {course.zip || apiData?.zip}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '0.25rem' }}>Contact</div>
              <div style={{ fontWeight: 500 }}>{course.phone || (apiData?.phone) || 'N/A'}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {course.website || apiData?.website ? (
                  <a href={course.website || apiData?.website} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '0.5rem', display: 'block', textAlign: 'center', padding: '0.8rem', fontSize: '0.9rem', width: '100%', boxShadow: 'none' }}>
                    Visit Official Website ↗
                  </a>
                ) : (
                  <>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(`${course.name} ${course.state} golf course`)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--forest)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                      🔍 Search on Google ↗
                    </a>
                    
                    <div style={{ background: 'rgba(26,46,26,0.03)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(26,46,26,0.08)', marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.25rem' }}>Is this your course?</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '0.5rem' }}>Help us maintain accurate data. Do you know the official website URL?</div>
                      <MissingCourseLinkWidget courseId={course.id} courseName={course.name} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {teeBoxes.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '0.5rem' }}>Tee Box Difficulty Index</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {teeBoxes.map((tee: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{tee.tee} Tees</span>
                      <span style={{ color: 'var(--mist)' }}>Slope {tee.slope || '--'} / Ratio {tee.handicap || '--'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div>
          {scorecard.length > 0 ? (
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--forest)', fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Course Scorecard Matrix</h2>
              
              <div style={{ width: '100%', overflowX: 'auto', background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '800px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem', background: 'rgba(26,46,26,0.03)', borderBottom: '2px solid rgba(26,46,26,0.1)', ...holeLabelStyle }}>HOLE</th>
                      {scorecard.map((h: any) => (
                        <th key={h.Hole} style={{ padding: '1rem 0.5rem', background: 'rgba(26,46,26,0.03)', borderBottom: '2px solid rgba(26,46,26,0.1)', color: 'var(--forest)', fontWeight: 700 }}>
                          {h.Hole}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Par Row */}
                    <tr>
                      <td style={rowLabelStyle}>Par</td>
                      {scorecard.map((h: any) => (
                        <td key={h.Hole} style={cellStyle}>{h.Par || '-'}</td>
                      ))}
                    </tr>
                    
                    {/* Handicap Row */}
                    <tr>
                      <td style={rowLabelStyle}>HCP</td>
                      {scorecard.map((h: any) => (
                        <td key={h.Hole} style={cellStyle}>{h.Handicap || '-'}</td>
                      ))}
                    </tr>

                    {/* Yardage Rows (Extracted from nested tees) */}
                    {Object.keys(scorecard[0]?.tees || {}).map((teeKey) => {
                       const teeColor = scorecard[0].tees[teeKey].color;
                       return (
                         <tr key={teeKey}>
                           <td style={rowLabelStyle}>{teeColor} Yds</td>
                           {scorecard.map((h: any) => (
                             <td key={h.Hole} style={cellStyle}>{h.tees?.[teeKey]?.yards || '-'}</td>
                           ))}
                         </tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(26,46,26,0.02)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(26,46,26,0.1)' }}>
               <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>⛳</span>
               <h3 style={{ fontSize: '1.2rem', color: 'var(--forest)', marginBottom: '0.5rem' }}>Detailed course layout unavailable</h3>
               <p style={{ color: 'var(--mist)' }}>This course has not yet been enriched with hole-by-hole analytics.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}

const holeLabelStyle: React.CSSProperties = {
  textAlign: 'left',
  fontWeight: 700,
  color: 'var(--forest)',
  textTransform: 'uppercase',
  fontSize: '0.85rem',
  letterSpacing: '1px'
};

const rowLabelStyle: React.CSSProperties = {
  padding: '1rem',
  textAlign: 'left',
  fontWeight: 600,
  color: 'var(--mist)',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  borderRight: '1px solid rgba(0,0,0,0.05)',
  fontSize: '0.9rem'
};

const cellStyle: React.CSSProperties = {
  padding: '1rem 0.5rem',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  borderRight: '1px solid rgba(0,0,0,0.02)',
  fontSize: '0.9rem',
  color: '#333'
};
