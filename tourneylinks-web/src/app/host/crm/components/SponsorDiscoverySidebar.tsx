import React, { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle2, ShieldCheck, MapPin, PenTool, Plus, X } from 'lucide-react';

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
        <div className="flex flex-col h-[35%] min-h-[300px] border-b border-[#e8eada] bg-[#FAF9F6] relative overflow-hidden shrink-0" style={{ padding: '36px' }}>
           {/* Ambient Lighting */}
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--gold)] opacity-10 blur-[60px] rounded-full pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-4 relative z-10">
             <label className="text-sm font-bold text-[var(--gold)] uppercase tracking-widest drop-shadow-md flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center">
                 <PenTool className="w-5 h-5 text-[var(--gold)]" />
               </div>
               Manager Scratchpad
             </label>
           </div>
           
           <textarea 
             className="flex-1 w-full bg-white border border-[#e8eada] text-[#071510] text-[0.95rem] rounded-2xl resize-none focus:outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[rgba(212,175,55,0.5)] transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)] leading-relaxed font-semibold relative z-10 placeholder-neutral-400"
             style={{ padding: '24px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}
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
                className="w-full bg-white border border-[#e8eada] text-[#0a120e] rounded-2xl py-4 pr-6 focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] placeholder-neutral-400 font-medium"
                style={{ paddingLeft: '3.5rem' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {brands.length === 0 && query === '' && (
                <button 
                  onClick={runSeeder} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[rgba(212,175,55,0.1)] text-[var(--gold)] font-bold text-xs rounded-xl border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.2)] hover:scale-105 transition-all shadow-md"
                >
                  Seed Mock Data
                </button>
              )}
            </div>
            </div>

            {/* Elevated Custom Lead Block */}
            <div className="pt-4 mt-2 mb-2">
              {isCreatingCustom ? (
                <div className="flex bg-white rounded-xl border-2 border-[var(--gold)] p-1 shadow-md animate-in fade-in zoom-in-95 duration-200">
                  <input 
                    type="text" 
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="Custom Company Name..."
                    autoFocus
                    className="flex-1 bg-transparent px-4 text-sm font-bold text-[#0a120e] placeholder-neutral-300 focus:outline-none w-full"
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
                  <button 
                    onClick={() => {
                      if (customName.trim()) {
                        onAssignLead({ id: null, companyName: customName.trim(), contactEmail: '' });
                        setIsCreatingCustom(false);
                        setCustomName('');
                      }
                    }}
                    className="px-4 py-2 bg-[var(--gold)] text-black rounded-lg font-bold text-xs hover:opacity-80 transition-opacity whitespace-nowrap"
                  >
                    Save Lead
                  </button>
                  <button 
                    onClick={() => { setIsCreatingCustom(false); setCustomName(''); }}
                    className="px-3 py-2 text-neutral-400 hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsCreatingCustom(true)} 
                  className="w-full py-3.5 bg-white border border-[#e8eada] text-[#0a120e] font-bold text-sm rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Add Custom Lead Manually
                </button>
              )}
            </div>

          {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-4" style={{ padding: '0 36px 36px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
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
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#e8eada] hover:bg-[#FAF9F6] transition-all cursor-pointer group shadow-sm hover:border-[rgba(212,175,55,0.3)]"
                  onClick={() => setPreviewBrand(brand)}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-white p-3 border border-neutral-100 shadow-sm shrink-0 flex items-center justify-center">
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
                          <span className="shrink-0 whitespace-nowrap flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#2ecc71] bg-[rgba(46,204,113,0.1)] px-2 py-0.5 rounded-full border border-[rgba(46,204,113,0.3)]">
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
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(212,175,55,0.08)] text-[var(--gold)] border border-[rgba(212,175,55,0.3)] hover:bg-[var(--gold)] hover:text-white transition-all shrink-0 group-hover:scale-110 ml-2"
                    title="Add directly to pipeline"
                  >
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {previewBrand && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a120e]/60 backdrop-blur-sm" onClick={() => setPreviewBrand(null)}></div>
          <div className="bg-[#FAF9F6] border border-[#e8eada] rounded-2xl shadow-2xl relative z-10 w-full max-w-3xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header Identity */}
            <div className="p-8 relative bg-white border-b border-[#e8eada] flex flex-col items-center text-center">
              <button onClick={() => setPreviewBrand(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-24 h-24 rounded-full bg-white p-4 border border-neutral-100 shadow-md flex items-center justify-center mb-6">
                 <img 
                   src={
                     previewBrand.companyName.includes('Lexus') ? '/logos/lexus.svg' :
                     previewBrand.companyName.includes('Titleist') ? '/logos/titleist.svg' :
                     (previewBrand.companyName.includes('Barton') || previewBrand.companyName.includes('Rolex')) ? '/logos/rolex.svg' :
                     previewBrand.companyLogoUrl
                   } 
                   alt={previewBrand.companyName.charAt(0)} 
                   className="w-full h-full object-contain" 
                 />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#0a120e]" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>
                {previewBrand.companyName.includes('Barton') ? 'Rolex Corporation' : previewBrand.companyName}
              </h2>
              
              {previewBrand.proNetworkId && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#2ecc71] bg-[rgba(46,204,113,0.1)] px-3 py-1 rounded-full border border-[rgba(46,204,113,0.3)]">
                  <CheckCircle2 className="w-4 h-4" /> Vouched by Course Pro
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-8 space-y-6 flex-1 bg-[#FAF9F6]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#e8eada] flex items-start gap-3 shadow-sm">
                  <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Region</label>
                    <p className="font-semibold text-sm">{previewBrand.locationName || 'Global'}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#e8eada] flex items-start gap-3 shadow-sm">
                  <Building2 className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Industry</label>
                    <p className="font-semibold text-sm">{previewBrand.industrySegment || 'Corporate'}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                This verified brand is available within the TourneyLinks Sponsor Discovery network. Adding them to your pipeline will unlock their digital media kit and connect you directly with their local B2B activation representatives.
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 bg-white border-t border-[#e8eada] flex gap-4">
              <button 
                onClick={() => setPreviewBrand(null)}
                className="flex-1 py-3.5 border border-[#e8eada] text-[#0a120e] font-bold rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Close Profile
              </button>
              <button 
                onClick={() => {
                  onAssignLead(previewBrand);
                  setPreviewBrand(null);
                }}
                className="flex-[2] py-3.5 bg-[var(--gold)] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
