import React, { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface DiscoverModalProps {
  onAssignLead: (brand: any) => void;
  onClose: () => void;
}

export default function DiscoverMarketplaceModal({ onAssignLead, onClose }: DiscoverModalProps) {
  const [query, setQuery] = useState('');
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If empty, fetch default discovery feed
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/host/sponsors/discover?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setBrands(data.brands || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simple debounce
    const timer = setTimeout(fetchBrands, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Seed Helper for Development
  const runSeeder = async () => {
    setIsLoading(true);
    await fetch('/api/host/sponsors/discover', { method: 'POST' });
    setQuery('Lexus'); // Force refresh
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0b1611] border border-[rgba(212,175,55,0.3)] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.02)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[var(--gold)]" />
                Sponsor Marketplace
              </h2>
              <p className="text-[var(--mist)] text-sm mt-1">Discover and invite verified brands to your pipeline.</p>
            </div>
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white transition-colors">&times;</button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search brands, industries, or locations (e.g. Lexus, Tech, Austin)..."
              className="w-full bg-[#13241b] border border-[rgba(212,175,55,0.2)] text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[var(--gold)] transition-colors shadow-inner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {brands.length === 0 && query === '' && (
              <button 
                onClick={runSeeder} 
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-[rgba(212,175,55,0.1)] text-[var(--gold)] text-xs rounded-md border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.2)]"
              >
                Seed Mock Data
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No verified brands found matching your search.</p>
            </div>
          ) : (
            brands.map(brand => (
              <div 
                key={brand.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(212,175,55,0.05)] hover:border-[rgba(212,175,55,0.2)] transition-all cursor-pointer group"
                onClick={() => onAssignLead(brand)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-white p-2 shadow-md shrink-0 flex items-center justify-center">
                    <img src={brand.companyLogoUrl} alt={brand.companyName} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                      {brand.companyName}
                      {brand.proNetworkId && (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#2ecc71] bg-[rgba(46,204,113,0.1)] px-2 py-0.5 rounded-full border border-[rgba(46,204,113,0.3)]" title="Vetted by your Course Pro">
                          <CheckCircle2 className="w-3 h-3" /> Pro Vouched
                        </span>
                      )}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-[rgba(255,255,255,0.5)]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {brand.locationName}
                      </span>
                      {brand.isFranchise && (
                        <span className="text-[var(--gold)] border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.1)] px-1.5 rounded-sm uppercase tracking-wider" style={{ fontSize: '9px' }}>
                          Franchise
                        </span>
                      )}
                      <span>·</span>
                      <span>{brand.industrySegment}</span>
                    </div>

                  </div>
                </div>

                <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[var(--gold)] text-black font-bold text-sm rounded-lg shadow-lg hover:scale-105 transition-all">
                  + Pitch
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
