'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { UploadDropzone } from "@/lib/uploadthing";

interface Tier {
  id: number;
  name: string;
  amount: number;
  description: string | null;
  spotsAvailable: number | null;
}

export default function SponsorSelectionClient({ tournamentId, tiers }: { tournamentId: number, tiers: Tier[] }) {
  const router = useRouter();
  
  const [selectedTierId, setSelectedTierId] = useState<number | null>(tiers[0]?.id || null);
  
  // Asset Collection
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submitSponsorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierId) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const parentTier = tiers.find(t => t.id === selectedTierId);
      if (!parentTier) throw new Error("Tier invalid");

      const res = await fetch('/api/stripe/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          tierId: selectedTierId,
          amount: parentTier.amount,
          companyName,
          contactEmail,
          websiteUrl,
          logoUrl
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize sponsorship session.');
      }

      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submitSponsorship}>
      
      {/* TIER SELECTION GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {tiers.map(tier => {
          const isSelected = selectedTierId === tier.id;
          return (
            <div 
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              style={{
                border: isSelected ? '2px solid var(--gold)' : '1px solid rgba(26,46,26,0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                cursor: 'pointer',
                background: isSelected ? '#fffcf5' : '#fff',
                position: 'relative',
                transition: 'all 0.2s cubic-bezier(0.1, 0, 0.1, 1)',
                boxShadow: isSelected ? '0 10px 30px rgba(212,175,55,0.15)' : 'none',
                transform: isSelected ? 'translateY(-4px)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.4rem', color: isSelected ? 'var(--forest)' : 'var(--ink)', fontWeight: 700 }}>
                  {tier.name}
                </h4>
                <div style={{ height: '24px', width: '24px', borderRadius: '50%', border: isSelected ? '6px solid var(--gold)' : '2px solid #ccc' }} />
              </div>
              
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '1rem' }}>
                ${tier.amount}
              </div>
              
              <p style={{ color: 'var(--mist)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                {tier.description}
              </p>

              {tier.spotsAvailable !== null && (
                <div style={{ display: 'inline-block', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {tier.spotsAvailable} Spots Remaining
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: '#fff', border: '1px solid rgba(26,46,26,0.08)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--forest)' }}>Digital Asset Collection</h3>
        <p style={{ color: 'var(--mist)', marginBottom: '2rem', lineHeight: '1.5' }}>
          Provide the assets you want featured on the tournament signage and digital platform.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem' }}>Company / Brand Name *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem' }}>Billing Email *</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="billing@acmecorp.com"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem' }}>Website URL (Click-through link)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              placeholder="https://acmecorp.com"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(26,46,26,0.2)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.4rem' }}>Logo Map URL (High-Res Image Link) *</label>
            {logoUrl ? (
              <div style={{ padding: '1.2rem', border: '1px solid var(--gold)', borderRadius: '8px', background: 'rgba(212,175,55,0.05)', color: 'var(--ink)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
                <span style={{ fontWeight: 600 }}>Brand Logo Secured</span>
                <div 
                  style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => setLogoUrl('')}
                >
                  Upload different file
                </div>
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(26,46,26,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                <UploadDropzone
                  endpoint="sponsorLogoUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) setLogoUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    setErrorMsg(`Upload Failed: ${error.message}`);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div style={{ color: 'red', fontSize: '0.9rem', background: '#ffebee', padding: '0.8rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
            {errorMsg}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || !selectedTierId}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: (!selectedTierId || isLoading) ? 0.7 : 1 }}
        >
          {isLoading ? 'Processing via Stripe...' : 'Secure Sponsorship 🚀'}
        </button>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.8rem' }}>
          Your payment will be seamlessly routed directly to the Tournament Host via Stripe Connect.
        </div>
      </div>
    </form>
  );
}
