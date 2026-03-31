"use client";

import React, { useState } from 'react';
import { Download, Utensils, Check, Coffee, AlertCircle, Calculator, Users, Mail } from 'lucide-react';

const COURSE_FORMATS = [
  { id: 'tee_time', title: 'Tee Time Starts', basePrice: 59, minPlayers: 1, desc: 'Perfect for smaller, intimate groups. Sequenced starting times.', requirements: 'No food minimums.' },
  { id: 'weekday_shotgun', title: 'Weekday Shotgun', basePrice: 62, minPlayers: 120, desc: 'Exclusive course access. Monday-Friday morning starts.', requirements: 'Requires ONE lunch AND ONE breakfast/dinner package.', badge: 'Most Popular' },
  { id: 'weekend_shotgun', title: 'Weekend Shotgun', basePrice: 75, minPlayers: 120, desc: 'Premium Saturday/Sunday morning starts with full valet.', requirements: 'Requires TWO catering packages (e.g., Lunch + Dinner).' }
];

const CATERING_LUNCH = [
  { id: 'turn', title: 'On The Turn', price: 11.99, desc: 'Hot Dog/Burger with Drink' },
  { id: 'box', title: 'Greenside Boxed', price: 12.25, desc: 'Deli Wrap, Bar, Water. Delivered to carts.' },
  { id: 'bbq', title: 'Banquet Buffet', price: 20.99, desc: 'Burgers, Dogs, Mac Salad, Cookies' }
];

const CATERING_DINNER = [
  { id: 'breakfast', title: 'Basic Breakfast', price: 20.99, desc: 'Eggs, Bacon, Toast, Coffee' },
  { id: 'bbq_dinner', title: 'Backyard BBQ', price: 28.99, desc: 'Burgers, Chicken, Salads' },
  { id: 'steak', title: 'Steak Roast Buffet', price: 34.99, desc: 'Carved Steak, Potatoes, Veggies' },
  { id: 'prime_rib', title: 'Prime Rib Dinner', price: 36.99, desc: '12oz Prime Rib, Formal Service' }
];

