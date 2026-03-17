'use client';

import React, { useState } from 'react';
import { Search, Loader2, Database, MapPin, Calendar, Trophy, AlertTriangle } from 'lucide-react';

export default function TournamentAgent() {
  const [searchUrl, setSearchUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'scraping' | 'analyzing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const mockResults = [
    {
      name: "Rochester City Amateur",
      date: "August 12-14, 2024",
      course: "Genesee Valley Golf Course",
      city: "Rochester, NY",
      format: "54-Hole Stroke Play",
      price: "$150",
      confidence: 98,
      source: "rdga.org"
    },
    {
      name: "Western NY Open Qualifer",
      date: "July 2, 2024",
      course: "Mendon Golf Club",
      city: "Mendon, NY",
      format: "18-Hole Qualifier",
      price: "$100",
      confidence: 92,
      source: "nysga.org"
    },
    {
      name: "Local Charity Scramble",
      date: "TBD 2024",
      course: "Unknown",
      city: "Rochester Area",
      format: "Team Scramble",
      price: "$500/team",
      confidence: 45,
      source: "eventbrite.com" // Lower confidence due to missing fields
    }
  ];

  const handleRunAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUrl) return;
    
    setStatus('scraping');
    setProgress(0);
    
    // Simulate scraping
    const scrapeInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 40) {
          clearInterval(scrapeInterval);
          setStatus('analyzing');
          
          // Simulate LLM analysis
          const llmInterval = setInterval(() => {
            setProgress(p2 => {
              if (p2 >= 100) {
                clearInterval(llmInterval);
                setStatus('done');
                return 100;
              }
              return p2 + 5;
            });
          }, 150);
          return p;
        }
        return p + 2;
      });
    }, 50);
  };

  return (
    <div className="bg-[var(--forest)] rounded-xl p-6 md:p-10 shadow-xl border border-[rgba(201,168,76,0.15)] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Database className="w-64 h-64 text-[var(--gold)]" />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] rounded-full text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-4">
            <Search className="w-3.5 h-3.5" /> LLM Extraction Engine
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-[var(--cream)] mb-2">Ingest Tournament Data</h2>
          <p className="text-[var(--mist)] text-sm max-w-xl">
            Input an association URL, golf club event page, or Eventbrite link. The agent uses Playwright and Claude 3.5 Sonnet to traverse, extract, structure, and normalize tournament data into the TourneyLinks database.
          </p>
        </div>

        <form onSubmit={handleRunAgent} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[var(--mist)] font-mono text-sm">https://</span>
            </div>
            <input 
              type="text" 
              value={searchUrl}
              onChange={e => setSearchUrl(e.target.value)}
              placeholder="rdga.org/tournaments"
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(201,168,76,0.3)] rounded-md pl-[4.5rem] pr-4 py-4 text-[var(--cream)] font-mono text-sm focus:border-[var(--gold)] outline-none transition-colors shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'scraping' || status === 'analyzing' || !searchUrl}
            className="bg-[var(--gold)] hover:bg-[var(--amber)] text-[var(--forest)] font-bold py-4 px-8 rounded-md transition-all flex justify-center items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {status === 'scraping' || status === 'analyzing' ? (
              <><Loader2 className="animate-spin w-5 h-5" /> Processing...</>
            ) : (
              'Run Extraction Pipeline'
            )}
          </button>
        </form>

        {(status === 'scraping' || status === 'analyzing') && (
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--gold)] mb-1">Status</div>
                <div className="text-[var(--cream)] font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
                  {status === 'scraping' ? 'Crawling pages via Playwright...' : 'Claude extracting structured JSON...'}
                </div>
              </div>
              <div className="font-mono text-xl font-bold text-[var(--gold)]">{progress}%</div>
            </div>
            
            <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--amber)] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-4 flex gap-4 text-xs font-mono text-[var(--mist)]">
              <span className={status === 'scraping' ? 'text-[var(--cream)]' : ''}>[1] Headless Browser Nav</span> →
              <span className={status === 'analyzing' ? 'text-[var(--cream)]' : ''}>[2] DOM to Markdown</span> →
              <span className={status === 'analyzing' && progress > 70 ? 'text-[var(--cream)]' : ''}>[3] LLM Schema Extraction</span>
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[rgba(90,140,58,0.2)] flex items-center justify-center">
                <Database className="w-5 h-5 text-[var(--grass)]" />
              </div>
              <div>
                <h3 className="text-[var(--cream)] font-semibold text-lg">Extraction Complete</h3>
                <p className="text-[var(--mist)] text-sm">Found {mockResults.length} tournament records match TourneyLinks schema.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left">
              {mockResults.map((t, i) => (
                <div key={i} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.1)] rounded-lg p-5 flex flex-col md:flex-row gap-4 justify-between transition-all hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(201,168,76,0.3)]">
                  <div>
                    <h4 className="font-serif text-[var(--cream)] text-lg font-bold mb-2">{t.name}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--mist)]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {t.course}, {t.city}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {t.date}</span>
                      <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> {t.format}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-[rgba(255,255,255,0.1)] pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0 shrink-0">
                    <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                      t.confidence >= 95 ? 'bg-[rgba(90,140,58,0.15)] text-[var(--grass)]' : 
                      t.confidence >= 90 ? 'bg-[rgba(201,168,76,0.15)] text-[var(--gold)]' : 
                      'bg-[rgba(192,57,43,0.15)] text-[var(--flag-red)]'
                    }`}>
                      {t.confidence < 90 && <AlertTriangle className="w-3 h-3" />}
                      {t.confidence}% Match
                    </div>
                    <div className="text-[var(--mist)] text-xs">via {t.source}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => { setStatus('idle'); setSearchUrl(''); }} className="bg-transparent border border-[rgba(201,168,76,0.4)] text-[var(--cream)] hover:text-[var(--gold)] hover:border-[var(--gold)] px-6 py-2 rounded text-sm font-medium transition-colors">
                Extract Another Source
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
