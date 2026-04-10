'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Award, UploadCloud, Receipt, Eye, Save, Settings, Video, FileText, ImageIcon, CheckCircle2 } from 'lucide-react';
import SponsorProfileModal from '@/app/host/crm/components/SponsorProfileModal';

export default function SponsorDashboardClient({ sponsorData, isDemo }: { sponsorData: any[], isDemo: boolean }) {
  const [activeTab, setActiveTab] = useState<'analytics'|'profile'|'media'|'tax'>('analytics');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadStates, setUploadStates] = useState({ logo: false, pdff: false, mp4: false });

  // Mock State for the entire profile (allows them to edit it)
  const defaultOverview = "This verified brand is available within the TourneyLinks Sponsor Discovery network. Adding them to your pipeline will unlock their digital media kit and connect you directly with their local B2B activation representatives.";
  const [profile, setProfile] = useState({
     companyName: sponsorData && sponsorData.length > 0 ? sponsorData[0].name : 'Rolex Corporation',
     locationName: 'North America',
     industrySegment: 'Automotive / Luxury',
     overviewText: defaultOverview,
     contactName: 'Sarah Parker',
     contactEmail: 's.parker@rolex.com',
     contactPhone: '(555) 012-3849',
     companyLogoUrl: '/logos/rolex.svg',
     proNetworkId: 'VOUCHED_123'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const simulateUpload = (key: 'logo'|'pdff'|'mp4') => {
    setUploadStates(p => ({ ...p, [key]: 'uploading' }));
    setTimeout(() => {
       setUploadStates(p => ({ ...p, [key]: true }));
    }, 1500);
  };

  if (!sponsorData || sponsorData.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#FAF9F6] p-16 text-center">
         <h1 className="text-3xl font-black text-[#0a120e] mb-4">Investment Portal</h1>
         <p className="text-neutral-500 mb-8">You have not deployed capital into any active golf tournaments.</p>
         <Link href="/tournaments" className="bg-[var(--gold)] text-black font-bold px-6 py-3 rounded-[6px] shadow-lg">Discover Inventory</Link>
      </div>
    );
  }

  const s = sponsorData[0];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF9F6] font-sans flex">
      {/* Left Navigation (Dark Mode similar to Organizer) */}
      <div className="w-[280px] bg-[#0a120e] text-white flex flex-col shrink-0 min-h-full">
        <div className="p-8 pb-4">
          <div className="font-black text-2xl tracking-tight mb-8 text-[#fffdf2]">
            Tourney<span className="text-[var(--gold)]">Links</span> 
            <span className="text-[0.65rem] bg-[rgba(212,175,55,0.2)] text-[var(--gold)] px-2 py-0.5 rounded ml-2 uppercase">B2B Hub</span>
          </div>

          <div className="text-[0.7rem] uppercase tracking-widest text-neutral-500 font-bold mb-3">Active Account</div>
          <div className="bg-[rgba(212,175,55,0.1)] border-l-4 border-[var(--gold)] p-3 rounded-r-lg text-[var(--gold)] font-bold text-sm mb-8 truncate cursor-pointer hover:bg-[rgba(212,175,55,0.15)] transition-colors">
            {profile.companyName}
          </div>

          <div className="text-[0.7rem] uppercase tracking-widest text-neutral-500 font-bold mb-3">Management</div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[6px] font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-[rgba(212,175,55,0.15)] text-[var(--gold)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Campaign Analytics
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[6px] font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-[rgba(212,175,55,0.15)] text-[var(--gold)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <Award className="w-5 h-5" /> Brand Profile
          </button>
          <button onClick={() => setActiveTab('media')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[6px] font-bold text-sm transition-all ${activeTab === 'media' ? 'bg-[rgba(212,175,55,0.15)] text-[var(--gold)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <UploadCloud className="w-5 h-5" /> Media Kit Studio
          </button>
          <button onClick={() => setActiveTab('tax')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[6px] font-bold text-sm transition-all ${activeTab === 'tax' ? 'bg-[rgba(212,175,55,0.15)] text-[var(--gold)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <Receipt className="w-5 h-5" /> Tax & Invoicing
          </button>
        </nav>

        <div className="p-6 mt-autobg-black/20">
           <button 
             onClick={() => setShowPreview(true)}
             className="w-full flex items-center justify-center gap-2 bg-[var(--gold)] text-black font-extrabold py-3.5 rounded-[6px] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform"
           >
             <Eye className="w-4 h-4" /> Preview Live Profile
           </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 p-10 lg:p-14 overflow-y-auto max-h-[calc(100vh-80px)]">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-10">
           <div>
              <h1 className="text-3xl font-black text-[#0a120e] tracking-tight">
                 {activeTab === 'analytics' && 'Deployment Analytics'}
                 {activeTab === 'profile' && 'Public Brand Profile'}
                 {activeTab === 'media' && 'Media Kit Studio'}
                 {activeTab === 'tax' && 'Tax Documentation'}
              </h1>
              <p className="text-neutral-500 mt-1 font-medium text-[0.95rem]">
                 {activeTab === 'analytics' && 'Track real-time digital impressions and physical activations.'}
                 {activeTab === 'profile' && 'Configure how Tournament Organizers see your brand in the CRM.'}
                 {activeTab === 'media' && 'Upload high-fidelity assets that Organizers can download and use.'}
                 {activeTab === 'tax' && 'Automatically generated 501(c)(3) receipts for your accounting.'}
              </p>
           </div>
           
           {(activeTab === 'profile' || activeTab === 'media') && (
             <button 
               onClick={handleSave}
               className="flex items-center gap-2 bg-[#0a120e] text-[var(--gold)] px-6 py-2.5 rounded-[6px] font-bold text-sm hover:bg-black transition-colors shadow-lg"
             >
               {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-4 h-4" /> Save Configurations</>}
             </button>
           )}
        </div>

        {/* Tab Contents */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[6px] border border-[#e8eada] shadow-sm">
                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Capital Deployed</div>
                   <div className="text-4xl font-black text-[#0a120e] mb-1">
                     ${s.amountPaid ? (s.amountPaid / 100).toLocaleString() : '10,000'}
                   </div>
                   <div className="text-sm font-medium text-neutral-500">Across {sponsorData.length} events</div>
                </div>
                <div className="bg-white p-6 rounded-[6px] border border-[#e8eada] shadow-sm">
                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">App Impressions</div>
                   <div className="text-4xl font-black text-[#0a120e] mb-1">24,289</div>
                   <div className="text-sm font-medium text-[#2ecc71] flex items-center gap-1"><span className="font-bold">+12%</span> vs last week</div>
                </div>
                <div className="bg-white p-6 rounded-[6px] border border-[#e8eada] shadow-sm">
                   <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Ctr / Engagement</div>
                   <div className="text-4xl font-black text-[var(--gold)] mb-1">8.4%</div>
                   <div className="text-sm font-medium text-neutral-500">Direct clicks to your URL</div>
                </div>
             </div>

             <div className="bg-white rounded-[6px] border border-[#e8eada] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#e8eada]">
                   <h3 className="font-bold text-[#0a120e] text-lg">Active Deployments</h3>
                </div>
                <div className="p-0">
                   {sponsorData.map((d: any, i: number) => (
                     <div key={i} className="flex items-center justify-between p-6 border-b border-[#e8eada] last:border-b-0 hover:bg-neutral-50 transition-colors">
                        <div>
                           <div className="font-bold text-[#0a120e]">{d.tournamentName || 'Tournament Name'}</div>
                           <div className="text-sm text-neutral-500">{d.sponsorType || 'Targeted Demographic'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-[#2ecc71] shadow-[0_0_8px_rgba(46,204,113,0.8)]"></span>
                           <span className="text-sm font-bold text-[#0a120e]">Active Mapping</span>
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                           ${d.amountPaid ? (d.amountPaid / 100).toLocaleString() : '5,000'} Invested
                        </div>
                        <button className="text-sm font-bold text-[var(--gold)] border border-[#e8eada] px-4 py-2 rounded-[6px] bg-white hover:bg-neutral-50">View Live Telemetry</button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
             <div className="bg-white rounded-[6px] border border-[#e8eada] shadow-sm overflow-hidden mb-8">
               <div className="p-6 border-b border-[#e8eada] flex items-center gap-3">
                  <div className="w-10 h-10 bg-[rgba(212,175,55,0.1)] text-[var(--gold)] rounded-[6px] flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a120e] text-lg">Brand Identity</h3>
                    <p className="text-sm text-neutral-500">How you appear in the Sponsor Discovery ecosystem.</p>
                  </div>
               </div>
               <div className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Company Name</label>
                     <input type="text" value={profile.companyName} onChange={e => setProfile({...profile, companyName: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Industry Segment</label>
                     <input type="text" value={profile.industrySegment} onChange={e => setProfile({...profile, industrySegment: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none" />
                   </div>
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Activation Region</label>
                     <input type="text" value={profile.locationName} onChange={e => setProfile({...profile, locationName: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none" />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Brand Overview (Pitch to Hosts)</label>
                     <textarea value={profile.overviewText} rows={4} onChange={e => setProfile({...profile, overviewText: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none resize-y" placeholder="Describe your sponsorship objectives..." />
                 </div>
               </div>
             </div>

             <div className="bg-white rounded-[6px] border border-[#e8eada] shadow-sm overflow-hidden">
               <div className="p-6 border-b border-[#e8eada]">
                  <h3 className="font-bold text-[#0a120e] text-lg">Activation Representatives</h3>
                  <p className="text-sm text-neutral-500">Contact details shared exclusively when an Organizer adds you to their pipeline.</p>
               </div>
               <div className="p-8 grid grid-cols-2 gap-6">
                 <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Primary Rep Name</label>
                     <input type="text" value={profile.contactName} onChange={e => setProfile({...profile, contactName: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none" />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Rep Title</label>
                     <input type="text" value="VP of B2B Marketing" disabled className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm bg-neutral-50 text-neutral-400 outline-none" />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Direct Phone</label>
                     <input type="text" value={profile.contactPhone} onChange={e => setProfile({...profile, contactPhone: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none" />
                 </div>
                 <div>
                     <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Direct Email</label>
                     <input type="text" value={profile.contactEmail} onChange={e => setProfile({...profile, contactEmail: e.target.value})} className="w-full border border-[#e8eada] rounded-[6px] px-4 py-3 font-medium text-sm focus:ring-2 focus:ring-[var(--gold)] outline-none" />
                 </div>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               
               {/* Primary Logo */}
               <div className="bg-white p-8 rounded-[6px] border border-[#e8eada] shadow-sm flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-[6px] flex items-center justify-center mb-4">
                     {uploadStates.logo === true ? <CheckCircle2 className="w-8 h-8 text-[#2ecc71]" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                  <h3 className="font-bold text-[#0a120e] text-lg mb-2">Primary Logo Vector</h3>
                  <p className="text-xs text-neutral-500 mb-6 px-4">Upload a transparent SVG. This physical maps over the course GPS pins and leaderboards.</p>
                  
                  {uploadStates.logo === true ? (
                     <div className="w-full py-3 bg-[#2ecc71]/10 text-[#2ecc71] font-bold rounded-[6px] text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Auto-Deployed
                     </div>
                  ) : uploadStates.logo === 'uploading' ? (
                     <div className="w-full py-3 bg-neutral-100 text-neutral-500 font-bold rounded-[6px] text-sm animate-pulse">Uploading...</div>
                  ) : (
                     <button onClick={() => simulateUpload('logo')} className="w-full border-2 border-dashed border-[#e8eada] hover:border-[var(--gold)] hover:bg-[rgba(212,175,55,0.05)] text-[var(--gold)] font-bold py-8 rounded-[6px] transition-all flex flex-col items-center gap-2">
                        <UploadCloud className="w-6 h-6" />
                        <span className="text-sm">Select .SVG</span>
                     </button>
                  )}
               </div>

               {/* Pitch Deck */}
               <div className="bg-white p-8 rounded-[6px] border border-[#e8eada] shadow-sm flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[6px] flex items-center justify-center mb-4">
                     {uploadStates.pdff === true ? <CheckCircle2 className="w-8 h-8 text-[#2ecc71]" /> : <FileText className="w-8 h-8" />}
                  </div>
                  <h3 className="font-bold text-[#0a120e] text-lg mb-2">Sponsorship Tier Deck</h3>
                  <p className="text-xs text-neutral-500 mb-6 px-4">Upload your PDF outlining exact demographics, activation formats, and pricing tiers.</p>
                  
                  {uploadStates.pdff === true ? (
                     <div className="w-full py-3 bg-[#2ecc71]/10 text-[#2ecc71] font-bold rounded-[6px] text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Live in Media Kit
                     </div>
                  ) : uploadStates.pdff === 'uploading' ? (
                     <div className="w-full py-3 bg-neutral-100 text-neutral-500 font-bold rounded-[6px] text-sm animate-pulse">Uploading...</div>
                  ) : (
                     <button onClick={() => simulateUpload('pdff')} className="w-full border-2 border-dashed border-[#e8eada] hover:border-rose-300 hover:bg-rose-50 text-rose-500 font-bold py-8 rounded-[6px] transition-all flex flex-col items-center gap-2">
                        <UploadCloud className="w-6 h-6" />
                        <span className="text-sm">Select .PDF</span>
                     </button>
                  )}
               </div>

               {/* Activation Video */}
               <div className="bg-white p-8 rounded-[6px] border border-[#e8eada] shadow-sm flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[6px] flex items-center justify-center mb-4">
                     {uploadStates.mp4 === true ? <CheckCircle2 className="w-8 h-8 text-[#2ecc71]" /> : <Video className="w-8 h-8" />}
                  </div>
                  <h3 className="font-bold text-[#0a120e] text-lg mb-2">Brand Activation Reel</h3>
                  <p className="text-xs text-neutral-500 mb-6 px-4">Upload a high-energy sizzle reel showing past tournament activations to excite Hosts.</p>
                  
                  {uploadStates.mp4 === true ? (
                     <div className="w-full py-3 bg-[#2ecc71]/10 text-[#2ecc71] font-bold rounded-[6px] text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Transcoded & Live
                     </div>
                  ) : uploadStates.mp4 === 'uploading' ? (
                     <div className="w-full py-3 bg-neutral-100 text-neutral-500 font-bold rounded-[6px] text-sm animate-pulse">Uploading...</div>
                  ) : (
                     <button onClick={() => simulateUpload('mp4')} className="w-full border-2 border-dashed border-[#e8eada] hover:border-blue-300 hover:bg-blue-50 text-blue-500 font-bold py-8 rounded-[6px] transition-all flex flex-col items-center gap-2">
                        <UploadCloud className="w-6 h-6" />
                        <span className="text-sm">Select .MP4</span>
                     </button>
                  )}
               </div>

            </div>
          </div>
        )}

      </div>

      {/* The Actual Real-Time Preview Renderer */}
      {showPreview && (
        <SponsorProfileModal 
           brand={profile} 
           onClose={() => setShowPreview(false)} 
           onAssignLead={() => {
              alert("In preview mode, the Host would add you to their pipeline here!");
              setShowPreview(false);
           }}
        />
      )}
    </div>
  );
}
