import React from 'react';
import { CheckCircle2, XCircle, BarChart3, Users, Globe2 } from 'lucide-react';
import Link from 'next/link';

export default function HomeWhyTourneylinks() {
  return (
    <section className="w-full py-32 bg-[#050b08] relative overflow-hidden text-white flex flex-col items-center justify-center">
      {/* Premium Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b08] via-[#0a1410] to-[#050b08] pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Header - Emotional Hook */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="inline-block py-2 px-6 rounded-full bg-white/5 border border-white/10 text-[#dfb962] text-sm font-bold tracking-widest uppercase mb-8">
            For Tournament Organizers
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
            Stop fighting for attention on <br/>
            <span className="text-white/50 italic">generic event sites.</span>
          </h2>
          <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Running a golf tournament is stressful enough without having to chase down handicap scores on a spreadsheet. Host your event where the golfers actually are.
          </p>
        </div>

        {/* The Matrix - Analytical Comparison */}
        <div className="w-full mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
            
            {/* The Old Way */}
            <div className="p-10 md:p-14 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
              <div className="flex items-center gap-4 mb-10 opacity-50">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-serif text-white tracking-wide">Eventbrite / Facebook</h4>
              </div>
              <ul className="space-y-10">
                <li className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-white/80 mb-2">Generic Audience</span>
                    <span className="text-lg text-white/40 font-light leading-relaxed">Your event is buried under local concerts and cooking classes.</span>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-white/80 mb-2">Basic Tickets</span>
                    <span className="text-lg text-white/40 font-light leading-relaxed">A $5,000 Title Sponsorship looks like a cheap $20 general admission ticket.</span>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-white/80 mb-2">Spreadsheet Chaos</span>
                    <span className="text-lg text-white/40 font-light leading-relaxed">One buyer, three "Guests". You manually track down their emails and shirt sizes.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* TourneyLinks */}
            <div className="p-10 md:p-14 rounded-3xl border border-[#dfb962]/30 bg-gradient-to-b from-[#dfb962]/5 to-transparent relative overflow-hidden shadow-[0_0_80px_rgba(223,185,98,0.05)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dfb962] to-transparent opacity-50" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-full bg-[#dfb962]/20 flex items-center justify-center border border-[#dfb962]/30">
                  <CheckCircle2 className="w-6 h-6 text-[#dfb962]" />
                </div>
                <h4 className="text-2xl font-serif text-[#dfb962] tracking-wide">TourneyLinks</h4>
              </div>
              <ul className="space-y-10">
                <li className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#dfb962]" />
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-white mb-2">100% Active Golfers</span>
                    <span className="text-lg text-white/60 font-light leading-relaxed">We put your tournament directly in front of local players actively searching for a game.</span>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#dfb962]" />
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-white mb-2">VIP Sponsorships</span>
                    <span className="text-lg text-white/60 font-light leading-relaxed">Dedicated sponsor carousels and edge-to-edge logos designed to maximize corporate revenue.</span>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#dfb962]" />
                  </div>
                  <div>
                    <span className="block text-xl font-medium text-white mb-2">Automated Rosters</span>
                    <span className="text-lg text-white/60 font-light leading-relaxed">Native foursome management automatically captures exact handicaps and contact info for every player.</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Three Pillars - Deep Dive */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <BarChart3 className="w-8 h-8 text-[#dfb962]" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Maximize Revenue</h3>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              Our checkout flow is optimized specifically for high-ticket sponsors, making it effortless for local businesses to support your cause.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <Users className="w-8 h-8 text-[#dfb962]" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Minimize Headaches</h3>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              Say goodbye to tracking down "Golfer 3" via email. Our team onboarding captures every player's exact details flawlessly.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <Globe2 className="w-8 h-8 text-[#dfb962]" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Amplify Reach</h3>
            <p className="text-lg text-white/50 font-light leading-relaxed">
              We operate the #1 national golf directory. By hosting your event on TourneyLinks, you gain massive, free exposure to active players.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full text-center pt-10 border-t border-white/10 flex justify-center">
          <Link href="/contact" className="inline-flex items-center justify-center gap-4 px-12 py-6 rounded-full bg-white text-[#050b08] hover:bg-[#dfb962] hover:text-white transition-all text-xl font-bold tracking-wide">
            List Your Tournament
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
