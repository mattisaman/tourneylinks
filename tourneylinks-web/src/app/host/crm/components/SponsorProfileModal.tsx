import React from 'react';
import { X, Check, MapPin, Building2, ExternalLink, DownloadCloud, MonitorPlay, Plus, Award, Mail, Phone, Calendar } from 'lucide-react';

interface SponsorProfileModalProps {
  brand: any;
  onClose: () => void;
  onAssignLead: (brand: any) => void;
}

export default function SponsorProfileModal({ brand, onClose, onAssignLead }: SponsorProfileModalProps) {
  if (!brand) return null;

  // Protect against undefined companyName if database maps to 'name'
  const safeCompanyName = brand.companyName || brand.name || 'Sponsor';
  const brandName = safeCompanyName.includes('Barton') ? 'Rolex Corporation' : safeCompanyName;

  // Determine a sleek generic hero background based on industry if possible
  const bgImage = brandName.includes('Lexus') 
    ? 'https://images.unsplash.com/photo-1605333146430-b384ba68e21f?auto=format&fit=crop&q=80&w=1600'
    : brandName.includes('Rolex') 
    ? 'https://images.unsplash.com/photo-1549971804-d57be76cb3ad?auto=format&fit=crop&q=80&w=1600'
    : 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600';

  return (
    <div className="fixed inset-0 z-[150] flex flex-col p-4 sm:p-8 items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a120e]/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Main Modal Island */}
      <div className="bg-[#FAF9F6] w-full max-w-[1200px] h-full max-h-[90vh] rounded-[6px] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Dynamic Hero Header */}
        <div className="relative h-[240px] md:h-[300px] shrink-0 bg-neutral-900 overflow-hidden group">
          {/* Close Button overlay */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-30 p-2 bg-black/40 text-white hover:bg-black/70 rounded-[6px] backdrop-blur-md transition-all shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div 
            className="absolute inset-0 opacity-60 mix-blend-overlay transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Header Internal Title & Logo */}
          <div className="absolute bottom-0 inset-x-0 p-8 flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div className="w-28 h-28 relative bg-white rounded-[6px] shadow-xl flex items-center justify-center p-4 border-4 border-white shrink-0 overflow-hidden">
                <img 
                  src={
                    brand.companyName.includes('Lexus') ? '/logos/lexus.svg' :
                    brand.companyName.includes('Titleist') ? '/logos/titleist.svg' :
                    (brand.companyName.includes('Barton') || brand.companyName.includes('Rolex')) ? '/logos/rolex.svg' :
                    brand.companyLogoUrl
                  } 
                  alt={brandName.charAt(0)} 
                  className="w-full h-full object-contain drop-shadow-sm" 
                />
              </div>
              <div className="pb-1 text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>
                  {brandName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                  <span className="flex items-center gap-1 opacity-90"><MapPin className="w-4 h-4" /> {brand?.locationName || 'Global Activation'}</span>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1 opacity-90"><Building2 className="w-4 h-4" /> {brand?.industrySegment || 'Corporate'}</span>
                  {brand?.proNetworkId && (
                    <>
                      <span className="opacity-50">•</span>
                      <span className="flex items-center gap-1.5 text-[#2ecc71] bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-[6px] border border-[#2ecc71]/40 shadow-sm leading-none pt-1">
                        <Check className="w-4 h-4 pb-0.5" /> Vouched by Course Pro
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Immediate CTA on desktop */}
            <div className="hidden md:block pb-2">
              <button 
                onClick={() => onAssignLead(brand)}
                className="px-8 py-3.5 bg-[var(--gold)] text-black font-extrabold text-sm rounded-[6px] hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <Plus className="w-5 h-5 -ml-1" /> Add Brand to Pipeline
              </button>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar flex">
          
          <div className="flex-1 p-8 lg:p-10 border-r border-[#e8eada]">
             <h3 className="text-xl font-bold text-[#0a120e] mb-6 flex items-center gap-2">
               Brand Overview
             </h3>
             <p className="text-neutral-600 leading-relaxed font-medium text-[0.95rem] mb-8 whitespace-pre-wrap">
               {brand.overviewText || `${brandName} is a verified activation partner within the TourneyLinks Sponsor Discovery network. By adding this brand to your active pipeline tracker, you unlock direct integration with their B2B local and national activation representatives. ${brandName} highly prefers interactive, hole-in-one, and tiered brand exposure formats over standard signage.`}
             </p>

             <h3 className="text-xl font-bold text-[#0a120e] mb-6">Digital Media Kit <span className="ml-2 text-xs font-bold bg-[var(--gold)] text-black px-2 py-0.5 rounded-[6px] uppercase tracking-wider">Public</span></h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="p-5 border border-[#e8eada] bg-white rounded-[6px] hover:border-[var(--gold)] hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                   <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-[6px] flex items-center justify-center shrink-0">
                      <ExternalLink className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#0a120e] leading-tight group-hover:text-[var(--gold)] transition-colors">Sponsorship Tier Deck</h4>
                     <p className="text-xs text-neutral-400 mt-1">PDF Document · 4.2 MB</p>
                   </div>
                </div>
                <div className="p-5 border border-[#e8eada] bg-white rounded-[6px] hover:border-[var(--gold)] hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                   <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-[6px] flex items-center justify-center shrink-0">
                      <MonitorPlay className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#0a120e] leading-tight group-hover:text-[var(--gold)] transition-colors">Brand Activation Reel</h4>
                     <p className="text-xs text-neutral-400 mt-1">Video MP4 · 2:14 runtime</p>
                   </div>
                </div>
                <div className="p-5 border border-[#e8eada] bg-white rounded-[6px] hover:border-[var(--gold)] hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
                   <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-[6px] flex items-center justify-center shrink-0">
                      <DownloadCloud className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#0a120e] leading-tight group-hover:text-[var(--gold)] transition-colors">High-Res Brand Assets</h4>
                     <p className="text-xs text-neutral-400 mt-1">ZIP Archive · Logomarks & SVGs</p>
                   </div>
                </div>
             </div>

          </div>
          
          <div className="w-[340px] shrink-0 bg-white p-8 lg:p-10 hidden md:block">
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Activation Contacts</h4>
              
              <div className="p-5 border border-[#e8eada] rounded-[6px] bg-[#FAF9F6]">
                <p className="font-extrabold text-[#0a120e] text-lg leading-tight mb-3">{brand.contactName || 'Sarah Parker'}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                    <Mail className="w-4 h-4 text-neutral-400" /> 
                    <span className="blur-[4px] select-none hover:blur-none transition-all">{brand.contactEmail || `s.parker@${brandName.toLowerCase().replace(/ /g, '')}.com`}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                    <Phone className="w-4 h-4 text-neutral-400" /> 
                    <span className="blur-[4px] select-none hover:blur-none transition-all">{brand.contactPhone || '(555) 012-3849'}</span>
                  </div>
                </div>
                
                <p className="mt-4 text-xs font-bold text-[var(--gold)] flex items-center gap-1.5 border-t border-[rgba(212,175,55,0.2)] pt-3">
                   <Award className="w-4 h-4" /> Unlocks in Pipeline Tracker
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Pipeline Integration</h4>
              <button 
                onClick={() => onAssignLead(brand)}
                className="w-full py-4 bg-[#0a120e] text-[var(--gold)] font-extrabold text-sm rounded-[6px] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xl"
              >
                <Plus className="w-4 h-4" /> Move to "To Contact"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
