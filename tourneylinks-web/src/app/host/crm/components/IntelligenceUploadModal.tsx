import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, ChevronRight, Wand2, DatabaseZap, Loader2, AlertTriangle, Trash2, ShieldCheck } from 'lucide-react';

interface AILeadPreview {
  id: string;
  companyName: string;
  expectedValue: number;
  contactName: string | null;
}

interface IntelligenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number;
  onImportComplete: (insertedLeads: any[]) => void;
}

export default function IntelligenceUploadModal({ isOpen, onClose, tournamentId, onImportComplete }: IntelligenceUploadModalProps) {
  const [step, setStep] = useState<'upload' | 'scanning' | 'verify'>('upload');
  const [previews, setPreviews] = useState<AILeadPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStep('scanning');

    try {
      // 1. Convert to Base64
      const buffer = await file.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');
      const mimeType = file.type;

      // 2. Invoke Gemini AI Pipeline
      const res = await fetch('/api/host/sponsors/import/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType })
      });

      if (!res.ok) throw new Error('AI Engine failed to parse the document matrix.');

      const { leads } = await res.json();
      
      // Inject synthetic frontend IDs for table management
      setPreviews(leads.map((l: any, i: number) => ({ ...l, id: `preview-${i}` })));
      setStep('verify');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unknown processing error');
      setStep('upload');
    }
  };

  const handleUpdatePreview = (id: string, field: keyof AILeadPreview, value: any) => {
    setPreviews(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeletePreview = (id: string) => {
    setPreviews(prev => prev.filter(p => p.id !== id));
  };

  const commitToPipeline = async () => {
    setIsCommitting(true);
    try {
      const res = await fetch('/api/host/sponsors/import/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, leads: previews })
      });
      
      if (!res.ok) throw new Error('Failed to bulk drop leads into the pipeline');
      const data = await res.json();
      onImportComplete(data.leads);
      onClose(); // Cleanup handled by parent
    } catch (err) {
      console.error(err);
      setError('An error occurred while pushing data to the database.');
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a120e]/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="bg-[#FAF9F6] border border-[#e8eada] rounded-2xl shadow-2xl relative z-10 w-full max-w-4xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 min-h-[400px] max-h-[85vh]">
        
        {/* Header Ribbon */}
        <div className="px-8 py-5 border-b border-[#e8eada] bg-white flex items-center justify-between shadow-sm relative z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center shrink-0">
               <DatabaseZap className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-[#0a120e]" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>Intelligence Pipeline</h3>
               <p className="text-sm text-neutral-500 font-medium">Automatic OCR & Matrix Extraction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col relative" style={{ scrollbarWidth: 'thin' }}>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          {step === 'upload' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 rounded-full bg-[rgba(212,175,55,0.05)] border-2 border-dashed border-[rgba(212,175,55,0.4)] flex items-center justify-center mb-6 relative">
                 <Wand2 className="w-8 h-8 text-[var(--gold)]" />
                 <div className="absolute -right-2 -bottom-2 bg-white rounded-full p-1 shadow-sm border border-[#e8eada]">
                   <UploadCloud className="w-4 h-4 text-neutral-400" />
                 </div>
               </div>
               
               <h4 className="text-2xl font-bold text-[#0a120e] mb-3 leading-tight">Drag and drop any list.</h4>
               <p className="text-neutral-500 max-w-sm mx-auto mb-8 leading-relaxed">
                 Simply upload a screenshot of a spreadsheet, a raw CSV, or even a handwritten list of potential hosts. Gemini Multimodal Intelligence will read, format, and load your pipeline for you.
               </p>

               <div className="relative group cursor-pointer">
                 <input 
                   type="file" 
                   accept="image/*, .csv" 
                   onChange={handleFileUpload}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                   title="Drop screenshot here"
                 />
                 <div className="px-8 py-4 bg-[var(--gold)] text-black font-extrabold text-sm rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-105 group-hover:shadow-[0_4px_25px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2">
                   <UploadCloud className="w-5 h-5" />
                   SELECT FILE OR SCREENSHOT
                 </div>
               </div>
            </div>
          )}

          {step === 'scanning' && (
             <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 mb-6 relative">
                 <div className="absolute inset-0 border-4 border-neutral-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-[var(--gold)] rounded-full border-t-transparent animate-spin drop-shadow-md"></div>
                 <Wand2 className="w-8 h-8 text-[var(--gold)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
               </div>
               <h4 className="text-2xl font-bold text-[var(--gold)] mb-2" style={{ fontFamily: 'var(--font-serif), var(--font-cinzel), serif' }}>Extracting Matrix...</h4>
               <p className="text-neutral-500 font-medium">Google Gemini is interpreting raw pixels and structuring database matrices.</p>
             </div>
          )}

          {step === 'verify' && (
            <div className="flex flex-col h-full animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-[#0a120e] mb-1">Verify Intelligence Payload</h4>
                  <p className="text-neutral-500 text-sm">We extracted <strong className="text-[var(--gold)]">{previews.length}</strong> unique entities. Please review the matrix before committing it to your active pipeline. You can edit typos directly in the cells.</p>
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                  Step 2 of 2
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-hidden border border-[#e8eada] rounded-xl bg-white shadow-sm flex flex-col relative">
                
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_150px_150px_60px] gap-4 p-4 border-b border-[#e8eada] bg-[#FAF9F6] text-xs font-bold text-neutral-400 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                  <div>Company Name</div>
                  <div>Contact Name</div>
                  <div className="text-right">Expected Value</div>
                  <div className="text-center">Drop</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {previews.map((preview, i) => (
                    <div key={preview.id} className={`grid grid-cols-[1fr_150px_150px_60px] gap-4 p-3 border-b border-neutral-100 items-center hover:bg-[#FAF9F6] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30'}`}>
                      {/* Name Input */}
                      <div>
                        <input 
                          type="text" 
                          value={preview.companyName}
                          onChange={e => handleUpdatePreview(preview.id, 'companyName', e.target.value)}
                          className="w-full bg-transparent border border-transparent hover:border-neutral-200 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 text-sm font-bold text-[#0a120e] focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                      
                      {/* Contact Input */}
                      <div>
                        <input 
                          type="text" 
                          value={preview.contactName || ''}
                          onChange={e => handleUpdatePreview(preview.id, 'contactName', e.target.value)}
                          placeholder="-- No Contact --"
                          className="w-full bg-transparent border border-transparent hover:border-neutral-200 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 text-sm text-neutral-600 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Value Input */}
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-neutral-400 font-bold">$</span>
                        <input 
                          type="number" 
                          value={preview.expectedValue ? preview.expectedValue / 100 : ''}
                          onChange={e => handleUpdatePreview(preview.id, 'expectedValue', e.target.value ? parseFloat(e.target.value) * 100 : 0)}
                          placeholder="0"
                          className="w-24 bg-transparent border border-transparent hover:border-neutral-200 focus:border-[var(--gold)] focus:bg-white rounded px-2 py-1.5 text-sm font-bold text-[#2ecc71] text-right focus:outline-none transition-all"
                        />
                      </div>

                      {/* Delete Action */}
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleDeletePreview(preview.id)}
                          className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors group"
                          title="Remove row"
                        >
                          <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {previews.length === 0 && (
                    <div className="py-12 text-center flex flex-col items-center justify-center">
                       <ShieldCheck className="w-10 h-10 text-neutral-200 mb-2" />
                       <p className="text-neutral-400 text-sm font-medium">All rows dropped. Upload a new image to start over.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Verify Step Only) */}
        {step === 'verify' && (
          <div className="p-6 border-t border-[#e8eada] bg-[#FAF9F6] flex items-center justify-between shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-20">
            <button 
              onClick={() => setStep('upload')} 
              className="px-5 py-3 text-neutral-500 font-bold text-sm hover:text-[#0a120e] transition-colors"
              disabled={isCommitting}
            >
              Start Over
            </button>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-400 underline cursor-pointer hover:text-neutral-600">Report AI Issue</span>
              <button 
                onClick={commitToPipeline}
                disabled={isCommitting || previews.length === 0}
                className="flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 rounded-xl font-extrabold text-sm hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                {isCommitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Committing Matrix...</>
                ) : (
                  <>Import {previews.length} Sponsors <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
