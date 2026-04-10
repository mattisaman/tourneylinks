import React, { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle2, ShieldCheck, MapPin, PenTool, Plus, X } from 'lucide-react';
import SponsorProfileModal from './SponsorProfileModal';

interface DiscoverModalProps {
  onAssignLead: (brand: any) => void;
}

export default function SponsorDiscoverySidebar({ onAssignLead }: DiscoverModalProps) {
  const [query, setQuery] = useState('');
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewBrand, setPreviewBrand] = useState<any | null>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');

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
    <div className="w-[420px] lg:w-[460px] shrink-0 flex flex-col h-full bg-white z-20">
        
        {/* Top Section: Global Scratchpad (Takes roughly 1/3) */}
        <div className="flex flex-col h-[25%] min-h-[220px] border-b border-[#e8eada] bg-[#FAF9F6] relative overflow-hidden shrink-0" style={{ padding: '24px' }}>
           {/* Ambient Lighting */}
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--gold)] opacity-10 blur-[60px] rounded-[6px] pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-4 relative z-10">
             <label className="text-sm font-bold text-[var(--gold)] uppercase tracking-widest drop-shadow-md flex items-center gap-3">
               <div className="w-10 h-10 rounded-[6px] bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center">
                 <PenTool className="w-5 h-5 text-[var(--gold)]" />
               </div>
               Manager Scratchpad
             </label>
           </div>
           
           <textarea 
             className="flex-1 w-full bg-white border border-[#e8eada] text-[#071510] text-[0.95rem] rounded-[6px] resize-none focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(212,175,55,0.5)] transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)] leading-relaxed font-semibold relative z-10 placeholder-neutral-400"
             style={{ padding: '16px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}
             placeholder="Jot down high-level strategy, bulk negotiation notes, or ideas here..."
             defaultValue="Use this scratch pad for thoughts and ideas of who to go to. (Yes, it autosaves!)"
           />
        </div>

        {/* Bottom Section: Market Discovery (Takes remaining 2/3) */}
        <div className="flex flex-col flex-1 relative overflow-hidden">
          
          <div className="shrink-0" style={{ padding: '32px 36px 16px' }}>
            <h2 className="text-2xl font-bold tracking-tight text-[#0a120e] flex items-center gap-3 drop-shadow-md" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>
              <ShieldCheck className="w-6 h-6 text-[var(--gold)]" />
              Market Discovery
            </h2>
            <p className="text-neutral-500 text-sm mt-2 font-medium leading-relaxed max-w-[95%]">
              Search the network for verified brands to invite, or manually add a custom sponsor to your tracker.
            </p>

            {/* Epic Search Bar */}
            <div className="mt-6 relative z-10 flex items-center">
              <div className="absolute left-5 flex items-center pointer-events-none z-20">
                <Search className="h-5 w-5 text-[var(--gold)] opacity-80" />
              </div>
              <input 
                id="sponsor-search-input"
                type="text" 
                placeholder="Search brands (e.g. Lexus, Tech)..."
                className="w-full bg-white border border-[#e8eada] text-[#0a120e] rounded-[6px] py-4 pr-6 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] placeholder-neutral-400 font-medium"
                style={{ paddingLeft: '3.5rem' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {brands.length === 0 && query === '' && (
                <button 
                  onClick={runSeeder} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[rgba(212,175,55,0.1)] text-[var(--gold)] font-bold text-xs rounded-[6px] border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.2)] hover:scale-105 transition-all shadow-md"
                >
                  Seed Mock Data
                </button>
              )}
            </div>
            </div>

            {/* Elevated Custom Lead Block */}
            <div className="pt-4 mt-2 mb-2">
              {isCreatingCustom ? (
                <div className="bg-[#FAF9F6] rounded-[6px] border border-[var(--gold)] p-4 shadow-md animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text" 
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="Enter company name..."
                      autoFocus
                      className="w-full bg-white border border-[#e8eada] rounded-[4px] px-4 py-3 text-sm font-bold text-[#0a120e] placeholder-neutral-400 focus:outline-none focus:border-[var(--gold)] shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customName.trim()) {
                          onAssignLead({ id: null, companyName: customName.trim(), contactEmail: '' });
                          setIsCreatingCustom(false);
                          setCustomName('');
                        } else if (e.key === 'Escape') {
                          setIsCreatingCustom(false);
                          setCustomName('');
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => {
                           if (customName.trim()) {
                             onAssignLead({ id: null, companyName: customName.trim(), contactEmail: '' });
                             setIsCreatingCustom(false);
                             setCustomName('');
                           }
                         }}
                         className="flex-1 py-2.5 bg-[var(--gold)] text-black rounded-[4px] font-bold text-sm hover:opacity-80 transition-opacity shadow-sm"
                       >
                         Save to Pipeline
                       </button>
                       <button 
                         onClick={() => { setIsCreatingCustom(false); setCustomName(''); }}
                         className="p-2.5 bg-white border border-[#e8eada] rounded-[4px] text-neutral-500 hover:text-black hover:border-neutral-300 transition-colors shadow-sm"
                       >
                         <X className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreatingCustom(true)} 
                  className="w-full py-3.5 bg-white border border-[#e8eada] text-[#0a120e] font-bold text-sm rounded-[6px] hover:border-[var(--gold)] hover:text-[var(--gold)] hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Add Custom Lead Manually
                </button>
              )}
            </div>

          {/* Results List */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4" style={{ padding: '0 36px 36px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-[6px] animate-spin"></div>
            </div>
          ) : (
            <>
              {brands.length === 0 && (
                <div className="py-8 text-center text-neutral-500">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No verified brands found under that name.</p>
                </div>
              )}
              
              {brands.map(brand => (
                <div 
                  key={brand.id}
                  className="flex items-center justify-between p-4 rounded-[6px] bg-white border border-[#e8eada] hover:bg-[#FAF9F6] transition-all cursor-pointer group shadow-sm hover:border-[rgba(212,175,55,0.3)]"
                  onClick={() => setPreviewBrand(brand)}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-[6px] bg-white p-3 border border-neutral-100 shadow-sm shrink-0 flex items-center justify-center">
                      <img 
                        src={
                          brand.companyName.includes('Lexus') ? '/logos/lexus.svg' :
                          brand.companyName.includes('Titleist') ? '/logos/titleist.svg' :
                          (brand.companyName.includes('Barton') || brand.companyName.includes('Rolex')) ? '/logos/rolex.svg' :
                          brand.companyLogoUrl
                        } 
                        alt={brand.companyName.charAt(0)} 
                        className="w-full h-full object-contain text-[16px] font-bold text-neutral-300 font-serif leading-none" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#0a120e] font-bold text-lg leading-tight flex items-center gap-2">
                        <span className="truncate">{brand.companyName.includes('Barton') ? 'Rolex Corporation' : brand.companyName}</span>
                        {brand.proNetworkId && (
                          <span className="shrink-0 whitespace-nowrap flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#2ecc71] bg-[rgba(46,204,113,0.1)] px-2 py-0.5 rounded-[6px] border border-[rgba(46,204,113,0.3)]">
                            <CheckCircle2 className="w-3 h-3" /> Pro Vouched
                          </span>
                        )}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-neutral-500">
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

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssignLead(brand);
                    }}
                    className="flex items-center justify-center w-9 h-9 rounded-[6px] bg-[rgba(212,175,55,0.08)] text-[var(--gold)] border border-[rgba(212,175,55,0.3)] hover:bg-[var(--gold)] hover:text-white transition-all shrink-0 group-hover:scale-110 ml-2"
                    title="Add directly to pipeline"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <SponsorProfileModal 
        brand={previewBrand} 
        onClose={() => setPreviewBrand(null)} 
        onAssignLead={(b) => {
          onAssignLead(b);
          setPreviewBrand(null);
        }} 
      />
    </div>
  );
}
