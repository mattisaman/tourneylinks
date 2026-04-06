'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, Monitor, Image as ImageIcon, DollarSign, Settings, ShoppingBag, Plus, UploadCloud } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import StripeOnboardButton from './onboarding/StripeOnboardButton';
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function HostLiveCampaignBuilder() {
  const { userId } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'finance' | 'donations' | 'sponsorships' | 'launch'>('content');

  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [course, setCourse] = useState('');
  const [city, setCity] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('scramble');
  const [selectedVis, setSelectedVis] = useState('private');

  const [maxPlayers, setMaxPlayers] = useState(80);
  const [holes, setHoles] = useState('18 Holes');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');

  const [showEmojiDesc, setShowEmojiDesc] = useState(false);
  const [showEmojiDonation, setShowEmojiDonation] = useState(false);
  const [showEmojiGolfCause, setShowEmojiGolfCause] = useState(false);

  const [packages, setPackages] = useState<{name: string, price: number, isTeam: boolean, passFees: boolean}[]>([
     { name: 'Foursome', price: 500, isTeam: true, passFees: false },
     { name: 'Individual Golfer', price: 125, isTeam: false, passFees: false },
     { name: 'Dinner Ticket Only', price: 50, isTeam: false, passFees: false }
  ]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<{name: string, price: number | string, isTeam: boolean, passFees: boolean}>({ name: '', price: '', isTeam: false, passFees: false });

  const [addons, setAddons] = useState<{name: string, price: number, type: 'per_player'|'per_team'|'flat', maxQuantity?: number, passFees: boolean}[]>([
     { name: 'Mulligan', price: 20, type: 'per_player', maxQuantity: 2, passFees: false }
  ]);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [newAddon, setNewAddon] = useState<{name: string, price: number | string, type: 'per_player'|'per_team'|'flat', maxQuantity?: number, passFees: boolean}>({ name: '', price: '', type: 'per_player', passFees: false });

  const [themeColor, setThemeColor] = useState('#c9a84c');
  const [secondaryThemeColor, setSecondaryThemeColor] = useState('#1a2e1a');
  const activeSecondaryColor = secondaryThemeColor || themeColor;

  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroPositionX, setHeroPositionX] = useState(50);
  const [heroPosition, setHeroPosition] = useState(50);
  const [heroZoom, setHeroZoom] = useState(100);
  const [tileImage, setTileImage] = useState<string | null>(null);
  const [tilePositionX, setTilePositionX] = useState(50);
  const [tilePosition, setTilePosition] = useState(50);
  const [tileZoom, setTileZoom] = useState(100);

  const [enableGallery, setEnableGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  const [coHostEmails, setCoHostEmails] = useState<{email: string}[]>([{email: ''}]);
  
  const [courseSearch, setCourseSearch] = useState('');
  const [courseResults, setCourseResults] = useState<any[]>([]);
  
  const [sponsors, setSponsors] = useState<{tier: string, price: number, spots: number, incentives: string[], includesIntent: boolean, includesDinner: boolean, rotatesOnTv?: boolean, passFees: boolean}[]>([
     { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: ['Primary Logo on all Hero branding', 'Foursome included', 'Speaking opportunity at dinner'], includesIntent: true, includesDinner: true, rotatesOnTv: true, passFees: false },
     { tier: 'Beverage Cart', price: 1500, spots: 2, incentives: ['Logo on beverage cart', 'Custom branded napkins'], includesIntent: false, includesDinner: false, rotatesOnTv: true, passFees: false }
  ]);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [editingSponsorIdx, setEditingSponsorIdx] = useState<number | null>(null);
  const [newSponsor, setNewSponsor] = useState<{tier: string, price: number | string, spots: number, incentivesText: string, includesIntent: boolean, includesDinner: boolean, rotatesOnTv: boolean, passFees: boolean}>({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false, passFees: false });
  const [sponsorPreviewMode, setSponsorPreviewMode] = useState<'directory' | 'checkout'>('directory');
  
  // Donations State
  const [donorTiers, setDonorTiers] = useState<{tier: string, price: number, incentives: string[]}[]>([
     { tier: 'Bronze Supporter', price: 100, incentives: ['Recognition on tournament page', 'Thank you email from organization'] },
     { tier: 'Silver Supporter', price: 250, incentives: ['Recognition on tournament page', 'Social media shoutout'] }
  ]);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [editingDonorIdx, setEditingDonorIdx] = useState<number | null>(null);
  const [newDonor, setNewDonor] = useState<{tier: string, price: number | string, incentivesText: string}>({ tier: '', price: '', incentivesText: '' });
  const [donorPreviewMode, setDonorPreviewMode] = useState<'directory' | 'checkout'>('directory');
  const [allowCustomDonation, setAllowCustomDonation] = useState(true);
  const [minCustomDonation, setMinCustomDonation] = useState<number>(5);
  const [donationThankYouEmail, setDonationThankYouEmail] = useState('Dear [Donor Name],\n\nThank you for supporting our cause! Your generous contribution allows us to continue our mission. Please keep this receipt for your records.\n\nWarm regards,\n[Tournament Organizer]');
  const [donationsEnabled, setDonationsEnabled] = useState(true);
  const [charityTaxIdDonationInfo, setCharityTaxIdDonationInfo] = useState('');

  const [simulatorDevice, setSimulatorDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [aiSuggestionPanel, setAiSuggestionPanel] = useState<any>(null);

  // 501(c)(3) and Golf Foundation State
  const [charityType, setCharityType] = useState<'none'|'own'|'golf_sponsored'>('none');
  const [charityName, setCharityName] = useState('');
  const [charityTaxId, setCharityTaxId] = useState('');
  const [golfApplicationCause, setGolfApplicationCause] = useState('');
  const [golfPayoutMethod, setGolfPayoutMethod] = useState<'bank'|'check'>('bank');
  const [golfPayoutInfo, setGolfPayoutInfo] = useState('');
  const [golfAgreementChecked, setGolfAgreementChecked] = useState(false);
  const [golfApplicationStatus, setGolfApplicationStatus] = useState<'draft'|'pending'|'approved'>('draft');
  const isCharity = charityType !== 'none';


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      
      const tid = p.get('tournamentId');
      if (tid) {
         setDraftId(tid);
         setIsLoadingForm(true);
         fetch(`/api/admin/tournaments/${tid}`)
           .then(r => r.ok ? r.json() : null)
           .then(data => {
             if (data) {
                // Hydrate core
                setName(data.name || '');
                setDate(data.dateStart ? new Date(data.dateStart).toISOString().split('T')[0] : '');
                setCourse(data.courseName || '');
                setCity(data.courseCity || '');
                setDesc(data.description || '');
                if (data.format) setSelectedFormat(data.format);
                if (data.isPrivate !== undefined) setSelectedVis(data.isPrivate ? 'private' : 'public');
                
                // Hydrate images
                if (data.heroImages) {
                   try {
                     const imgs = typeof data.heroImages === 'string' && data.heroImages.startsWith('[') ? JSON.parse(data.heroImages) : data.heroImages;
                     if (Array.isArray(imgs) && imgs.length > 0) setHeroImage(imgs[0]);
                     else if (typeof imgs === 'string') setHeroImage(imgs);
                   } catch(e) {
                     setHeroImage(data.heroImages);
                   }
                } else if (data.heroImageUrl) {
                   setHeroImage(data.heroImageUrl);
                }

                if (data.galleryImages) {
                   try {
                     const parsed = typeof data.galleryImages === 'string' ? JSON.parse(data.galleryImages) : data.galleryImages;
                     if (Array.isArray(parsed)) {
                        setGalleryImages(parsed);
                        if (parsed.length > 0) setEnableGallery(true);
                     }
                   } catch(e) {}
                }

                if (data.tileImage) setTileImage(data.tileImage);
                
                // Hydrate configs
                if (data.heroPositionData) {
                   try {
                     const parsed = typeof data.heroPositionData === 'string' ? JSON.parse(data.heroPositionData) : data.heroPositionData;
                     if (parsed.x !== undefined) setHeroPositionX(parsed.x);
                     if (parsed.y !== undefined) setHeroPosition(parsed.y);
                     if (parsed.zoom !== undefined) setHeroZoom(parsed.zoom);
                   } catch(e) {}
                }
                
                if (data.tilePositionData) {
                   try {
                     const parsed = typeof data.tilePositionData === 'string' ? JSON.parse(data.tilePositionData) : data.tilePositionData;
                     if (parsed.x !== undefined) setTilePositionX(parsed.x);
                     if (parsed.y !== undefined) setTilePosition(parsed.y);
                     if (parsed.zoom !== undefined) setTileZoom(parsed.zoom);
                   } catch(e) {}
                }
                
                if (data.coHostEmails) {
                   try {
                     const parsed = typeof data.coHostEmails === 'string' ? JSON.parse(data.coHostEmails) : data.coHostEmails;
                     if (Array.isArray(parsed) && parsed.length > 0) setCoHostEmails(parsed);
                   } catch(e) {}
                }

                if (data.sponsors) {
                   try {
                     const parsed = typeof data.sponsors === 'string' ? JSON.parse(data.sponsors) : data.sponsors;
                     if (Array.isArray(parsed) && parsed.length > 0) setSponsors(parsed);
                   } catch(e) {}
                }
                if (data.acceptsDonations !== undefined) setDonationsEnabled(data.acceptsDonations);
                if (data.donationsConfig) {
                   try {
                     const parsed = typeof data.donationsConfig === 'string' ? JSON.parse(data.donationsConfig) : data.donationsConfig;
                     if (parsed.allowCustomDonation !== undefined) setAllowCustomDonation(parsed.allowCustomDonation);
                     if (parsed.minCustomDonation !== undefined) setMinCustomDonation(parsed.minCustomDonation);
                     if (parsed.donationThankYouEmail !== undefined) setDonationThankYouEmail(parsed.donationThankYouEmail);
                     if (parsed.charityTaxIdDonationInfo !== undefined) setCharityTaxIdDonationInfo(parsed.charityTaxIdDonationInfo);
                     if (parsed.donorTiers) setDonorTiers(parsed.donorTiers);
                   } catch(e) {}
                }

                if (data.themeColor) setThemeColor(data.themeColor);
                if (data.secondaryThemeColor) setSecondaryThemeColor(data.secondaryThemeColor);
             }
             setIsLoadingForm(false);
           });
      } else {
         if (p.get('courseName')) {
            setCourse(p.get('courseName') || '');
            setCourseSearch(p.get('courseName') || '');
         }
         const ct = p.get('courseCity');
         const st = p.get('courseState');
         if (ct && st) setCity(`${ct}, ${st}`);
         else if (ct) setCity(ct);
      }
    }
  }, []);

  useEffect(() => {
    if (courseSearch.length > 2 && courseSearch !== course) {
      const fetchCourses = async () => {
         try {
            const res = await fetch(`/api/courses/search?q=${encodeURIComponent(courseSearch)}`);
            if (res.ok) {
               const data = await res.json();
               setCourseResults(data.courses || []);
            }
         } catch (err) {}
      };
      const to = setTimeout(() => fetchCourses(), 300);
      return () => clearTimeout(to);
    } else {
      setCourseResults([]);
    }
  }, [courseSearch, course]);

  const selectCourse = (c: any) => {
     setCourse(c.name);
     setCourseSearch(c.name);
     setCity(`${c.city}, ${c.state || ''}`);
     setCourseResults([]);
  };

  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'>('idle');
  const [draftId, setDraftId] = useState<string | null>(null);

  const hasMinimalSubstance = name.length > 2 || course.length > 2 || !!heroImage || galleryImages.length > 0;
  const [showExitModal, setShowExitModal] = useState<{show: boolean, targetUrl: string | null}>({show: false, targetUrl: null});

  // Exit/Navigation Interceptor for Unsaved Fresh Drafts
  useEffect(() => {
    if (draftId || !hasMinimalSubstance) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
       if ((window as any).__skipBeforeUnload) return;
       e.preventDefault();
       e.returnValue = '';
    };

    const handleLinkClick = (e: MouseEvent) => {
       const target = (e.target as Element).closest('a');
       if (target && target.href && !target.href.startsWith('javascript:') && !target.href.includes('/host')) {
          e.preventDefault();
          setShowExitModal({ show: true, targetUrl: target.href });
       }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
       window.removeEventListener('beforeunload', handleBeforeUnload);
       document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [draftId, hasMinimalSubstance]);

  useEffect(() => {
     if (userId && !draftId && hasMinimalSubstance) {
        handleManualSaveAsDraft();
     }
  }, [userId, draftId, hasMinimalSubstance]);

  const handleManualSaveAsDraft = async () => {
     if (draftId) return;
     setSaveStatus('saving');
     try {
        const payload = {
           name: name || 'Untitled Campaign', courseName: course || 'Unknown', dateStart: date || new Date().toISOString().split('T')[0], format: selectedFormat,
           description: desc, city, themeColor, secondaryThemeColor, 
           heroImages: heroImage ? JSON.stringify([heroImage]) : null,
           galleryImages: galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
           heroPositionData: JSON.stringify({ x: heroPositionX, y: heroPosition, zoom: heroZoom }),
           tileImage: tileImage || null,
           tilePositionData: JSON.stringify({ x: tilePositionX, y: tilePosition, zoom: tileZoom }),
           coHostEmails: JSON.stringify(coHostEmails),
           sponsors: JSON.stringify(sponsors),
           acceptsDonations: donationsEnabled,
           donationsConfig: JSON.stringify({ allowCustomDonation, minCustomDonation, donationThankYouEmail, charityTaxIdDonationInfo, donorTiers })
        };
        const res = await fetch('/api/admin/tournaments', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.id) {
           setDraftId(data.id.toString());
           window.history.replaceState(null, '', `/host?tournamentId=${data.id}`);
           setSaveStatus('saved');
           setTimeout(() => setSaveStatus('idle'), 3000);
           return true; 
        }
     } catch (e) {
        setSaveStatus('idle');
     }
     return false;
  };

  useEffect(() => {
    if (draftId && !isLoadingForm) {
        // Auto Save Logic
        const payload = {
           name, dateStart: date, courseName: course, city, description: desc, format: selectedFormat,
           themeColor, secondaryThemeColor, 
           heroImages: heroImage ? JSON.stringify([heroImage]) : null,
           galleryImages: galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
           heroPositionData: JSON.stringify({ x: heroPositionX, y: heroPosition, zoom: heroZoom }),
           tileImage: tileImage || null,
           tilePositionData: JSON.stringify({ x: tilePositionX, y: tilePosition, zoom: tileZoom }),
           coHostEmails: JSON.stringify(coHostEmails),
           sponsors: JSON.stringify(sponsors),
           acceptsDonations: donationsEnabled,
           donationsConfig: JSON.stringify({ allowCustomDonation, minCustomDonation, donationThankYouEmail, charityTaxIdDonationInfo, donorTiers })
        };

        const autoSave = async () => {
           setSaveStatus('saving');
           try {
              const res = await fetch(`/api/admin/tournaments/${draftId}`, {
                 method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
              });
              if (res.ok) {
                 setSaveStatus('saved');
                 setTimeout(() => setSaveStatus('idle'), 3000);
              } else {
                 setSaveStatus('idle');
              }
           } catch(e) {
              setSaveStatus('idle');
           }
        };

        const to = setTimeout(() => autoSave(), 1500); // 1.5s Debounce
        return () => clearTimeout(to);
    }
  }, [name, date, course, city, desc, selectedFormat, themeColor, secondaryThemeColor, heroImage, galleryImages, heroPositionX, heroPosition, heroZoom, coHostEmails, sponsors, draftId, isLoadingForm]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatNames: Record<string, string> = {
    'scramble': '4-Man Scramble',
    '2scramble': '2-Man Scramble',
    'bestball': 'Best Ball',
    'stroke': 'Stroke Play',
    'match': 'Match Play',
    'stableford': 'Stableford'
  };

  const formatName = formatNames[selectedFormat] || selectedFormat;

  const fee = packages.length > 0 ? packages[0].price : 0;
  const stripeFee = fee > 0 ? (fee * (isCharity ? 0.022 : 0.029) + 0.30) : 0;
  let totalFee = fee;
  let organizerRevenue = fee - stripeFee;

  
  // --- EDITOR UI CHUNKS --- //

  const renderContentTab = () => (
     <div className="builder-section fade-in">
        <div className="pro-tip-alert" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           <div style={{ fontSize: '1.2rem' }}>💡</div>
           <div>
              <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>PRO TIP: Detailed Profiles Convert</strong>
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                 Tournaments with a description over 150 words and a custom Hero Image see a <strong style={{ color: 'var(--forest)' }}>40% higher registration rate</strong>.
              </div>
           </div>
        </div>

        {/* Setup Donations & 501(c)(3) Entity Block */}
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div className="wizard-card-title">Setup Donations & 501(c)(3) Entity</div>
           
           <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.8rem' }}>501(c)(3) Status & Structure</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                 <div style={{ background: 'rgba(46, 204, 113, 0.06)', border: '1px dashed rgba(46, 204, 113, 0.4)', borderRadius: '6px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.2rem' }}>💡</div>
                    <div>
                       <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>Why 501(c)(3) Status Matters</strong>
                       <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                          Enabling tax-deductible receipts often unlocks <b>significantly larger contributions</b> from corporate sponsors and individual donors. It also unlocks discounted processing fees (2.2%) instead of standard (2.9%)!
                       </div>
                    </div>
                 </div>

                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: charityType === 'none' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'none' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'none'} onChange={() => { setCharityType('none'); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>No 501(c)(3) affiliation</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Funds are collected directly as non-tax-deductible gifts.</div>
                    </div>
                 </label>

                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: charityType === 'own' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'own' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'own'} onChange={() => { setCharityType('own'); if(charityName === 'G.O.L.F. Foundation') setCharityName(''); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)' }} />
                    <div>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>We have our own 501(c)(3)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Provide your Tax ID instantly for donor receipts.</div>
                    </div>
                 </label>

                 <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '1rem', background: charityType === 'golf_sponsored' ? 'rgba(212,175,55,0.05)' : '#fff', borderRadius: '6px', border: charityType === 'golf_sponsored' ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: '0.2s' }}>
                    <input type="radio" name="charityType" checked={charityType === 'golf_sponsored'} onChange={() => { setCharityType('golf_sponsored'); setCharityName('G.O.L.F. Foundation'); }} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--gold)', marginTop: '0.2rem' }} />
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Apply for Fiscal Sponsorship (G.O.L.F.)</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: charityType === 'golf_sponsored' ? '1rem' : 0 }}>Process donations and sponsorships tax-free through the Gateway Outreach Links Foundation.</div>
                       
                       {charityType === 'golf_sponsored' && (
                          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '6px', padding: '1rem', marginTop: '0.5rem', animation: 'fadeIn 0.3s' }} onClick={e => e.preventDefault()}>
                             <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--forest)' }}>Describe your cause (required for board approval):</label>
                             <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginBottom: '0.8rem', lineHeight: 1.4 }}>
                                Our foundation supports a broad spectrum of causes—from disease awareness and medical tragedies, to youth sports and group fundraisers. As long as it's legal, ethical, and well-intended, we want to help!
                             </div>
                             <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'visible', marginBottom: '0.8rem', background: '#fff' }}>
                                <div style={{ background: '#f8faf9', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '0.4rem 0.5rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                   <button type="button" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>B</button>
                                   <button type="button" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'italic', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>I</button>
                                   <button type="button" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>U</button>
                                   <span style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.1)', margin: '0 0.2rem' }}></span>
                                   <button type="button" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>🔗 Link</button>
                                   <button type="button" onClick={e => e.stopPropagation()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>• Bullet List</button>
                                   <div style={{ position: 'relative', display: 'inline-flex' }}>
                                      <button type="button" onClick={(e) => { e.stopPropagation(); setShowEmojiGolfCause(!showEmojiGolfCause); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>😀</button>
                                      {showEmojiGolfCause && (
                                         <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: '5px' }}>
                                            <EmojiPicker onEmojiClick={(emojiData) => { setGolfApplicationCause(prev => prev + emojiData.emoji); setShowEmojiGolfCause(false); }} />
                                         </div>
                                      )}
                                   </div>
                                </div>
                                <textarea value={golfApplicationCause} onChange={e => { e.stopPropagation(); setGolfApplicationCause(e.target.value); }} rows={3} style={{ width: '100%', padding: '0.8rem', border: 'none', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', fontSize: '0.85rem', resize: 'vertical', outline: 'none' }} placeholder="E.g. We are raising funds for medical bills for a local family, or, generating funds for our inner-city youth baseball league's new uniforms..."></textarea>
                             </div>
                             
                             <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--forest)' }}>Preferred Disbursement Method:</label>
                             <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.4rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: golfPayoutMethod === 'bank' ? 600 : 400 }}>
                                   <input type="radio" checked={golfPayoutMethod === 'bank'} onChange={(e) => { e.stopPropagation(); setGolfPayoutMethod('bank'); }} style={{ accentColor: 'var(--forest)' }} /> Bank Transfer
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', fontWeight: golfPayoutMethod === 'check' ? 600 : 400 }}>
                                   <input type="radio" checked={golfPayoutMethod === 'check'} onChange={(e) => { e.stopPropagation(); setGolfPayoutMethod('check'); }} style={{ accentColor: 'var(--forest)' }} /> Mailed Check
                                </label>
                             </div>
                             <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '1rem', lineHeight: 1.4 }}>
                               (You can securely provide your preferred routing/mailing details later once your application is approved.)
                             </div>

                             <div style={{ background: '#f8faf9', padding: '1rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
                                   <input type="checkbox" checked={golfAgreementChecked} onChange={(e) => { e.stopPropagation(); setGolfAgreementChecked(!golfAgreementChecked); }} style={{ marginTop: '0.2rem', accentColor: 'var(--forest)', width: '1rem', height: '1rem' }} />
                                   <span style={{ fontSize: '0.75rem', color: 'var(--ink)', lineHeight: 1.5 }}>
                                      <strong>Terms of Agreement:</strong> I acknowledge that by applying for fiscal sponsorship, all collected funds will be managed by the Gateway Outreach Links Foundation. Upon successful completion of the event, the Foundation will disburse all gross proceeds (minus standard Stripe processing fees of 2.2% + 30¢) directly to the tournament organizer using the method specified above.
                                   </span>
                                </label>
                             </div>
                             
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: golfApplicationStatus === 'pending' ? '#e6a100' : 'var(--mist)' }}>Status: {golfApplicationStatus === 'pending' ? 'Application Pending Review' : 'Draft'}</span>
                                <button 
                                   onClick={(e) => { 
                                      e.stopPropagation(); 
                                      e.preventDefault(); 
                                      if(!golfApplicationCause) return alert('Please enter a description of your cause.'); 
                                      if(!golfPayoutInfo) return alert('Please provide your disbursement information.');
                                      if(!golfAgreementChecked) return alert('You must agree to the Terms of Agreement to apply.');
                                      setGolfApplicationStatus('pending'); 
                                   }}
                                   style={{ padding: '0.4rem 0.8rem', background: golfApplicationStatus === 'pending' ? '#e0ece0' : 'var(--forest)', color: golfApplicationStatus === 'pending' ? 'var(--forest)' : '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', opacity: (!golfApplicationCause || !golfPayoutInfo || !golfAgreementChecked) ? 0.6 : 1, transition: '0.2s' }}
                                   disabled={golfApplicationStatus === 'pending'}
                                >
                                   {golfApplicationStatus === 'pending' ? 'Application Submitted' : 'Submit Application'}
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 </label>
              </div>

              {charityType === 'own' && (
                 <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', animation: 'fadeIn 0.3s' }}>
                    <div className="wfield wform-full" style={{ flex: 2 }}>
                      <label>501(c)(3) Organization Name</label>
                      <input type="text" value={charityName} onChange={e => setCharityName(e.target.value)} placeholder="e.g. Jimmy Fund" />
                    </div>
                    <div className="wfield wform-full" style={{ flex: 1 }}>
                      <label>Tax ID (EIN)</label>
                      <input type="text" value={charityTaxId} onChange={e => setCharityTaxId(e.target.value)} placeholder="e.g. 12-3456789" />
                    </div>
                 </div>
              )}
           </div>
        </div>
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
          <div className="wizard-card-title">Tournament Logistics</div>
          <div className="wform-grid">
            <div className="wfield wform-full">
              <label>Tournament Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oak Hill Classic Invitational" />
            </div>
            <div className="wfield" style={{ position: 'relative' }}>
              <label>Host Course</label>
              <input type="text" value={courseSearch} onChange={e => { setCourseSearch(e.target.value); if (e.target.value === '') setCourse(''); }} placeholder="Type to search courses..." />
              {courseResults.length > 0 && (
                 <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 50, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', marginTop: '0.2rem' }}>
                    {courseResults.map(c => (
                       <div key={c.id} onClick={() => selectCourse(c)} style={{ padding: '0.6rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.85rem' }}>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>{c.city}, {c.state}</div>
                       </div>
                    ))}
                 </div>
              )}
            </div>
            <div className="wfield">
              <label>City & State</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Victor, NY" />
            </div>
            <div className="wfield">
              <label>Start Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="wfield">
               <label>Shotgun / Tee Time</label>
               <input type="time" defaultValue="08:00" />
            </div>
            <div className="wfield wform-full">
               <label>Public Description</label>
               <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'visible', transition: 'border-color 0.2s', background: '#fff' }}>
                 <div style={{ background: '#f4f7f5', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '0.4rem 0.6rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <button type="button" style={{ background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--ink)' }}>B</button>
                    <button type="button" style={{ background: 'none', border: 'none', fontStyle: 'italic', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--ink)' }}>I</button>
                    <button type="button" style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', color: 'var(--ink)' }}>U</button>
                    <div style={{ width: '1px', height: '16px', background: 'rgba(0,0,0,0.1)', margin: '0 0.3rem' }}></div>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--ink)' }}>🔗 Link</button>
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 600 }}>• Bullet List</button>
                    <div style={{ position: 'relative', display: 'inline-flex' }}>
                       <button type="button" onClick={() => setShowEmojiDesc(!showEmojiDesc)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--ink)' }}>😀</button>
                       {showEmojiDesc && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: '5px' }}>
                             <EmojiPicker onEmojiClick={(emojiData) => { setDesc(prev => prev + emojiData.emoji); setShowEmojiDesc(false); }} />
                          </div>
                       )}
                    </div>
                 </div>
                 <textarea style={{ border: 'none', width: '100%', padding: '1rem', outline: 'none', resize: 'vertical', minHeight: '120px', fontFamily: 'inherit', fontSize: '0.9rem' }} rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tell players what makes this tournament special. For example, copy-paste a bulleted list of events or schedule information here..."></textarea>
               </div>
            </div>
            <div className="wfield wform-full">
               <label>Co-Host Emails (Optional)</label>
               <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginBottom: '0.8rem', lineHeight: 1.4 }}>Grant additional people full Administration Hub access to this event. If they don't have an account yet, they will receive an email invite to collaborate on this saved draft!</div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {coHostEmails.map((ch, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                       <input type="email" value={ch.email} onChange={e => { const newArr = [...coHostEmails]; newArr[idx].email = e.target.value; setCoHostEmails(newArr); }} placeholder="e.g. hello@tourneylinks.com" style={{ flex: 1 }} />
                       {idx === coHostEmails.length - 1 ? (
                          <button type="button" onClick={() => setCoHostEmails([...coHostEmails, {email: ''}])} className="btn-hero-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Add Co-Host</button>
                       ) : (
                          <button type="button" onClick={() => setCoHostEmails(coHostEmails.filter((_, i) => i !== idx))} style={{ background: 'var(--flag-red)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                       )}
                    </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
          <div className="wizard-card-title">Format & Branding</div>
          <div className="wform-grid">
             <div className="wfield">
                <label>Format</label>
                <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}>
                   <option value="scramble">4-Man Scramble</option>
                   <option value="2scramble">2-Man Scramble</option>
                   <option value="bestball">Best Ball</option>
                   <option value="stroke">Stroke Play</option>
                </select>
             </div>
             <div className="wfield">
               <label>Number of Holes</label>
               <select value={holes} onChange={e => setHoles(e.target.value)}>
                 <option>18 Holes</option>
                 <option>9 Holes</option>
               </select>
             </div>
              <div className="wfield">
                 <label>Primary Theme Color</label>
                 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} style={{ padding: 0, width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                    <input type="text" value={themeColor.toUpperCase()} onChange={e => { let v = e.target.value.toLowerCase(); if(!v.startsWith('#')) v='#'+v; if(v.length<=7) setThemeColor(v); }} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--ink)', width: '85px', padding: '0.4rem 0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px' }} />
                 </div>
              </div>
              <div className="wfield">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <label style={{ margin: 0 }}>Secondary Theme Color</label>
                 </div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                    Optional: Disable the secondary color for a single primary color vibe.
                 </div>
                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label className="toggle-switch">
                       <input type="checkbox" checked={!!secondaryThemeColor} onChange={(e) => {
                          if (e.target.checked) setSecondaryThemeColor('#000000');
                          else setSecondaryThemeColor('');
                       }} />
                       <span className="toggle-slider"></span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: secondaryThemeColor ? 1 : 0.4, pointerEvents: secondaryThemeColor ? 'auto' : 'none' }}>
                       <input type="color" value={activeSecondaryColor} onChange={e => setSecondaryThemeColor(e.target.value)} style={{ padding: 0, width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={!secondaryThemeColor} />
                       <input type="text" value={secondaryThemeColor ? secondaryThemeColor.toUpperCase() : ''} onChange={e => { let v = e.target.value.toLowerCase(); if(v === '' || v === '#') { setSecondaryThemeColor(''); return; } if(!v.startsWith('#')) v='#'+v; if(v.length<=7) setSecondaryThemeColor(v); }} placeholder="Disabled" style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--ink)', width: '85px', padding: '0.4rem 0.6rem', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px' }} disabled={!secondaryThemeColor} />
                    </div>
                 </div>
              </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)' }}>Hero Branding Image</span>
                   {heroImage && (
                     <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                             <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Zoom</span>
                             <input type="range" min="50" max="250" value={heroZoom} onChange={e => setHeroZoom(Number(e.target.value))} style={{ width: '50px' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                             <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Position X</span>
                             <input type="range" min="0" max="100" value={heroPositionX} onChange={e => setHeroPositionX(Number(e.target.value))} style={{ width: '50px' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                             <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Position Y</span>
                             <input type="range" min="0" max="100" value={heroPosition} onChange={e => setHeroPosition(Number(e.target.value))} style={{ width: '50px' }} />
                          </div>
                     </div>
                   )}
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', background: heroImage ? `linear-gradient(135deg, ${activeSecondaryColor}99, ${themeColor}99), url(${heroImage}) ${heroPositionX}% ${heroPosition}%/${heroZoom}% no-repeat` : '#fafaf5', cursor: 'pointer', minHeight: '160px', position: 'relative' }}>
                   <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleImageUpload(e, setHeroImage)} />
                   {!heroImage && (
                     <>
                        <UploadCloud color="var(--mist)" size={32} style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--forest)', fontWeight: 600 }}>Upload Hero Media</span>
                     </>
                   )}
                   {heroImage && <span style={{ color: '#fff', fontWeight: 600, zIndex: 10 }}>Change Hero</span>}
                </label>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--mist)' }}>Directory Tile Thumbnail</span>
                   {tileImage && (
                     <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Zoom</span>
                            <input type="range" min="50" max="250" value={tileZoom} onChange={e => setTileZoom(Number(e.target.value))} style={{ width: '50px' }} />
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Position X</span>
                            <input type="range" min="0" max="100" value={tilePositionX} onChange={e => setTilePositionX(Number(e.target.value))} style={{ width: '50px' }} />
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Position Y</span>
                            <input type="range" min="0" max="100" value={tilePosition} onChange={e => setTilePosition(Number(e.target.value))} style={{ width: '50px' }} />
                         </div>
                     </div>
                   )}
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', background: tileImage ? `linear-gradient(135deg, ${activeSecondaryColor}99, ${themeColor}99), url(${tileImage}) ${tilePositionX}% ${tilePosition}%/${tileZoom}% no-repeat` : '#fafaf5', cursor: 'pointer', minHeight: '160px', position: 'relative' }}>
                   <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => handleImageUpload(e, setTileImage)} />
                   {!tileImage && (
                     <>
                        <ImageIcon color="var(--mist)" size={32} style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--forest)', fontWeight: 600 }}>Upload Tile Media</span>
                     </>
                   )}
                   {tileImage && <span style={{ color: '#fff', fontWeight: 600, zIndex: 10 }}>Change Tile</span>}
                </label>
                
                {/* Embedded Tile Preview */}
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginTop: '0.5rem' }}>Search Page Preview</div>
                <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', background: '#fff' }}>
                   <div style={{ height: '140px', background: tileImage ? `url(${tileImage}) ${tilePositionX}% ${tilePosition}%/${tileZoom}% no-repeat` : '#fafaf5' }}></div>
                   <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--forest)' }}>{name || 'Tournament Title'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)' }}>{course ? `${course} · ${city}` : 'Course Location'}</div>
                   </div>
                </div>
              </div>
           </div>
        </div>

        <div className="wizard-card" style={{ marginTop: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Media Gallery Module</div>
              <label className="toggle-switch">
                 <input type="checkbox" checked={enableGallery} onChange={e => setEnableGallery(e.target.checked)} />
                 <span className="toggle-slider"></span>
              </label>
           </div>
           {enableGallery && (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.2rem', lineHeight: 1.4 }}>
                    Upload up to 10 photos from past events, charitable impact, or course highlights to increase engagement.
                 </div>
                 
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {galleryImages.map((img, idx) => (
                       <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '6px', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                          <button type="button" onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--flag-red)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 800, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>×</button>
                       </div>
                    ))}
                    
                    {galleryImages.length < 10 && (
                       <label style={{ width: '80px', height: '80px', borderRadius: '6px', border: '2px dashed rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fafaf5', transition: '0.2s' }}>
                          <input type="file" style={{ display: 'none' }} accept="image/*" multiple onChange={(e) => {
                             if(e.target.files) {
                                const newFiles = Array.from(e.target.files).map(f => URL.createObjectURL(f));
                                setGalleryImages(prev => [...prev, ...newFiles].slice(0, 10));
                             }
                          }} />
                          <Plus size={20} color="var(--mist)" />
                       </label>
                    )}
                 </div>
              </div>
           )}
        </div>

     </div>
  );

  const renderFinanceTab = () => (
     <div className="builder-section fade-in">
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Registration Packages</div>
              <button onClick={() => setShowPackageForm(!showPackageForm)} className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showPackageForm ? 'Cancel' : <><Plus size={14} /> Mint Package</>}
              </button>
           </div>
           
           {showPackageForm && (
              <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                 <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Package</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Package Name</label>
                          <input type="text" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} placeholder="e.g. Foursome" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>PRICE</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <input type="number" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: e.target.value === '' ? '' : Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                             
                             {/* AI Target Suggestion Button */}
                             <button
                               onClick={async () => {
                                  if (!course) {
                                     alert('Please enter your Golf Course Name on the Content tab first so our AI knows the venue!');
                                     return;
                                  }
                                  setIsSuggestingPrice(true);
                                  try {
                                     const res = await fetch('/api/ai/price-engine', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ courseName: course, players: 144, type: 'charity' })
                                     });
                                     const data = await res.json();
                                     if (data.recommendedPrice) {
                                        setNewPackage({ ...newPackage, price: data.recommendedPrice });
                                        setAiSuggestionPanel({
                                           price: data.recommendedPrice, 
                                           note: data.demographicNote
                                        });
                                     } else {
                                        setAiSuggestionPanel({ error: data.error || 'Failed to calculate price.' });
                                     }
                                  } catch (err) {
                                     setAiSuggestionPanel({ error: 'Network error communicating with AI.' });
                                  }
                                  setIsSuggestingPrice(false);
                               }}
                               disabled={isSuggestingPrice}
                               title="Auto-calculate the perfect price using venue intelligence"
                               style={{ background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '4px', padding: '0.6rem 0.8rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', opacity: isSuggestingPrice ? 0.6 : 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                             >
                               {isSuggestingPrice ? 'Calculating...' : '✨ AI Suggest'}
                             </button>
                          </div>
                       </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                       <input type="checkbox" checked={newPackage.isTeam} onChange={e => setNewPackage({...newPackage, isTeam: e.target.checked})} />
                       <span style={{ fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>This is a Foursome/Team Package</span>
                    </label>

                    {/* Highly Polished AI Suggestion Inline Panel */}
                    {aiSuggestionPanel && !aiSuggestionPanel.error && (
                       <div style={{ background: '#f4fbf7', border: '1px solid #d1fae5', borderRadius: '8px', padding: '1rem', marginTop: '0.8rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', animation: 'fadeIn 0.3s ease-out' }}>
                          <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}} />
                          <div style={{ flexShrink: 0, fontSize: '1.5rem' }}>🧠</div>
                          <div>
                             <div style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>AI Pricing Insight</span>
                                <button onClick={() => setAiSuggestionPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--grass)', fontSize: '0.75rem', fontWeight: 700 }}>Dismiss</button>
                             </div>
                             <p style={{ color: '#2d5a3c', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                                {aiSuggestionPanel.note} <strong style={{ color: 'var(--forest)', display: 'block', marginTop: '0.4rem' }}>Suggested Target: ${aiSuggestionPanel.price}</strong>
                             </p>
                          </div>
                       </div>
                    )}
                    {aiSuggestionPanel?.error && (
                       <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '0.8rem 1rem', marginTop: '0.8rem', color: '#991b1b', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>❌ {aiSuggestionPanel.error}</span>
                          <button onClick={() => setAiSuggestionPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}>X</button>
                       </div>
                    )}

                    <button 
                       onClick={() => {
                          if (newPackage.name && newPackage.price !== '' && Number(newPackage.price) >= 0) {
                             setPackages([...packages, { ...newPackage, price: Number(newPackage.price) }]);
                             setNewPackage({ name: '', price: '', isTeam: false });
                             setShowPackageForm(false);
                             setAiSuggestionPanel(null);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                       Save Package to Registration
                    </button>
                 </div>
              </div>
           )}

           {!showPackageForm && packages.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Mint packages for users to purchase (e.g. Foursome, Individual Golfer, Dinner Only ticket).
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map((p, i) => {
                 const standardFee = p.price > 0 ? p.price * 0.029 + 0.30 : 0;
                 const charityFee = p.price > 0 ? p.price * 0.022 + 0.30 : 0;
                 const payoutStandard = p.passFees ? p.price : p.price - standardFee;
                 const payoutCharity = p.passFees ? p.price : p.price - charityFee;
                 return (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                             {p.isTeam ? 'Foursome' : 'Individual'}
                             {p.passFees ? ' • Reg. Pays Fees' : ' • You Absorb Fees'}
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${typeof p.price === 'number' ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</span>
                          <button onClick={() => {
                             setNewPackage(p);
                             setPackages(packages.filter((_, idx) => idx !== i));
                             setShowPackageForm(true);
                          }} style={{ background: 'none', border: 'none', color: 'var(--forest)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => setPackages(packages.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Remove</button>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600, marginBottom: '0.2rem' }}>STANDARD PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                       </div>
                       <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.2rem' }}>★ 501(C)(3) PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--grass)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>
        
        
        <div className="wizard-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Add-ons & Extras</div>
              <button onClick={() => setShowAddonForm(!showAddonForm)} className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showAddonForm ? 'Cancel' : <><Plus size={14} /> Mint Add-on</>}
              </button>
           </div>
           
           {showAddonForm && (
              <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                 <div style={{ fontWeight: 700, color: 'var(--forest)', marginBottom: '1rem', fontSize: '0.9rem' }}>Create Custom Add-on</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Add-on Name</label>
                          <input type="text" value={newAddon.name} onChange={e => setNewAddon({...newAddon, name: e.target.value})} placeholder="e.g. Mulligan Package" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Price ($)</label>
                          <input type="number" value={newAddon.price} onChange={e => setNewAddon({...newAddon, price: e.target.value === '' ? '' : Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Application Logic</label>
                          <select value={newAddon.type} onChange={e => setNewAddon({...newAddon, type: e.target.value as any})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}>
                             <option value="per_player">Per Player (Scales with roster size)</option>
                             <option value="per_team">Per Foursome Team (Flat team addition)</option>
                             <option value="flat">Flat Purchase (e.g. 50/50 Raffle Tickets)</option>
                          </select>
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Max Qty (Optional)</label>
                          <input type="number" value={newAddon.maxQuantity || ''} onChange={e => setNewAddon({...newAddon, maxQuantity: e.target.value ? Number(e.target.value) : undefined})} placeholder="e.g. 2" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '0.5rem' }}>
                        <div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Pass Fees to Registrant?</div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Automatically append processing costs to checkout.</div>
                        </div>
                        <label className="toggle-switch">
                           <input type="checkbox" checked={newAddon.passFees} onChange={e => setNewAddon({...newAddon, passFees: e.target.checked})} />
                           <span className="toggle-slider"></span>
                        </label>
                     </div>
                     <button 
                       onClick={() => {
                          if (newAddon.name && newAddon.price !== '' && Number(newAddon.price) >= 0) {
                             setAddons([...addons, { ...newAddon, price: Number(newAddon.price) }]);
                             setNewAddon({ name: '', price: '', type: 'per_player', maxQuantity: undefined, passFees: false });
                             setShowAddonForm(false);
                          }
                       }}
                       style={{ padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                       Save Add-on to Cart
                    </button>
                 </div>
              </div>
           )}

           {!showAddonForm && addons.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Configure optional purchases (e.g., Mulligans, Skins, Raffle Tickets) that players can seamlessly add to their cart during checkout.
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {addons.map((a, i) => {
                 const standardFee = a.price > 0 ? a.price * 0.029 + 0.30 : 0;
                 const charityFee = a.price > 0 ? a.price * 0.022 + 0.30 : 0;
                 const payoutStandard = a.passFees ? a.price : a.price - standardFee;
                 const payoutCharity = a.passFees ? a.price : a.price - charityFee;
                 return (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.95rem' }}>
                             {a.name}
                             {a.maxQuantity ? <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--mist)', marginLeft: '0.5rem' }}>(Max {a.maxQuantity})</span> : null}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                             {a.type === 'per_player' ? 'Per Player' : a.type === 'per_team' ? 'Per Team' : 'Flat Purchase'}
                             {a.passFees ? ' • Reg. Pays Fees' : ' • You Absorb Fees'}
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>${a.price.toFixed(2)}</div>
                          <button onClick={() => {
                             setNewAddon(a);
                             setAddons(addons.filter((_, idx) => idx !== i));
                             setShowAddonForm(true);
                          }} style={{ background: 'none', border: 'none', color: 'var(--forest)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => setAddons(addons.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--mist)', fontWeight: 600, marginBottom: '0.2rem' }}>STANDARD PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: 700 }}>${payoutStandard.toFixed(2)}</div>
                       </div>
                       <div style={{ flex: 1, background: 'rgba(212,175,55,0.05)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--forest)', fontWeight: 600, marginBottom: '0.2rem' }}>★ 501(C)(3) PAYOUT</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--grass)', fontWeight: 700 }}>${payoutCharity.toFixed(2)}</div>
                       </div>
                    </div>
                 </div>
              )})}
           </div>
        </div>
        
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div className="wizard-card-title">Prizes & Raffles</div>
           <div className="pro-tip-alert" style={{ background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
               <div style={{ fontSize: '1.2rem' }}>⚠️</div>
               <div>
                  <strong style={{ color: '#856404', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>Legal & Tax Implications</strong>
                  <div style={{ color: '#856404', fontSize: '0.8rem', lineHeight: 1.5 }}>
                     Strict Stripe Terms of Service prohibit processing digital "Raffles" or games of chance unless your organization is a verified 501(c)(3) and explicitly whitelisted by Stripe. 
                     We strongly advise collecting cash/check at the door for raffles until you achieve whitelisted status.
                  </div>
               </div>
            </div>
            <div style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>Prizes setup will unlock once you connect a verified 501(c)(3) taxonomy code.</div>
        </div>
     </div>
  );

  const renderDonationTab = () => (
     <div className="builder-section fade-in">
        <div className="pro-tip-alert" style={{ background: 'rgba(46, 204, 113, 0.08)', border: '1px solid rgba(46, 204, 113, 0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           <div style={{ fontSize: '1.2rem' }}>💖</div>
           <div>
              <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>PRO TIP: Non-Golfer Contributions</strong>
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                 Open your tournament up to non-golfers by offering donation tiers. Many local supporters who cannot attend the event or dinner will still eagerly contribute to a great cause!
              </div>
           </div>
        </div>

         <div className="wizard-card" style={{ marginBottom: '2rem', background: '#f8faf9', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <div className="wizard-card-title" style={{ marginBottom: '0.2rem' }}>Accept Donations</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Enable or disable the donations module for your tournament.</div>
               </div>
               <label className="toggle-switch">
                  <input 
                     type="checkbox" 
                     checked={donationsEnabled} 
                     onChange={(e) => setDonationsEnabled(e.target.checked)} 
                  />
                  <span className="toggle-slider"></span>
               </label>
            </div>
         </div>

         {donationsEnabled && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
               <div className="wizard-card" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                     <div className="wizard-card-title" style={{ marginBottom: 0 }}>Custom Donation Goal</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8faf9', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div>
                           <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--forest)' }}>Accept Open / Custom Donations?</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Allow users to enter any custom dollar amount instead of fixed tiers.</div>
                        </div>
                        <label className="toggle-switch">
                           <input 
                              type="checkbox" 
                              checked={allowCustomDonation} 
                              onChange={(e) => setAllowCustomDonation(e.target.checked)} 
                           />
                           <span className="toggle-slider"></span>
                        </label>
                     </div>

                     {allowCustomDonation && (
                        <div>
                           <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Minimum Custom Amount ($)</label>
                           <input type="number" min="1" value={minCustomDonation} onChange={e => setMinCustomDonation(Number(e.target.value))} style={{ width: '150px', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                        </div>
                     )}
                  </div>
               </div>

               <div className="wizard-card" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                     <div className="wizard-card-title" style={{ marginBottom: 0 }}>Donation Tiers</div>
                     <button 
                        onClick={() => {
                           setShowDonorForm(!showDonorForm);
                           setEditingDonorIdx(null);
                           setNewDonor({ tier: '', price: '', incentivesText: '' });
                        }} 
                        className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {showDonorForm && editingDonorIdx === null ? 'Cancel' : <><Plus size={14} /> Mint Donor Tier</>}
                     </button>
                  </div>
                  
                  {showDonorForm && (
                     <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                           <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.9rem' }}>
                              {editingDonorIdx !== null ? 'Edit Donor Tier' : 'Create Custom Donor Tier'}
                           </div>
                           {editingDonorIdx !== null && (
                              <button onClick={() => { setShowDonorForm(false); setEditingDonorIdx(null); }} style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                           )}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                           <div style={{ display: 'flex', gap: '1rem' }}>
                              <div style={{ flex: 2 }}>
                                 <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Tier Name</label>
                                 <input type="text" value={newDonor.tier} onChange={e => setNewDonor({...newDonor, tier: e.target.value})} placeholder="e.g. Bronze Supporter" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                 <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Price ($)</label>
                                 <input type="number" value={newDonor.price} onChange={e => setNewDonor({...newDonor, price: e.target.value === '' ? '' : Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                              </div>
                           </div>
                           
                           <div>
                              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Benefits (One per line)</label>
                              <textarea 
                                 value={newDonor.incentivesText}
                                 onChange={e => setNewDonor({...newDonor, incentivesText: e.target.value})}
                                 placeholder="e.g. Honorable Mention at Dinner"
                                 rows={3}
                                 style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }}
                              />
                           </div>
                           <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                              <button 
                                 onClick={() => {
                                    if (!newDonor.tier || newDonor.price === '' || Number(newDonor.price) <= 0) return;
                                    const incArray = newDonor.incentivesText.split('\n').map(i => i.trim()).filter(i => i !== '');
                                    const donorObj = { tier: newDonor.tier, price: Number(newDonor.price), incentives: incArray };
                                    
                                    if (editingDonorIdx !== null) {
                                       const clone = [...donorTiers];
                                       clone[editingDonorIdx] = donorObj;
                                       setDonorTiers(clone);
                                    } else {
                                       setDonorTiers([...donorTiers, donorObj]);
                                    }
                                    setNewDonor({ tier: '', price: '', incentivesText: '' });
                                    setShowDonorForm(false);
                                    setEditingDonorIdx(null);
                                 }}
                                 style={{ flex: 1, padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                                 {editingDonorIdx !== null ? 'Save Changes' : 'Mint Tier'}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {!showDonorForm && donorTiers.length === 0 && (
                     <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Create fixed donation tiers for users who want to explicitly support your event at a specific generosity level.
                     </div>
                  )}
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {donorTiers.map((d, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9', transition: '0.2s', ...(editingDonorIdx === i ? { opacity: 0.5, pointerEvents: 'none' } : {}) }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: d.incentives && d.incentives.length > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingBottom: d.incentives && d.incentives.length > 0 ? '0.75rem' : 0, marginBottom: d.incentives && d.incentives.length > 0 ? '0.75rem' : 0 }}>
                              <div>
                                 <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.95rem' }}>{d.tier}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${d.price.toLocaleString()}</div>
                                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => {
                                       setEditingDonorIdx(i);
                                       setNewDonor({ tier: d.tier, price: d.price, incentivesText: (d.incentives || []).join('\n') });
                                       setShowDonorForm(true);
                                    }} style={{ background: 'none', border: 'none', color: '#3399FF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                                    <button onClick={() => setDonorTiers(donorTiers.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                                 </div>
                              </div>
                           </div>
                           {d.incentives && d.incentives.length > 0 && (
                              <div style={{ paddingLeft: '0.5rem' }}>
                                 {d.incentives.map((inc, incIdx) => (
                                    <div key={incIdx} style={{ fontSize: '0.75rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                       <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                                       {inc}
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               <div className="wizard-card">
                  <div className="wizard-card-title">Tax & Digital Receipting</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem', lineHeight: 1.5 }}>Configure the automated email receipt your donors will receive securely right after contributing.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Thank You Email Message</label>
                        <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', overflow: 'visible' }}>
                           <div style={{ background: '#f8faf9', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>B</button>
                              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'italic', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>I</button>
                              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>U</button>
                              <span style={{ width: '1px', background: 'rgba(0,0,0,0.1)', margin: '0 0.2rem' }}></span>
                              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🔗 Link</button>
                              <div style={{ position: 'relative', display: 'inline-flex' }}>
                                 <button onClick={() => setShowEmojiDonation(!showEmojiDonation)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>😀</button>
                                 {showEmojiDonation && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: '5px' }}>
                                       <EmojiPicker onEmojiClick={(emojiData) => { setDonationThankYouEmail(prev => prev + emojiData.emoji); setShowEmojiDonation(false); }} />
                                    </div>
                                 )}
                              </div>
                           </div>
                           <textarea 
                              value={donationThankYouEmail}
                              onChange={e => setDonationThankYouEmail(e.target.value)}
                              rows={6}
                              style={{ width: '100%', padding: '0.8rem', border: 'none', resize: 'vertical', outline: 'none' }}
                           />
                        </div>
                     </div>
                     <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>501(c)(3) Organization Tax ID (Appears on Receipt)</label>
                        <input 
                           type="text" 
                           value={charityTaxIdDonationInfo}
                           onChange={e => setCharityTaxIdDonationInfo(e.target.value)}
                           placeholder="e.g. 12-3456789"
                           style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }} 
                        />
                     </div>
                  </div>
               </div>
            </div>
         )}

     </div>
  );

  const renderSponsorTab = () => (
     <div className="builder-section fade-in">
        <div className="pro-tip-alert" style={{ background: 'rgba(46, 204, 113, 0.08)', border: '1px solid rgba(46, 204, 113, 0.4)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           <div style={{ fontSize: '1.2rem' }}>💰</div>
           <div>
              <strong style={{ color: 'var(--forest)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>PRO TIP: Sponsor Tiers Maximize Revenue</strong>
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                 Pre-selling automated digital sponsorship real estate can cover the entire cost of the tournament before a single golfer registers.
              </div>
           </div>
        </div>

        <div className="wizard-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="wizard-card-title" style={{ marginBottom: 0 }}>Sponsorship Inventory</div>
              <button 
                 onClick={() => {
                    setShowSponsorForm(!showSponsorForm);
                    setEditingSponsorIdx(null);
                    setNewSponsor({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false });
                 }} 
                 className="btn-hero-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 {showSponsorForm && editingSponsorIdx === null ? 'Cancel' : <><Plus size={14} /> Mint Sponsor Tier</>}
              </button>
           </div>
           
           {showSponsorForm && (
              <div style={{ padding: '1.5rem', background: '#f4f7f5', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.9rem' }}>
                       {editingSponsorIdx !== null ? 'Edit Sponsor Tier' : 'Create Custom Tier'}
                    </div>
                    {editingSponsorIdx !== null && (
                       <button onClick={() => { setShowSponsorForm(false); setEditingSponsorIdx(null); }} style={{ background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                    )}
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <div style={{ flex: 2 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Tier Name</label>
                          <input type="text" value={newSponsor.tier} onChange={e => setNewSponsor({...newSponsor, tier: e.target.value})} placeholder="e.g. Title Sponsor" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Price ($)</label>
                          <input type="number" value={newSponsor.price} onChange={e => setNewSponsor({...newSponsor, price: e.target.value === '' ? '' : Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Inventory</label>
                          <input type="number" value={newSponsor.spots} onChange={e => setNewSponsor({...newSponsor, spots: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }} />
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                           <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Player Flow?</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Include foursome registration link.</div>
                           </div>
                           <label className="toggle-switch">
                              <input 
                                 type="checkbox" 
                                 checked={newSponsor.includesIntent} 
                                 onChange={(e) => setNewSponsor({...newSponsor, includesIntent: e.target.checked})} 
                              />
                              <span className="toggle-slider"></span>
                           </label>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                           <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Hospitality Flow?</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Include dinner seating link.</div>
                           </div>
                           <label className="toggle-switch">
                              <input 
                                 type="checkbox" 
                                 checked={newSponsor.includesDinner} 
                                 onChange={(e) => setNewSponsor({...newSponsor, includesDinner: e.target.checked})} 
                              />
                              <span className="toggle-slider"></span>
                           </label>
                        </div>
                     </div>
                     <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                           <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest)' }}>Rotate on TV?</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--mist)' }}>Include in live leaderboard rotation.</div>
                           </div>
                           <label className="toggle-switch">
                              <input 
                                 type="checkbox" 
                                 checked={newSponsor.rotatesOnTv} 
                                 onChange={(e) => setNewSponsor({...newSponsor, rotatesOnTv: e.target.checked})} 
                              />
                              <span className="toggle-slider"></span>
                           </label>
                        </div>
                    <div>
                       <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)', marginBottom: '0.3rem', display: 'block' }}>Incentives & Perks (One per line)</label>
                       <textarea 
                          value={newSponsor.incentivesText}
                          onChange={e => setNewSponsor({...newSponsor, incentivesText: e.target.value})}
                          placeholder="e.g. Foursome Included&#10;Logo on all Golf Carts"
                          rows={3}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical' }}
                       />
                       <div style={{ fontSize: '0.65rem', color: 'var(--mist)', marginTop: '0.3rem' }}>Hit enter to create a new bullet point for the sponsor.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                       <button 
                          onClick={() => {
                             if (!newSponsor.tier || newSponsor.price === '' || Number(newSponsor.price) < 0) return;
                             const incArray = newSponsor.incentivesText.split('\n').map(i => i.trim()).filter(i => i !== '');
                             const sponsorObj = { tier: newSponsor.tier, price: Number(newSponsor.price), spots: newSponsor.spots, incentives: incArray, includesIntent: newSponsor.includesIntent, includesDinner: newSponsor.includesDinner, rotatesOnTv: newSponsor.rotatesOnTv };
                             
                             if (editingSponsorIdx !== null) {
                                const clone = [...sponsors];
                                clone[editingSponsorIdx] = sponsorObj;
                                setSponsors(clone);
                             } else {
                                setSponsors([...sponsors, sponsorObj]);
                             }
                             setNewSponsor({ tier: '', price: '', spots: 1, incentivesText: '', includesIntent: false, includesDinner: false, rotatesOnTv: false });
                             setShowSponsorForm(false);
                             setEditingSponsorIdx(null);
                          }}
                          style={{ flex: 1, padding: '0.8rem', background: 'var(--forest)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                          {editingSponsorIdx !== null ? 'Save Changes' : 'Mint Tier'}
                       </button>
                    </div>
                 </div>
              </div>
           )}

           {!showSponsorForm && sponsors.length === 0 && (
              <div style={{ color: 'var(--mist)', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                 Clearly list what each sponsor tier includes. Incentives like "Foursome Included" or "Logo on Signage" help drive higher commitment.
              </div>
           )}
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sponsors.map((s, i) => (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', background: '#f8faf9', transition: '0.2s', ...(editingSponsorIdx === i ? { opacity: 0.5, pointerEvents: 'none' } : {}) }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: s.incentives && s.incentives.length > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0, marginBottom: s.incentives && s.incentives.length > 0 ? '0.75rem' : 0 }}>
                       <div>
                          <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '0.95rem' }}>{s.tier} <span style={{ fontSize: '0.7rem', color: 'var(--mist)', fontWeight: 400, marginLeft: '0.5rem' }}>({s.spots} {s.spots === 1 ? 'spot' : 'spots'})</span></div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price.toLocaleString()}</div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                             <button onClick={() => {
                                setEditingSponsorIdx(i);
                                setNewSponsor({ tier: s.tier, price: s.price, spots: s.spots, incentivesText: (s.incentives || []).join('\n'), includesIntent: s.includesIntent || false, includesDinner: s.includesDinner || false, rotatesOnTv: s.rotatesOnTv || false });
                                setShowSponsorForm(true);
                             }} style={{ background: 'none', border: 'none', color: '#3399FF', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                             <button onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#ff5f56', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>Remove</button>
                          </div>
                       </div>
                    </div>
                    {s.incentives && s.incentives.length > 0 && (
                       <div style={{ paddingLeft: '0.5rem' }}>
                          {s.incentives.map((inc, incIdx) => (
                             <div key={incIdx} style={{ fontSize: '0.75rem', color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                                {inc}
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

   const renderLaunchTab = () => (
     <div className="builder-section fade-in">
        <div className="wizard-card" style={{ marginBottom: '2rem' }}>
           <div className="wizard-card-title">Payouts & Treasury</div>
           {charityType === 'golf_sponsored' ? (
              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                 <div style={{ fontSize: '1.5rem' }}>⏳</div>
                 <div>
                    <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: '0.4rem' }}>Gateway Links Foundation Treasury</strong>
                    <div style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                       Your application for Fiscal Sponsorship is currently <strong>Under Review</strong>. <br/><br/>
                       If approved, all transactions will be securely routed directly through the foundation's audited accounts. You can expect a response on your application and a status update within 48 hours.
                    </div>
                 </div>
              </div>
           ) : (
              <>
                 <div style={{ color: 'var(--mist)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Connect a validated Stripe account to enable automated payouts. Player entry fees and sponsor revenue will bypass TourneyLinks and flow directly into your connected treasury account.
                 </div>
                 
                 <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <DollarSign color="var(--forest)" size={24} />
                      <div>
                         <div style={{ fontWeight: 700, color: 'var(--forest)' }}>Stripe Connect Identity</div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--mist)' }}>Awaiting Boarding...</div>
                      </div>
                   </div>
                   <StripeOnboardButton />
                 </div>
              </>
           )}
        </div>

        <div className="wizard-card">
           <div className="wizard-card-title">Launch Protocol</div>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
             <button disabled={charityType === 'golf_sponsored' && golfApplicationStatus === 'pending'} onClick={() => { if(draftId) { alert('Stripe Checkout Flow Initiating...') } else alert('Please fill out the campaign first!'); }} className="btn-primary" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '0.5rem 1rem', background: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? '#ccc' : 'var(--gold)', color: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? '#666' : '#000', fontWeight: 700, border: 'none', borderRadius: '8px', boxShadow: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? 'none' : '0 4px 15px rgba(212,175,55,0.4)', cursor: (charityType === 'golf_sponsored' && golfApplicationStatus === 'pending') ? 'not-allowed' : 'pointer', transition: '0.2s' }}>
               <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.7, marginBottom: '-0.2rem' }}>$149 Regular Price</div>
               <div style={{ fontSize: '1.1rem' }}>Pay $99 Intro Price 🚀</div>
             </button>
             <button className="btn-hero-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '1rem', borderRadius: '8px', cursor: 'pointer', opacity: saveStatus === 'saving' ? 0.5 : 1 }} onClick={() => { 
                if (!draftId) handleManualSaveAsDraft(); 
                setShowSaveModal(true); 
             }}>
               {saveStatus === 'saving' ? 'Auto-Saving...' : (saveStatus === 'saved' ? 'Saved & Synced ✅' : 'Save as Draft')}
             </button>
           </div>
        </div>
     </div>
  );

  const renderDesktopSimulator = () => {
     if (activeTab === 'content' || activeTab === 'launch') {
        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '2rem', minHeight: '260px', background: heroImage ? `linear-gradient(135deg, ${activeSecondaryColor}99, ${themeColor}99), url(${heroImage}) ${heroPositionX}% ${heroPosition}%/${heroZoom}% no-repeat` : `linear-gradient(135deg, ${activeSecondaryColor}, ${themeColor})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', textAlign: 'center' }}>
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 60%)`, opacity: 0.3, pointerEvents: 'none' }}></div>
                 <div style={{ position: 'relative', zIndex: 10 }}>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: '4px', fontWeight: 700, marginBottom: '0.75rem', display: 'inline-block' }}>{formatName}</span>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#fff', margin: 0, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)' }}>
                       {name || 'Tournament Title'}
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                       <span>📍 {course || 'Course TBD'}</span>
                       <span>·</span>
                       <span>{date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Date TBD'}</span>
                    </div>
                 </div>
                 {isCharity && (
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,1)', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 20 }}>
                       <span>🎗️</span> Official 501(c)(3) Sponsored Event
                    </div>
                 )}
              </div>
              
              <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flex: 1 }}>
                 <div style={{ flex: '1 1 60%', minWidth: 0 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--forest)', marginBottom: '0.5rem' }}>About Event</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.6, marginBottom: '1.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{desc || 'Tournament description will appear here...'}</div>

                    {enableGallery && galleryImages.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                           <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Event Gallery</div>
                           <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
                              {galleryImages.map((img, idx) => (
                                 <img key={idx} src={img} alt="Gallery" style={{ height: '160px', width: '220px', objectFit: 'cover', borderRadius: '6px', scrollSnapAlign: 'start', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} />
                              ))}
                           </div>
                        </div>
                     )}

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Sponsors</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                       {sponsors.map((s, idx) => (
                          <div key={idx} style={{ padding: '0.75rem', background: '#fff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--mist)' }}>{s.tier}</div>
                             <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div style={{ flex: '0 0 200px' }}>
                    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center', position: 'sticky', top: '10px' }}>
                       <div style={{ fontSize: '0.75rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration</div>
                       {packages.length === 0 && (
                          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--forest)', margin: '0.5rem 0' }}>${totalFee.toFixed(2)}</div>
                       )}
                       <button style={{ width: '100%', padding: '0.8rem', background: `linear-gradient(135deg, ${themeColor}, ${activeSecondaryColor})`, color: '#fff', fontWeight: 700, border: `1px solid ${activeSecondaryColor}40`, borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', boxShadow: `0 8px 20px ${themeColor}40`, transition: '0.2s', marginBottom: packages.length > 0 ? '1rem' : 0, marginTop: packages.length > 0 ? '1rem' : 0 }}>Register Now</button>
                       
                       {packages.length > 0 && (
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', textAlign: 'left' }}>
                             <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>Available Packages</div>
                             {packages.map((p, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                                   <span style={{ color: 'var(--mist)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{p.name}</span>
                                   <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${p.price}</span>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        );
     }
     if (activeTab === 'finance') {
        const entryFeeSubtotal = packages.length > 0 ? Number(packages[0].price) : 0;
         const entryFeePassed = packages.length > 0 && packages[0].passFees;
         
         const totalAddon = addons.reduce((acc, a) => acc + Number(a.price), 0);
         const passedAddons = addons.filter(a => a.passFees).reduce((acc, a) => acc + Number(a.price), 0);
         
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         
         const entryProcessing = entryFeePassed ? (entryFeeSubtotal * baseFeeRate + 0.30) : 0;
         const addonProcessing = passedAddons > 0 ? (passedAddons * baseFeeRate + 0.30) : 0;
         const totalProcessing = entryProcessing + addonProcessing;
         
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;

        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
             <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '2rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>Registration</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{packages.length > 0 ? packages[0].name : 'Primary Package'}</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                   </div>
                   {addons.map((a, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${a.price.toFixed(2)}</span>
                       </div>
                   ))}
                   {totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                   </div>
                   <div style={{ background: '#f4f7f5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💳 Split Payment at Checkout</span>
                         <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                           <input type="checkbox" checked={false} readOnly />
                           <span className="toggle-slider"></span>
                         </label>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                         <b>How it works:</b> The registering player controls the ledger. They can split it entirely using <b>Affirm/Klarna</b> natively, OR pay their fraction and generate a <b>Secure Team Link</b> to text their 3 buddies to collect the remaining fractions! Your Tournament gets paid in full instantly.
                      </div>
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Pay With Credit Card</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '4px', marginBottom: '2px' }}></span> Pay
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3c4043', fontWeight: 600, border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{fontWeight: 700, marginRight: '4px', letterSpacing: '-0.5px'}}>
                            <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>
                         </span> Pay
                      </span>
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0074FF', color: '#fff', fontWeight: 900, border: 'none', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: 'var(--forest)', fontWeight: 600, border: '1px dashed rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.8rem' }}>Commit & Pay at Course (Cash/Check)</button>
                </div>
             </div>
          </div>
        );
     }
     if (activeTab === 'donations') {
        if (!donationsEnabled) {
           return (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: '#f8faf9' }}>
                 <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⛳</div>
                 <div style={{ fontWeight: 700, color: 'var(--mist)' }}>Donations Disabled</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: '0.5rem' }}>The donations module is currently disabled for this tournament.</div>
              </div>
           );
        }

        if (donorPreviewMode === 'directory') {
           return (
              <div style={{ padding: '3rem 2rem', background: '#f8faf9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Support the Cause</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--forest)', margin: 0 }}>Every Contribution Helps</h2>
                 </div>
                 
                 <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {allowCustomDonation && (
                       <div style={{ padding: '2rem', background: 'var(--forest)', color: '#fff', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
                          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>Custom Donation</h3>
                          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Enter any amount you wish to contribute to the event's success. Your support is greatly appreciated.</div>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                             <div style={{ flex: 1, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#000' }}>$</span>
                                <input type="number" placeholder={minCustomDonation.toString()} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '1.1rem', background: '#fff', color: '#000' }} />
                             </div>
                             <button style={{ padding: '0 2rem', background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Contribute</button>
                          </div>
                          {minCustomDonation > 0 && <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>* Minimum contribution is ${minCustomDonation}</div>}
                       </div>
                    )}
                    
                    {!allowCustomDonation && donorTiers.length === 0 ? (
                       <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>No donation options available right now.</div>
                    ) : (
                       donorTiers.map((donor, idx) => (
                          <div key={idx} style={{ display: 'flex', background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', overflow: 'hidden' }}>
                             <div style={{ padding: '2rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                   <div>
                                      <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--forest)' }}>{donor.tier}</h3>
                                   </div>
                                   <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--grass)' }}>${donor.price}</div>
                                </div>
                                {donor.incentives && donor.incentives.length > 0 && (
                                   <div style={{ marginBottom: '1.5rem' }}>
                                      {donor.incentives.map((inc, i) => (
                                         <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem', flexShrink: 0 }}>✓</div>
                                            <span>{inc}</span>
                                         </div>
                                      ))}
                                   </div>
                                )}
                                <button style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, var(--forest), #1a3a28)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 10px rgba(26, 58, 40, 0.3)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', width: 'auto' }}>
                                   Select Amount
                                </button>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           );
        }

        const topDonor = donorTiers.length > 0 ? donorTiers[0] : { tier: 'Custom Amount', price: minCustomDonation || 5, incentives: [] };

        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
             <div style={{ width: '100%', maxWidth: '450px', background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 15px 50px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure Donation</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>{topDonor.tier}</h3>
                
                {charityTaxIdDonationInfo && (
                   <div style={{ fontSize: '0.75rem', color: 'var(--mist)', background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                      <strong>501(c)(3) Receipt:</strong> Your donation may be tax-deductible. Tax ID: {charityTaxIdDonationInfo}
                   </div>
                )}

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Contribution</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${topDonor.price.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${topDonor.price.toFixed(2)}</span>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Pay With Credit Card</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '4px', marginBottom: '2px' }}></span> Pay
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3c4043', fontWeight: 600, border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{fontWeight: 700, marginRight: '4px', letterSpacing: '-0.5px'}}>
                            <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>
                         </span> Pay
                      </span>
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0074FF', color: '#fff', fontWeight: 900, border: 'none', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                </div>
                
                <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--mist)', marginTop: '1rem' }}>
                   Credit card incurs standard processing fees. ACH processing is recommended for larger donations.
                </div>
             </div>
          </div>
        );
     }
     if (activeTab === 'sponsorships') {
        if (sponsorPreviewMode === 'directory') {
           return (
              <div style={{ padding: '3rem 2rem', background: '#f8faf9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Partnership Opportunities</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--forest)', margin: 0 }}>Support Our Mission</h2>
                 </div>
                 
                 <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {sponsors.length === 0 ? (
                       <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)' }}>No sponsor tiers configured yet.</div>
                    ) : (
                       sponsors.map((sponsor, idx) => (
                          <div key={idx} style={{ display: 'flex', background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', overflow: 'hidden' }}>
                             <div style={{ padding: '2rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                   <div>
                                      <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--forest)' }}>{sponsor.tier}</h3>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--mist)' }}>{sponsor.spots} {sponsor.spots === 1 ? 'Opportunity' : 'Opportunities'} Remaining</div>
                                   </div>
                                   <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--grass)' }}>${sponsor.price}</div>
                                </div>
                                {sponsor.incentives && sponsor.incentives.length > 0 && (
                                   <div style={{ marginBottom: '1.5rem' }}>
                                      {sponsor.incentives.map((inc, i) => (
                                         <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--ink)' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem', flexShrink: 0 }}>✓</div>
                                            <span>{inc}</span>
                                         </div>
                                      ))}
                                   </div>
                                )}
                                <button style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, var(--forest), #1a3a28)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 10px rgba(26, 58, 40, 0.3)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: '0.2s', width: 'auto' }}>
                                   Secure Partnership
                                </button>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           );
        }

        const topSponsor = sponsors.length > 0 ? sponsors[0] : { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: [], includesIntent: true, includesDinner: true };
        // ACH is generally ~0.8% with a $5 cap. Let's accurately mock that calculation.
        const achFee = Math.min(topSponsor.price * 0.008, 5.00);

        return (
           <div style={{ height: '450px', overflowY: 'auto', background: '#f8faf9', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 2rem' }}>
             <div style={{ width: '100%', maxWidth: '450px', background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 15px 50px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure Checkout</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--forest)' }}>{topSponsor.tier}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--mist)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <span>{topSponsor.spots} remaining</span>
                   {topSponsor.incentives && topSponsor.incentives.length > 0 && <span style={{ color: 'var(--forest)', background: 'rgba(46, 204, 113, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>Includes Perks</span>}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Sponsorship Tier</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${topSponsor.price.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--mist)' }}>Bank Transfer (ACH)</span>
                      <span style={{ fontWeight: 600, color: 'var(--mist)' }}>Absorbed</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${topSponsor.price.toFixed(2)}</span>
                   </div>
                </div>

                {(topSponsor.includesIntent || topSponsor.includesDinner) && (
                   <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>Participant Intent</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                         <button style={{ flex: 1, minWidth: '120px', padding: '0.6rem', border: '2px solid var(--forest)', background: 'var(--forest)', color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Sponsor Only</button>
                         {topSponsor.includesIntent && <button style={{ flex: 1, minWidth: '120px', padding: '0.6rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Play & Sponsor</button>}
                         {topSponsor.includesDinner && <button style={{ flex: 1, minWidth: '120px', padding: '0.6rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Sponsor & Dinner</button>}
                      </div>
                   </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Pay With Credit Card</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '4px', marginBottom: '2px' }}></span> Pay
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3c4043', fontWeight: 600, border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{fontWeight: 700, marginRight: '4px', letterSpacing: '-0.5px'}}>
                            <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>
                         </span> Pay
                      </span>
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0074FF', color: '#fff', fontWeight: 900, border: 'none', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: 'var(--forest)', fontWeight: 600, border: '1px dashed rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s' }}>Commit manually via Check or Wire transfer</button>
                </div>
                
                <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--mist)', marginTop: '1rem' }}>
                   Credit card incurs standard 2.9% + 30¢ processing fee (${(topSponsor.price * 0.029 + 0.3).toFixed(2)}). ACH processing is recommended.
                </div>
             </div>
          </div>
        );
     }
     
     return null;
  };

  const renderMobileSimulator = () => {
     if (activeTab === 'content' || activeTab === 'launch') {
        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative' }}>
              <div style={{ height: '240px', background: heroImage ? `linear-gradient(135deg, ${activeSecondaryColor}99, ${themeColor}99), url(${heroImage}) ${heroPositionX}% ${heroPosition}%/${heroZoom}% no-repeat` : `linear-gradient(135deg, ${activeSecondaryColor}, ${themeColor})`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem', position: 'relative', flexShrink: 0 }}>
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at top right, ${themeColor} 0%, transparent 60%)`, opacity: 0.3, pointerEvents: 'none' }}></div>
                 
                 <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                       <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}>{formatName}</span>
                       {isCharity && <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span>🎗️</span> 501(c)(3)</span>}
                    </div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#fff', margin: 0, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)' }}>
                       {name || 'Tournament Title'}
                    </h2>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                       📍 {course ? `${course} ${city ? `· ${city}` : ''}` : 'Course TBD'}
                    </div>
                 </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#fff' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div>
                       <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{packages.length > 0 ? 'Packages' : 'Entry Fee'}</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--forest)' }}>{packages.length > 0 ? 'Available' : `$${totalFee.toFixed(2)}`}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.7rem', color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Date</div>
                       <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)', fontFamily: 'DM Mono, monospace' }}>
                          {date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'TBD'}
                       </div>
                    </div>
                 </div>

                 {desc && (
                    <div style={{ marginBottom: '1.5rem' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>About Event</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{desc}</div>
                    </div>
                 )}

                 {enableGallery && galleryImages.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>Event Gallery</div>
                       <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch', margin: '0 -1.5rem', padding: '0 1.5rem' }} className="hide-scrollbar">
                          {galleryImages.map((img, idx) => (
                             <img key={idx} src={img} alt="Gallery" style={{ height: '140px', width: '200px', objectFit: 'cover', borderRadius: '6px', scrollSnapAlign: 'center', flexShrink: 0 }} />
                          ))}
                       </div>
                    </div>
                 )}

                 <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Live Sponsors</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {sponsors.map((s, idx) => (
                       <div key={idx} style={{ padding: '1rem', background: '#f8faf9', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>{s.tier}</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--grass)' }}>${s.price}</span>
                       </div>
                    ))}
                 </div>

                 {packages.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Registration Packages</div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {packages.map((p, idx) => (
                             <div key={idx} style={{ padding: '1rem', background: '#f4f7f5', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>{p.name}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--ink)' }}>${p.price}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div style={{ position: 'sticky', bottom: 0, background: '#fff', padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', zIndex: 50 }}>
                 <button style={{ width: '100%', padding: '0.9rem', background: `linear-gradient(135deg, ${themeColor}, ${activeSecondaryColor})`, color: '#fff', fontWeight: 700, border: `1px solid ${activeSecondaryColor}40`, borderRadius: '12px', boxShadow: `0 8px 20px ${themeColor}40` }}>
                    Register Now
                 </button>
              </div>
           </div>
        );
     }
     if (activeTab === 'finance') {
        const entryFeeSubtotal = packages.length > 0 ? Number(packages[0].price) : 0;
         const entryFeePassed = packages.length > 0 && packages[0].passFees;
         
         const totalAddon = addons.reduce((acc, a) => acc + Number(a.price), 0);
         const passedAddons = addons.filter(a => a.passFees).reduce((acc, a) => acc + Number(a.price), 0);
         
         const baseFeeRate = charityType === 'golf_sponsored' ? 0.022 : 0.029;
         
         const entryProcessing = entryFeePassed ? (entryFeeSubtotal * baseFeeRate + 0.30) : 0;
         const addonProcessing = passedAddons > 0 ? (passedAddons * baseFeeRate + 0.30) : 0;
         const totalProcessing = entryProcessing + addonProcessing;
         
         const totalDue = entryFeeSubtotal + totalAddon + totalProcessing;
        
        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
             <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--forest)' }}>Registration</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '1.5rem' }}>{name || 'Tournament Title'}</div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Primary Package</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${entryFeeSubtotal.toFixed(2)}</span>
                   </div>
                   {addons.map((a, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--mist)' }}>+ {a.name}</span>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${a.price.toFixed(2)}</span>
                       </div>
                   ))}
                   {totalProcessing > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ color: 'var(--mist)', fontWeight: 600 }}>Standard Credit Card Processing Entity Fee</span>
                             <span style={{ color: '#aaa', fontSize: '0.65rem' }}>TourneyLinks charges exactly $0 platform & convenience fees.</span>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--mist)' }}>${totalProcessing.toFixed(2)}</span>
                       </div>
                    )}
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.1rem' }}>${totalDue.toFixed(2)}</span>
                   </div>
                   <div style={{ background: '#f4f7f5', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', marginTop: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>💳 Split Payment at Checkout</span>
                         <label className="toggle-switch" style={{ transform: 'scale(0.8)' }}>
                           <input type="checkbox" checked={false} readOnly />
                           <span className="toggle-slider"></span>
                         </label>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--mist)', lineHeight: 1.5 }}>
                         <b>How it works:</b> The registering player controls the ledger. They can split it entirely using <b>Affirm/Klarna</b> natively, OR pay their fraction and generate a <b>Secure Team Link</b> to text their 3 buddies to collect the remaining fractions! Your Tournament gets paid in full instantly.
                      </div>
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Pay With Credit Card</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '4px', marginBottom: '2px' }}></span> Pay
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3c4043', fontWeight: 600, border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{fontWeight: 700, marginRight: '4px', letterSpacing: '-0.5px'}}>
                            <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>
                         </span> Pay
                      </span>
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0074FF', color: '#fff', fontWeight: 900, border: 'none', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: 'var(--forest)', fontWeight: 600, border: '1px dashed rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.8rem' }}>Commit & Pay at Course (Cash/Check)</button>
                </div>
             </div>
          </div>
        );
     }

     if (activeTab === 'donations') {
        if (!donationsEnabled) {
           return (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', background: '#f8faf9' }}>
                 <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⛳</div>
                 <div style={{ fontWeight: 700, color: 'var(--mist)' }}>Donations Disabled</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginTop: '0.5rem' }}>The donations module is currently disabled for this tournament.</div>
              </div>
           );
        }

        if (donorPreviewMode === 'directory') {
           return (
              <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
                 <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Support the Cause</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--forest)', margin: 0, lineHeight: 1.1 }}>Every Contribution Helps</h2>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {allowCustomDonation && (
                       <div style={{ background: 'var(--forest)', color: '#fff', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                          <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>Custom Donation</h3>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>Enter any amount you wish to contribute to the event's success.</div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                             <div style={{ flex: 1, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#000', fontSize: '0.9rem' }}>$</span>
                                <input type="number" placeholder={minCustomDonation.toString()} style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 1.6rem', borderRadius: '6px', border: 'none', fontWeight: 700, fontSize: '1rem', background: '#fff', color: '#000' }} />
                             </div>
                             <button style={{ padding: '0 1rem', background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Contribute</button>
                          </div>
                       </div>
                    )}

                    {!allowCustomDonation && donorTiers.length === 0 ? (
                       <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)', fontSize: '0.85rem' }}>No tiers available.</div>
                    ) : (
                       donorTiers.map((donor, idx) => (
                          <div key={idx} style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 15px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '1.25rem' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--forest)' }}>{donor.tier}</h3>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${donor.price}</div>
                             </div>
                             
                             {donor.incentives && donor.incentives.length > 0 && (
                                <div style={{ marginBottom: '1rem', marginTop: '0.8rem' }}>
                                   {donor.incentives.slice(0, 3).map((inc, i) => (
                                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.3rem', fontSize: '0.75rem', color: 'var(--ink)' }}>
                                         <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem', flexShrink: 0, fontSize: '8px' }}>✓</div>
                                         <span style={{ lineHeight: 1.3 }}>{inc}</span>
                                      </div>
                                   ))}
                                </div>
                             )}
                             <button style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg, var(--forest), #1a3a28)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(26, 58, 40, 0.3)', marginTop: donor.incentives && donor.incentives.length > 0 ? 0 : '1rem' }}>
                                Select Amount
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           );
        }

        const topDonor = donorTiers.length > 0 ? donorTiers[0] : { tier: 'Custom Amount', price: minCustomDonation || 5, incentives: [] };

        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
             <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure Donation</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--forest)' }}>{topDonor.tier}</h3>
                
                {charityTaxIdDonationInfo && (
                   <div style={{ fontSize: '0.65rem', color: 'var(--mist)', background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '4px', marginBottom: '1.2rem', lineHeight: 1.4 }}>
                      <strong>501(c)(3) Receipt:</strong> Your donation may be tax-deductible. Tax ID: {charityTaxIdDonationInfo}
                   </div>
                )}

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Contribution</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${topDonor.price.toFixed(2)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.05rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.05rem' }}>${topDonor.price.toFixed(2)}</span>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Pay With Credit Card</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '4px', marginBottom: '2px' }}></span> Pay
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#fff', color: '#3c4043', fontWeight: 600, border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{fontWeight: 700, marginRight: '4px', letterSpacing: '-0.5px'}}>
                            <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>
                         </span> Pay
                      </span>
                   </button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#0074FF', color: '#fff', fontWeight: 900, border: 'none', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.9rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                </div>
             </div>
          </div>
        );
     }
     
     if (activeTab === 'sponsorships') {
        if (sponsorPreviewMode === 'directory') {
           return (
              <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
                 <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Partnerships</div>
                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--forest)', margin: 0, lineHeight: 1.1 }}>Sponsorship Opportunities</h2>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sponsors.length === 0 ? (
                       <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--mist)', fontSize: '0.85rem' }}>No tiers available.</div>
                    ) : (
                       sponsors.map((sponsor, idx) => (
                          <div key={idx} style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 15px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '1.25rem' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--forest)' }}>{sponsor.tier}</h3>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--grass)' }}>${sponsor.price}</div>
                             </div>
                             <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginBottom: '1rem' }}>{sponsor.spots} {sponsor.spots === 1 ? 'Opportunity' : 'Opportunities'}</div>
                             
                             {sponsor.incentives && sponsor.incentives.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                   {sponsor.incentives.slice(0, 3).map((inc, i) => (
                                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.3rem', fontSize: '0.75rem', color: 'var(--ink)' }}>
                                         <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', color: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem', flexShrink: 0, fontSize: '8px' }}>✓</div>
                                         <span style={{ lineHeight: 1.3 }}>{inc}</span>
                                      </div>
                                   ))}
                                   {sponsor.incentives.length > 3 && (
                                      <div style={{ fontSize: '0.7rem', color: 'var(--mist)', marginTop: '0.3rem', fontStyle: 'italic' }}>+ {sponsor.incentives.length - 3} more perks</div>
                                   )}
                                </div>
                             )}
                             <button style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg, var(--forest), #1a3a28)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(26, 58, 40, 0.3)' }}>
                                Secure Tier
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           );
        }

        const topSponsor = sponsors.length > 0 ? sponsors[0] : { tier: 'Title Sponsor', price: 5000, spots: 1, incentives: [], includesIntent: true, includesDinner: true };
        const achFee = Math.min(topSponsor.price * 0.008, 5.00);

        return (
           <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', position: 'relative', background: '#f8faf9', padding: '1.5rem' }}>
             <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fcfefc 100%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)', padding: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Secure Checkout</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--forest)' }}>{topSponsor.tier}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                   <span>{topSponsor.spots} remaining</span>
                   {topSponsor.incentives && topSponsor.incentives.length > 0 && <span style={{ color: 'var(--forest)', background: 'rgba(46, 204, 113, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem' }}>Includes Perks</span>}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '1.5rem 0', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Sponsorship Tier</span>
                      <span style={{ fontWeight: 700, color: 'var(--ink)' }}>${topSponsor.price.toFixed(2)}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--mist)' }}>Bank Transfer (ACH)</span>
                      <span style={{ fontWeight: 600, color: 'var(--mist)' }}>Absorbed</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.05rem' }}>Total Due</span>
                      <span style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1.05rem' }}>${topSponsor.price.toFixed(2)}</span>
                   </div>
                </div>

                {(topSponsor.includesIntent || topSponsor.includesDinner) && (
                   <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>Participant Intent</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                         <button style={{ flex: 1, minWidth: '100px', padding: '0.5rem', border: '2px solid var(--forest)', background: 'var(--forest)', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Sponsor Only</button>
                         {topSponsor.includesIntent && <button style={{ flex: 1, minWidth: '100px', padding: '0.5rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Play & Sponsor</button>}
                         {topSponsor.includesDinner && <button style={{ flex: 1, minWidth: '100px', padding: '0.5rem', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: 'var(--mist)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Sponsor & Dinner</button>}
                      </div>
                   </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>Pay With Credit Card</button>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.2rem', marginRight: '4px', marginBottom: '2px' }}></span> Pay
                   </button>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#fff', color: '#3c4043', fontWeight: 600, border: '1px solid #dadce0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.05rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                         <span style={{fontWeight: 700, marginRight: '4px', letterSpacing: '-0.5px'}}>
                            <span style={{color: '#4285F4'}}>G</span><span style={{color: '#EA4335'}}>o</span><span style={{color: '#FBBC05'}}>o</span><span style={{color: '#4285F4'}}>g</span><span style={{color: '#34A853'}}>l</span><span style={{color: '#EA4335'}}>e</span>
                         </span> Pay
                      </span>
                   </button>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#0074FF', color: '#fff', fontWeight: 900, border: 'none', borderRadius: '8px', cursor: 'pointer', fontStyle: 'italic', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>venmo</button>
                   <button style={{ width: '100%', padding: '0.8rem', background: '#e0ece0', color: 'var(--forest)', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connect Bank (ACH)</button>
                   <button style={{ width: '100%', padding: '0.8rem', background: 'transparent', color: 'var(--forest)', fontWeight: 600, border: '1px dashed rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' }}>Commit manually via Check or Wire transfer</button>
                </div>
                
                <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--mist)', marginTop: '1rem' }}>
                   Credit card incurs standard processing fee (${(topSponsor.price * 0.029 + 0.3).toFixed(2)}). ACH processing is recommended.
                </div>
             </div>
          </div>
        );
     }
     
     return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--stone)', paddingBottom: '5rem', position: 'relative' }}>
       {/* Glassmorphic Background Elements */}
       <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)', filter: 'blur(80px)' }}></div>
          <div style={{ position: 'absolute', top: '20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,74,44,0.1) 0%, rgba(34,74,44,0) 70%)', filter: 'blur(100px)' }}></div>
       </div>

       {/* Global Title Header - Dark Immersive Hub */}
       <div style={{ 
          position: 'relative',
          backgroundImage: 'linear-gradient(to bottom, rgba(7, 18, 11, 0.75), rgba(5, 11, 8, 0.95)), url(/hero-bg-4.jpg)',
          backgroundColor: '#050b08',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%', 
          paddingTop: '6rem', // Clears absolute global nav
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3) inset',
          zIndex: 10
       }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ 
                  width: '50px', height: '50px', borderRadius: '12px',
                  background: 'radial-gradient(ellipse at top left, #f9e28e 0%, #d4af37 40%, #8a6d1c 100%)',
                  borderTop: '1px solid rgba(255,255,255,0.7)',
                  borderBottom: '1px solid rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(212,175,55,0.4), inset 0 2px 10px rgba(255,255,255,0.4)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '-10px', right: '10px', height: '25px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)', transform: 'rotate(-20deg)', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '1.4rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}>⛳</span>
                </div>
                 <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.3rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.8))' }}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f3e5ab', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.9 }}>Administration Hub</div>
                   </div>
                   <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>Live Campaign Builder</h1>
                 </div>
             </div>
             
             {draftId && (
                <div suppressHydrationWarning style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px', backdropFilter: 'blur(10px)', transition: '0.3s', opacity: saveStatus === 'idle' ? 0.7 : 1 }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: saveStatus === 'saving' ? '#f1c40f' : (saveStatus === 'saved' ? '#2ecc71' : '#ccc'), boxShadow: saveStatus === 'saving' ? '0 0 10px rgba(241,196,15,0.5)' : (saveStatus === 'saved' ? '0 0 10px rgba(46,204,113,0.5)' : 'none') }}></div>
                   {saveStatus === 'saving' ? 'Auto-saving...' : (saveStatus === 'saved' ? 'Saved & Synced' : 'Draft Saved')}
                </div>
             )}
          </div>
       </div>

       {/* Campaign Builder Two-Column Grid */}
       <div style={{ maxWidth: '1600px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          
          {/* EDITOR COLUMN (Left) */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
             
             {/* 5-State Tab Nav */}
             <div style={{ display: 'flex', gap: '0.2rem', background: '#fff', padding: '0.3rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <button 
                  onClick={() => setActiveTab('content')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'content' ? 'var(--forest)' : 'transparent', color: activeTab === 'content' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   1. Campaign Setup
                </button>
                <button 
                  onClick={() => setActiveTab('finance')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'finance' ? 'var(--forest)' : 'transparent', color: activeTab === 'finance' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   2. Financials
                </button>
                <button 
                  onClick={() => setActiveTab('donations')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'donations' ? 'var(--forest)' : 'transparent', color: activeTab === 'donations' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   3. Donations
                </button>
                <button 
                  onClick={() => setActiveTab('sponsorships')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'sponsorships' ? 'var(--forest)' : 'transparent', color: activeTab === 'sponsorships' ? '#fff' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   4. Sponsorships
                </button>
                <button 
                  onClick={() => setActiveTab('launch')}
                  style={{ flex: 1, padding: '0.6rem 0.2rem', background: activeTab === 'launch' ? 'var(--gold)' : 'transparent', color: activeTab === 'launch' ? '#000' : 'var(--mist)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                   5. Launch & Stripe
                </button>
             </div>

             {/* Tab Render */}
             {activeTab === 'content' && renderContentTab()}
             {activeTab === 'finance' && renderFinanceTab()}
             {activeTab === 'donations' && renderDonationTab()}
             {activeTab === 'sponsorships' && renderSponsorTab()}
             {activeTab === 'launch' && renderLaunchTab()}

          </div>

          {/* SIMULATOR COLUMN (Right) */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
             
             {/* Sticky Wrapper - using height and overflow-y to allow internal scroll without disrupting layout */}
             <div className="no-scrollbar" style={{ position: 'sticky', top: '100px', height: 'calc(100vh - 120px)', overflowY: 'auto', width: '100%', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingBottom: '3rem' }}>
                
                <div className="animated-gold-border" style={{ background: '#0a1a12', padding: '0.4rem', borderRadius: '30px', display: 'flex', border: '1px solid rgba(212,175,55,0.8)', boxShadow: '0 0 15px rgba(212,175,55,0.3)', width: 'max-content', gap: '0.3rem', flexShrink: 0 }}>
                   <button 
                     onClick={() => setSimulatorDevice('desktop')}
                     style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', fontWeight: 600, background: simulatorDevice === 'desktop' ? 'linear-gradient(135deg, var(--gold), #f3e5ab)' : 'transparent', color: simulatorDevice === 'desktop' ? '#000' : '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: simulatorDevice === 'desktop' ? '0 0 10px rgba(212,175,55,0.5)' : 'none' }}>
                      <Monitor size={16} /> Desktop
                   </button>
                   <button 
                     onClick={() => setSimulatorDevice('mobile')}
                     style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', fontWeight: 600, background: simulatorDevice === 'mobile' ? 'linear-gradient(135deg, var(--gold), #f3e5ab)' : 'transparent', color: simulatorDevice === 'mobile' ? '#000' : '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: simulatorDevice === 'mobile' ? '0 0 10px rgba(212,175,55,0.5)' : 'none' }}>
                      <Smartphone size={16} /> Mobile
                   </button>
                </div>

                {/* Sponsorship Mode Toggle */}
                {activeTab === 'sponsorships' && (
                   <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '-0.5rem' }}>
                      <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '30px', overflow: 'hidden', padding: '0.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                         <button 
                            onClick={() => setSponsorPreviewMode('directory')}
                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '25px', cursor: 'pointer', border: 'none', background: sponsorPreviewMode === 'directory' ? 'var(--forest)' : 'transparent', color: sponsorPreviewMode === 'directory' ? '#fff' : 'var(--mist)', transition: '0.2s' }}>
                            Partnership Opportunities
                         </button>
                         <button 
                            onClick={() => setSponsorPreviewMode('checkout')}
                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '25px', cursor: 'pointer', border: 'none', background: sponsorPreviewMode === 'checkout' ? 'var(--gold)' : 'transparent', color: sponsorPreviewMode === 'checkout' ? '#000' : 'var(--mist)', transition: '0.2s' }}>
                            Checkout Experience
                         </button>
                      </div>
                   </div>
                )}

                {/* Donation Mode Toggle */}
                {activeTab === 'donations' && (
                   <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '-0.5rem' }}>
                      <div style={{ display: 'flex', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '30px', overflow: 'hidden', padding: '0.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                         <button 
                            onClick={() => setDonorPreviewMode('directory')}
                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '25px', cursor: 'pointer', border: 'none', background: donorPreviewMode === 'directory' ? 'var(--forest)' : 'transparent', color: donorPreviewMode === 'directory' ? '#fff' : 'var(--mist)', transition: '0.2s' }}>
                            Donor Option Page
                         </button>
                         <button 
                            onClick={() => setDonorPreviewMode('checkout')}
                            style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '25px', cursor: 'pointer', border: 'none', background: donorPreviewMode === 'checkout' ? 'var(--gold)' : 'transparent', color: donorPreviewMode === 'checkout' ? '#000' : 'var(--mist)', transition: '0.2s' }}>
                            Donor Payment Page
                         </button>
                      </div>
                   </div>
                )}

                {simulatorDevice === 'desktop' && (
                   <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s' }}>
                      <div style={{ width: '100%', background: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                         <div style={{ background: '#f4f7f5', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                            <div style={{ marginLeft: '1rem', background: '#fff', padding: '0.2rem 1rem', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--mist)', flex: 1, border: '1px solid rgba(0,0,0,0.05)' }}>demo.tourneylinks.com/tournaments/live</div>
                         </div>
                         {/* Desktop Canvas */}
                         {renderDesktopSimulator()}
                      </div>
                   </div>
                )}

                {simulatorDevice === 'mobile' && (
                   <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s', marginBottom: '-10%' }}>
                      <div style={{
                         width: '330px', // Crisp mobile width
                         height: '660px',
                         background: '#fff',
                         borderRadius: '36px', // iPhone hardware curves
                         border: '10px solid #0f1512', // Black device frame
                         boxShadow: '0 25px 50px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.2)',
                         position: 'relative',
                         overflow: 'hidden',
                         display: 'flex',
                         flexDirection: 'column'
                      }}>
                         {/* Dynamic Notch */}
                         <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '105px', height: '22px', background: '#0f1512', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px', zIndex: 50 }}></div>

                         {/* SIMULATED WEB BROWSER CANVAS */}
                         {renderMobileSimulator()}
                      </div>
                   </div>
                )}

             </div>
          </div>

       </div>
       
       {/* Exit Intent Modal */}
       {showExitModal.show && (
         <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,11,8,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ background: '#0a1a12', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--gold)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.1)', maxWidth: '450px', textAlign: 'center', width: '90%' }}>
             <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>Unsaved Campaign Architecture</h3>
             <p style={{ color: 'var(--mist)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>You've begun shaping a pristine event. Would you like to archive this draft to your Command Center before departing?</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
               <button onClick={async () => {
                  const saved = await handleManualSaveAsDraft();
                  if (saved || draftId) {
                     (window as any).__skipBeforeUnload = true;
                     window.location.href = showExitModal.targetUrl || '/profile';
                  }
               }} style={{ background: 'var(--gold)', color: '#000', fontWeight: 800, padding: '1.1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', transition: '0.2s', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                  Save to Profile & Leave
               </button>
               <button onClick={() => {
                  (window as any).__skipBeforeUnload = true;
                  window.location.href = showExitModal.targetUrl || '/profile';
               }} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
                  Leave Without Saving
               </button>
               <button onClick={() => setShowExitModal({show: false, targetUrl: null})} style={{ background: 'transparent', color: 'var(--mist)', border: 'none', marginTop: '1rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: '0.2s' }}>
                  Cancel Departure
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Custom Status Modal for Save Draft */}
       {showSaveModal && (
         <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,11,8,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ background: '#0a1a12', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--gold)', boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.1)', maxWidth: '450px', textAlign: 'center', width: '90%', animation: 'fadeIn 0.2s' }}>
             <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
               {userId ? 'Campaign Draft Secured' : 'Claim Your Campaign'}
             </h3>
             <p style={{ color: 'var(--mist)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
               {userId ? 'Your draft is automatically and securely saved. You can safely return to your profile or continue editing here.' : 'Secure this campaign draft! Create a quick profile or log in to automatically save your progress to your database.'}
             </p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
               {userId ? (
                 <>
                   <button onClick={() => {
                      (window as any).__skipBeforeUnload = true;
                      window.location.href = '/profile';
                   }} style={{ background: 'var(--gold)', color: '#000', fontWeight: 800, padding: '1.1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', transition: '0.2s', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                      Return to Profile
                   </button>
                   <button onClick={() => setShowSaveModal(false)} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
                      Continue Editing
                   </button>
                 </>
               ) : (
                 <>
                   <SignInButton mode="modal" fallbackRedirectUrl="/host">
                     <button onClick={() => {}} style={{ background: 'var(--gold)', color: '#000', fontWeight: 800, padding: '1.1rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', width: '100%', letterSpacing: '0.05em', textTransform: 'uppercase', transition: '0.2s', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
                        Sign Up to Save Progress
                     </button>
                   </SignInButton>
                   <button onClick={() => setShowSaveModal(false)} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' }}>
                      Continue Editing Anonymously
                   </button>
                 </>
               )}
             </div>
           </div>
         </div>
       )}

     </div>
  );
}
