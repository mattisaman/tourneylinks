import React from 'react';
import Link from 'next/link';
import { db, sponsorship_packages, tournaments } from '@/lib/db';
import { eq, desc, and, gt } from 'drizzle-orm';
import { Map, Search, MapPin, Building2, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SponsorsDirectoryPage() {
    // Fetch all active sponsorship packages
    const packages = await db.select({
        package: sponsorship_packages,
        tournament: tournaments
    })
    .from(sponsorship_packages)
    .innerJoin(tournaments, eq(sponsorship_packages.tournamentId, tournaments.id))
    .where(and(
        eq(sponsorship_packages.isActive, true),
        gt(sponsorship_packages.spotsAvailable, sponsorship_packages.spotsSold)
    ))
    .orderBy(desc(sponsorship_packages.createdAt));

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingTop: '80px', fontFamily: '"Inter", sans-serif' }}>
            {/* HERO SECTION */}
            <div style={{ background: 'linear-gradient(to bottom, #111 0%, #0a0a0a 100%)', borderBottom: '1px solid #222', padding: '4rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '1.5rem' }}>
                        <Building2 size={16} /> B2B CORPORATE SPONSORSHIPS
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>Sponsor the Local Golf Ecosystem.</h1>
                    <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        Browse high-impact charity scrambles and corporate outings in your zip code. Buy title sponsorships digitally, instantly upload your brand logo, and put your business directly in front of the local golf demographic.
                    </p>
                </div>
            </div>

            {/* DIRECTORY SPLIT SCREEN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 400px)' }}>
                
                {/* LEFT PANE: LIST & FILTERS */}
                <div style={{ padding: '3rem', borderRight: '1px solid #222', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input type="text" placeholder="Search by zip code or city..." style={{ width: '100%', background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '1rem 1rem 1rem 3rem', color: '#fff', fontSize: '1rem' }} />
                        </div>
                        <select style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '0 1.5rem', color: '#fff', cursor: 'pointer' }}>
                            <option>All Packages</option>
                            <option>Title Sponsors (&gt;$1,000)</option>
                            <option>Hole Sponsors (&lt;$500)</option>
                        </select>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} style={{ color: 'var(--gold)' }} />
                        Available Packages ({packages.length})
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {packages.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', background: '#111', borderRadius: '12px', border: '1px dashed #333' }}>
                                <p style={{ color: '#666' }}>No sponsorships are currently listed in the directory.</p>
                            </div>
                        ) : packages.map((pkg) => (
                            <Link key={pkg.package.id} href={`/t/${pkg.tournament.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }} className="hover:border-[var(--gold)]">
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px', color: '#ccc' }}>
                                                {pkg.package.spotsAvailable - pkg.package.spotsSold} AVAIL
                                            </span>
                                            {pkg.tournament.isCharity && (
                                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: '4px', fontWeight: 600 }}>501(c)(3) Charity</span>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{pkg.package.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#888', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {pkg.tournament.courseCity}, {pkg.tournament.courseState}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {pkg.tournament.dateStart}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>${pkg.package.amount}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                                            View Tournament <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANE: MAPBOX (Simulated) */}
                <div style={{ background: '#1a1a1a', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Simulated Map Background - Using radial gradients to look techy/data-driven */}
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #222 0%, #0a0a0a 100%)', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.5 }} />
                    
                    <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                        <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <MapPin size={40} style={{ color: 'var(--gold)' }} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Interactive Heatmap Offline</h2>
                        <p style={{ color: '#888', maxWidth: '300px', margin: '0 auto' }}>Mapbox Integration pending Phase 4. Search and filter using the directory on the left.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
