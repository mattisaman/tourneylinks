import React from 'react';
import { db, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { MapPin, Phone, Globe, ChevronLeft, Map, Flag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const courseId = parseInt(params.id, 10);
  if (isNaN(courseId)) notFound();

  const courseRows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const course = courseRows[0];

  if (!course) notFound();

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>

      <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '6rem' }}>
        <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '2rem', transition: 'color 0.2s' }}>
            <ChevronLeft size={16} /> Back to Directory
          </Link>

          {/* Hero Premium Card */}
          <div style={{ background: 'var(--ink)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
             <div style={{ background: 'linear-gradient(135deg, #152b1b 0%, rgba(10,20,10,0.9) 100%)', height: '160px', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 100% 0%, var(--gold) 0%, transparent 60%)' }} />
             </div>
             
             <div style={{ padding: '2.5rem', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                <span style={{ background: 'var(--gold)', color: 'var(--ink)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(201,168,76,0.3)', display: 'inline-block', marginBottom: '1rem' }}>
                   {course.type || 'Public Course'}
                </span>
                
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, color: 'var(--white)', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                  {course.name}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '2rem' }}>
                  <MapPin size={18} />
                  <span>{course.city}, {course.state} {course.zip}</span>
                </div>

                {/* KPI Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Holes</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--gold)', fontSize: '1.5rem' }}>
                       <Flag size={20} color="var(--gold)" />
                       {course.holes || '18'}
                     </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Par</div>
                     <div style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '1.5rem' }}>
                       {course.par || '72'}
                     </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.4rem' }}>Architect</div>
                     <div style={{ fontWeight: 600, color: 'var(--white)', fontSize: '1.1rem' }}>
                       {course.architect || 'Unknown'}
                     </div>
                  </div>
                </div>

                {/* AI Extracted Amenities & Policies Section */}
                <div style={{ marginBottom: '3rem' }}>
                  {(course.hasDrivingRange || course.hasPuttingGreen || course.hasChippingArea || course.hasProShop) && (
                    <>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '1rem', fontWeight: 600 }}>Available Amenities</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {course.hasDrivingRange && <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--white)', fontSize: '0.85rem' }}>Driving Range</span>}
                        {course.hasPuttingGreen && <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--white)', fontSize: '0.85rem' }}>Putting Green</span>}
                        {course.hasChippingArea && <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--white)', fontSize: '0.85rem' }}>Chipping Area</span>}
                        {course.hasProShop && <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', color: 'var(--white)', fontSize: '0.85rem' }}>Pro Shop</span>}
                        {course.yearBuilt && <span style={{ padding: '0.4rem 1rem', background: 'rgba(201,168,76,0.1)', borderRadius: '20px', color: 'var(--gold)', fontSize: '0.85rem' }}>Built in {course.yearBuilt}</span>}
                      </div>
                    </>
                  )}
                  {course.guestPolicy && (
                     <div style={{ background: 'rgba(201,168,76,0.05)', borderLeft: '3px solid var(--gold)', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Guest Policy</div>
                       <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.5 }}>{course.guestPolicy}</div>
                     </div>
                  )}
                </div>

                {/* Contact Banner */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   {course.phone && (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--white)', fontWeight: 500 }}>
                        <Phone size={18} color="var(--gold)" />
                        {course.phone}
                     </div>
                   )}
                   {course.email && (
                     <a href={`mailto:${course.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--white)', fontWeight: 500, textDecoration: 'none' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        {course.email}
                     </a>
                   )}
                   {course.website && (
                     <a href={course.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--white)', fontWeight: 500, textDecoration: 'none' }}>
                        <Globe size={18} color="var(--gold)" />
                        Visit Official Website
                     </a>
                   )}
                   {course.address && (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--white)', fontWeight: 500 }}>
                        <Map size={18} color="var(--gold)" />
                        {course.address}, {course.city}, {course.state} {course.zip}
                     </div>
                   )}
                </div>

             </div>

             {/* Action Bar */}
             <div style={{ background: 'linear-gradient(90deg, #0f1c0f 0%, #152b1b 100%)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ color: 'var(--white)' }}>
                   <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', fontWeight: 600 }}>Host a Tournament Here</h3>
                   <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Register and manage your next event at this venue.</p>
                </div>
                <Link href={`/host?courseId=${course.id}&courseName=${encodeURIComponent(course.name)}&courseCity=${encodeURIComponent(course.city)}&courseState=${encodeURIComponent(course.state)}&courseZip=${course.zip || ''}`} className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--ink)', border: 'none', padding: '0.8rem 2rem' }}>
                   Plan Event Setup
                </Link>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