export default function EagleValePricing({ courseName, courseEmail }: { courseName: string, courseEmail: string }) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedLunch, setSelectedLunch] = useState<string | null>(null);
  const [selectedDinner, setSelectedDinner] = useState<string | null>(null);
  const [estimatedPlayers, setEstimatedPlayers] = useState<number>(120);

  const formatData = COURSE_FORMATS.find(f => f.id === selectedFormat);
  const lunchData = CATERING_LUNCH.find(l => l.id === selectedLunch);
  const dinnerData = CATERING_DINNER.find(d => d.id === selectedDinner);

  const basePpH = formatData ? formatData.basePrice : 0;
  const foodPpH = (lunchData ? lunchData.price : 0) + (dinnerData ? dinnerData.price : 0);
  const totalPpH = basePpH + foodPpH;
  const grandTotal = totalPpH * estimatedPlayers;

  const generateInquiryEmail = () => {
    const subject = encodeURIComponent(`Tournament Inquiry: ${formatData?.title || 'Event'} at ${courseName}`);
    const body = encodeURIComponent(`Hello ${courseName} Banquets & Pro Shop,\n\nI am organizing a tournament and would like to check course availability.\n\nHere is my compiled tournament package from TourneyLinks:\n\n- Format: ${formatData?.title || 'Undecided'}\n- Estimated Players: ${estimatedPlayers}\n- Selected Lunch: ${lunchData?.title || 'None'}\n- Selected Dinner/Breakfast: ${dinnerData?.title || 'None'}\n\nEstimated Budget per Player: $${totalPpH.toFixed(2)}\n\nPlease let me know what dates are currently available for an event of this size!\n\nThank you,`);
    return `mailto:${courseEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full overflow-visible" id="builder" style={{ maxWidth: '1300px', margin: '0 auto', paddingLeft: 'clamp(2rem, 5vw, 4rem)', paddingRight: 'clamp(2rem, 5vw, 4rem)', paddingBottom: '6rem' }}>
      
      {/* Cinematic Header Block - Unboxed */}
      <div className="border-b border-white/10 pb-12 mb-16 flex flex-col items-center text-center relative">
        <div className="flex-1 max-w-4xl relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <span className="text-[var(--gold)] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Calculator size={14} /> Interactive Tournament Builder
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6 flex flex-row flex-wrap justify-center gap-3 md:gap-4" style={{ fontFamily: 'var(--font-serif)' }}>
            <span>Build Your</span>
            <span className="text-[var(--gold)] italic font-light">Experience.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl font-light">
            Select your preferred tournament structure and catering options below to instantly calculate your per-player costs. Once built, directly inquire with the course admin for date availability.
          </p>
        </div>
        
        <div className="mt-8">
          <a href="/eagle-vale-2026-pricing.pdf" download className="relative z-10 inline-flex flex-shrink-0 items-center justify-center gap-2 px-6 py-4 bg-[var(--ink)] border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-colors font-bold text-[11px] uppercase tracking-widest rounded-md">
            <Download size={14} /> Official Pricing PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-12 xl:gap-20 w-full items-start">
        
        {/* LEFT COLUMN: SELECTION PANELS */}
        <div className="w-full flex-col flex gap-16 min-w-0">
          
          {/* STEP 1 */}
          <div className="w-full relative">
            <div className="flex items-center gap-4 mb-8">
               <div className="text-[var(--gold)] font-black text-xs tracking-widest bg-[rgba(197,160,89,0.1)] px-3 py-1 bg-white/5">STEP 01</div>
               <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>Select Format</h3>
            </div>
            
            <div className="flex flex-col w-full border-t border-white/10">
              {COURSE_FORMATS.map((format) => (
                <div 
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className="cursor-pointer transition-all duration-300 py-6 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-5 w-full group relative overflow-hidden rounded-lg"
                  style={{
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    borderLeft: selectedFormat === format.id ? '4px solid var(--gold)' : '4px solid transparent',
                    borderBottomColor: selectedFormat === format.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                    background: selectedFormat === format.id ? 'linear-gradient(90deg, rgba(197,160,89,0.1) 0%, transparent 100%)' : 'transparent',
                    boxShadow: selectedFormat === format.id ? 'inset 20px 0 40px -20px rgba(197,160,89,0.15)' : 'none'
                  }}
                >
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none transition-opacity duration-500" style={{ display: selectedFormat === format.id ? 'block' : 'none' }}>
                     <div className="w-32 h-32 rounded-full" style={{ backgroundColor: 'var(--gold)', filter: 'blur(30px)' }} />
                  </div>
                  <div className="flex-1 pr-0 md:pr-6 min-w-0">
                     <div className="flex items-center gap-3 mb-2 flex-wrap">
                       <h4 className={`text-xl md:text-2xl font-bold pr-2 ${selectedFormat === format.id ? 'text-[var(--gold)]' : 'text-white group-hover:text-[var(--gold)] transition-colors'}`} style={{ fontFamily: 'var(--font-serif)' }}>{format.title}</h4>
                       {format.badge && (
                         <span className="text-[9px] uppercase font-black tracking-widest px-2 py-1 bg-[rgba(197,160,89,0.1)] text-[var(--gold)] whitespace-nowrap">{format.badge}</span>
                       )}
                     </div>
                     <p className={`text-sm md:text-base leading-relaxed font-light ${selectedFormat === format.id ? 'text-white/80' : 'text-white/40'}`}>{format.desc}</p>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0 mt-4 md:mt-0">
                     <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-bold text-white mr-1" style={{ fontFamily: 'var(--font-serif)' }}>${format.basePrice}</span>
                        <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">/ Player</span>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-[var(--gold)] mt-2">
                        <Users size={12} className="text-[var(--gold)]" /> Min {format.minPlayers} Players
                     </div>
                  </div>
                </div>
              ))}
            </div>

            {formatData && (
              <div className="mt-8 py-4 px-6 bg-[rgba(197,160,89,0.05)] border-l-2 border-l-[var(--gold)] rounded-r-lg flex gap-4 w-full items-start">
                 <AlertCircle size={18} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
                 <div className="text-sm text-white/80 font-light">
                   <strong className="text-[var(--gold)] text-[10px] uppercase tracking-widest block mb-1">Requirement</strong> 
                   <span className="pr-1">{formatData.requirements}</span>
                 </div>
              </div>
            )}
          </div>

          {/* STEP 2 */}
          <div className={`w-full transition-opacity duration-500 relative ${!selectedFormat ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-4 mb-8">
               <div className="text-[var(--gold)] font-black text-xs tracking-widest bg-white/5 px-3 py-1">STEP 02</div>
               <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>Customize Catering</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
              <div className="min-w-0">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                   <h4 className="text-lg font-bold text-[var(--gold)] uppercase tracking-widest pr-1 flex items-center gap-3">
                     <Utensils size={16} /> Lunches
                   </h4>
                 </div>
                 <div className="flex flex-col">
                   {CATERING_LUNCH.map(lunch => (
                     <div 
                        key={lunch.id}
                        onClick={() => setSelectedLunch(selectedLunch === lunch.id ? null : lunch.id)}
                        className="py-5 mb-2 cursor-pointer transition-all duration-300 w-full group relative rounded-md"
                        style={{
                           paddingLeft: '1.25rem',
                           paddingRight: '1.25rem',
                           borderLeft: selectedLunch === lunch.id ? '3px solid var(--gold)' : '3px solid transparent',
                           borderBottomColor: selectedLunch === lunch.id ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.05)',
                           background: selectedLunch === lunch.id ? 'linear-gradient(90deg, rgba(197,160,89,0.08) 0%, transparent 100%)' : 'transparent',
                        }}
                     >
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div className={`font-bold text-base pr-1 ${selectedLunch === lunch.id ? 'text-[var(--gold)]' : 'text-white group-hover:text-[var(--gold)] transition-colors'}`}>{lunch.title}</div>
                          <div className="font-mono text-[var(--gold)] font-bold pr-1">${lunch.price}</div>
                        </div>
                        <div className="text-sm font-light text-white/40 pr-1">{lunch.desc}</div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="min-w-0">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                   <h4 className="text-lg font-bold text-[var(--gold)] uppercase tracking-widest pr-1 flex items-center gap-3">
                     <Coffee size={16} /> Dinners
                   </h4>
                 </div>
                 <div className="flex flex-col">
                   {CATERING_DINNER.map(dinner => (
                     <div 
                        key={dinner.id}
                        onClick={() => setSelectedDinner(selectedDinner === dinner.id ? null : dinner.id)}
                        className="py-5 mb-2 cursor-pointer transition-all duration-300 w-full group relative rounded-md"
                        style={{
                           paddingLeft: '1.25rem',
                           paddingRight: '1.25rem',
                           borderLeft: selectedDinner === dinner.id ? '3px solid var(--gold)' : '3px solid transparent',
                           borderBottomColor: selectedDinner === dinner.id ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.05)',
                           background: selectedDinner === dinner.id ? 'linear-gradient(90deg, rgba(197,160,89,0.08) 0%, transparent 100%)' : 'transparent',
                        }}
                     >
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div className={`font-bold text-base pr-1 ${selectedDinner === dinner.id ? 'text-[var(--gold)]' : 'text-white group-hover:text-[var(--gold)] transition-colors'}`}>{dinner.title}</div>
                          <div className="font-mono text-[var(--gold)] font-bold pr-1">+${dinner.price}</div>
                        </div>
                        <div className="text-sm font-light text-white/40">{dinner.desc}</div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SHARP ESTIMATOR BAR */}
        <div className="w-full relative min-w-0">
          <div className="sticky top-[100px] z-20 bg-[#020604] border border-[rgba(255,255,255,0.05)] border-t-[3px] border-t-[var(--gold)] shadow-2xl p-8 lg:p-10 w-full overflow-hidden rounded-xl">
             
             <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-6 flex items-center gap-3 uppercase tracking-widest pr-2" style={{ fontFamily: 'var(--font-serif)' }}>
               <Calculator size={20} className="text-[var(--gold)] flex-shrink-0" /> Calculator System
             </h3>
             
             {!selectedFormat ? (
               <div className="text-center py-10">
                 <p className="text-xs uppercase tracking-widest text-white/30 max-w-[200px] mx-auto leading-relaxed">Awaiting base format input</p>
               </div>
             ) : (
               <div className="space-y-6 w-full">
                 <div className="space-y-4 w-full border-b border-white/10 pb-6">
                   <div className="flex justify-between items-end gap-2">
                     <div className="min-w-0 pr-2">
                       <div className="text-[10px] text-[var(--gold)] uppercase tracking-widest mb-1.5 truncate">Format Base</div>
                       <div className="text-sm font-bold text-white/80 truncate">{formatData?.title}</div>
                     </div>
                     <div className="text-lg text-white font-bold flex-shrink-0 pr-1">${basePpH.toFixed(2)}</div>
                   </div>
                   
                   {selectedLunch && (
                     <div className="flex justify-between items-end gap-2">
                       <div className="min-w-0 pr-2">
                         <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 truncate">Lunch Catering</div>
                         <div className="text-xs font-bold text-white/60 truncate">{lunchData?.title}</div>
                       </div>
                       <div className="text-xs text-[var(--gold)] font-medium flex-shrink-0 pr-1">+${lunchData?.price.toFixed(2)}</div>
                     </div>
                   )}
                   
                   {selectedDinner && (
                     <div className="flex justify-between items-end gap-2">
                       <div className="min-w-0 pr-2">
                         <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 truncate">Dinner Catering</div>
                         <div className="text-xs font-bold text-white/60 truncate">{dinnerData?.title}</div>
                       </div>
                       <div className="text-xs text-[var(--gold)] font-medium flex-shrink-0 pr-1">+${dinnerData?.price.toFixed(2)}</div>
                     </div>
                   )}
                 </div>

                 <div className="w-full">
                   <div className="flex justify-between items-center mb-8 gap-2">
                     <span className="text-white/50 text-xs uppercase tracking-widest truncate">Subtotal Per Player</span>
                     <span className="text-3xl font-black text-[var(--gold)] flex-shrink-0 pr-1" style={{ fontFamily: 'var(--font-serif)' }}>${totalPpH.toFixed(2)}</span>
                   </div>
                   
                   <div className="space-y-3 pt-6 w-full bg-white/5 p-5">
                     <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center justify-between mb-4">
                        Player Matrix Simulation
                     </label>
                     <div className="flex items-center border-b border-[var(--gold)] pb-2 focus-within:border-white transition-colors w-full">
                       <Users size={16} className="text-[var(--gold)] mr-4 flex-shrink-0" />
                       <input 
                         type="number" 
                         value={estimatedPlayers} 
                         onChange={(e) => setEstimatedPlayers(parseFloat(e.target.value) || 0)}
                         className="bg-transparent w-full outline-none text-white text-xl tracking-wider font-bold"
                         min="1"
                       />
                     </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-white/10 w-full">
                     <div className="flex flex-col gap-2 mb-8 text-right">
                       <span className="text-[10px] text-white/40 uppercase tracking-widest font-black truncate">Projected Tournament Total</span>
                       <span className="text-4xl font-black text-white tracking-tight flex-shrink-0 pr-1">${grandTotal.toFixed(2)}</span>
                     </div>
                     <p className="text-[9px] uppercase tracking-widest text-white/20 mb-8 text-right pr-1">Excludes taxes & processing fees</p>

                     <a 
                       href={generateInquiryEmail()}
                       className="w-full flex items-center justify-center gap-3 py-5 bg-[var(--gold)] hover:bg-white text-black font-black uppercase tracking-widest text-[11px] transition-colors"
                     >
                       Submit Inquiry <Mail size={14} className="flex-shrink-0" />
                     </a>
                   </div>
                 </div>

               </div>
             )}
             
          </div>
        </div>
      </div>
    </div>
  );
}
