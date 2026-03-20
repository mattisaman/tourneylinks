import React from 'react';
import { db, courses } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { MapPin, Phone, Globe, ChevronLeft, Map, Flag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id);
  if (isNaN(courseId)) notFound();

  const courseRows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  const course = courseRows[0];

  if (!course) notFound();

  return (
    <div style={{ background: '#fafaf5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, paddingTop: '100px', paddingBottom: '6rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--mist)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '2rem', transition: 'color 0.2s' }}>
            <ChevronLeft size={16} /> Back to Directory
          </Link>

          {/* Hero Premium Card */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(26,46,26,0.08)', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.03)' }}>
             <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, #153928 100%)', height: '160px', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 100% 0%, var(--gold) 0%, transparent 60%)' }} />
             </div>
             
             <div style={{ padding: '2.5rem', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                <span style={{ background: 'var(--gold)', color: 'var(--white)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(201,168,76,0.3)', display: 'inline-block', marginBottom: '1rem' }}>
                   {course.type || 'Public Course'}
                </span>
                
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: "'Clash Display', sans-serif", fontWeight: 600, color: 'var(--forest)', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                  {course.name}
                </h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--mist)', fontSize: '1rem', marginBottom: '2rem' }}>
                  <MapPin size={18} />
                  <span>{course.city}, {course.state} {course.zip}</span>
                </div>

                {/* KPI Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                  <div style={{ background: '#f8fdfa', border: '1px solid rgba(26,46,26,0.05)', padding: '1.25rem', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.4rem' }}>Holes</div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--forest)', fontSize: '1.5rem' }}>
                       <Flag size={20} color="var(--gold)" />
                       {course.holes || '18'}
                     </div>
                  </div>
                  <div style={{ background: '#f8fdfa', border: '1px solid rgba(26,46,26,0.05)', padding: '1.25rem', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.4rem' }}>Par</div>
                     <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '1.5rem' }}>
                       {course.par || '72'}
                     </div>
                  </div>
                  <div style={{ background: '#f8fdfa', border: '1px solid rgba(26,46,26,0.05)', padding: '1.25rem', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mist)', marginBottom: '0.4rem' }}>Architect</div>
                     <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '1.1rem' }}>
                       {course.architect || 'Unknown'}
                     </div>
                  </div>
                </div>

                {/* Contact Banner */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', background: '#fafaf5', borderRadius: '12px', border: '1px solid rgba(26,46,26,0.05)' }}>
                   {course.phone && (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--forest)', fontWeight: 500 }}>
                        <Phone size={18} color="var(--gold)" />
                        {course.phone}
                     </div>
                   )}
                   {course.website && (
                     <a href={course.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--forest)', fontWeight: 500, textDecoration: 'none' }}>
                        <Globe size={18} color="var(--gold)" />
                        Visit Official Website
                     </a>
                   )}
                   {course.address && (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--forest)', fontWeight: 500 }}>
                        <Map size={18} color="var(--gold)" />
                        {course.address}
                     </div>
                   )}
                </div>

             </div>

             {/* Action Bar */}
             <div style={{ background: 'var(--forest)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ color: 'var(--white)' }}>
                   <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', fontWeight: 600 }}>Host a Tournament Here</h3>
                   <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Register and manage your next event at this venue.</p>
                </div>
                <Link href="/host" className="btn-primary" style={{ background: 'var(--gold)', color: 'var(--white)', border: 'none', padding: '0.8rem 2rem' }}>
                   Plan Event Setup
                </Link>
             </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
