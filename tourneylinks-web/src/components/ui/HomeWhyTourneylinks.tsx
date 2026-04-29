import React from 'react';
import { Target, DollarSign, Users, Search, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomeWhyTourneylinks() {
  return (
    <section className="py-24 bg-[var(--white)] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header - Emotional Hook */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[var(--forest)]/10 text-[var(--forest)] text-sm font-semibold tracking-wide uppercase mb-6">
            For Tournament Organizers
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--forest)] tracking-tight mb-6 leading-tight">
            Stop fighting for attention on generic event sites.
          </h2>
          <p className="text-lg md:text-xl text-[var(--mist)] font-medium leading-relaxed">
            Running a golf tournament is stressful enough without having to chase down handicap scores on a spreadsheet. Host your event where the golfers actually are.
          </p>
        </div>

        {/* The Matrix - Analytical Comparison */}
        <div className="bg-[var(--sand)] rounded-3xl border border-black/5 overflow-hidden mb-24 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Legend Column */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/5 flex flex-col justify-center bg-white/50">
              <h3 className="text-2xl font-bold text-[var(--forest)] mb-4">The Platform Comparison</h3>
              <p className="text-[var(--mist)] leading-relaxed">See exactly why top charities and country clubs are migrating away from generic ticketing platforms.</p>
            </div>
            
            {/* The Old Way */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/5 bg-white/30">
              <div className="flex items-center gap-3 mb-8 opacity-60">
                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="font-bold text-black/50 text-xl">X</span>
                </div>
                <h4 className="text-xl font-bold text-black/60">Eventbrite / Facebook</h4>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-black/70 mb-1">Generic Audience</span>
                    <span className="text-sm text-black/50">Your event is buried under local concerts and cooking classes.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-black/70 mb-1">Basic Tickets</span>
                    <span className="text-sm text-black/50">A $5,000 Title Sponsorship looks like a cheap $20 general admission ticket.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-black/70 mb-1">Spreadsheet Chaos</span>
                    <span className="text-sm text-black/50">One buyer, three "Guests". You have to manually track down their emails and shirt sizes.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* TourneyLinks */}
            <div className="p-8 md:p-10 bg-white shadow-[0_0_40px_rgba(0,0,0,0.03)] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--emerald)]" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[var(--emerald)]/10 flex items-center justify-center">
                  <img src="/logos/icon-green.png" alt="TourneyLinks" className="w-6 h-6 object-contain opacity-80" />
                </div>
                <h4 className="text-xl font-bold text-[var(--forest)]">TourneyLinks</h4>
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[var(--emerald)] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-[var(--forest)] mb-1">100% Active Golfers</span>
                    <span className="text-sm text-[var(--mist)] leading-relaxed">We put your tournament directly in front of local players actively searching for a game.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[var(--emerald)] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-[var(--forest)] mb-1">VIP Sponsorships</span>
                    <span className="text-sm text-[var(--mist)] leading-relaxed">Dedicated sponsor carousels and edge-to-edge logos designed to maximize corporate revenue.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[var(--emerald)] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-[var(--forest)] mb-1">Automated Rosters</span>
                    <span className="text-sm text-[var(--mist)] leading-relaxed">Native foursome management automatically captures exact handicaps and contact info for every player.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Three Pillars - Deep Dive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20">
          <div className="p-8 rounded-2xl bg-[var(--white)] border border-black/5 hover:border-[var(--emerald)]/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[var(--forest)]/5 flex items-center justify-center mb-6">
              <DollarSign className="w-7 h-7 text-[var(--emerald)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--forest)] mb-4">Maximize Revenue</h3>
            <p className="text-[var(--mist)] leading-relaxed">
              Our checkout flow is optimized specifically for high-ticket sponsors, making it effortless for local businesses to support your cause and receive premium brand visibility.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--white)] border border-black/5 hover:border-[var(--emerald)]/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[var(--forest)]/5 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-[var(--emerald)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--forest)] mb-4">Minimize Headaches</h3>
            <p className="text-[var(--mist)] leading-relaxed">
              Say goodbye to tracking down "Golfer 3" via email. Our team onboarding captures every player's exact details, so you show up on tournament day with a perfect roster.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--white)] border border-black/5 hover:border-[var(--emerald)]/30 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[var(--forest)]/5 flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-[var(--emerald)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--forest)] mb-4">Amplify Reach</h3>
            <p className="text-[var(--mist)] leading-relaxed">
              We operate the #1 national golf directory. By hosting your event on TourneyLinks, you gain massive, free exposure to our network of active local players.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/contact" className="btn-hero inline-flex items-center gap-3 px-10 py-5 text-lg font-bold">
            List Your Tournament
            <span className="text-[var(--emerald)]">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
